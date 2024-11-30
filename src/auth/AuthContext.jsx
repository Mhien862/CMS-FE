import { useState, useEffect } from "react";
import { Form, Input, Button, Typography, notification } from "antd";
import "./login.scss";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
import { login } from "../services/login";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "user") {
        const newUser = JSON.parse(e.newValue);
        if (newUser) {
          redirectBasedOnRole(newUser.role_id);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const redirectBasedOnRole = (roleId) => {
    switch (roleId) {
      case 1: // Admin role
        navigate("/list-user");
        break;
      case 2: // Teacher role
        navigate("/teacher/class-teacher");
        break;
      default: // Student role or any other role
        navigate("/student/class-student");
        break;
    }
  };

  const handleSubmit = async (values) => {
    try {
      const response = await login(values.email, values.password);
      const { user, token } = response;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      window.dispatchEvent(new Event("storage"));

      notification.success({
        message: "Login Successful!",
        description: "Welcome to the system!",
      });

      redirectBasedOnRole(user.role_id);
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred. Please try again later.";

      notification.error({
        message: "Login Failed!",
        description: errorMessage,
      });
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
            rules={[{ required: true, message: "Please enter your email!" }]}
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
            rules={[{ required: true, message: "Please enter your password!" }]}
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
