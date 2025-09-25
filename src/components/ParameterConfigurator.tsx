import { Card, Form, Input, InputNumber, Switch, Slider, Tooltip, Space, AutoComplete } from "antd";
import { useEffect, useContext, useState } from "react";
import { QuestionCircleOutlined } from '@ant-design/icons';
import { FFmpegVersionContext } from '../contexts/FFmpegVersionContext';
import { getParametersForTaskAndVersion } from '../utils/paramLoader';
import type { ParamConfig } from '../utils/paramLoader';

interface ParameterConfiguratorProps {
  taskKey: string | null;
  onParametersChange: (parameters: Record<string, any>) => void;
}

const ParameterConfigurator: React.FC<ParameterConfiguratorProps> = ({
  taskKey,
  onParametersChange,
}) => {
  const [form] = Form.useForm();
  const { selectedVersion } = useContext(FFmpegVersionContext);
  const [specialParams, setSpecialParams] = useState<ParamConfig[]>([]);
  const [commonParams, setCommonParams] = useState<ParamConfig[]>([]);

  useEffect(() => {
    const loadParams = async () => {
      const params = await getParametersForTaskAndVersion(taskKey, selectedVersion);
      setSpecialParams(params.special);
      setCommonParams(params.common);
      
      const initialValues: Record<string, any> = {};
      [...params.special, ...params.common].forEach((param) => {
        initialValues[param.name] = param.defaultValue;
      });
      form.setFieldsValue(initialValues);
      
      // 初始化时也要触发参数变化
      setTimeout(() => {
        onParametersChange(form.getFieldsValue());
      }, 0);
    };

    if (taskKey && selectedVersion) {
      loadParams();
    }
  }, [taskKey, selectedVersion, form, onParametersChange]);

  const handleFormChange = () => {
    const values = form.getFieldsValue();
    onParametersChange(values);
  };

  const renderInput = (param: ParamConfig) => {
    // 使用类型守卫和 switch 语句来处理不同的参数类型
    switch (param.type) {
      case "string":
        // 如果参数有options（选择项），使用AutoComplete组件以支持自由输入
        if (param.options && param.options.length > 0) {
          return (
            <AutoComplete
              options={param.options.map(option => ({ value: option }))}
              filterOption={(inputValue, option) =>
                option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
              placeholder={`请输入或选择${param.label}`}
            />
          );
        }
        // 否则使用文本输入框
        return <Input placeholder={`请输入${param.label}`} />;
      case "number":
        return <InputNumber min={param.min ?? -Infinity} max={param.max ?? Infinity} placeholder={`请输入${param.label}`} />;
      case "select":
        return (
          <AutoComplete
            options={param.options?.map(option => ({ value: option }))}
            filterOption={(inputValue, option) =>
              option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
            placeholder={`请输入或选择${param.label}`}
          />
        );
      case "boolean":
        return <Switch />;
      case "slider":
        return <Slider min={param.min ?? 0} max={param.max ?? 100} step={1} />;
      default: {
        // 使用类型守卫确保 param 是 never 类型
        const _exhaustiveCheck: never = param;
        console.error("Unhandled parameter type:", _exhaustiveCheck);
        return <Input placeholder="未知参数类型" />;
      }
    }
  };

  return (
    <Card title="参数配置">
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleFormChange}
      >
        {/* 特殊选项 */}
        {specialParams.length > 0 && (
          <div>
            <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>特殊选项</h3>
            {specialParams.map((param) => (
              <Form.Item
                key={`special-${param.name}`}
                label={
                  <Space>
                    {param.label}
                    <Tooltip title={param.description}>
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </Space>
                }
                name={param.name}
              >
                <>
                  {renderInput(param)}
                  {param.examples && param.examples.length > 0 && (
                    <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                      示例: {param.examples.slice(0, 2).join(', ')}
                    </div>
                  )}
                  {(param.name === '-filter_complex' || param.name === '-lavfi') && (
                    <div style={{ fontSize: '12px', color: '#1890ff', marginTop: '4px' }}>
                      {param.name === '-filter_complex' ? (
                        <>
                          <p><strong>复杂滤镜说明 (-filter_complex):</strong></p>
                          <p>格式: <code>'[input]filter1[a];[input]filter2[b];[a][b]overlay[out]'</code></p>
                          <p>常用滤镜: scale, crop, rotate, fade, eq, colorbalance</p>
                          <p>示例: <code>scale=1280:720,fade=t=in:st=0:d=1</code></p>
                        </>
                      ) : (
                        <>
                          <p><strong>Libav滤镜说明 (-lavfi):</strong></p>
                          <p>等同于 -filter_complex，但用于纯滤镜图形</p>
                          <p>不需要输入文件，滤镜直接生成输出</p>
                          <p>示例: <code>color=red:size=1920x1080[test];[test]rotate=45:out_w=800[out]</code></p>
                        </>
                      )}
                    </div>
                  )}
                  {param.name === '-hwaccel' && (
                    <div style={{ fontSize: '12px', color: '#1890ff', marginTop: '4px' }}>
                      <p><strong>硬件加速说明:</strong></p>
                      <p>auto: 自动检测可用的硬件加速</p>
                      <p>vaapi: Linux 上的 VAAPI</p>
                      <p>cuda: NVIDIA GPU 加速</p>
                      <p>qsv: Intel Quick Sync Video</p>
                    </div>
                  )}
                </>
              </Form.Item>
            ))}
          </div>
        )}

        {/* 公共选项 */}
        {commonParams.length > 0 && (
          <div style={{ marginTop: '24px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 'bold', color: '#52c41a' }}>公共选项</h3>
            {commonParams.map((param) => (
              <Form.Item
                key={`common-${param.name}`}
                label={
                  <Space>
                    {param.label}
                    <Tooltip title={param.description}>
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </Space>
                }
                name={param.name}
              >
                <>
                  {renderInput(param)}
                  {param.examples && param.examples.length > 0 && (
                    <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                      示例: {param.examples.slice(0, 2).join(', ')}
                    </div>
                  )}
                  {(param.name === '-filter_complex' || param.name === '-lavfi') && (
                    <div style={{ fontSize: '12px', color: '#1890ff', marginTop: '4px' }}>
                      {param.name === '-filter_complex' ? (
                        <>
                          <p><strong>复杂滤镜说明 (-filter_complex):</strong></p>
                          <p>格式: <code>'[input]filter1[a];[input]filter2[b];[a][b]overlay[out]'</code></p>
                          <p>常用滤镜: scale, crop, rotate, fade, eq, colorbalance</p>
                          <p>示例: <code>scale=1280:720,fade=t=in:st=0:d=1</code></p>
                        </>
                      ) : (
                        <>
                          <p><strong>Libav滤镜说明 (-lavfi):</strong></p>
                          <p>等同于 -filter_complex，但用于纯滤镜图形</p>
                          <p>不需要输入文件，滤镜直接生成输出</p>
                          <p>示例: <code>color=red:size=1920x1080[test];[test]rotate=45:out_w=800[out]</code></p>
                        </>
                      )}
                    </div>
                  )}
                  {param.name === '-hwaccel' && (
                    <div style={{ fontSize: '12px', color: '#1890ff', marginTop: '4px' }}>
                      <p><strong>硬件加速说明:</strong></p>
                      <p>auto: 自动检测可用的硬件加速</p>
                      <p>vaapi: Linux 上的 VAAPI</p>
                      <p>cuda: NVIDIA GPU 加速</p>
                      <p>qsv: Intel Quick Sync Video</p>
                    </div>
                  )}
                </>
              </Form.Item>
            ))}
          </div>
        )}
      </Form>
    </Card>
  );
};

export default ParameterConfigurator;