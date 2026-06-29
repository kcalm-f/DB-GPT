# vLLM 推理
DB-GPT 支持 [vLLM](https://github.com/vllm-project/vllm) 推理，这是一个快速且易于使用的 LLM 推理和服务库。

## 安装依赖项
`vLLM` 是 DB-GPT 中的可选依赖项。您可以通过在安装依赖项时添加额外的 `--extra "vllm"` 来安装它。
```bash
# Use uv to install dependencies needed for vllm
# Install core dependencies and select desired extensions
uv sync --all-packages \
--extra "base" \
--extra "hf" \
--extra "cuda121" \
--extra "vllm" \
--extra "rag" \
--extra "storage_chromadb" \
--extra "quant_bnb" \
--extra "dbgpts"
```
## 修改配置文件

安装依赖项后，您可以修改配置文件以使用“vllm”提供程序。
```toml
# Model Configurations
[models]
[[models.llms]]
name = "THUDM/glm-4-9b-chat-hf"
provider = "vllm"
# If not provided, the model will be downloaded from the Hugging Face model hub
# uncomment the following line to specify the model path in the local file system
# path = "the-model-path-in-the-local-file-system"
```
有关“vLLM”支持的模型列表的更多信息，请参阅[vLLM支持的模型文档](https://docs.vllm.ai/en/latest/models/supported_models.html#supported-models)。