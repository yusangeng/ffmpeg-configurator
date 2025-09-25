import { Select, Space } from "antd";
import { FFmpegVersionContext } from "../contexts/FFmpegVersionContext";

const { Option } = Select;

// 模拟的 FFmpeg 版本列表，实际项目中应从 API 或配置文件获取
const ffmpegVersions = [
  { version: "6.1", description: "Current Stable" },
  { version: "5.1", description: "LTS" },
  { version: "4.4", description: "Old Stable" },
  { version: "7.0", description: "Development" },
];

const VersionSelector: React.FC = () => {
  return (
    <FFmpegVersionContext.Consumer>
      {({ selectedVersion, setSelectedVersion }: { selectedVersion: string; setSelectedVersion: (version: string) => void }) => (
        <Space>
          <span>FFmpeg 版本:</span>
          <Select
            defaultValue={ffmpegVersions[0].version}
            value={selectedVersion}
            onChange={(value) => setSelectedVersion(value)}
            style={{ width: 120 }}
          >
            {ffmpegVersions.map((version) => (
              <Option key={version.version} value={version.version}>
                {version.version} ({version.description})
              </Option>
            ))}
          </Select>
        </Space>
      )}
    </FFmpegVersionContext.Consumer>
  );
};

export default VersionSelector;