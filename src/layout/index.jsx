import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
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
  Dropdown,
  Input,
  Avatar,
} from "antd";
import { getMe } from "../services/user";
import "./style.scss";

const { Header, Sider, Content } = LayoutAntd;

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
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
        handleTokenExpiration();
      }
    }
  };

  const handleTokenExpiration = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const handleLogout = () => {
    handleTokenExpiration();
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="1" onClick={handleLogout}>
        <LogoutOutlined /> Logout
      </Menu.Item>
    </Menu>
  );

  const menuItems = [
    {
      key: "/list-user",
      icon: <UserOutlined />,
      label: "User",
    },
    {
      key: "/list-class",
      icon: <LaptopOutlined />,
      label: "Class",
    },
    {
      key: "/list-faculty",
      icon: <GlobalOutlined />,
      label: "Faculty",
    },
    // {
    //   key: "/dashboard",
    //   icon: <DashboardOutlined />,
    //   label: "Dashboard",
    // },
  ];

  return (
    <LayoutAntd className="minimal-layout">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="minimal-sider"
      >
        <div className="logo">{collapsed ? "CMS" : "CMS ADMIN"}</div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          className="minimal-menu"
        />
      </Sider>
      <LayoutAntd>
        <Header className="minimal-header">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="collapse-button"
          />
          <div className="header-right">
            <Input
              placeholder="Search"
              prefix={<SearchOutlined />}
              className="search-input"
            />
            <Button icon={<BellOutlined />} className="header-button" />
            <Button icon={<SettingOutlined />} className="header-button" />
            <Dropdown overlay={userMenu} trigger={["click"]}>
              <a onClick={(e) => e.preventDefault()} className="user-dropdown">
                <Avatar icon={<UserOutlined />} />
                <span>{user ? user.username : "Loading..."}</span>
              </a>
            </Dropdown>
          </div>
        </Header>
        <Content className="minimal-content">
          <Outlet />
        </Content>
      </LayoutAntd>
    </LayoutAntd>
  );
};

export default Layout;
