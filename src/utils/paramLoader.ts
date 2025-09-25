// src/utils/paramLoader.ts

// 定义参数配置的类型
interface BaseParamConfig {
  name: string;
  description: string;
  label: string; // Add the label property that the UI component uses
  type: string;
  defaultValue: any;
  examples?: string[];
  versionAdded: string;
  versionDeprecated?: string | null;
  relatedOptions?: string[];
}

interface StringParamConfig extends BaseParamConfig {
  type: "string";
  options?: string[]; // For specific choices
}

interface NumberParamConfig extends BaseParamConfig {
  type: "number";
  min?: number;
  max?: number;
}

interface SelectParamConfig extends BaseParamConfig {
  type: "select";
  options: string[];
}

interface BooleanParamConfig extends BaseParamConfig {
  type: "boolean";
}

interface SliderParamConfig extends BaseParamConfig {
  type: "slider";
  min?: number;
  max?: number;
}

export type ParamConfig = StringParamConfig | NumberParamConfig | SelectParamConfig | BooleanParamConfig | SliderParamConfig;

// 定义版本特定参数的类型
interface VersionSpecificParams {
  generic: ParamConfig[];
  main: ParamConfig[];
  video: ParamConfig[];
  audio: ParamConfig[];
  codec_specific: ParamConfig[];
  time_control: ParamConfig[];
  hardware_acceleration: ParamConfig[];
  filters?: ParamConfig[];
  // ... 可以根据需要添加更多类别
}

// 定义完整参数数据库的类型
interface FFmpegParamsDatabase {
  versions: {
    [version: string]: VersionSpecificParams;
  };
}

// 加载参数数据库
let paramsDatabase: FFmpegParamsDatabase | null = null;

export const loadParamsDatabase = async (): Promise<FFmpegParamsDatabase> => {
  if (paramsDatabase) {
    return paramsDatabase;
  }

  // 在实际项目中，这里会从 API 或者 public 目录加载 JSON 文件
  // 为了演示，我们暂时使用 import
  // In a real application, you would typically fetch from a public/ directory or an API:
  // const response = await fetch('/data/ffmpeg_params.json');
  // paramsDatabase = await response.json();

  // For this example, since the JSON file is in src/, we can import it directly
  // But for better separation of concerns and to avoid bundling large data with the main app,
  // it's recommended to put the JSON in public/ and fetch it.
  // Let's simulate loading from a static import for now:
  // This assumes you move the JSON to public/data/ffmpeg_params.json and fetch it:
  // const response = await fetch('/data/ffmpeg_params.json');
  // paramsDatabase = await response.json();

  // For the purpose of this immediate implementation, I'll import the file directly
  // which is fine for a static file in src/ that's not too large.
  // To handle the type mismatch between the JSON and our types, we'll use type assertion.
  const paramsDataRaw = await import('../data/ffmpeg_params.json');
  paramsDatabase = paramsDataRaw.default as FFmpegParamsDatabase;
  return paramsDatabase;
};

// 定义参数分组的类型
interface GroupedParamConfig {
  special: ParamConfig[]; // 特殊选项
  common: ParamConfig[];  // 公共选项
}

// 根据任务类型获取参数
export const getParametersForTaskAndVersion = async (taskKey: string | null, version: string): Promise<GroupedParamConfig> => {
  if (!taskKey) return { special: [], common: [] };

  const db = await loadParamsDatabase();
  const versionParams = db.versions[version];
  if (!versionParams) {
    console.warn(`Parameters for FFmpeg version ${version} not found, falling back to latest known version.`);
    // Fallback to the last version in the object
    const versions = Object.keys(db.versions);
    if (versions.length === 0) return { special: [], common: [] };
    const lastVersionKey = versions[versions.length - 1];
    const lastVersionParams = db.versions[lastVersionKey];
    if (!lastVersionParams) return { special: [], common: [] };
  }

  // 定义公共参数 - 这些参数在大多数任务中都会用到
  const commonParams = [
    ...versionParams.main,
    ...(versionParams.hardware_acceleration || []),
  ];

  // 根据任务类型映射到参数类别
  // 这里定义了任务到参数类别的映射
  switch (taskKey) {
    case "format_conversion":
      // 格式转换特殊参数
      const formatConversionSpecial = [
        ...versionParams.codec_specific,
        ...versionParams.video,
        ...versionParams.audio,
      ];
      return {
        special: formatConversionSpecial,
        common: commonParams
      };
    case "video_editing":
      // 视频剪辑特殊参数
      const videoEditingSpecial = [
        ...versionParams.time_control,
        ...versionParams.video,
      ];
      return {
        special: videoEditingSpecial,
        common: commonParams
      };
    case "audio_processing":
      // 音频处理特殊参数
      const audioProcessingSpecial = [
        ...versionParams.audio,
      ];
      return {
        special: audioProcessingSpecial,
        common: commonParams
      };
    case "filter_application":
      // 滤镜应用特殊参数
      const filterApplicationSpecial = [
        ...(versionParams.video || []),
        ...(versionParams.filters || []),
      ];
      return {
        special: filterApplicationSpecial,
        common: commonParams
      };
    case "custom":
      // 自定义任务 - 包含所有参数
      return {
        special: [
          ...versionParams.codec_specific,
          ...versionParams.video,
          ...versionParams.audio,
          ...versionParams.time_control,
          ...(versionParams.filters || []),
        ],
        common: commonParams
      };
    default:
      // For unknown tasks, return a basic set
      return {
        special: [
          ...versionParams.video,
          ...versionParams.audio,
        ],
        common: commonParams
      };
  }
};