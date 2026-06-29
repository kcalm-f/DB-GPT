# 单机部署

## 准备工作
```bash
# download source code
git clone https://github.com/eosphoros-ai/DB-GPT.git

cd DB-GPT
```
## 环境安装
```bash
# create a virtual environment
conda create -n dbgpt_env python=3.10

# activate virtual environment
conda activate dbgpt_env
```
## 安装依赖项
```bash
pip install -e ".[default]"
```
## 模型下载

下载LLM和嵌入模型

:::信息说明

⚠️如果没有GPU资源，建议使用代理模型，如OpenAI、Qwen、ERNIE Bot等。
:::
```bash
mkdir models && cd models

# download embedding model, eg: text2vec-large-chinese
git clone https://huggingface.co/GanymedeNil/text2vec-large-chinese
```
:::提示

设置代理API并修改`.env`配置
:::
```bash
#set LLM_MODEL TYPE
LLM_MODEL=proxyllm
#set your Proxy Api key and Proxy Server url
PROXY_API_KEY={your-openai-sk}
PROXY_SERVER_URL=https://api.openai.com/v1/chat/completions
```
:::信息说明
⚠️如果有GPU资源，可以使用本地模型来部署
:::
```bash
mkdir models && cd models

# # download embedding model, eg: glm-4-9b-chat or  
git clone https://huggingface.co/THUDM/glm-4-9b-chat

# download embedding model, eg: text2vec-large-chinese
git clone https://huggingface.co/GanymedeNil/text2vec-large-chinese

popd

```
## 命令行启动
```bash
LLM_MODEL=glm-4-9b-chat 
dbgpt start webserver --port 6006
```
默认情况下，“dbgpt start webserver 命令”将通过单个 Python 进程启动“webserver”、“modelcontroller”和“modelworker”。在上面的命令中，指定了端口“6006”。



## 查看并验证模型服务

:::提示
查看并显示所有模型服务
:::
```bash
dbgpt model list 
```

```bash
# result
+-----------------+------------+------------+------+---------+---------+-----------------+----------------------------+
|    Model Name   | Model Type |    Host    | Port | Healthy | Enabled | Prompt Template |       Last Heartbeat       |
+-----------------+------------+------------+------+---------+---------+-----------------+----------------------------+
| glm-4-9b-chat |    llm     | 172.17.0.9 | 6006 |   True  |   True  |                 | 2023-10-16T19:49:59.201313 |
|  WorkerManager  |  service   | 172.17.0.9 | 6006 |   True  |   True  |                 | 2023-10-16T19:49:59.246756 |
+-----------------+------------+------------+------+---------+---------+-----------------+----------------------------+

```
其中`WorkerManager`是`Model Workers`的管理进程

:::提示
检查并验证模型服务
:::
```bash
dbgpt model chat --model_name glm-4-9b-chat
```
上述命令将启动一个交互式页面，允许您通过终端与模型对话。
```bash
Chatbot started with model glm-4-9b-chat. Type 'exit' to leave the chat.


You: Hello
Bot: Hello! How can I assist you today?

You: 
```

