import logging
from typing import List, Optional

from fastapi import APIRouter, Depends

from dbgpt._private.config import Config
from dbgpt.agent.core.agent_manage import get_agent_manager
from dbgpt.agent.resource.manage import get_resource_manager
from dbgpt.agent.util.llm.llm import LLMStrategyType
from dbgpt_app.openapi.api_view_model import Result
from dbgpt_serve.agent.app.gpts_server import available_llms
from dbgpt_serve.agent.db.gpts_app import (
    GptsApp,
    GptsAppCollectionDao,
    GptsAppDao,
    GptsAppQuery,
    native_app_params,
)
from dbgpt_serve.agent.team.base import TeamMode
from dbgpt_serve.core import blocking_func_to_async
from dbgpt_serve.utils.auth import UserRequest, get_user_from_headers

CFG = Config()

router = APIRouter()
logger = logging.getLogger(__name__)

gpts_dao = GptsAppDao()
collection_dao = GptsAppCollectionDao()

AGENT_LABEL_ZH = {
    "AnomalyDetector": "异常检测智能体",
    "App Starter": "应用启动器",
    "MetricInfoRetriever": "指标信息检索器",
    "ReportGenerator": "报告生成器",
    "AppLauncher": "应用调用器",
    "Intent Recognition Expert": "意图识别专家",
    "Reporter": "报告员",
    "ReActToolMaster": "ReAct 工具专家",
    "WebSearchAgent": "联网搜索智能体",
    "ToolExpert": "工具专家",
    "AI Assistant": "AI 助手",
    "DataAnalyzer": "数据分析师",
    "Indicator": "指标助手",
    "SeniorDataAnalyst": "高级数据分析师",
    "CodeEngineer": "代码工程师",
    "DataScientist": "数据科学家",
    "Summarizer": "摘要助手",
}

AGENT_DESC_ZH = {
    "AnomalyDetector": "通过对比基期和当前周期数据判断业务指标是否存在异常波动，并检查波动是否超过预设阈值。",
    "App Starter": "根据用户问题和应用资源信息，选择最合适的应用来回答问题，并提取应用意图所需的关键信息。",
    "MetricInfoRetriever": "从知识库资源中检索业务指标元信息，包括指标名称、字段、计算规则、建议分析维度和波动阈值。",
    "ReportGenerator": "整合异常检测、归因分析等结果，生成结构化 Markdown 分析报告。",
    "AppLauncher": "启动并调用已选择的应用。",
    "Intent Recognition Expert": "识别用户意图，并提取应用调用所需的槽位信息。",
    "Reporter": "读取历史消息中的分析结果，整理 SQL 和图表，生成专业报告。",
    "ReActToolMaster": "基于 ReAct 推理流程选择和调用工具，逐步完成复杂任务。",
    "WebSearchAgent": "判断用户问题是否需要实时外部信息，并在必要时生成关键词进行联网搜索。",
    "ToolExpert": "理解工具资源的能力和参数，选择合适工具来完成用户目标。",
    "AI Assistant": "通用 AI 助手，用清晰、友好、专业的方式回答用户问题。",
    "DataAnalyzer": "根据任务目标选择合适的数据分析动作，高效完成数据分析任务。",
    "Indicator": "根据用户问题和资源内容进行指标相关总结，并输出摘要结果。",
    "SeniorDataAnalyst": "自主规划数据分析步骤，探索数据源、清洗数据、生成图表并提炼洞察。",
    "CodeEngineer": "编写并执行 Python 或 Shell 代码，帮助解决数据处理、信息获取和计算类任务。",
    "DataScientist": "基于数据库结构生成分析 SQL，并推荐合适的数据展示方式。",
    "Summarizer": "根据用户问题从资源内容或历史对话中提炼并总结答案。",
}


@router.post("/v1/app/create")
async def create(
    gpts_app: GptsApp, user_info: UserRequest = Depends(get_user_from_headers)
):
    try:
        gpts_app.user_code = (
            user_info.user_id if user_info.user_id is not None else gpts_app.user_code
        )
        res = await blocking_func_to_async(CFG.SYSTEM_APP, gpts_dao.create, gpts_app)
        return Result.succ(res)
    except Exception as ex:
        return Result.failed(code="E000X", msg=f"create app error: {ex}")


@router.post("/v1/app/list")
async def app_list(
    query: GptsAppQuery,
    user_info: UserRequest = Depends(get_user_from_headers),
):
    try:
        # query.user_code = (
        #     user_info.user_id if user_info.user_id is not None else query.user_code
        # )
        query.ignore_user = "true"
        res = await blocking_func_to_async(
            CFG.SYSTEM_APP, gpts_dao.app_list, query, True
        )
        return Result.succ(res)
    except Exception as ex:
        logger.exception("app_list exception!")
        return Result.failed(code="E000X", msg=f"query app list error: {ex}")


@router.get("/v1/app/info")
async def app_detail(
    chat_scene: str,
    app_code: str = None,
):
    logger.info(f"app_detail:{chat_scene},{app_code}")
    try:
        if app_code:
            res = await blocking_func_to_async(
                CFG.SYSTEM_APP, gpts_dao.app_detail, app_code
            )
            return Result.succ(res)
        else:
            from dbgpt_app.scene.base import ChatScene

            scene: ChatScene = ChatScene.of_mode(chat_scene)
            res = await blocking_func_to_async(
                CFG.SYSTEM_APP, gpts_dao.native_app_detail, scene.scene_name()
            )
            return Result.succ(res)
    except Exception as ex:
        logger.exception("query app detail error!")
        return Result.failed(code="E000X", msg=f"query app detail error: {ex}")


@router.get("/v1/app/export")
async def app_export(
    chat_scene: str,
    app_code: str = None,
):
    logger.info(f"app_export:{app_code}")
    try:
        if app_code:
            app_info = await blocking_func_to_async(
                CFG.SYSTEM_APP, gpts_dao.app_detail, app_code
            )
        else:
            from dbgpt_app.scene.base import ChatScene

            scene: ChatScene = ChatScene.of_mode(chat_scene)
            app_info = await blocking_func_to_async(
                CFG.SYSTEM_APP, gpts_dao.native_app_detail, scene.scene_name()
            )

        return Result.succ(app_info)
    except Exception as ex:
        logger.exception("export app info error!")
        return Result.failed(code="E000X", msg=f"export app info error: {ex}")


@router.get("/v1/app/{app_code}")
async def get_app_by_code(
    app_code: str,
):
    try:
        return Result.succ(gpts_dao.app_detail(app_code))
    except Exception as ex:
        logger.exception("query app detail error!")
        return Result.failed(code="E000X", msg=f"query app detail error: {ex}")


@router.post("/v1/app/hot/list")
async def hot_app_list(
    query: GptsAppQuery, user_info: UserRequest = Depends(get_user_from_headers)
):
    try:
        query.user_code = (
            user_info.user_id if user_info.user_id is not None else query.user_code
        )
        list_hot_apps = gpts_dao.list_hot_apps(query)
        return Result.succ(list_hot_apps)
    except Exception as ex:
        logger.exception("hot_app_list exception！")
        return Result.failed(code="E000X", msg=f"query hot app error: {ex}")


@router.post("/v1/app/detail")
async def app_list(
    gpts_app: GptsApp, user_info: UserRequest = Depends(get_user_from_headers)
):
    try:
        gpts_app.user_code = (
            user_info.user_id if user_info.user_id is not None else gpts_app.user_code
        )
        return Result.succ(gpts_dao.app_detail(gpts_app.app_code))
    except Exception as ex:
        return Result.failed(code="E000X", msg=f"query app error: {ex}")


@router.post("/v1/app/edit")
async def edit(
    gpts_app: GptsApp, user_info: UserRequest = Depends(get_user_from_headers)
):
    try:
        gpts_app.user_code = (
            user_info.user_id if user_info.user_id is not None else gpts_app.user_code
        )
        return Result.succ(gpts_dao.edit(gpts_app))
    except Exception as ex:
        logger.exception(" app edit exception!")
        return Result.failed(code="E000X", msg=f"edit app error: {ex}")


@router.get("/v1/agents/list")
async def all_agents(user_info: UserRequest = Depends(get_user_from_headers)):
    try:
        agents = get_agent_manager().list_agents()
        for agent in agents:
            name = agent["name"]
            agent["label"] = AGENT_LABEL_ZH.get(name, name)
            agent["desc"] = AGENT_DESC_ZH.get(name, agent.get("desc"))
        return Result.succ(agents)
    except Exception as ex:
        return Result.failed(code="E000X", msg=f"query agents error: {ex}")


@router.post("/v1/app/remove", response_model=Result)
async def delete(
    gpts_app: GptsApp, user_info: UserRequest = Depends(get_user_from_headers)
):
    try:
        gpts_app.user_code = (
            user_info.user_id if user_info.user_id is not None else gpts_app.user_code
        )
        gpts_dao.delete(gpts_app.app_code, gpts_app.user_code, gpts_app.sys_code)
        return Result.succ()
    except Exception as ex:
        logger.exception("app remove exception!")
        return Result.failed(code="E000X", msg=f"delete app error: {ex}")


@router.post("/v1/app/collect", response_model=Result)
async def collect(
    gpts_app: GptsApp, user_info: UserRequest = Depends(get_user_from_headers)
):
    try:
        gpts_app.user_code = (
            user_info.user_id if user_info.user_id is not None else gpts_app.user_code
        )
        collection_dao.collect(gpts_app.app_code, gpts_app.user_code, gpts_app.sys_code)
        return Result.succ()
    except Exception as ex:
        return Result.failed(code="E000X", msg=f"collect app error: {ex}")


@router.post("/v1/app/uncollect", response_model=Result)
async def uncollect(
    gpts_app: GptsApp, user_info: UserRequest = Depends(get_user_from_headers)
):
    try:
        gpts_app.user_code = (
            user_info.user_id if user_info.user_id is not None else gpts_app.user_code
        )
        collection_dao.uncollect(
            gpts_app.app_code, gpts_app.user_code, gpts_app.sys_code
        )
        return Result.succ()
    except Exception as ex:
        return Result.failed(code="E000X", msg=f"uncollect app error: {ex}")


@router.get("/v1/team-mode/list")
async def team_mode_list(user_info: UserRequest = Depends(get_user_from_headers)):
    try:
        return Result.succ([mode.to_dict() for mode in TeamMode])
    except Exception as ex:
        logger.exception(str(ex))
        return Result.failed(code="E000X", msg=f"query team mode list error: {ex}")


@router.get("/v1/resource-type/list")
async def team_mode_list(user_info: UserRequest = Depends(get_user_from_headers)):
    try:
        resources = get_resource_manager().get_supported_resources_type()
        return Result.succ(resources)
    except Exception as ex:
        logger.exception(str(ex))
        return Result.failed(code="E000X", msg=f"query resource type list error: {ex}")


@router.get("/v1/llm-strategy/list")
async def llm_strategies(user_info: UserRequest = Depends(get_user_from_headers)):
    try:
        return Result.succ([type.to_dict() for type in LLMStrategyType])
    except Exception as ex:
        logger.exception(str(ex))
        return Result.failed(
            code="E000X", msg=f"query llm strategy type list error: {ex}"
        )


@router.get("/v1/llm-strategy/value/list")
async def llm_strategy_values(
    type: str, user_info: UserRequest = Depends(get_user_from_headers)
):
    try:
        results = []
        match type:
            case LLMStrategyType.Priority.value:
                results = await available_llms()
        return Result.succ(results)
    except Exception as ex:
        logger.exception(str(ex))
        return Result.failed(
            code="E000X", msg=f"query llm strategy type list error: {ex}"
        )


@router.get("/v1/app/resources/list", response_model=Result)
async def app_resources(
    type: str,
    name: Optional[str] = None,
    version: Optional[str] = None,
    user_code: Optional[str] = None,
    sys_code: Optional[str] = None,
    user_info: UserRequest = Depends(get_user_from_headers),
):
    """
    Get agent resources, such as db, knowledge, internet, plugin.
    """
    try:
        resources = await blocking_func_to_async(
            CFG.SYSTEM_APP,
            get_resource_manager().get_supported_resources,
            version=version or "v1",
            type=type,
            user_id=None,
        )
        results = resources.get(type, [])
        return Result.succ(results)
    except Exception as ex:
        logger.exception(str(ex))
        return Result.failed(code="E000X", msg=f"query app resources error: {ex}")


@router.post("/v1/app/publish", response_model=Result)
async def publish(
    gpts_app: GptsApp, user_info: UserRequest = Depends(get_user_from_headers)
):
    try:
        gpts_app.user_code = (
            user_info.user_id if user_info.user_id is not None else gpts_app.user_code
        )
        gpts_dao.publish(gpts_app.app_code, gpts_app.user_code, gpts_app.sys_code)
        return Result.succ([])
    except Exception as ex:
        logger.exception(str(ex))
        return Result.failed(code="E000X", msg=f"publish app error: {ex}")


@router.post("/v1/app/unpublish", response_model=Result)
async def unpublish(
    gpts_app: GptsApp, user_info: UserRequest = Depends(get_user_from_headers)
):
    try:
        gpts_app.user_code = (
            user_info.user_id if user_info.user_id is not None else gpts_app.user_code
        )
        gpts_dao.unpublish(gpts_app.app_code, gpts_app.user_code, gpts_app.sys_code)
        return Result.succ([])
    except Exception as ex:
        logger.exception("unpublish:" + str(ex))
        return Result.failed(code="E000X", msg=f"unpublish app error: {ex}")


@router.post("/v1/app/native/init", response_model=Result)
async def init_native_apps(
    gpts_app: GptsApp, user_info: UserRequest = Depends(get_user_from_headers)
):
    try:
        user_code = (
            user_info.user_id if user_info.user_id is not None else gpts_app.user_code
        )
        gpts_dao.init_native_apps(user_code)
        return Result.succ([])
    except Exception as ex:
        logger.exception("init natove error!")
        return Result.failed(code="E000X", msg=f"init natove error: {ex}")


@router.get("/v1/native_scenes")
async def native_scenes(user_info: UserRequest = Depends(get_user_from_headers)):
    return Result.succ(native_app_params())


@router.post("/v1/app/admins/update")
def update_admins(
    gpts_app: GptsApp, user_info: UserRequest = Depends(get_user_from_headers)
):
    return Result.succ(gpts_dao.update_admins(gpts_app.app_code, gpts_app.admins))


@router.get("/v1/app/{app_code}/admins")
async def query_admins(
    app_code: str,
    user_info: UserRequest = Depends(get_user_from_headers),
):
    try:
        return Result.succ(gpts_dao.get_admins(app_code))
    except Exception as ex:
        logger.exception("query_admins:" + str(ex))
        return Result.failed(code="E000X", msg=f"query admins error: {ex}")


@router.get("/v1/dbgpts/list", response_model=Result[List[GptsApp]])
async def get_dbgpts(user_code: str = None, sys_code: str = None):
    logger.info(f"get_dbgpts:{user_code},{sys_code}")
    try:
        query: GptsAppQuery = GptsAppQuery()
        query.ignore_user = "true"
        response = gpts_dao.app_list(query, True)
        return Result.succ(response.app_list)
    except Exception as e:
        logger.error(f"get_dbgpts failed:{str(e)}")
        return Result.failed(msg=str(e), code="E300003")
