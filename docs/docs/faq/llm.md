# LLM使用常见问题解答

### Q1:如何使用openai chatgpt服务
更改您的 LLM_MODEL
````shell
LLM_MODEL=proxyllm
````
设置您的 OPENAPI 密钥
````shell
PROXY_API_KEY={your-openai-sk}
PROXY_SERVER_URL=https://api.openai.com/v1/chat/completions
````
确保您的 openapi API_KEY 可用

### Q2 `python dbgpt_server --light` 和 `python dbgpt_server` 有什么区别

:::提示
python dbgpt_server --light` dbgpt_server 不启动 llm 服务。用户可以使用`python llmserver`单独部署llm服务，dbgpt_server通过在.env中设置LLM_SERVER环境变量来访问llm服务。目的是允许单独部署dbgpt的后端服务和llm服务。

python dbgpt_server 服务和 llm 服务部署在同一个实例上。 dbgpt_server启动服务的同时，也同时启动了llm服务。
:::

### Q3 如何使用 MultiGPU

默认情况下，DB-GPT 将使用所有可用的 GPU。您可以修改`.env`文件中的设置`CUDA_VISIBLE_DEVICES=0,1`
使用特定的 GPU ID。

或者，您还可以在启动命令之前指定要使用的 GPU ID，如下所示：
````shell
# Specify 1 gpu
CUDA_VISIBLE_DEVICES=0 python3 dbgpt/app/dbgpt_server.py

# Specify 4 gpus
CUDA_VISIBLE_DEVICES=3,4,5,6 python3 dbgpt/app/dbgpt_server.py
````
您可以修改`.env`文件中的设置`MAX_GPU_MEMORY=xxGib`来配置每个GPU使用的最大内存。

### Q4 内存不足

DB-GPT支持8位量化和4位量化。

您可以修改`.env`文件中的设置`QUANTIZE_8bit=True`或`QUANTIZE_4bit=True`来使用量化（默认启用8位量化）。

具有 8 位量化的 Llama-2-70b 可以在 80 GB VRAM 上运行，4 位量化可以在 48 GB VRAM 上运行。

注意：您需要根据[requirements.txt](https://github.com/eosphoros-ai/DB-GPT/blob/main/requirements.txt)安装最新的依赖项。
注意：您需要根据[requirements.txt](https://github.com/eosphoros-ai/DB-GPT/blob/main/requirements.txt)安装最新的依赖项。