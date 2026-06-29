# 可观测性

**可观察性** 是衡量系统内部状态的推断程度的指标 
了解其外部输出。在软件系统的背景下，可观察性 
是通过检查系统输出来了解系统内部状态的能力。 
这对于调试、监控和维护系统非常重要。


## DB-GPT 中的可观察性

DB-GPT 通过以下机制提供可观察性：
- **日志记录**：DB-GPT 记录各种事件和指标，以帮助您了解系统的内部状态。
- **跟踪**：DB-GPT 提供跟踪功能，帮助您了解系统中的请求流。

## 日志记录

您可以配置 DB-GPT 日志的日志记录级别和存储位置。默认情况下， 
日志存储在DB-GPT根目录下的“logs”目录中。你可以改变 
通过设置`DBGPT_LOG_LEVEL`和`DBGPT_LOG_DIR`环境来设置日志级别和存储位置。


## 追踪

DB-GPT 具有内置跟踪功能，可让您跟踪请求流 
通过系统。 


## 跟踪存储

### 本地存储

DB-GPT 会将跟踪存储在 DB-GPT 日志目录中的 `traces` 目录中，默认情况下， 
它们位于“logs/dbgpt*.jsonl”中。 

如果您想了解更多有关痕迹本地存储以及如何使用它们的信息，您可以 
可以参考[调试](./debugging)文档。


### OpenTelemetry 支持

DB-GPT 还支持 [OpenTelemetry](https://opentelemetry.io/) 进行分布式跟踪。 
现在，您可以将跟踪导出到开放遥测兼容的后端，例如 Jaeger、Zipkin、 
以及其他具有开放遥测协议 (OTLP) 的协议。

要启用 OpenTelemetry 支持，您需要安装以下软件包：
```bash
pip install opentelemetry-api opentelemetry-sdk opentelemetry-exporter-otlp
```
然后，修改您的 .env 文件以启用 OpenTelemetry 跟踪：
```bash
## Whether to enable DB-GPT send trace to OpenTelemetry
TRACER_TO_OPEN_TELEMETRY=True
## More details see https://opentelemetry-python.readthedocs.io/en/latest/exporter/otlp/otlp.html
OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=http://localhost:4317
```
在上面的配置中，您可以将`OTEL_EXPORTER_OTLP_TRACES_ENDPOINT`更改为 
您的 OTLP 收集器或后端，我们默认使用 gRPC 端点。

这里我们以 Jaeger 为例，展示如何使用 OpenTelemetry 来追踪 DB-GPT。

### Jaeger 支持

以下是如何使用 Jaeger 和 docker 跟踪 DB-GPT 的示例：

运行 Jaeger 一体化映像：
```bash
docker run --rm --name jaeger \
  -e COLLECTOR_ZIPKIN_HOST_PORT=:9411 \
  -p 6831:6831/udp \
  -p 6832:6832/udp \
  -p 5778:5778 \
  -p 16686:16686 \
  -p 4317:4317 \
  -p 4318:4318 \
  -p 14250:14250 \
  -p 14268:14268 \
  -p 14269:14269 \
  -p 9411:9411 \
  jaegertracing/all-in-one:1.58
```
然后，修改您的“.env”文件以启用 OpenTelemetry 跟踪，如上所示。
```bash
TRACER_TO_OPEN_TELEMETRY=True
OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=http://localhost:4317
```
启动 DB-GPT 服务器：
```bash
dbgpt start webserver
```
现在，您可以通过“http://localhost:16686”访问 Jaeger UI 来查看跟踪记录。

以下是 Jaeger UI 的一些屏幕截图示例：

**搜索痕迹页面**
<p对齐=“左”>
  <img src={'/img/application/advanced_tutorial/observability_img1.png'} width="720px"/>
</p>

**显示正常对话轨迹**

<p对齐=“左”>
  <img src={'/img/application/advanced_tutorial/observability_img2.png'} width="720px"/>
</p>

**显示对话详细标签**

<p对齐=“左”>
  <img src={'/img/application/advanced_tutorial/observability_img3.png'} width="720px"/>
</p>

**显示代理对话轨迹**

<p对齐=“左”>
  <img src={'/img/application/advanced_tutorial/observability_img4.png'} width="720px"/>
</p>

**显示集群中的跟踪**

### Jaeger 对 Docker Compose 的支持

如果你想使用 docker-compose 来启动 DB-GPT 和 Jaeger，可以使用以下命令
`docker-compose.yml` 文件：
```yaml
# An example of using docker-compose to start a cluster with observability enabled.
version: '3.10'

services:
  jaeger:
    image: jaegertracing/all-in-one:1.58
    restart: unless-stopped
    networks:
      - dbgptnet
    ports:
      # serve frontend
      - "16686:16686"
      # accept jaeger.thrift over Thrift-compact protocol (used by most SDKs)
      - "6831:6831"
      # accept OpenTelemetry Protocol (OTLP) over HTTP
      - "4318:4318"
      # accept OpenTelemetry Protocol (OTLP) over gRPC
      - "4317:4317"
      - "14268:14268"
    environment:
      - LOG_LEVEL=debug
      - SPAN_STORAGE_TYPE=badger
      - BADGER_EPHEMERAL=false
      - BADGER_DIRECTORY_VALUE=/badger/data
      - BADGER_DIRECTORY_KEY=/badger/key
    volumes:
      - jaeger-badger:/badger
    user: root
  controller:
    image: eosphorosai/dbgpt:latest
    command: dbgpt start controller
    restart: unless-stopped
    environment:
      - TRACER_TO_OPEN_TELEMETRY=True
      - OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=http://jaeger:4317
      - DBGPT_LOG_LEVEL=DEBUG
    networks:
      - dbgptnet
  llm-worker:
    image: eosphorosai/dbgpt:latest
    command: dbgpt start worker --model_type proxy --model_name chatgpt_proxyllm --model_path chatgpt_proxyllm --proxy_server_url ${OPENAI_API_BASE}/chat/completions --proxy_api_key ${OPENAI_API_KEY} --controller_addr http://controller:8000
    environment:
      # Your real openai model name, e.g. gpt-3.5-turbo, gpt-4o
      - PROXYLLM_BACKEND=gpt-3.5-turbo
      - TRACER_TO_OPEN_TELEMETRY=True
      - OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=http://jaeger:4317
      - DBGPT_LOG_LEVEL=DEBUG
    depends_on:
      - controller
    restart: unless-stopped
    networks:
      - dbgptnet
    ipc: host
  embedding-worker:
    image: eosphorosai/dbgpt:latest
    command: dbgpt start worker --worker_type text2vec --model_name proxy_http_openapi --model_path proxy_http_openapi --proxy_server_url ${OPENAI_API_BASE}/embeddings --proxy_api_key ${OPENAI_API_KEY} --controller_addr http://controller:8000
    environment:
      - proxy_http_openapi_proxy_backend=text-embedding-3-small
      - TRACER_TO_OPEN_TELEMETRY=True
      - OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=http://jaeger:4317
      - DBGPT_LOG_LEVEL=DEBUG
    depends_on:
      - controller
    restart: unless-stopped
    networks:
      - dbgptnet
    ipc: host
  webserver:
    image: eosphorosai/dbgpt:latest
    command: dbgpt start webserver --light --remote_embedding --controller_addr http://controller:8000
    environment:
      - LLM_MODEL=chatgpt_proxyllm
      - EMBEDDING_MODEL=proxy_http_openapi
      - TRACER_TO_OPEN_TELEMETRY=True
      - OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=http://jaeger:4317
    depends_on:
      - controller
      - llm-worker
      - embedding-worker
    volumes:
      - dbgpt-data:/app/pilot/data
      - dbgpt-message:/app/pilot/message
    ports:
      - 5670:5670/tcp
    restart: unless-stopped
    networks:
      - dbgptnet
volumes:
  dbgpt-data:
  dbgpt-message:
  jaeger-badger:
networks:
  dbgptnet:
    driver: bridge
    name: dbgptnet
```
您可以使用以下命令启动集群：
```bash
OPENAI_API_KEY="{your api key}" OPENAI_API_BASE="https://api.openai.com/v1" docker compose up -d
```
请将“{your api key}”替换为您真实的 OpenAI API 密钥和“https://api.openai.com/v1” 
与您真实的 OpenAI API 基本 URL 一起使用。
您可以在“docker/compose_examples/observability/docker-compose.yml”文档中查看有关 docker-compose 文件的更多详细信息。

集群启动后，您可以通过“http://localhost:16686”访问Jaeger UI来查看跟踪信息。

**显示 RAG 对话轨迹**

<p对齐=“左”>
  <img src={'/img/application/advanced_tutorial/observability_img5.png'} width="720px"/>
</p>

在上面的屏幕截图中，您可以看到 DB-GPT 控制器、LLM Worker 和 Web 服务器之间跨服务通信的痕迹。