# 开始吧

AWEL（代理工作流表达式语言）可以轻松构建复杂的 llm 应用程序，并且提供强大的功能和灵活性。 

## 使用 AWEL 的基本示例：http 请求 + 输出重写

AWEL 的基本用法是构建一个 http 请求并重写一些输出值。要了解其工作原理，让我们看一个示例。

### DAG 规划
首先，让我们看一下基本 AWEL 编排的介绍性示例。该示例的核心功能是处理 HTTP 请求的输入和输出。因此，整个编排只包含两个步骤：
- HTTP 请求
- 处理HTTP响应结果

DB-GPT中已经封装了一些基本的依赖运算符，可以直接引用。
```python
from dbgpt._private.pydantic import BaseModel, Field
from dbgpt.core.awel import DAG, HttpTrigger, MapOperator
```
### 自定义运算符

定义接受两个参数的 HTTP 请求正文：姓名和年龄。
```python
class TriggerReqBody(BaseModel):
    name: str = Field(..., description="User name")
    age: int = Field(18, description="User age")
```
定义一个名为“RequestHandleOperator”的请求处理运算符，它是扩展基本“MapOperator”的运算符。 “RequestHandleOperator”的操作很简单：解析请求正文并提取名称和年龄字段，然后将它们连接成一个句子。例如：

> “你好，张三，你今年18岁。”
```python
class RequestHandleOperator(MapOperator[TriggerReqBody, str]):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    async def map(self, input_value: TriggerReqBody) -> str:
        print(f"Receive input value: {input_value}")
        return f"Hello, {input_value.name}, your age is {input_value.age}"
```
### DAG 管道

编写完上述算子后，就可以将它们组装成DAG编排了。这个DAG一共有两个节点：第一个节点是`HttpTrigger`，主要处理HTTP请求（这个算子内置在DB-GPT中），第二个节点是新定义的`RequestHandleOperator`，处理请求体。下面的 DAG 代码可用于将两个节点链接在一起。
```python
with DAG("simple_dag_example") as dag:
    trigger = HttpTrigger("/examples/hello", request_body=TriggerReqBody)
    map_node = RequestHandleOperator()
    trigger >> map_node
```
### 访问验证

在进行访问验证之前，需要先启动项目：`python dbgpt/app/dbgpt_server.py`
```bash
% curl -X GET http://127.0.0.1:5670/api/v1/awel/trigger/examples/hello\?name\=zhangsan
"Hello, zhangsan, your age is 18"
```
当然，为了方便用户测试，我们还提供了测试环境。该测试环境允许在不启动 dbgpt_server 的情况下进行测试。在 simple_dag_example 下面添加以下代码，然后直接运行 simple_dag_example.py 脚本即可运行测试脚本，无需启动项目。
```python
if __name__ == "__main__":
    if dag.leaf_nodes[0].dev_mode:
        # Development mode, you can run the dag locally for debugging.
        from dbgpt.core.awel import setup_dev_environment
        setup_dev_environment([dag], port=5555)
    else:
        # Production mode, DB-GPT will automatically load and execute the current file after startup.
        pass
```

```bash
curl -X GET http://127.0.0.1:5555/api/v1/awel/trigger/examples/hello\?name\=zhangsan
"Hello, zhangsan, your age is 18"
```
[simple_dag_example](/examples/awel/simple_dag_example.py)