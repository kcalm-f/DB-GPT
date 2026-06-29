# 源码部署

## 环境要求

|启动模式| CPU * 内存 |       图形处理器 |         备注 |
|:--------------------:|:------------:|:--------------:|:----------------:|
|     代理模式|    4C*8G |        无 |  代理模型不依赖GPU |
|     本地模特|    8C*32G |       24G |  本地启动最好24G以上GPU |


## 环境准备

### 下载源代码

:::提示
下载 DB-GPT
:::
```bash
git clone https://github.com/eosphoros-ai/DB-GPT.git
```
:::信息说明
安装uv有以下几种方法：
:::
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
默认值=“uv_sh”
  值={[
    {label: '命令（macOS 和 Linux）', value: 'uv_sh'},
    {标签：'PyPI'，值：'uv_pypi'}，
    {标签：'其他'，值：'uv_other'}，
  ]}>
  <TabItem value="uv_sh" label="Command">
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```
  </TabItem>

  <TabItem value="uv_pypi" label="Pypi">
使用 pipx 安装 uv。
```bash
python -m pip install --upgrade pip
python -m pip install --upgrade pipx
python -m pipx ensurepath
pipx install uv --global
```
  </TabItem>

  <TabItem value="uv_other" label="Other">
更多安装方法可以参见【uv安装】(https://docs.astral.sh/uv/getting-started/installation/)
  </TabItem>

</Tabs>
然后，您可以运行“uv --version”来检查uv是否安装成功。
```bash
uv --version
```
## 部署 DB-GPT 

### 安装依赖项
<Tabs
默认值=“openai”
  值={[
    {标签：'OpenAI（代理）'，值：'openai'}，
    {标签：'DeepSeek（代理）'，值：'deepseek'}，
    {标签：'GLM4（本地）'，值：'glm-4'}，
  ]}>
  <TabItem value="openai" label="OpenAI(proxy)">

```bash
# Use uv to install dependencies needed for OpenAI proxy
uv sync --all-packages \
--extra "base" \
--extra "proxy_openai" \
--extra "rag" \
--extra "storage_chromadb" \
--extra "dbgpts"
```
### 运行网络服务器

要使用 OpenAI 代理运行 DB-GPT，您必须在“configs/dbgpt-proxy-openai.toml”配置文件中提供 OpenAI API 密钥，或在环境变量中使用密钥“OPENAI_API_KEY”提供它。
```toml
# Model Configurations
[models]
[[models.llms]]
...
api_key = "your-openai-api-key"
[[models.embeddings]]
...
api_key = "your-openai-api-key"
```
然后运行以下命令来启动网络服务器：
```bash
uv run dbgpt start webserver --config configs/dbgpt-proxy-openai.toml
```
上面命令中，`--config`指定配置文件，`configs/dbgpt-proxy-openai.toml`是OpenAI代理模型的配置文件，您也可以使用其他配置文件或根据需要创建自己的配置文件。

或者，您还可以使用以下命令来启动网络服务器：
```bash
uv run python packages/dbgpt-app/src/dbgpt_app/dbgpt_server.py --config configs/dbgpt-proxy-openai.toml
```

  </TabItem>
<TabItem value="deepseek" label="DeepSeek(proxy)">

```bash
# Use uv to install dependencies needed for OpenAI proxy
uv sync --all-packages \
--extra "base" \
--extra "proxy_openai" \
--extra "rag" \
--extra "storage_chromadb" \
--extra "dbgpts"
```
### 运行网络服务器

要使用 DeepSeek 代理运行 DB-GPT，您必须在“configs/dbgpt-proxy-deepseek.toml”中提供 DeepSeek API 密钥。

您可以在`configs/dbgpt-proxy-deepseek.toml`配置文件中指定您的嵌入模型，默认嵌入模型是`BAAI/bge-large-zh-v1.5`。如果想使用其他嵌入模型，可以修改 configs/dbgpt-proxy-deepseek.toml 配置文件，并在 [[models.embeddings]] 部分指定嵌入模型的 name 和provider 。提供者可以是“hf”。
```toml
# Model Configurations
[models]
[[models.llms]]
# name = "deepseek-chat"
name = "deepseek-reasoner"
provider = "proxy/deepseek"
api_key = "your-deepseek-api-key"
[[models.embeddings]]
name = "BAAI/bge-large-zh-v1.5"
provider = "hf"
# If not provided, the model will be downloaded from the Hugging Face model hub
# uncomment the following line to specify the model path in the local file system
# path = "the-model-path-in-the-local-file-system"
path = "/data/models/bge-large-zh-v1.5"
```
然后运行以下命令来启动网络服务器：
```bash
uv run dbgpt start webserver --config configs/dbgpt-proxy-deepseek.toml
```
上面命令中，`--config`指定配置文件，`configs/dbgpt-proxy-deepseek.toml`是DeepSeek代理模型的配置文件，您也可以使用其他配置文件或根据需要创建自己的配置文件。

或者，您还可以使用以下命令来启动网络服务器：
```bash
uv run python packages/dbgpt-app/src/dbgpt_app/dbgpt_server.py --config configs/dbgpt-proxy-deepseek.toml
```

  </TabItem>
  <TabItem value="glm-4" label="GLM4(local)">

```bash
# Use uv to install dependencies needed for GLM4
# Install core dependencies and select desired extensions
uv sync --all-packages \
--extra "base" \
--extra "cuda121" \
--extra "hf" \
--extra "rag" \
--extra "storage_chromadb" \
--extra "quant_bnb" \
--extra "dbgpts"
```
### 运行网络服务器

使用本地模型运行 DB-GPT。您可以修改 configs/dbgpt-local-glm.toml 配置文件来指定模型路径和其他参数。
```toml
# Model Configurations
[models]
[[models.llms]]
name = "THUDM/glm-4-9b-chat-hf"
provider = "hf"
# If not provided, the model will be downloaded from the Hugging Face model hub
# uncomment the following line to specify the model path in the local file system
# path = "the-model-path-in-the-local-file-system"

[[models.embeddings]]
name = "BAAI/bge-large-zh-v1.5"
provider = "hf"
# If not provided, the model will be downloaded from the Hugging Face model hub
# uncomment the following line to specify the model path in the local file system
# path = "the-model-path-in-the-local-file-system"
```
在上面的配置文件中，“[[models.llms]]”指定LLM模型，“[[models.embeddings]]”指定嵌入模型。如果您不提供“path”参数，则将根据“name”参数从Hugging Face模型中心下载模型。

然后运行以下命令来启动网络服务器：
```bash
uv run dbgpt start webserver --config configs/dbgpt-local-glm.toml
```

  </TabItem>
</Tabs>
## 访问网站

打开浏览器并访问 [`http://localhost:5670`](http://localhost:5670)

### （可选）单独运行 Web 前端

您还可以单独运行 Web 前端：
```bash
cd web && npm install
cp .env.template .env
// Set API_BASE_URL to your DB-GPT server address, usually http://localhost:5670
npm run dev
```
打开浏览器并访问 [`http://localhost:3000`](http://localhost:3000)


## 安装 DB-GPT 应用数据库
<Tabs
默认值=“sqlite”
  值={[
    {标签：'SQLite'，值：'SQLite'}，
    {标签：'MySQL'，值：'mysql'}，
  ]}>
<TabItem value="sqlite" label="sqlite">
:::提示注意

不需要在SQLite中单独创建与DB-GPT应用相关的数据库表； 
默认情况下，它们会自动为您创建。

:::

修改您的 toml 配置文件以使用 SQLite 作为数据库（是默认设置）。
```toml
[service.web.database]
type = "sqlite"
path = "pilot/meta_data/dbgpt.db"
```


 </TabItem>
<TabItem value="mysql" label="MySQL">
:::警告注意

在0.4.7版本之后，为了安全起见，我们删除了MySQL数据库Schema的自动生成。

:::

1. 首先，执行MySQL脚本创建数据库和表。
```bash
$ mysql -h127.0.0.1 -uroot -p{your_password} < ./assets/schema/dbgpt.sql
```
2. 其次，修改 toml 配置文件以使用 MySQL 作为数据库。
```toml
[service.web.database]
type = "mysql"
host = "127.0.0.1"
port = 3306
user = "root"
database = "dbgpt"
password = "aa123456"
```
请将“主机”、“端口”、“用户”、“数据库”和“密码”替换为您自己的 MySQL 数据库设置。
 </TabItem>
</Tabs>
## 测试数据（可选）
DB-GPT项目默认内置了部分测试数据，可以通过以下命令加载到本地数据库进行测试
- **Linux**
```bash
bash ./scripts/examples/load_examples.sh

```
- **Windows**
```bash
.\scripts\examples\load_examples.bat
```
:::

## 访问网站
打开浏览器并访问[`http://localhost:5670`](http://localhost:5670)