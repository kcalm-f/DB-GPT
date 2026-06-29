# 聊天仪表板

报表分析对应DB-GPT中的“Chat Dashboard”场景，可以通过自然语言进行智能报表生成和分析。它是生成式BI（GBI）的基本能力之一。我们来看看如何使用报表分析功能。

## 步骤
以下是使用报告分析的步骤：
- 1.数据准备
- 2.添加数据源
- 3.选择聊天仪表板应用程序
- 4.开始聊天


### 数据准备

为了更好地体验报表分析功能，我们在代码中内置了一些测试数据。要使用此测试数据，我们首先需要创建一个测试库。
```SQL
CREATE DATABASE IF NOT EXISTS dbgpt_test CHARACTER SET utf8;
```
测试库创建完成后，可以通过脚本一键初始化测试数据。
```python
python docker/examples/dashboard/test_case_mysql_data.py
```
### 添加数据源

添加数据源的步骤与[聊天数据](./chat_data.md)相同。在数据源管理选项卡中选择对应的数据库类型，然后创建。填写必要的信息即可完成创建。


### 选择聊天仪表板

添加数据源后，在主场景页面选择“Chat Dashboard”即可进行报表分析。

<p对齐=“中心”>
  <img src={'/img/app/chat_dashboard_v0.6.jpg'} width="800px" />
</p>


### 开始聊天
在右侧对话框中输入具体问题即可开始数据对话。


:::信息说明

⚠️数据对话对模型能力要求比较高，`ChatGPT/GPT-4`成功率很高。其他开源模型你可以尝试`qwen2`
:::

<p对齐=“中心”>
  <img src={'/img/app/chat_dashboard_display_v0.6.jpg'} width="800px" />
</p>