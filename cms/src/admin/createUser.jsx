import { Form, Input, Button, notification, Select } from "antd";
import { CheckCircleOutlined, WarningOutlined } from "@ant-design/icons";
import { register } from "../services/login";

const { Option } = Select;

const createUser = () => {
  const [form] = Form.useForm();
  //   const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      const res = await register(
        values.username,
        values.email,
        values.password,
        values.role,
        values.faculty
      );
      console.log(res);
      //   navigate("/user");
      notification.open({
        message: "Create Success",
        icon: <CheckCircleOutlined style={{ color: "#00ff66" }} />,
      });
      console.log(res.message);
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        notification.open({
          message: error.response.data.message,
          icon: <WarningOutlined style={{ color: "#e91010" }} />,
        });
      }
    }
  };

  const rolesData = [
    "marketing manager",
    "marketing coordinator",
    "guest",
    "student",
    "Admin",
  ];

  const facultiesData = ["IT", "Business", "Design"];

  const validatePassword = (_, value) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!value || regex.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(
      "Password must contain at least one lowercase letter, one uppercase letter, one number, one special character, and be at least 8 characters long."
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ maxWidth: 400, margin: "auto" }}>
        <Form
          form={form}
          name="signup"
          onFinish={handleSubmit}
          layout="vertical"
          initialValues={{
            remember: true,
          }}
        >
          <h1>Create Account</h1>
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input placeholder="Enter your username" />
          </Form.Item>
          <Form.Item
            label="Role"
            name="role"
            rules={[
              {
                required: true,
                message: "Please select a role!",
              },
            ]}
          >
            <Select placeholder="Select a role">
              {rolesData.map((role) => (
                <Option key={role}>{role}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Faculty"
            name="faculty"
            rules={[
              {
                required: true,
                message: "Please select a faculty!",
              },
            ]}
          >
            <Select placeholder="Select a faculty">
              {facultiesData.map((faculty) => (
                <Option key={faculty}>{faculty}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please input a valid email address!",
              },
            ]}
          >
            <Input placeholder="Example@gmail.com" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
              {
                validator: validatePassword,
              },
            ]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Create
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default createUser;
