import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  LaptopOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Button, Layout as LayoutAntd, Menu, theme, Dropdown } from "antd";
import { getMe } from "../services/user";

const { Header, Sider, Content } = LayoutAntd;

const LayoutTeacher = () => {
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
    <LayoutAntd>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <LaptopOutlined />,
              label: "Class",
              onClick: () => {
                navigate("/teacher/class-teacher");
              },
            },
            {
              key: "2",
              icon: <DashboardOutlined />,
              label: "Dashboard",
            },
          ]}
        />
      </Sider>
      <LayoutAntd>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <div style={{ marginRight: 16 }}>
            <Dropdown overlay={userMenu} trigger={["click"]}>
              <a
                onClick={(e) => e.preventDefault()}
                style={{ color: "rgba(0, 0, 0, 0.65)" }}
              >
                <UserOutlined style={{ marginRight: 8 }} />
                <span>{user ? user.username : "Loading..."}</span>
              </a>
            </Dropdown>
          </div>
        </Header>
        <Content
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

export default LayoutTeacher;
