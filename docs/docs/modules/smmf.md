#SMMF
面向服务的多模型管理框架（SMMF）

# 简介

在AIGC应用探索和生产落地中，很难避免与建模服务直接对接，但目前大模型推理的部署还没有事实上的标准，新模型不断发布、新训练方法不断提出，需要花费大量时间来适应不断变化的底层建模环境，这在一定程度上制约了AIGC应用的探索和落地


# 系统设计
为了简化模型适配过程，提高模型部署效率和性能，我们提出了面向服务的多模型管理框架（SMMF）。

<p对齐=“中心”>
  <img src={'/img/module/smmf_layer.png'} width="360px" />
</p>

SMMF由两部分组成：模型推理层和模型部署层。模型推理层对应模型推理框架vLLM、TGI、TensorRT等。模型部署层向下连接推理层，向上提供模型服务能力。模型部署框架基于推理框架，提供多模型实例、多推理框架、多云、自动扩缩容<sup>[1]</sup>、可观察性<sup>[2]</sup>等能力


<p对齐=“中心”>
  <img src={'/img/module/smmf.png'} width="600px" />
</p>

在DB-GPT中，SMMF具体如上图所示：顶层对应服务和应用层（如DB-GPT WebServer、Agents系统、应用程序等）。再下一层是模型部署框架层，包括为应用层提供模型服务的API Server和Model Handle，整个部署框架的元数据管控中心模型控制器，以及直接与推理框架和底层环境对接的Model Worker。再下一层是推理框架层，包括vLLM、llama.cpp和FastChat（由于DB-GPT直接使用了FastChat的推理接口，这里我们也将FastChat归为推理框架），推理框架中部署了大语言模型（Vicuna、Llama、Baichuan、ChatGLM）等。底层是实际的部署环境，包括Kubernetes、Ray、AWS、阿里云、私有云等

## SMMF 特性
- 支持多种模型和多种推理框架

- 可扩展性和稳定性

- 高框架性能

- 可管理、可监控

- 轻量级

### 多种模型和多种推理框架
当前大型模型领域的发展日新月异。新的模型不断发布，模型训练和推理方面新的方法不断被提出。我们判断这种情况还将持续一段时间。

对于大多数探索和实施AIGC应用场景的用户来说，这种情况既有优点也有缺点。一个典型的弊端就是被模型“牵着鼻子走”，需要不断尝试和探索新模型、新推理框架。

DB-GPT 直接提供了对 FastChat、vLLM 和 llama.cpp 的无缝支持。理论上，DB-GPT 支持其支持的所有模型。如果你对推理速度和战术能力有需求，可以直接使用 vLLM ，如果你想让 CPU 或者 Mac 的 M1/M2 芯片也获得良好的推理性能，可以使用 llama.cpp 。此外，DB-GPT还支持代理模型，如：OpenAI、Azure、Google Bard、统易、百川、迅飞星火、百度文信、智浦AI等


### 支持法学硕士
#### 开源模型
  - [骆驼毛](https://huggingface.co/Tribbiani/vicuna-13b)
  - [vicuna-13b-v1.5](https://huggingface.co/lmsys/vicuna-13b-v1.5)
  - [LLama2](https://huggingface.co/meta-llama/Llama-2-7b-chat-hf)
  - [baichuan2-13b](https://huggingface.co/baichuan-inc/Baichuan2-13B-Chat)
  - [baichuan2-7b](https://huggingface.co/baichuan-inc/Baichuan2-7B-Chat)
  - [chatglm-6b](https://huggingface.co/THUDM/chatglm-6b)
  - [chatglm2-6b](https://huggingface.co/THUDM/chatglm2-6b)
  - [chatglm3-6b](https://huggingface.co/THUDM/chatglm3-6b)
  - [falcon-40b](https://huggingface.co/tiiuae/falcon-40b)
  - [internlm-chat-7b](https://huggingface.co/internlm/internlm-chat-7b)
  - [internlm-chat-20b](https://huggingface.co/internlm/internlm-chat-20b)
  - [qwen-7b-chat](https://huggingface.co/Qwen/Qwen-7B-Chat)
  - [qwen-14b-chat](https://huggingface.co/Qwen/Qwen-14B-Chat)
  - [wizardlm-13b](https://huggingface.co/WizardLM/WizardLM-13B-V1.2)
  - [orca-2-7b](https://huggingface.co/microsoft/Orca-2-7b)
  - [orca-2-13b](https://huggingface.co/microsoft/Orca-2-13b)
  - [openchat_3.5](https://huggingface.co/openchat/openchat_3.5)
  - [zephyr-7b-alpha](https://huggingface.co/HuggingFaceH4/zephyr-7b-alpha)
  - [mistral-7b-instruct-v0.1](https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.1)
  - [Yi-34B-Chat](https://huggingface.co/01-ai/Yi-34B-Chat)


#### 代理模型
  - [OpenAI·ChatGPT](https://api.openai.com/)
  - [百川·百川](https://platform.baichuan-ai.com/)
  - [阿里巴巴·通义](https://www.aliyun.com/product/dashscope)
  - [谷歌·巴德](https://bard.google.com/)
  - [百度·文心](https://cloud.baidu.com/product/wenxinworkshop?track=dingbutonglan)
  - [智谱·ChatGLM](http://open.bigmodel.cn/)
- [讯飞·星火](https://xinghuo.xfyun.cn/)


:::信息
更多LLM请参考【源码】(https://github.com/eosphoros-ai/DB-GPT/blob/main/pilot/configs/model_config.py)
:::

### 可扩展性和稳定性
云原生领域解决海量计算资源的管理、控制、调度、利用的核心痛点。让计算的价值得到充分释放，让大规模计算成为无所不在的技术。

在大模型领域，我们也担心模型推理过程中对计算资源的爆炸性需求。因此，具有调度超算能力的多模型管理是我们在生产实施过程中关注的重点。鉴于过去几年Kubernetes、Istio等计算调度层取得的突出成就，我们在多模型管控方面充分借鉴相关设计理念。

一个比较完整的模型部署框架需要多个部分，包括直接与底层推理框架对接的Model Worker、管理和维护多个模型组件的Model Controller以及提供外部模型服务能力的Model API。 Model Worker 必须是可扩展的。它可以是专门部署大型语言模型的 Model Worker，也可以是用于部署 Embedding 模型的 Model Worker。当然也可以基于部署环境，比如物理机环境、kubernetes环境、以及一些特定的云。根据服务商提供的云环境选择不同的Model Worker。

用于管理元数据的模型控制器也需要具有可扩展性，针对不同的部署环境和不同的模型管控需求，必须选择不同的模型控制器。另外，从技术角度来看，模型服务与传统微服务有很多共同点。在微服务中，微服务中的某个服务可以有多个服务实例，所有服务实例都统一注册到注册中心。服务调用方根据服务名称从注册中心拉取该服务名称对应的服务列表，然后根据一定的负载均衡策略选择具体的服务实例进行调用。

在模型部署中，也可以考虑类似的架构。某个模型可以有多个模型实例。所有模型实例统一注册到模型注册中心，然后模型服务调用者根据模型名称去注册中心拉取模型实例。列表，然后根据模型的负载均衡策略调用具体的模型实例。

这里我们介绍一下模型注册中心，它负责在Model Controller中存储模型实例元数据。它可以直接使用现有微服务中的注册中心作为实现（例如nacos、eureka、etcd和console等），这样整个部署系统就可以实现高可用性。

### 高框架性能

框架层不应该成为模型推理性能的瓶颈。大多数情况下，硬件和推理框架决定了模型服务的能力，而模型推理的部署和优化是一个复杂的工程，不合适的框架设计可能会增加这种复杂性。我们认为，为了“不拖累”性能，部署框架主要关注两个问题： ● 框架不应该成为模型推理性能的瓶颈。

避免过度封装：封装越多、链路越长，性能问题就越难排查。
高性能通信设计：高性能通信设计有很多要点，这里不再赘述。由于Python目前在AIGC应用中处于领先地位，因此在Python中，异步接口对于服务的性能至关重要。因此，模型服务层仅提供异步接口来与模型推理框架对接层兼容，如果模型推理框架提供异步接口则直接对接。否则使用同步到异步任务支持。

### 可管理和可监控
在AIGC应用探索或者AIGC应用生产实施中，我们需要模型部署系统具有一定的管理能力，对通过API或者命令行部署的模型实例进行一定的管理和控制（如：上线、下线、重启、调试等）

可观察性是生产系统的一个非常重要的能力。我们相信可观测性在 AIGC 应用中至关重要。由于用户体验以及用户与系统之间的交互更加复杂，除了传统的观察指标之外，我们还更关注用户的输入信息以及对应场景的上下文信息。调用了哪些模型实例和模型参数、模型的输出内容和响应时间、用户反馈等。

从这些信息中我们可以发现模型服务的一些性能瓶颈以及一些用户体验数据。

响应延迟怎么样？

是否解决用户问题，从用户内容中提取用户满意度等？

这些是整个应用进一步优化的基础。

### 轻量级
考虑到支持的模型和推理框架众多，我们需要努力避免不必要的依赖，并确保用户可以根据需要安装它们。

在DB-GPT中，用户可以按需安装自己的依赖项。一些主要的可选依赖项如下：

- 安装最基本的依赖项 `pip install -e .` 或 `pip install -e ".[core]"`

- 安装基础框架的依赖`pip install -e ".[framework]"`

- 安装openai代理模型的依赖项 `pip install -e ".[openai]"`

- 安装默认依赖项 `pip install -e ".[default]"`

- 安装 vLLM 推理框架的依赖项 `pip install -e ".[vllm]"`

- 安装模型量化部署的依赖项 `pip install -e ".[quantization]"`

- 安装知识库相关依赖项 `pip install -e ".[knowledge]"`

- 安装 pytorch 依赖项 `pip install -e ".[torch]"`

- 安装 llama.cpp 的依赖项 `pip install -e ".[llama_cpp]"`

- 安装矢量化数据库依赖项 `pip install -e ".[vstore]"`

- 安装数据源依赖项 `pip install -e ".[datasource]"`

## 实施
多模型相关实现请参考【源码】(https://github.com/eosphoros-ai/DB-GPT/tree/main/pilot/model)

# 附录
`[1]` `[2]` 自动缩放和可观察性等功能仍处于孵化阶段，尚未实现。