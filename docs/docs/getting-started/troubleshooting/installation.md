---
sidebar_position: 1
title: Installation Issues
---
# 安装问题

DB-GPT 安装过程中的常见问题及其解决方法。

## Python 版本错误

**症状：** `需要 Python 3.10+` 或版本不匹配错误。

**使固定：**
```bash
python --version
# Must be 3.10 or newer
```
如果您有多个 Python 版本，请明确指定版本：
```bash
uv python pin 3.11
uv sync --all-packages ...
```
## 未找到紫外线

**症状：** `找不到命令：uv`

**修复：**
```bash
# Install uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# Verify
uv --version
```
如果已安装但未找到，请确保它位于您的 PATH 中：
```bash
export PATH="$HOME/.local/bin:$PATH"
```
## 依赖解析失败

**症状：** `uvsync` 失败并出现依赖冲突错误。

**修复：**

1. 确保您使用的是最新的 uv：
```bash
uv self update
```
2. 清理缓存并重试：
```bash
uv cache clean
uv sync --all-packages --extra "base" ...
```
3.如果使用中国镜像，设置索引URL：
```bash
UV_INDEX_URL=https://pypi.tuna.tsinghua.edu.cn/simple uv sync --all-packages ...
```
## 本机扩展的构建失败

**症状：** `uvsync` 期间出现编译错误，尤其是像 `tokenizers`、`grpcio` 或 `psutil` 这样的包。

**修复：**

安装构建工具：
```bash
# Ubuntu/Debian
sudo apt-get install build-essential python3-dev

# macOS
xcode-select --install

# CentOS/RHEL
sudo yum groupinstall "Development Tools"
```
对于 Rust 相关的包（例如，`tokenizers`）：
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source $HOME/.cargo/env
```
## CUDA/GPU 问题

**症状：** `CUDA 不可用`或未检测到 GPU。

**修复：**

1.验证CUDA安装：
```bash
nvidia-smi
# Should show your GPU and CUDA version
```
2.安装匹配的CUDA额外：
```bash
# For CUDA 12.1
uv sync --all-packages --extra "cuda121" ...

# For CUDA 12.4
uv sync --all-packages --extra "cuda124" ...
```
3. 验证 PyTorch 是否能识别 GPU：
```bash
uv run python -c "import torch; print(torch.cuda.is_available())"
```
## 端口冲突

**症状：** 端口 5670 上的“地址已在使用中”。

**修复：**
```bash
# Find what's using the port
lsof -i :5670

# Kill the process
kill -9 <PID>
```
或者从不同的端口启动：
```bash
uv run dbgpt start webserver --config configs/your-config.toml --port 5671
```
## Docker 特定问题

### 权限被拒绝

**症状：** 运行 Docker 命令时出现“权限被拒绝”。

**使固定：**
```bash
# Add your user to the docker group
sudo usermod -aG docker $USER
# Log out and back in
```
### 未找到 NVIDIA 运行时

**症状：** `docker：来自守护程序的错误响应：无法选择设备驱动程序`

**修复：** 安装 NVIDIA Container Toolkit：
```bash
# Ubuntu
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/libnvidia-container/gpgkey | sudo apt-key add -
curl -s -L https://nvidia.github.io/libnvidia-container/$distribution/libnvidia-container.list | sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
sudo apt-get update && sudo apt-get install -y nvidia-container-toolkit
sudo systemctl restart docker
```
## 数据库问题

### MySQL 连接被拒绝

**症状：** `启动期间无法连接到 MySQL 服务器`。

**修复：**

1. 验证 MySQL 是否正在运行：
```bash
mysql -h127.0.0.1 -uroot -p -e "SELECT 1"
```
2. 检查配置值是否与您的 MySQL 实例匹配：
```toml
[service.web.database]
type = "mysql"
host = "127.0.0.1"    # Not 'localhost' — use IP
port = 3306
user = "root"
database = "dbgpt"
password = "your-password"
```
3.如果数据库不存在则创建：
```bash
mysql -h127.0.0.1 -uroot -p < ./assets/schema/dbgpt.sql
```
## 还是卡住了吗？

- 查看详细的[FAQ](/docs/faq/install)以获取更多解决方案
- 搜索 [GitHub 问题](https://github.com/eosphoros-ai/DB-GPT/issues)
- 在 [GitHub 讨论](https://github.com/orgs/eosphoros-ai/discussions) 中提问