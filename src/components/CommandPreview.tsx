import { Card, Typography, Space, Button } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";

const { Text, Paragraph } = Typography;

interface CommandPreviewProps {
  parameters: Record<string, any>;
}

const CommandPreview: React.FC<CommandPreviewProps> = ({ parameters }) => {
  const [command, setCommand] = useState("");

  // 根据参数生成命令
  useEffect(() => {
    // 直接使用parameters对象，它已经是{paramName: value}的格式
    const parts = ["ffmpeg"];
    
    Object.keys(parameters).forEach(key => {
      const value = parameters[key];
      
      // 跳过空值或默认值
      if (value === undefined || value === null || value === "" || value === false) {
        return;
      }
      
      // 检查key是否已经以'-'开头
      const paramKey = key.startsWith('-') ? key : `-${key}`;
      
      // 处理布尔型参数（值为true时只需添加参数名）
      if (typeof value === 'boolean' && value === true) {
        parts.push(paramKey);
      } else {
        // 其他类型参数需要添加键值对
        parts.push(paramKey, value.toString());
      }
    });

    setCommand(parts.join(" "));
  }, [parameters]); // 依赖parameters对象，当它变化时重新运行

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
  };

  return (
    <Card title="命令预览">
      <Space direction="vertical" style={{ width: "100%" }}>
        <Text strong>生成的 FFmpeg 命令:</Text>
        <Paragraph
          style={{ backgroundColor: "#f5f5f5", padding: "12px", borderRadius: "4px", wordBreak: "break-all" }}
          copyable={{ text: command }}
        >
          {command}
        </Paragraph>
        <Button icon={<CopyOutlined />} onClick={handleCopy}>
          复制命令
        </Button>
      </Space>
    </Card>
  );
};

export default CommandPreview;