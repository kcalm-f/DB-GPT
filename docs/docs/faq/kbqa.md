# KBQA 常见问题解答

### Q1：未找到text2vec-large-chinese

确保您已以正确的方式下载 text2vec-large-chinese 嵌入模型
```tip
centos:yum install git-lfs
ubuntu:apt-get install git-lfs -y
macos:brew install git-lfs
```
```bash
cd models
git lfs clone https://huggingface.co/GanymedeNil/text2vec-large-chinese
```
### Q2：如何更改DB-GPT中的Vector DB类型。

更新 .env 文件并设置 VECTOR_STORE_TYPE。

DB-GPT 目前支持 Chroma(默认)、Milvus(>2.1)、Weaviate、Valkey、OceanBase 矢量数据库。
如果您想更改矢量数据库，请更新您的.env，设置您的矢量存储类型，VECTOR_STORE_TYPE=Chroma（现在仅支持 Chroma 和 Milvus（>2.1），如果您设置 Milvus，请设置 MILVUS_URL 和 MILVUS_PORT）。

如果您想使用OceanBase，请先通过以下命令启动一个docker容器：
```shell
docker run --name=ob433 -e MODE=slim -p 2881:2881 -d quay.io/oceanbase/oceanbase-ce:4.3.3.0-100000142024101215
```
下载合作伙伴包：
```shell
pip install --upgrade --quiet pyobvector
```
检查OceanBase的连接并设置矢量数据的内存使用比例：
```python
from pyobvector import ObVecClient

tmp_client = ObVecClient()
tmp_client.perform_raw_text_sql(
    "ALTER SYSTEM ob_vector_memory_limit_percentage = 30"
)
```
然后在 .env 文件中设置以下变量：
```shell
VECTOR_STORE_TYPE=OceanBase
OB_HOST=127.0.0.1
OB_PORT=2881
OB_USER=root@test
OB_DATABASE=test
## Optional
# OB_PASSWORD=
## Optional: If {OB_ENABLE_NORMALIZE_VECTOR} is set, the vector stored in OceanBase is normalized.
# OB_ENABLE_NORMALIZE_VECTOR=True
```
如果你想支持更多的vector db，可以自己集成。[如何集成](https://db-gpt.readthedocs.io/en/latest/modules/vector.html)
```commandline
#*******************************************************************#
#**                  VECTOR STORE SETTINGS                       **#
#*******************************************************************#
VECTOR_STORE_TYPE=Chroma
#MILVUS_URL=127.0.0.1
#MILVUS_PORT=19530
#MILVUS_USERNAME
#MILVUS_PASSWORD
#MILVUS_SECURE=

#WEAVIATE_URL=https://kt-region-m8hcy0wc.weaviate.network
```
### Q3：当我使用vicuna-13b时，发现一些像这样的非法字符。
<p对齐=“左”>
  <img src="https://github.com/eosphoros-ai/DB-GPT/assets/13723926/088d1967-88e3-4f72-9ad7-6c4307baa2f8" width="800px" />
</p>

将 KNOWLEDGE_SEARCH_TOP_SIZE 设置较小或将 KNOWLEDGE_CHUNK_SIZE 设置较小，然后重新启动服务器。

### Q4：空间添加错误（pymysql.err.OperationalError）（1054，“‘字段列表’中的未知列‘knowledge_space.context’”）

1.关闭dbgpt_server(ctrl c)

2.为表knowledge_space添加列上下文
```commandline
mysql -h127.0.0.1 -uroot -p {your_password}
```
3.执行sql ddl
```commandline
mysql> use knowledge_management;
mysql> ALTER TABLE knowledge_space ADD COLUMN context TEXT COMMENT "arguments context";
```
4.重启dbgpt服务

### Q5：使用Mysql，如何使用DB-GPT KBQA

构建Mysql KBQA系统数据库模式。
```bash
$ mysql -h127.0.0.1 -uroot -p{your_password} < ./assets/schema/knowledge_management.sql
```