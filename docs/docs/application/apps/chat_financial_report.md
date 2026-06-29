# 与财务报告聊天
   使用大型模型进行财务报告分析正在成为垂直领域的流行应用。大型模型不仅可以比人类更准确地理解复杂的金融规则，还可以基于专业知识输出合理的分析结果。 
   
使用AWEL构建财务报告知识构建工作流程和财务报告智能问答工作流程应用程序可以帮助用户 
- 回答有关财务报告的基本信息问题
- 财务报告指标计算与分析题
- 财务报告内容分析问题。

####财务报告知识构建工作流程
<p对齐=“左”>
  <img src={'/img/chat_knowledge/fin_report/knowledge_workflow.png'} width="1000px"/>
</p>

####一个财务报告智能机器人工作流程 
<p对齐=“左”>
  <img src={'/img/chat_knowledge/fin_report/financial_robot_chat.png'} width="1000px"/>
</p>

# 如何使用
上传财务报告 PDF 并与财务报告聊天

场景一：查询财务报告基础信息

<p对齐=“左”>
  <img src={'/img/chat_knowledge/fin_report/base_info_chat.jpg'} width="1000px"/>
</p>

场景2：计算财务报表的财务指标
<p对齐=“左”>
  <img src={'/img/chat_knowledge/fin_report/chat_indicator.png'} width="1000px"/>
</p>

场景3：分析财务报告
<p对齐=“左”>
  <img src={'/img/chat_knowledge/fin_report/report_analyze.png'} width="1000px"/>
</p>


# 如何安装

第 1 步：确保您的 dbgpt 版本 >=0.5.10

第二步：升级python依赖
```
pip install pdfplumber
pip install fuzzywuzzy
```
第 3 步：从 dbgpts 安装财务报告应用程序
```
# install poetry
pip install poetry

# install financial report knowledge process pipeline workflow and financial-robot-app workflow
dbgpt app install financial-robot-app financial-report-knowledge-factory

```
步骤4：从https://www.modelscope.cn/models/AI-ModelScope/bge-large-zh-v1.5下载预训练的嵌入模型
```
git clone https://www.modelscope.cn/models/AI-ModelScope/bge-large-zh-v1.5
```

```
#*******************************************************************#
#**                     FINANCIAL CHAT Config                     **#
#*******************************************************************#
FIN_REPORT_MODEL=/app/DB-GPT/models/bge-large-zh-v1.5
```
第五步：创建知识空间，选择`FinancialReport`域名类型
<p对齐=“左”>
  <img src={'/img/chat_knowledge/fin_report/financial_space.png'} width="1000px"/>
</p>


第6步：从`docker/examples/fin_report`上传财务报告，如果您想使用财务报告数据集，可以从modelscope下载。
```bash
git clone http://www.modelscope.cn/datasets/modelscope/chatglm_llm_fintech_raw_dataset.git
```
第七步：自动分段并等待一段时间

第8步：与财务报告聊天
<p对齐=“左”>
  <img src={'/img/chat_knowledge/fin_report/chat.jpg'} width="1000px"/>
</p>