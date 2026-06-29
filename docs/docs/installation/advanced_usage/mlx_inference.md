# MLX 推理
DB-GPT 支持 [MLX](https://github.com/ml-explore/mlx-lm) 推理，这是一个快速且易于使用的 LLM 推理和服务库。

## 安装依赖项

“MLX”是 DB-GPT 中的可选依赖项。您可以通过在安装依赖项时添加额外的 `--extra "mlx"` 来安装它。
```bash
# Use uv to install dependencies needed for mlx
# Install core dependencies and select desired extensions
uv sync --all-packages \
--extra "base" \
--extra "hf" \
--extra "mlx" \
--extra "rag" \
--extra "storage_chromadb" \
--extra "quant_bnb" \
--extra "dbgpts"
```
## 修改配置文件

安装依赖项后，您可以修改配置文件以使用“mlx”提供程序。
```toml
# Model Configurations
[models]
[[models.llms]]
name = "Qwen/Qwen3-0.6B-MLX-4bit"
provider = "mlx"
# If not provided, the model will be downloaded from the Hugging Face model hub
# uncomment the following line to specify the model path in the local file system
# https://huggingface.co/Qwen/Qwen3-0.6B-MLX-4bit
# path = "the-model-path-in-the-local-file-system"
```
### 第 3 步：运行模型

您可以使用以下命令运行模型：
```bash
uv run dbgpt start webserver --config {your_config_file}
```