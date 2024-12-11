import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Upload,
  Button,
  message,
  List,
  Card,
  Typography,
  Space,
  Divider,
  Popconfirm,
} from "antd";
import {
  InboxOutlined,
  FileOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  CommentOutlined,
  LeftOutlined, // Thêm LeftOutlined vào import
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import {
  submitAssignment,
  getSubmittedAssignments,
  deleteAssignment,
} from "../services/class";
import { motion } from "framer-motion";
import "./style.scss";

const { Title, Text } = Typography;
const { Dragger } = Upload;

const SubmitAssignment = () => {
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const { classId, folderId } = useParams();
  const [submitting, setSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const navigate = useNavigate(); // Khai báo hook navigate

  useEffect(() => {
    fetchAssignments();
  }, [classId, folderId]);

  const fetchAssignments = async () => {
    try {
      const data = await getSubmittedAssignments(classId, folderId);
      setAssignments(data);

      setHasSubmitted(data.length > 0);
    } catch {
      message.error("Failed to fetch submitted assignments");
    }
  };

  const handleDelete = async (assignmentId) => {
    try {
      await deleteAssignment(classId, folderId, assignmentId);
      message.success("Assignment deleted successfully");
      fetchAssignments();
      setHasSubmitted(false);
    } catch {
      message.error("Failed to delete assignment");
    }
  };

  const onFinish = async (values) => {
    if (hasSubmitted) {
      message.error("You have already submitted");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    if (file) {
      formData.append("file", file);
    }

    try {
      await submitAssignment(classId, folderId, formData);
      message.success("Assignment submitted successfully");
      form.resetFields();
      setFile(null);
      fetchAssignments();
    } catch {
      message.error("Failed to submit assignment");
    } finally {
      setSubmitting(false);
    }
  };

  const uploadProps = {
    onRemove: () => {
      setFile(null);
    },
    beforeUpload: (file) => {
      setFile(file);
      return false;
    },
    fileList: file ? [file] : [],
  };

  const handleGoBack = () => {
    navigate(-1); // Quay lại trang trước
  };

  return (
    <div className="submit-assignment">
      {/* Nút quay lại */}
      <Button
        onClick={handleGoBack}
        icon={<LeftOutlined />}
        type="text"
        className="go-back-button"
      >
        Go Back
      </Button>

      <motion.div
        className="submit-form"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title level={3}>Submit New Assignment</Title>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please input the title!" }]}
          >
            <Input disabled={hasSubmitted} />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please input the description!" },
            ]}
          >
            <Input.TextArea rows={4} disabled={hasSubmitted} />
          </Form.Item>
          <Form.Item label="File">
            <Dragger {...uploadProps} disabled={hasSubmitted}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single file upload. You can only submit once.
              </p>
            </Dragger>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              disabled={hasSubmitted}
            >
              Submit Assignment
            </Button>
            {hasSubmitted && (
              <Text type="warning" className="ml-3">
                You have already submitted
              </Text>
            )}
          </Form.Item>
        </Form>
      </motion.div>

      <Divider type="vertical" className="divider" />

      <motion.div
        className="submitted-assignments"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title level={3}>Submitted Assignments</Title>
        <List
          dataSource={assignments}
          renderItem={(assignment, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <List.Item>
                <Card
                  className="assignment-card"
                  title={
                    <Space>
                      <FileOutlined className="file-icon" />
                      <Text strong>{assignment.title}</Text>
                    </Space>
                  }
                  extra={
                    <Space>
                      {assignment.file_url && (
                        <Button
                          type="link"
                          href={assignment.file_url}
                          target="_blank"
                        >
                          View File
                        </Button>
                      )}
                      {!assignment.grade && (
                        <Popconfirm
                          title="Delete Assignment"
                          description="Are you sure you want to delete this assignment?"
                          onConfirm={() => handleDelete(assignment.id)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button type="text" danger icon={<DeleteOutlined />}>
                            Delete
                          </Button>
                        </Popconfirm>
                      )}
                    </Space>
                  }
                >
                  <p>{assignment.description}</p>
                  <Space direction="vertical" className="w-full">
                    <Space className="assignment-info">
                      <ClockCircleOutlined />
                      <Text type="secondary">
                        Submitted:{" "}
                        {new Date(assignment.submitted_at).toLocaleString()}
                      </Text>
                    </Space>

                    {assignment.grade && (
                      <Space className="assignment-grade">
                        <CheckCircleOutlined />
                        <Text strong>Grade: {assignment.grade}</Text>
                      </Space>
                    )}

                    {assignment.comment && (
                      <Space className="assignment-comment">
                        <CommentOutlined />
                        <Text> Comment: {assignment.comment}</Text>
                      </Space>
                    )}
                  </Space>
                </Card>
              </List.Item>
            </motion.div>
          )}
        />
      </motion.div>
    </div>
  );
};

export default SubmitAssignment;
