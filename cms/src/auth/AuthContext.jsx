import { useState } from "react";
import { Form, Input, Button, Typography, notification } from "antd";
import "./login.scss"; // Import file SCSS
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
import { login } from "../services/login";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      const data = await login(values.email, values.password);
      localStorage.setItem("token", data.token);
      notification.success({
        message: "Đăng nhập thành công!",
        description: "Chào mừng bạn đến với hệ thống!",
      });
      navigate("/create-user");
    } catch {
      notification.error("Đăng nhập thất bại!");
    }
  };

  return (
    <div className="login-container">
      <Title level={1} className="login-title">
        Login CMS
      </Title>

      <Form name="login" onFinish={handleSubmit} layout="vertical">
        <div className="input-login">
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <Input
              type="email"
              size="large"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </Form.Item>
        </div>
        <div className="input-password">
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              size="large"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </Form.Item>
        </div>

        <div className="button-login">
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
}

export default Login;
