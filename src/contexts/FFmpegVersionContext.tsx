import { createContext, useState } from "react";
import type { ReactNode } from "react";

// 定义上下文类型
interface FFmpegVersionContextType {
  selectedVersion: string;
  setSelectedVersion: (version: string) => void;
}

// 创建默认上下文值
const defaultContextValue: FFmpegVersionContextType = {
  selectedVersion: "6.1", // 默认版本
  setSelectedVersion: () => {}, // 默认函数，将在 Provider 中被覆盖
};

// 创建上下文
export const FFmpegVersionContext = createContext<FFmpegVersionContextType>(
  defaultContextValue
);

// 定义 Provider 组件的 props
interface FFmpegVersionProviderProps {
  children: ReactNode; // 子组件
}

// Provider 组件
export const FFmpegVersionProvider: React.FC<FFmpegVersionProviderProps> = ({
  children,
}) => {
  const [selectedVersion, setSelectedVersion] = useState<string>("6.1");

  return (
    <FFmpegVersionContext.Provider value={{ selectedVersion, setSelectedVersion }}>
      {children}
    </FFmpegVersionContext.Provider>
  );
};