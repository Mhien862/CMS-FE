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
} from "antd";
import {
  InboxOutlined,
  FileOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { submitAssignment, getSubmittedAssignments } from "../services/class";
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

  useEffect(() => {
    fetchAssignments();
  }, [classId]);

  const fetchAssignments = async () => {
    try {
      const data = await getSubmittedAssignments(classId);
      setAssignments(data);
    } catch {
      message.error("Failed to fetch submitted assignments");
    }
  };

  const onFinish = async (values) => {
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

  return (
    <div className="submit-assignment">
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
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please input the description!" },
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item label="File">
            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single file upload. Strictly prohibit from
                uploading company data or other sensitive files.
              </p>
            </Dragger>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Submit Assignment
            </Button>
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
                    assignment.file_url && (
                      <Button
                        type="link"
                        href={assignment.file_url}
                        target="_blank"
                      >
                        View File
                      </Button>
                    )
                  }
                >
                  <p>{assignment.description}</p>
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
