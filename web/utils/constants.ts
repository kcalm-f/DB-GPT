import { ModelType } from '@/types/chat';
import { DBType } from '@/types/db';
import { ModelIconInfo } from '@/types/models';

export const DEFAULT_ICON_URL = '/models/huggingface.svg';

export const MODEL_ICON_MAP: Record<ModelType, { label: string; icon: string }> = new Proxy({} as any, {
  get: (_target, prop) => {
    const modelId = prop as string;
    return {
      label: getModelLabel(modelId),
      icon: getModelIcon(modelId),
    };
  },
});

export const MODEL_ICON_INFO: Record<string, ModelIconInfo> = {
  deepseek: {
    label: 'DeepSeek',
    icon: '/models/deepseek.png',
    patterns: ['deepseek', 'r1'],
  },
  qwen: {
    label: 'Qwen',
    icon: '/models/qwen2.png',
    patterns: ['qwen', 'qwen2', 'qwen2.5', 'qwq', 'qvq'],
  },
  gemini: {
    label: 'Gemini',
    icon: '/models/gemini.png',
    patterns: ['gemini'],
  },
  moonshot: {
    label: 'Moonshot',
    icon: '/models/moonshot.png',
    patterns: ['moonshot', 'kimi'],
  },
  minimax: {
    label: 'MiniMax',
    icon: '/models/minimax.png',
    patterns: ['minimax', 'm3', 'm2.7'],
  },
  doubao: {
    label: 'Doubao',
    icon: '/models/doubao.png',
    patterns: ['doubao'],
  },
  ernie: {
    label: 'ERNIE',
    icon: '/models/ernie.png',
    patterns: ['ernie'],
  },
  proxyllm: {
    label: 'Proxy LLM',
    icon: '/models/chatgpt.png',
    patterns: ['proxy'],
  },
  chatgpt: {
    label: 'ChatGPT',
    icon: '/models/chatgpt.png',
    patterns: ['chatgpt', 'gpt', 'o1', 'o3'],
  },
  vicuna: {
    label: 'Vicuna',
    icon: '/models/vicuna.jpeg',
    patterns: ['vicuna'],
  },
  'glm-4': {
    label: 'GLM-4.7',
    icon: '/models/glm4.png',
    patterns: ['glm-4'],
  },
  chatglm: {
    label: 'ChatGLM',
    icon: '/models/chatglm.png',
    patterns: ['chatglm', 'glm'],
  },
  llama: {
    label: 'Llama',
    icon: '/models/llama.jpg',
    patterns: ['llama', 'llama2', 'llama3'],
  },
  baichuan: {
    label: 'Baichuan',
    icon: '/models/baichuan.png',
    patterns: ['baichuan'],
  },
  claude: {
    label: 'Claude',
    icon: '/models/claude.png',
    patterns: ['claude'],
  },
  bard: {
    label: 'Bard',
    icon: '/models/bard.gif',
    patterns: ['bard'],
  },
  tongyi: {
    label: 'Tongyi',
    icon: '/models/tongyi.apng',
    patterns: ['tongyi'],
  },
  yi: {
    label: 'Yi',
    icon: '/models/yi.svg',
    patterns: ['yi'],
  },
  bailing: {
    label: 'Bailing',
    icon: '/models/bailing.svg',
    patterns: ['bailing'],
  },
  wizardlm: {
    label: 'WizardLM',
    icon: '/models/wizardlm.png',
    patterns: ['wizard'],
  },
  internlm: {
    label: 'InternLM',
    icon: '/models/internlm.png',
    patterns: ['internlm'],
  },
  solar: {
    label: 'Solar',
    icon: '/models/solar_logo.png',
    patterns: ['solar'],
  },
  gorilla: {
    label: 'Gorilla',
    icon: '/models/gorilla.png',
    patterns: ['gorilla'],
  },
  zhipu: {
    label: 'Zhipu',
    icon: '/models/zhipu.png',
    patterns: ['zhipu'],
  },
  falcon: {
    label: 'Falcon',
    icon: '/models/falcon.jpeg',
    patterns: ['falcon'],
  },
  huggingface: {
    label: 'Hugging Face',
    icon: '/models/huggingface.svg',
    patterns: ['huggingface', 'hf'],
  },
};

export function getModelLabel(modelId: string): string {
  if (!modelId) return '';

  // 1. Try to match directly
  if (MODEL_ICON_INFO[modelId]?.label) {
    return MODEL_ICON_INFO[modelId].label;
  }

  // 2. Try to match by patterns to get the base name, then add version information
  const formattedModelId = modelId.toLowerCase();
  for (const key in MODEL_ICON_INFO) {
    const modelInfo = MODEL_ICON_INFO[key];

    if (modelInfo.patterns && modelInfo.patterns.some(pattern => formattedModelId.includes(pattern.toLowerCase()))) {
      // Try to extract version information from the model ID
      const versionMatch = modelId.match(/[-_](\d+b|\d+\.\d+b?|v\d+(\.\d+)?)/i);
      const sizePart = modelId.match(/[-_](\d+b)/i);

      // Build the display name
      let displayName = modelInfo.label;

      // Add version information
      if (versionMatch && !sizePart) {
        displayName += ` ${versionMatch[1]}`;
      }

      // Add size information
      if (sizePart) {
        displayName += ` ${sizePart[1]}`;
      }

      return displayName;
    }
  }

  // If no match
  return modelId;
}

export function getModelIcon(modelId: string): string {
  if (!modelId) return DEFAULT_ICON_URL;

  // Format the model ID for matching
  const formattedModelId = modelId.toLowerCase();

  // 1. Try to match directly
  if (MODEL_ICON_INFO[modelId]?.icon) {
    return MODEL_ICON_INFO[modelId].icon;
  }

  // 2. Try to match by patterns
  for (const key in MODEL_ICON_INFO) {
    const modelInfo = MODEL_ICON_INFO[key];

    // Check if the model ID contains one of the patterns
    if (modelInfo.patterns && modelInfo.patterns.some(pattern => formattedModelId.includes(pattern.toLowerCase()))) {
      return modelInfo.icon;
    }
  }

  // Try to match by the model prefix
  const modelParts = formattedModelId.split(/[-_]/);
  if (modelParts.length > 0) {
    const modelPrefix = modelParts[0];
    for (const key in MODEL_ICON_INFO) {
      if (modelPrefix === key.toLowerCase()) {
        return MODEL_ICON_INFO[key].icon;
      }
    }
  }

  // If no match, return the default icon
  return DEFAULT_ICON_URL;
}

export const dbMapper: Record<DBType, { label: string; icon: string; desc: string }> = {
  mysql: {
    label: 'MySQL',
    icon: '/icons/mysql.png',
    desc: '开源关系型数据库，适合通用事务系统和业务数据存储。',
  },
  oceanbase: {
    label: 'OceanBase',
    icon: '/icons/oceanbase.png',
    desc: '分布式关系型数据库，适合高并发和大规模数据场景。',
  },
  mssql: {
    label: 'MSSQL',
    icon: '/icons/mssql.png',
    desc: 'Microsoft SQL Server，适合企业级关系型数据管理。',
  },
  duckdb: {
    label: 'DuckDB',
    icon: '/icons/duckdb.png',
    desc: '轻量级分析型数据库，适合本地文件和嵌入式 OLAP 分析。',
  },
  sqlite: {
    label: 'Sqlite',
    icon: '/icons/sqlite.png',
    desc: '轻量级嵌入式关系型数据库，适合本地文件数据和快速验证。',
  },
  clickhouse: {
    label: 'ClickHouse',
    icon: '/icons/clickhouse.png',
    desc: '高性能列式分析数据库，适合实时 OLAP 查询。',
  },
  oracle: {
    label: 'Oracle',
    icon: '/icons/oracle.png',
    desc: '企业级关系型数据库，适合稳定、安全的大型业务系统。',
  },
  access: {
    label: 'Access',
    icon: '/icons/access.png',
    desc: 'Microsoft 桌面关系型数据库，适合小规模应用和本地数据管理。',
  },
  mongodb: {
    label: 'MongoDB',
    icon: '/icons/mongodb.png',
    desc: '文档型 NoSQL 数据库，适合灵活数据模型和应用数据存储。',
  },
  doris: {
    label: 'ApacheDoris',
    icon: '/icons/doris.png',
    desc: '实时分析型数据仓库，适合高并发报表和明细查询。',
  },
  starrocks: {
    label: 'StarRocks',
    icon: '/icons/starrocks.png',
    desc: '高性能分析型数据库，适合极速多维分析。',
  },
  db2: { label: 'DB2', icon: '/icons/db2.png', desc: 'IBM 企业级关系型数据库，适合稳定、安全的数据管理。' },
  hbase: {
    label: 'HBase',
    icon: '/icons/hbase.png',
    desc: '分布式 NoSQL 数据库，适合大规模结构化和半结构化数据。',
  },
  redis: {
    label: 'Redis',
    icon: '/icons/redis.png',
    desc: '高性能内存数据存储，适合缓存、消息和实时数据场景。',
  },
  cassandra: {
    label: 'Cassandra',
    icon: '/icons/cassandra.png',
    desc: '高可扩展、容错的分布式 NoSQL 数据库，适合海量数据。',
  },
  couchbase: {
    label: 'Couchbase',
    icon: '/icons/couchbase.png',
    desc: '分布式文档型 NoSQL 数据库，适合高性能应用数据服务。',
  },
  omc: { label: 'Omc', icon: '/icons/odc.png', desc: 'OMC 元数据源。' },
  postgresql: {
    label: 'PostgreSQL',
    icon: '/icons/postgresql.png',
    desc: '开源关系型数据库，支持丰富扩展和标准 SQL 能力。',
  },
  gaussdb: {
    label: 'GaussDB',
    icon: '/icons/gaussdb.png',
    desc: '华为分布式关系型数据库，兼容 PostgreSQL 生态。',
  },
  openGauss: {
    label: 'openGauss',
    icon: '/icons/opengauss.png',
    desc: '开源关系型数据库，适合企业级事务和分析场景。',
  },
  vertica: {
    label: 'Vertica',
    icon: '/icons/vertica.png',
    desc: '面向大规模数据分析的列式数据仓库。',
  },
  spark: { label: 'Spark', icon: '/icons/spark.png', desc: '大规模数据处理引擎，适合批处理和分布式分析。' },
  hive: { label: 'Hive', icon: '/icons/hive.png', desc: '基于 Hadoop 的数据仓库，适合离线大数据分析。' },
  space: { label: 'Space', icon: '/icons/knowledge.png', desc: '知识库分析数据源。' },
  tugraph: {
    label: 'TuGraph',
    icon: '/icons/tugraph.png',
    desc: '高性能图数据库，适合关系网络和图计算分析。',
  },
  neo4j: {
    label: 'Neo4j',
    icon: '/icons/neo4j.png',
    desc: '原生图数据库，适合复杂关系建模和图查询。',
  },
};
