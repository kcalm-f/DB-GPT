# DB-GPT 文档 

## 快速入门

### 安装依赖项 
- 首先克隆当前项目！
- 安装docusaurus依赖项，生成node_modules文件夹。
```
yarn install
```
＃＃＃ 发射
``` 
yarn start
```
默认服务在`3000`端口启动，访问`localhost:3000`

## 部署多版本文档

我们可以通过docker部署多个版本的文档。

### 构建 Docker 镜像

首先，在“DB-GPT”项目根目录中构建docker镜像。
```bash
# Use the default NPM_REGISTRY=https://registry.npmjs.org
# Use https://www.npmmirror.com/
NPM_REGISTRY=https://registry.npmmirror.com
docker build -f docs/Dockerfile-deploy \
-t eosphorosai/dbgpt-docs \
--build-arg NPM_REGISTRY=$NPM_REGISTRY \
--build-arg CI=false \
--build-arg NUM_VERSION=2 .
```
### 运行 Docker 容器

使用以下命令运行 docker 容器：
```bash
docker run -it --rm -p 8089:8089 \
--name my-dbgpt-docs \
-v $(pwd)/docs/nginx/nginx-docs.conf:/etc/nginx/nginx.conf \
eosphorosai/dbgpt-docs
```
打开浏览器并访问“localhost:8089”即可查看文档。