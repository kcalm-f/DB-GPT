# 什么是 AWEL？ 

Agentic Workflow Expression Language（AWEL）是一套专为大型模型应用而设计的智能代理工作流表达语言
发展。它提供了强大的功能和灵活性。通过AWEL API，您可以专注于LLM应用程序的业务逻辑开发
无需关注繁琐的模型和环境细节。

AWEL采用分层API设计。 AWEL的分层API设计架构如下图所示。


<p对齐=“左”>
  <img src={'/img/awel.png'} width="480px"/>
</p>

## AWEL 设计

AWEL在设计上分为三个层次，即算子层、AgentFream层和DSL层。下面简单介绍一下
到三个层次。

- **算子层**
算子层是指LLM应用开发过程中最基本的操作原子， 
例如开发 RAG 应用程序时。检索、向量化、模型交互、提示处理等 
都是基本运算符。在后续的发展中，该框架将进一步抽象和规范算子的设计。 
基于标准API可快速实现一组算子

- **AgentFream层**
AgentFream层进一步封装了算子，可以基于算子进行链式计算。 
这一层链计算还支持分布式，支持filter、join、map、reduce等一套链计算操作，未来会支持更多的计算逻辑。

- **DSL层**
DSL层提供了一套标准的结构化表示语言，可以通过编写DSL语句来完成AgentFream和算子的操作，使得围绕数据编写大型模型应用更加确定，避免了自然语言编写的不确定性，让围绕数据编写变得更加容易。使用大型模型的应用程序编程变成了确定性应用程序编程。

## 示例
AWEL 的初级版本也已经发布，我们提供了一些内置的使用示例。

## 运算符

### API-RAG 示例 
您可以从`examples/awel/simple_rag_example.py`找到[源代码](https://github.com/eosphoros-ai/DB-GPT/blob/main/examples/awel/simple_rag_example.py)
```python
with DAG("simple_rag_example") as dag:
    trigger_task = HttpTrigger(
        "/examples/simple_rag", methods="POST", request_body=ConversationVo
    )
    req_parse_task = RequestParseOperator()
    # TODO should register prompt template first
    prompt_task = PromptManagerOperator()
    history_storage_task = ChatHistoryStorageOperator()
    history_task = ChatHistoryOperator()
    embedding_task = EmbeddingEngingOperator()
    chat_task = BaseChatOperator()
    model_task = ModelOperator()
    output_parser_task = MapOperator(lambda out: out.to_dict()["text"])

    (
        trigger_task
        >> req_parse_task
        >> prompt_task
        >> history_storage_task
        >> history_task
        >> embedding_task
        >> chat_task
        >> model_task
        >> output_parser_task
    )

```
位运算将整个过程以DAG的形式排列

<p对齐=“左”>
  <img src={'/img/awel_dag_flow.png'} width="360px" />
</p>

#### LLM+缓存示例

<p对齐=“左”>
  <img src={'/img/awel_cache_flow.png'} width="360px" />
</p>


### AgentFream 示例
```python
af = AgentFream(HttpSource("/examples/run_code", method = "post"))
result = (
    af
    .text2vec(model="text2vec")
    .filter(vstore, store = "chromadb", db="default")
    .llm(model="vicuna-13b", temperature=0.7)
    .map(code_parse_func)
    .map(run_sql_func)
    .reduce(lambda a, b: a + b)
)
result.write_to_sink(type='source_slink')
```
### DSL 示例
``` python
CREATE WORKFLOW RAG AS
BEGIN
    DATA requestData = RECEIVE REQUEST FROM 
    		http_source("/examples/rags", method = "post");
        
    DATA processedData = TRANSFORM requestData USING embedding(model = "text2vec");
    DATA retrievedData = RETRIEVE DATA 
    		FROM vstore(database = "chromadb", key = processedData)
    		ON ERROR FAIL;
        
    DATA modelResult = APPLY LLM "vicuna-13b" 
    		WITH DATA retrievedData AND PARAMETERS (temperature = 0.7)
    		ON ERROR RETRY 2 TIMES;
        
    RESPOND TO http_source WITH modelResult
    		ON ERROR LOG "Failed to respond to request";
END;
```
## 目前支持的运营商
- **基本运算符**
    - 基础操作员
    - 加入操作员
    - 归约运算符
    - 地图操作员
    - 分行操作员
    - 输入操作符
    - 触发操作员
- **流运营商**
    - StreamifyAbsOperator
    - UnstreamifyAbsOperator
    - TransformStreamAbsOperator

## 可执行环境
- 单机环境
- 射线环境