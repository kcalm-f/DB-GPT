# 安装常见问题

### Q1: sqlalchemy.exc.OperationalError: (sqlite3.OperationalError) 无法打开数据库文件 

确保您提取最新代码或使用 mkdir Pilot/data 创建目录

### Q2：模型不断被杀死。

您的 GPU VRAM 大小不够，请尝试更换您的硬件或更换其他 llms。

### Q3：如何访问公网网站

你可以尝试使用gradio的[network](https://github.com/gradio-app/gradio/blob/main/gradio/networking.py)来实现。
```python
import secrets
from gradio import networking
token=secrets.token_urlsafe(32)
local_port=5670
url = networking.setup_tunnel('0.0.0.0', local_port, token)
print(f'Public url: {url}')
time.sleep(60 * 60 * 24)
```
用浏览器打开“url”即可查看该网站。

### Q4: (Windows) 执行 `pip install -e .` 错误

错误日志类似如下：
``` 
× python setup.py bdist_wheel did not run successfully.
  │ exit code: 1
  ╰─> [11 lines of output]
      running bdist_wheel
      running build
      running build_py
      creating build
      creating build\lib.win-amd64-cpython-310
      creating build\lib.win-amd64-cpython-310\cchardet
      copying src\cchardet\version.py -> build\lib.win-amd64-cpython-310\cchardet
      copying src\cchardet\__init__.py -> build\lib.win-amd64-cpython-310\cchardet
      running build_ext
      building 'cchardet._cchardet' extension
      error: Microsoft Visual C++ 14.0 or greater is required. Get it with "Microsoft C++ Build Tools": https://visualstudio.microsoft.com/visual-cpp-build-tools/
      [end of output]
```
从 [visual-cpp-build-tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) 下载并安装“Microsoft C++ 构建工具”



### Q5：`Torch 未在启用 CUDA 的情况下编译`
```
2023-08-19 16:24:30 | ERROR | stderr |     raise AssertionError("Torch not compiled with CUDA enabled")
2023-08-19 16:24:30 | ERROR | stderr | AssertionError: Torch not compiled with CUDA enabled
```
1.安装【CUDA工具包】(https://developer.nvidia.com/cuda-toolkit-archive)
2. 重新安装具有 CUDA 支持的 PyTorch [start-locally](https://pytorch.org/get-started/locally/#start-locally)。


### Q6：`如何将元表chat_history和connect_config从duckdb迁移到sqlite`
```commandline
 python docker/examples/metadata/duckdb2sqlite.py
```
### Q7：`如何将元表chat_history和connect_config从duckdb迁移到mysql`
```commandline
1. update your mysql username and password in docker/examples/metadata/duckdb2mysql.py
2.  python docker/examples/metadata/duckdb2mysql.py
```
### Q8：`如何管理和迁移我的数据库`

您可以使用“dbgpt db migration”命令来管理和迁移您的数据库。

详细信息请参见以下命令。
```commandline
dbgpt db migration --help
```
首先，您需要创建一个迁移脚本（除非您清理它，否则只需创建一次）。
此命令会在“pilot/meta_data”目录中创建一个“alembic”目录，并在其中创建一个初始迁移脚本。
```commandline
dbgpt db migration init
```
然后您可以使用以下命令升级数据库。
```commandline
dbgpt db migration upgrade
```
每次更改模型或从 DB-GPT 存储库提取最新代码时，都需要创建新的迁移脚本。
```commandline

dbgpt db migration migrate -m "your message"
```
然后您可以使用以下命令升级数据库。
```commandline
dbgpt db migration upgrade
```
### Q9：`alembic.util.exc.CommandError：目标数据库不是最新的。`

**解决方案1：**

运行以下命令升级数据库。
```commandline
dbgpt db migration upgrade
```
**解决方案2：**

运行以下命令来清理迁移脚本和迁移历史记录。
```commandline
dbgpt db migration clean -y
```
**解决方案3：**

如果您已经运行了上述命令，但错误仍然存在， 
您可以尝试以下命令来清理迁移脚本、迁移历史记录和数据。
警告：此命令将删除您的所有数据！请谨慎使用。
```commandline
dbgpt db migration clean --drop_all_tables -y --confirm_drop_all_tables
```
或者
```commandline
rm -rf pilot/meta_data/alembic/versions/*
rm -rf pilot/meta_data/alembic/dbgpt.db
```