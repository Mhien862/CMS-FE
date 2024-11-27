import React from "react";
import { Form, Input, Button, Select, notification } from "antd";
import {
  UserAddOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { register } from "../../services/login";
import { useNavigate } from "react-router-dom";
import { useRole } from "../../hook/useRole";
import { useFaculty } from "../../hook/useFaculty";
import "./style.scss";

const CreateUser = () => {
  const { loading: loadingRoles, roles } = useRole();
  const { loading: loadingFaculty, faculty } = useFaculty();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      const res = await register(values);
      notification.success({
        message: "Success",
        description: res.message,
        placement: "topRight",
        icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
      });
      navigate("/list-user");
      form.resetFields();
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "Failed to create user",
        placement: "topRight",
        icon: <WarningOutlined style={{ color: "#ff4d4f" }} />,
      });
    }
  };

  return (
    <div className="create-user-container">
      <div className="form-card">
        <div className="form-title">
          <h2>Create New User</h2>
          <p>Add a new user to the system with role and faculty assignment</p>
        </div>

        <Form
          form={form}
          name="createUser"
          onFinish={handleSubmit}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[
              { required: true, message: "Please input username!" },
              { min: 3, message: "Username must be at least 3 characters!" },
            ]}
          >
            <Input placeholder="Enter username" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please input password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item
            name="role_id"
            label="Role"
            rules={[{ required: true, message: "Please select a role!" }]}
          >
            <Select
              placeholder="Select user role"
              loading={loadingRoles}
              showSearch
              optionFilterProp="children"
            >
              {roles?.map((role) => (
                <Select.Option key={role.id} value={role.id}>
                  {role.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="faculty"
            label="Faculty"
            rules={[{ required: true, message: "Please select a faculty!" }]}
          >
            <Select
              placeholder="Select faculty"
              loading={loadingFaculty}
              showSearch
              optionFilterProp="children"
            >
              {faculty?.map((fac) => (
                <Select.Option key={fac.id} value={fac.id}>
                  {fac.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            className="submit-button"
            icon={<UserAddOutlined />}
          >
            Create User
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default CreateUser;
