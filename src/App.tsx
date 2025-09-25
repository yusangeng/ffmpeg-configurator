import { Layout, Typography } from "antd";
import VersionSelector from "./components/VersionSelector";
import Home from "./pages/Home";

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ display: "flex", alignItems: "center", color: "white" }}>
        <Title style={{ color: "white", margin: 0, flex: 1 }}>
          FFmpeg 可视化配置工具
        </Title>
        <VersionSelector />
      </Header>
      <Content style={{ padding: "24px" }}>
        <Home />
      </Content>
    </Layout>
  );
}

export default App
