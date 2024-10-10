import { useState, useEffect } from "react";
import {
  Table,
  Typography,
  Space,
  Button,
  Modal,
  Form,
  Input,
  notification,
} from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import {
  getAllFaculty,
  createFaculty,
  updateFaculty,
} from "../../services/faculty";
import "./style.scss";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const { Title } = Typography;

const FacultyList = () => {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentFacultyId, setCurrentFacultyId] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    try {
      const response = await getAllFaculty();
      setFaculties(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching faculties:", error);
      setLoading(false);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
    setIsEditMode(false);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleCreate = async (values) => {
    try {
      await createFaculty(values);
      notification.success({
        message: "Success",
        description: "Faculty created successfully",
        icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
      });
      setIsModalVisible(false);
      fetchFaculties();
    } catch (error) {
      console.error("Error creating faculty:", error);
      notification.error({
        message: "Error",
        description: "Failed to create faculty. Please try again.",
        icon: <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
      });
    }
  };

  const handleEdit = async (values) => {
    try {
      await updateFaculty(values, currentFacultyId);
      notification.success({
        message: "Success",
        description: "Faculty updated successfully",
        icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
      });
      setIsModalVisible(false);
      fetchFaculties();
    } catch (error) {
      console.error("Error updating faculty:", error);
      notification.error({
        message: "Error",
        description: "Failed to update faculty. Please try again.",
        icon: <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
      });
    }
  };

  const handleEditClick = (faculty) => {
    setIsEditMode(true);
    setCurrentFacultyId(faculty.id);
    form.setFieldsValue({ name: faculty.name });
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Action",
      key: "action",
      render: (text, faculty) => (
        <Button
          icon={<EditOutlined />}
          onClick={() => handleEditClick(faculty)}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="list-faculty">
      <Space direction="vertical" size="large" style={{ display: "flex" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={2}>Faculty List</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
            Add Faculty
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={faculties}
          rowKey="id"
          loading={loading}
          pagination={false}
        />
      </Space>

      <Modal
        title={isEditMode ? "Edit Faculty" : "Create New Faculty"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          onFinish={isEditMode ? handleEdit : handleCreate}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Faculty Name"
            rules={[
              { required: true, message: "Please input the faculty name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isEditMode ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FacultyList;
