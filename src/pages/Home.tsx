import { Card, Space, Divider } from "antd";
import { useState } from "react";
import ParameterConfigurator from "../components/ParameterConfigurator";
import CommandPreview from "../components/CommandPreview";

const Home: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [parameters, setParameters] = useState<Record<string, any>>({});

  // 定义任务选项
  const taskOptions = [
    { key: "format_conversion", label: "格式转换" },
    { key: "video_editing", label: "视频剪辑" },
    { key: "audio_processing", label: "音频处理" },
    { key: "filter_application", label: "滤镜应用" },
    { key: "custom", label: "自定义任务" },
  ];

  // 任务改变时重置参数
  const handleTaskChange = (taskKey: string) => {
    setSelectedTask(taskKey);
    // 不要立即重置参数，而是让ParameterConfigurator来处理参数更新
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 命令预览区 - 上半部分 */}
      <Card 
        title="实时命令预览" 
        style={{ marginBottom: 16, flex: '0 0 auto' }}
      >
        <CommandPreview parameters={parameters} />
      </Card>

      <Divider style={{ margin: '8px 0' }} />

      {/* 任务选择和参数配置区 - 下半部分 */}
      <Card 
        title={
          <Space wrap>
            <span>任务选择</span>
            {taskOptions.map((task) => (
              <button
                key={task.key}
                style={{
                  border: selectedTask === task.key ? '2px solid #1890ff' : '1px solid #d9d9d9',
                  borderRadius: '2px',
                  padding: '4px 15px',
                  background: selectedTask === task.key ? '#1890ff' : '#fff',
                  color: selectedTask === task.key ? '#fff' : 'rgba(0, 0, 0, 0.65)',
                  cursor: 'pointer',
                  outline: 'none',
                  fontSize: '14px',
                  height: '32px'
                }}
                onClick={() => handleTaskChange(task.key)}
              >
                {task.label}
              </button>
            ))}
          </Space>
        }
        style={{ flex: '1 1 auto', overflow: 'auto' }}
      >
        {selectedTask ? (
          <ParameterConfigurator
            taskKey={selectedTask}
            onParametersChange={setParameters}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>请选择一个任务开始配置</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Home;