import { useEffect, useState } from "react";
import { Form, Input, Button, Select, notification, Checkbox } from "antd";
import {
  CheckCircleOutlined,
  WarningOutlined,
  EditOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useRole } from "../../hook/useRole";
import { useFaculty } from "../../hook/useFaculty";
import { getInforUser } from "../../services/user";
import { updateUser } from "../../services/user";
import "./style.scss";

const { Option } = Select;

const EditUserForm = () => {
  const { loading, roles } = useRole();
  const { faculty } = useFaculty();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getInforUser(id);
        const userData = response.data;
        setInitialValues(userData);
        form.setFieldsValue({
          username: userData.username,
          email: userData.email,
          role_id: userData.role_id,
          faculty_id: userData.faculty_id,
          is_active: userData.is_active,
        });
      } catch (error) {
        notification.error({
          message: "Failed to fetch user data",
          description: error.response?.data?.message || "An error occurred",
          icon: <WarningOutlined style={{ color: "#e91010" }} />,
        });
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id, form]);

  const handleSubmit = async (values) => {
    try {
      const res = await updateUser(id, values);
      notification.success({
        message: "Update Success",
        description: "User information has been updated successfully",
        icon: <CheckCircleOutlined style={{ color: "#00ff66" }} />,
      });
      console.log(res);

      navigate("/list-user");
    } catch (error) {
      notification.error({
        message: "Update Failed",
        description: error.response?.data?.message || "An error occurred",
        icon: <WarningOutlined style={{ color: "#e91010" }} />,
      });
    }
  };

  if (!initialValues) {
    return <div>Loading...</div>;
  }

  return (
    <div className="edit-user" style={{ padding: 20 }}>
      <Button
        className="back-button"
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
      />
      <div className="form-container">
        <h2>Edit User</h2>
        <Form
          form={form}
          name="editUser"
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input size="large" placeholder="Enter username" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input size="large" placeholder="Enter email" />
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
            name="faculty_id"
            label="Faculty"
            rules={[{ required: false, message: "Please select a faculty!" }]}
          >
            <Select
              size="large"
              placeholder="Select a faculty"
              loading={loading}
              allowClear
            >
              {faculty?.map((fac) => (
                <Option key={fac.id} value={fac.id}>
                  {fac.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="is_active" valuePropName="checked">
            <Checkbox>Is Active</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<EditOutlined />}>
              Update User
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default EditUserForm;
