import { Form, Input, Button, Select, notification } from "antd";
import { CheckCircleOutlined, WarningOutlined } from "@ant-design/icons";
import { register } from "../../services/login";
import { useNavigate } from "react-router-dom";
import { useRole } from "../../hook/useRole";
import { useFaculty } from "../../hook/useFaculty";

const { Option } = Select;

const FormUser = () => {
  const { loading, roles } = useRole();
  const { faculty } = useFaculty();

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const handleSubmit = async (values) => {
    try {
      const res = await register(values);
      notification.success({
        message: "Create Success",
        description: res.message,
        icon: <CheckCircleOutlined style={{ color: "#00ff66" }} />,
      });
      navigate("/list-user");
      form.resetFields();
    } catch (error) {
      notification.error({
        message: "Create Failed",
        description: error.response?.data?.message || "An error occurred",
        icon: <WarningOutlined style={{ color: "#e91010" }} />,
      });
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ maxWidth: 400, margin: "auto" }}>
        <h2>Create New User</h2>
        <Form
          form={form}
          name="createUser"
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item
            name="role_id"
            label="Role"
            rules={[{ required: true, message: "Please select a role!" }]}
          >
            <Select size="large" placeholder="Select a role" loading={loading}>
              {roles?.map((role) => (
                <Option key={role.id} value={role.id}>
                  {role.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="faculty"
            label="Faculty"
            rules={[{ required: true, message: "Please select a faculty!" }]}
          >
            <Select
              size="large"
              placeholder="Select a faculty"
              loading={loading}
            >
              {faculty?.map((faculty) => (
                <Option key={faculty.id} value={faculty.id}>
                  {faculty.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Create User
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default FormUser;
