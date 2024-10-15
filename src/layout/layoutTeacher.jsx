import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  MenuOutlined,
  DashboardOutlined,
  UserOutlined,
  BookOutlined,
  LogoutOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, Dropdown, Avatar, Badge, Tooltip } from "antd";
import { motion } from "framer-motion";
import { getMe } from "../services/user";
import "./style.scss";

const { Header, Sider, Content } = Layout;

const LayoutTeacher = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();

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
      <Menu.Item key="profile">
        <UserOutlined /> Profile
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        <LogoutOutlined /> Logout
      </Menu.Item>
    </Menu>
  );

  const menuItems = [
    {
      key: "/teacher/class-teacher",
      icon: <BookOutlined />,
      label: "Classes",
    },
    // {
    //   key: "/teacher/dashboard",
    //   icon: <DashboardOutlined />,
    //   label: "Dashboard",
    // },
  ];

  return (
    <Layout className="layout-teacher">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="sidebar"
        theme="light"
      >
        <div className="logo">{collapsed ? "CMS" : "CMS TEACHER"}</div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header className="header" style={{ background: colorBgContainer }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="header-content"
          >
            <MenuOutlined
              className="trigger"
              onClick={() => setCollapsed(!collapsed)}
            />
            <div className="header-right">
              <Tooltip title="Notifications">
                <Badge count={5} className="notification-badge">
                  <BellOutlined className="notification-icon" />
                </Badge>
              </Tooltip>
              <Dropdown overlay={userMenu} trigger={["click"]}>
                <a
                  onClick={(e) => e.preventDefault()}
                  className="user-dropdown"
                >
                  <Avatar
                    src={user?.avatar || "https://joeschmoe.io/api/v1/random"}
                  />
                  <span className="username">
                    {user ? user.username : "Loading..."}
                  </span>
                </a>
              </Dropdown>
            </div>
          </motion.div>
        </Header>
        <Content
          className="main-content"
          style={{ background: colorBgContainer, borderRadius: borderRadiusLG }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutTeacher;
