import { IFlowData, IFlowDataNode, IFlowNode, IVariableItem } from '@/types/flow';
import { Node } from 'reactflow';

const FLOW_CATEGORY_LABEL_ZH: Record<string, string> = {
  trigger: '触发器',
  sender: '发送器',
  llm: '大模型',
  conversion: '数据转换',
  output_parser: '输出解析',
  common: '通用',
  agent: '智能体',
  rag: '知识检索',
  experimental: '实验性',
  database: '数据库',
  type_converter: '类型转换',
  example: '示例',
  code: '代码执行',
  http_body: 'HTTP 请求体',
  llm_client: '大模型客户端',
  storage: '存储',
  serializer: '序列化器',
  prompt: '提示词',
  embeddings: '嵌入模型',
  vector_store: '向量存储',
  knowledge_graph: '知识图谱',
  full_text: '全文检索',
};

const FLOW_LABEL_ZH: Record<string, string> = {
  'Common LLM Http Trigger': '通用大语言模型 HTTP 触发器',
  'Dict Http Trigger': '字典 HTTP 触发器',
  'String Http Trigger': '字符串 HTTP 触发器',
  'Request Http Trigger': 'HTTP 请求触发器',
  'Request Body To Dict Operator': '请求体转字典算子',
  'User Input Parsed Operator': '用户输入解析算子',
  'Request Body Parsed To String Operator': '请求体解析为字符串算子',
  'String Join Operator': '字符串合并算子',
  'LLM Operator': '大模型调用算子',
  'Streaming LLM Operator': '流式大模型调用算子',
  'Prompt Builder Operator': '提示词构建算子',
  'Chat Prompt Builder Operator': '对话提示词构建算子',
  'Knowledge Space Operator': '知识空间检索算子',
  'Knowledge Space Prompt Builder Operator': '知识空间提示词构建算子',
  'Datasource Retriever Operator': '数据源检索算子',
  'Datasource Executor Operator': '数据源执行算子',
  'Datasource Dashboard Operator': '数据源看板算子',
  'Datasource Structed Operator': '数据源结构化算子',
  'Report Analyst': '报告分析算子',
  'Code Map Operator': '代码映射算子',
  'Code Dict to Model Request Operator': '代码字典转模型请求算子',
  'HTTP Sender': 'HTTP 发送器',
  'Example Flow Select': '示例下拉选择算子',
  'Example Flow Cascader': '示例级联选择算子',
  'Example Flow Checkbox': '示例复选框算子',
  'Example Flow Radio': '示例单选框算子',
  'Example Flow Date Picker': '示例日期选择算子',
  'Example Flow Input': '示例输入框算子',
  'Example Flow Text Area': '示例文本域算子',
  'Example Flow Slider': '示例滑块算子',
  'Example Flow Slider List': '示例范围滑块算子',
  'Example Flow Time Picker': '示例时间选择算子',
  'Example Flow Tree Select': '示例树形选择算子',
  'Example Refresh Operator': '示例刷新算子',
  'Example Flow Upload': '示例上传算子',
  'Example Variables Operator': '示例变量算子',
  'Example Tags Operator': '示例标签算子',
  'Example Flow Code Editor': '示例代码编辑器算子',
  'Example Dynamic Parameters Operator': '示例动态参数算子',
  'Example Dynamic Outputs Operator': '示例动态输出算子',
  'Example Dynamic Inputs Operator': '示例动态输入算子',
  'AWEL Agent Resource': 'AWEL 智能体资源',
  'Awel Agent Resource Knowledge': 'AWEL 智能体知识资源',
  'Datasource Resource': '数据源资源',
};

const FLOW_DESCRIPTION_ZH: Record<string, string> = {
  'Trigger your workflow by http request, and parse the request body as a common LLM http body':
    '通过 HTTP 请求触发工作流，并将请求体解析为通用大语言模型 HTTP 请求体。',
  'Trigger your workflow by http request, and parse the request body as a dict':
    '通过 HTTP 请求触发工作流，并将请求体解析为字典。',
  'Trigger your workflow by http request, and parse the request body as a string':
    '通过 HTTP 请求触发工作流，并将请求体解析为字符串。',
  'User input parsed operator, parse the user input from request body and return as a string':
    '用户输入解析算子，从请求体中解析用户输入并以字符串形式返回。',
  'User input parsed operator, parse the user input from request body and return as a dict':
    '用户输入解析算子，从请求体中解析用户输入并以字典形式返回。',
  'Merge multiple inputs into a single string.': '将多个输入合并为一个字符串。',
  'Send a HTTP request to a specified endpoint': '向指定端点发送 HTTP 请求。',
  'Report Analyst': '报告分析算子。',
  'Execute the context from the datasource and output structed data.': '执行数据源上下文并输出结构化数据。',
  'An example flow operator that includes a select as parameter.': '包含下拉选择参数的示例流程算子。',
  'An example flow operator that includes a cascader as parameter.': '包含级联选择参数的示例流程算子。',
  'An example flow operator that includes a checkbox as parameter.': '包含复选框参数的示例流程算子。',
  'An example flow operator that includes a radio as parameter.': '包含单选框参数的示例流程算子。',
  'An example flow operator that includes a date picker as parameter.': '包含日期选择参数的示例流程算子。',
  'An example flow operator that includes a input as parameter.': '包含输入框参数的示例流程算子。',
  'An example flow operator that includes a text area as parameter.': '包含文本域参数的示例流程算子。',
  'An example flow operator that includes a slider as parameter.': '包含滑块参数的示例流程算子。',
  'An example flow operator that includes a slider list as parameter.': '包含范围滑块参数的示例流程算子。',
  'An example flow operator that includes a time picker as parameter.': '包含时间选择参数的示例流程算子。',
  'An example flow operator that includes a tree select as parameter.': '包含树形选择参数的示例流程算子。',
  'An example flow operator that includes a refresh option.': '包含刷新选项的示例流程算子。',
  'An example flow operator that includes a upload as parameter.': '包含上传参数的示例流程算子。',
  'An example flow operator that includes a variables option.': '包含变量选项的示例流程算子。',
  'An example flow operator that includes a tags': '包含标签的示例流程算子。',
  'An example flow operator that includes a code editor as parameter.': '包含代码编辑器参数的示例流程算子。',
  'An example flow operator that includes dynamic parameters.': '包含动态参数的示例流程算子。',
  'An example flow operator that includes dynamic outputs.': '包含动态输出的示例流程算子。',
  'An example flow operator that includes dynamic inputs.': '包含动态输入的示例流程算子。',
  'The Agent Resource.': '智能体资源。',
  'The Agent Resource Knowledge.': '智能体知识资源。',
  'Connect to a datasource(retrieve table schemas and execute SQL to fetch data).':
    '连接到数据源（检索表结构并执行 SQL 获取数据）。',
};

function localizeFlowNodeForDisplay(node: IFlowNode): IFlowNode {
  return {
    ...node,
    original_label: node.original_label || node.label,
    original_description: node.original_description || node.description,
    label: FLOW_LABEL_ZH[node.label] || node.label,
    description: FLOW_DESCRIPTION_ZH[node.description] || node.description,
    category_label: FLOW_CATEGORY_LABEL_ZH[node.category] || node.category_label,
  };
}

export function localizeFlowNodesForDisplay(nodes: IFlowNode[]) {
  return nodes.map(localizeFlowNodeForDisplay);
}

export const getUniqueNodeId = (nodeData: IFlowNode, nodes: Node[]) => {
  let count = 0;
  nodes.forEach(node => {
    if (node.data.name === nodeData.name) {
      count++;
    }
  });
  return `${nodeData.id}_${count}`;
};

// function getUniqueNodeId will add '_${count}' to id, so we need to remove it when we want to get the original id
export const removeIndexFromNodeId = (id: string) => {
  const indexPattern = /_\d+$/;
  return id.replace(indexPattern, '');
};

// 驼峰转下划线，接口协议字段命名规范
export const mapHumpToUnderline = (flowData: IFlowData) => {
  /**
   * sourceHandle -> source_handle,
   * targetHandle -> target_handle,
   * positionAbsolute -> position_absolute
   */
  const { nodes, edges, ...rest } = flowData;
  const newNodes = nodes.map(node => {
    const { positionAbsolute, ...rest } = node;
    return {
      position_absolute: positionAbsolute,
      ...rest,
    };
  });
  const newEdges = edges.map(edge => {
    const { sourceHandle, targetHandle, ...rest } = edge;
    return {
      source_handle: sourceHandle,
      target_handle: targetHandle,
      ...rest,
    };
  });
  return {
    nodes: newNodes,
    edges: newEdges,
    ...rest,
  };
};

export const mapUnderlineToHump = (flowData: IFlowData) => {
  /**
   * source_handle -> sourceHandle,
   * target_handle -> targetHandle,
   * position_absolute -> positionAbsolute
   */
  const { nodes, edges, ...rest } = flowData;
  const newNodes = nodes.map(node => {
    const { position_absolute, ...rest } = node;
    return {
      positionAbsolute: position_absolute,
      ...rest,
    };
  });
  const newEdges = edges.map(edge => {
    const { source_handle, target_handle, ...rest } = edge;
    return {
      sourceHandle: source_handle,
      targetHandle: target_handle,
      ...rest,
    };
  });
  return {
    nodes: newNodes,
    edges: newEdges,
    ...rest,
  };
};

// Helper function to check if a dynamic input/output has enough connections
const checkDynamicConnections = (
  nodeId: string,
  fieldType: string,
  _fieldIndex: number,
  edges: any[],
  dynamicMinimum: number,
): boolean => {
  // Count connections for this specific field type
  const handlePrefix = `${nodeId}|${fieldType}|`;
  const connectionCount = edges.filter(edge => {
    // For inputs, check targetHandle; for outputs, check sourceHandle
    const handle = fieldType === 'inputs' ? edge.targetHandle : edge.sourceHandle;
    if (!handle) return false;

    // Check if the handle belongs to this node and field type
    return handle.startsWith(handlePrefix);
  }).length;

  // Return true if we have at least the minimum required connections
  return connectionCount >= dynamicMinimum;
};

// Helper function to identify dynamic field groups
const getDynamicFieldGroups = (fields: any[]) => {
  const groups: Record<string, any[]> = {};

  fields.forEach(field => {
    if (field.dynamic) {
      // Extract base name (remove _X suffix if present)
      const baseName = field.name.replace(/_\d+$/, '');
      if (!groups[baseName]) {
        groups[baseName] = [];
      }
      groups[baseName].push(field);
    }
  });

  return groups;
};

// Helper function to validate dynamic parameters
const validateDynamicParameters = (node: IFlowDataNode): [boolean, string] => {
  if (!node.data.parameters || node.data.parameters.length === 0) {
    return [true, ''];
  }

  // Find all dynamic parameter groups
  const dynamicParamGroups = getDynamicFieldGroups(node.data.parameters);

  // Check each group
  for (const [baseName, fields] of Object.entries(dynamicParamGroups)) {
    const minimumRequired = fields[0].dynamic_minimum || 0;

    // Skip if minimum is 0
    if (minimumRequired === 0) continue;

    // For dynamic parameters, we check if we have at least the minimum number
    if (fields.length < minimumRequired) {
      return [
        false,
        `The dynamic parameter ${baseName} of node ${node.data.label} requires at least ${minimumRequired} parameters`,
      ];
    }

    // Check if any required parameters are missing values
    const requiredFields = fields.filter(field => !field.optional);
    for (const field of requiredFields) {
      if (field.value === undefined || field.value === null) {
        return [false, `The parameter ${field.name} of node ${node.data.label} is required`];
      }
    }
  }

  return [true, ''];
};

export const checkFlowDataRequied = (flowData: IFlowData) => {
  const { nodes, edges } = flowData;
  // check the input, parameters that are required
  let result: [boolean, IFlowDataNode, string] = [true, nodes[0], ''];

  outerLoop: for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i].data;
    const { inputs = [], parameters = [] } = node;

    // Check dynamic input groups first
    const dynamicInputGroups = getDynamicFieldGroups(inputs);
    for (const [baseName, fields] of Object.entries(dynamicInputGroups)) {
      const minimumRequired = fields[0].dynamic_minimum || 0;
      if (minimumRequired > 0) {
        // For dynamic fields, we check connections across all fields of this type
        const hasEnoughConnections = checkDynamicConnections(nodes[i].id, 'inputs', 0, edges, minimumRequired);
        if (!hasEnoughConnections) {
          result = [
            false,
            nodes[i],
            `The dynamic input ${baseName} of node ${node.label} requires at least ${minimumRequired} connections`,
          ];
          break outerLoop;
        }
      }
    }

    // Check individual inputs
    for (let j = 0; j < inputs.length; j++) {
      const input = inputs[j];

      // Skip dynamic inputs that were checked above
      if (input.dynamic) continue;

      const isRequired = !input.optional;
      if (isRequired && !edges.some(edge => edge.targetHandle === `${nodes[i].id}|inputs|${j}`)) {
        result = [false, nodes[i], `The input ${inputs[j].type_name} of node ${node.label} is required`];
        break outerLoop;
      }
    }

    // Validate dynamic parameters
    const [paramsValid, errorMessage] = validateDynamicParameters(nodes[i]);
    if (!paramsValid) {
      result = [false, nodes[i], errorMessage];
      break outerLoop;
    }

    // Check dynamic parameter groups
    const dynamicParamGroups = getDynamicFieldGroups(parameters);
    for (const [baseName, fields] of Object.entries(dynamicParamGroups)) {
      const minimumRequired = fields[0].dynamic_minimum || 0;
      if (minimumRequired > 0 && fields[0].category === 'resource') {
        // For dynamic params, check connections across all params of this type
        const hasEnoughConnections = checkDynamicConnections(nodes[i].id, 'parameters', 0, edges, minimumRequired);
        if (!hasEnoughConnections) {
          result = [
            false,
            nodes[i],
            `The dynamic parameter ${baseName} of node ${node.label} requires at least ${minimumRequired} connections`,
          ];
          break outerLoop;
        }
      }
    }

    // check parameters
    for (let k = 0; k < parameters.length; k++) {
      const parameter = parameters[k];

      // Skip dynamic parameters that were checked above
      if (parameter.dynamic) continue;

      if (
        !parameter.optional &&
        parameter.category === 'resource' &&
        !edges.some(edge => edge.targetHandle === `${nodes[i].id}|parameters|${k}`)
      ) {
        result = [false, nodes[i], `The parameter ${parameter.type_name} of node ${node.label} is required`];
        break outerLoop;
      } else if (
        !parameter.optional &&
        parameter.category === 'common' &&
        (parameter.value === undefined || parameter.value === null)
      ) {
        result = [false, nodes[i], `The parameter ${parameter.type_name} of node ${node.label} is required`];
        break outerLoop;
      }
    }

    // Check dynamic output groups
    const dynamicOutputGroups = getDynamicFieldGroups(node.outputs || []);
    for (const [baseName, fields] of Object.entries(dynamicOutputGroups)) {
      const minimumRequired = fields[0].dynamic_minimum || 0;
      if (minimumRequired > 0) {
        // For dynamic outputs, check connections across all outputs of this type
        const hasEnoughConnections = checkDynamicConnections(nodes[i].id, 'outputs', 0, edges, minimumRequired);
        if (!hasEnoughConnections) {
          result = [
            false,
            nodes[i],
            `The dynamic output ${baseName} of node ${node.label} requires at least ${minimumRequired} connections`,
          ];
          break outerLoop;
        }
      }
    }
  }

  return result;
};

export const convertKeysToCamelCase = (obj: Record<string, any>): Record<string, any> => {
  function toCamelCase(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  function isObject(value: any): boolean {
    return value && typeof value === 'object' && !Array.isArray(value);
  }

  function convert(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(item => convert(item));
    } else if (isObject(obj)) {
      const newObj: Record<string, any> = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const newKey = toCamelCase(key);
          newObj[newKey] = convert(obj[key]);
        }
      }
      return newObj;
    }
    return obj;
  }

  return convert(obj);
};

function escapeVariable(value: string, enableEscape: boolean): string {
  if (!enableEscape) {
    return value;
  }
  return value.replace(/@/g, '\\@').replace(/#/g, '\\#').replace(/%/g, '\\%').replace(/:/g, '\\:');
}

export function buildVariableString(variableDict: IVariableItem): string {
  const scopeSig = '@';
  const sysCodeSig = '#';
  const userSig = '%';
  const kvSig = ':';
  const enableEscape = true;

  const specialChars = new Set([scopeSig, sysCodeSig, userSig, kvSig]);

  const newVariableDict: Partial<IVariableItem> = {
    key: variableDict.key || '',
    name: variableDict.name || '',
    scope: variableDict.scope || '',
    scope_key: variableDict.scope_key || '',
    sys_code: variableDict.sys_code || '',
    user_name: variableDict.user_name || '',
  };

  // Check for special characters in values
  for (const [key, value] of Object.entries(newVariableDict)) {
    if (value && [...specialChars].some(char => (value as string).includes(char))) {
      if (enableEscape) {
        newVariableDict[key] = escapeVariable(value as string, enableEscape);
      } else {
        throw new Error(
          `${key} contains special characters, error value: ${value}, special characters: ${[...specialChars].join(', ')}`,
        );
      }
    }
  }

  const { key, name, scope, scope_key, sys_code, user_name } = newVariableDict;

  let variableStr = `${key}`;

  if (name) variableStr += `${kvSig}${name}`;
  if (scope || scope_key) {
    variableStr += `${scopeSig}${scope}`;
    if (scope_key) {
      variableStr += `${kvSig}${scope_key}`;
    }
  }
  if (sys_code) variableStr += `${sysCodeSig}${sys_code}`;
  if (user_name) variableStr += `${userSig}${user_name}`;
  return `\${${variableStr}}`;
}
