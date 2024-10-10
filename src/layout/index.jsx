import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  LaptopOutlined,
  LogoutOutlined,
  GlobalOutlined,
  BellOutlined,
  SettingOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Layout as LayoutAntd,
  Menu,
  theme,
  Dropdown,
  Input,
} from "antd";
import { getMe } from "../services/user";
import "./style.scss"; // Import the SCSS file

const { Header, Sider, Content } = LayoutAntd;

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchUserData();
    }
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      const data = await getMe();
      setUser(data.user);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="1" onClick={handleLogout}>
        <LogoutOutlined /> Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <LayoutAntd className="layout">
      <Sider trigger={null} collapsible collapsed={collapsed} className="sider">
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <UserOutlined />,
              label: "User",
              onClick: () => {
                navigate("/list-user");
              },
            },
            {
              key: "2",
              icon: <LaptopOutlined />,
              label: "Class",
              onClick: () => {
                navigate("/list-class");
              },
            },
            {
              key: "3",
              icon: <GlobalOutlined />,
              label: "Faculty",
              onClick: () => {
                navigate("/list-faculty");
              },
            },
            {
              key: "4",
              icon: <DashboardOutlined />,
              label: "Dashboard",
            },
          ]}
        />
      </Sider>
      <LayoutAntd>
        <Header className="header">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="collapse-button"
          />

          <div className="header-icons">
            <Input
              placeholder="Search"
              prefix={<SearchOutlined />}
              className="search-input"
            />
            <Button icon={<BellOutlined />} className="header-button" />
            <Button icon={<SettingOutlined />} className="header-button" />
            <Dropdown overlay={userMenu} trigger={["click"]}>
              <a onClick={(e) => e.preventDefault()} className="user-dropdown">
                <UserOutlined style={{ marginRight: 8 }} />
                <span>{user ? user.username : "Loading..."}</span>
              </a>
            </Dropdown>
          </div>
        </Header>
        <Content
          className="content"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </LayoutAntd>
    </LayoutAntd>
  );
};

export default Layout;
