import IconFont from '@/new-components/common/Icon';
import {
  AppstoreAddOutlined,
  BarChartOutlined,
  CodeOutlined,
  CopyOutlined,
  DatabaseOutlined,
  DeploymentUnitOutlined,
  FileExcelOutlined,
  FileOutlined,
  FolderOutlined,
  GlobalOutlined,
  PictureOutlined,
  PieChartOutlined,
  ProductOutlined,
  ReadOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import React from 'react';

export const agentIcon: Record<string, React.ReactNode> = {
  CodeEngineer: <CodeOutlined />,
  Reporter: <PieChartOutlined />,
  DataScientist: <BarChartOutlined />,
  Summarizer: <CopyOutlined />,
  ToolExpert: <IconFont type='icon-plugin' style={{ fontSize: 17.25, marginTop: 2 }} />,
  Indicator: <RiseOutlined />,
  Dbass: <FolderOutlined />,
};

const AGENT_LABEL_ZH: Record<string, string> = {
  AnomalyDetector: '异常检测智能体',
  'App Starter': '应用启动器',
  AppLauncher: '应用调用器',
  MetricInfoRetriever: '指标信息检索器',
  ReportGenerator: '报告生成器',
  'Intent Recognition Expert': '意图识别专家',
  Reporter: '报告员',
  ReActToolMaster: 'ReAct 工具专家',
  WebSearchAgent: '联网搜索智能体',
  ToolExpert: '工具专家',
  'AI Assistant': 'AI 助手',
  DataAnalyzer: '数据分析师',
  Indicator: '指标助手',
  SeniorDataAnalyst: '高级数据分析师',
  CodeEngineer: '代码工程师',
  DataScientist: '数据科学家',
  Summarizer: '摘要助手',
};

const AGENT_DESC_ZH: Record<string, string> = {
  AnomalyDetector: '通过对比基期和当前周期数据判断业务指标是否存在异常波动，并检查波动是否超过预设阈值。',
  'App Starter': '根据用户问题和应用资源信息，选择最合适的应用来回答问题，并提取应用意图所需的关键信息。',
  AppLauncher: '启动并调用已选择的应用。',
  MetricInfoRetriever: '从知识库资源中检索业务指标元信息，包括指标名称、字段、计算规则、建议分析维度和波动阈值。',
  ReportGenerator: '整合异常检测、归因分析等结果，生成结构化 Markdown 分析报告。',
  'Intent Recognition Expert': '识别用户意图，并提取应用调用所需的槽位信息。',
  Reporter: '读取历史消息中的分析结果，整理 SQL 和图表，生成专业报告。',
  ReActToolMaster: '基于 ReAct 推理流程选择和调用工具，逐步完成复杂任务。',
  WebSearchAgent: '判断用户问题是否需要实时外部信息，并在必要时生成关键词进行联网搜索。',
  ToolExpert: '理解工具资源的能力和参数，选择合适工具来完成用户目标。',
  'AI Assistant': '通用 AI 助手，用清晰、友好、专业的方式回答用户问题。',
  DataAnalyzer: '根据任务目标选择合适的数据分析动作，高效完成数据分析任务。',
  Indicator: '根据用户问题和资源内容进行指标相关总结，并输出摘要结果。',
  SeniorDataAnalyst: '自主规划数据分析步骤，探索数据源、清洗数据、生成图表并提炼洞察。',
  CodeEngineer: '编写并执行 Python 或 Shell 代码，帮助解决数据处理、信息获取和计算类任务。',
  DataScientist: '基于数据库结构生成分析 SQL，并推荐合适的数据展示方式。',
  Summarizer: '根据用户问题从资源内容或历史对话中提炼并总结答案。',
};

export function localizeAgentForDisplay<T extends { name?: string; label?: string; desc?: string }>(agent: T): T {
  const key = agent.name || agent.label || '';
  return {
    ...agent,
    label: AGENT_LABEL_ZH[key] || agent.label || key,
    desc: AGENT_DESC_ZH[key] || agent.desc,
  };
}

export const resourceTypeIcon: Record<string, React.ReactNode> = {
  all: <ProductOutlined />,
  database: <DatabaseOutlined />,
  knowledge: <ReadOutlined />,
  internet: <GlobalOutlined />,
  plugin: <AppstoreAddOutlined />,
  text_file: <FileOutlined />,
  excel_file: <FileExcelOutlined />,
  image_file: <PictureOutlined />,
  awel_flow: <DeploymentUnitOutlined />,
};

const Config = () => <></>;

export default Config;
