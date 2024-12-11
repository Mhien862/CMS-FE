import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  Space,
  Typography,
  Button,
  Modal,
  Input,
  message,
  Alert,
  Spin,
  Tag,
  Form,
  Card,
  Tooltip,
} from "antd";
import {
  SortAscendingOutlined,
  EditOutlined,
  CheckOutlined,
  UserOutlined,
  CommentOutlined,
  DownloadOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { getAssignmentsByFolder, gradeAssignment } from "../services/class";
import { motion } from "framer-motion";
import "./style.scss";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Search } = Input;
const { TextArea } = Input;

const FolderPage = () => {
  const { classId, folderId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gradeModalVisible, setGradeModalVisible] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [form] = Form.useForm();
  const [sortUngradedFirst, setSortUngradedFirst] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [tableLoading, setTableLoading] = useState(false);
  const [gradeError, setGradeError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignments();
  }, [classId, folderId]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAssignmentsByFolder(classId, folderId);
      const processedData = data?.assignments || [];
      setAssignments(processedData);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      setError(error.response?.data?.message || "Failed to fetch assignments");
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  const validateGrade = (value) => {
    if (!value || value.trim() === "") {
      setGradeError("Please enter a grade!");
      return false;
    }

    const numberValue = Number(value);

    if (isNaN(numberValue)) {
      setGradeError("Grade must be a number!");
      return false;
    }

    if (!Number.isInteger(numberValue)) {
      setGradeError("Grade must be an integer!");
      return false;
    }

    if (numberValue < 1 || numberValue > 10) {
      setGradeError("Grade must be between 1 and 10!");
      return false;
    }

    setGradeError("");
    return true;
  };

  const handleGradeChange = (e) => {
    const value = e.target.value;
    form.setFieldsValue({ grade: value });
    validateGrade(value);
  };

  const handleGrade = (assignment) => {
    setCurrentAssignment(assignment);
    form.setFieldsValue({
      grade: assignment.grade || "",
      comment: assignment.comment || "",
    });
    setGradeError("");
    setGradeModalVisible(true);
  };

  const handleGradeModalClose = () => {
    setGradeModalVisible(false);
    setGradeError("");
    form.resetFields();
    setCurrentAssignment(null);
  };

  const submitGrade = async () => {
    try {
      const values = form.getFieldsValue();

      if (!validateGrade(values.grade)) {
        return;
      }

      setTableLoading(true);

      await gradeAssignment(classId, currentAssignment.id, {
        grade: Number(values.grade),
        comment: values.comment,
      });

      message.success("Grade submitted successfully!");
      handleGradeModalClose();
      await fetchAssignments();
    } catch (error) {
      console.error("Error submitting grade:", error);
      message.error(
        "Error submitting grade: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setTableLoading(false);
    }
  };

  const toggleSort = () => {
    setSortUngradedFirst(!sortUngradedFirst);
  };

  const filteredAndSortedAssignments = [...assignments]
    .filter((assignment) =>
      assignment.student_name.toLowerCase().includes(searchText.toLowerCase())
    )
    .sort((a, b) => {
      if (sortUngradedFirst) {
        if (!a.grade && b.grade) return -1;
        if (a.grade && !b.grade) return 1;
      }
      return new Date(b.submitted_at) - new Date(a.submitted_at);
    });

  const getGradeColor = (grade) => {
    if (!grade) return "default";
    if (grade >= 8) return "green";
    if (grade >= 5) return "blue";
    return "red";
  };

  const columns = [
    {
      title: "Student Name",
      dataIndex: "student_name",
      key: "student_name",
      render: (text) => (
        <Tag color="blue" icon={<UserOutlined />}>
          {text}
        </Tag>
      ),
      width: "15%",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "25%",
      render: (text, record) => (
        <Space direction="vertical" size="small">
          <Text strong>{text}</Text>
          {record.description && (
            <Text type="secondary" className="description-text">
              {record.description}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: "Submission Time",
      dataIndex: "submitted_at",
      key: "submitted_at",
      width: "20%",
      render: (text) => (
        <Tooltip title={new Date(text).toLocaleString()}>
          {new Date(text).toLocaleDateString()}
        </Tooltip>
      ),
    },
    {
      title: "Submitted File",
      key: "file",
      width: "15%",
      render: (_, record) =>
        record.file_url && (
          <Space>
            <Button
              type="link"
              icon={<DownloadOutlined />}
              href={record.file_url}
              target="_blank"
            >
              Download
            </Button>
          </Space>
        ),
    },
    {
      title: "Grade & Comments",
      key: "grade",
      width: "25%",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Space>
            <Tag color={getGradeColor(record.grade)}>
              {record.grade ? `Grade: ${record.grade}/10` : "Not Graded"}
            </Tag>
            <Button
              type="primary"
              icon={record.grade ? <EditOutlined /> : <CheckOutlined />}
              onClick={() => handleGrade(record)}
              size="small"
            >
              {record.grade ? "Update" : "Grade"}
            </Button>
          </Space>
          {record.comment && (
            <Text type="secondary" className="comment-text">
              <CommentOutlined /> {record.comment}
            </Text>
          )}
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="folder-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <Space direction="vertical" style={{ width: "100%", gap: "20px" }}>
            <Space style={{ justifyContent: "space-between", width: "100%" }}>
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                style={{ fontSize: "18px" }}
              />

              <Title level={2} style={{ margin: 0 }}>
                Submissions List
              </Title>
              <Space>
                <Search
                  placeholder="Search by student name"
                  allowClear
                  enterButton="Search"
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 300 }}
                />
                <Button
                  type="primary"
                  icon={<SortAscendingOutlined />}
                  onClick={toggleSort}
                >
                  {sortUngradedFirst ? "Show All" : "Show Ungraded First"}
                </Button>
              </Space>
            </Space>

            {error && (
              <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
                className="error-alert"
              />
            )}

            {assignments.length === 0 ? (
              <Alert
                message="No Submissions"
                description="There are no submissions in this folder yet."
                type="info"
                showIcon
                className="info-alert"
              />
            ) : (
              <Table
                dataSource={filteredAndSortedAssignments}
                columns={columns}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showTotal: (total) => `Total ${total} submissions`,
                }}
                loading={tableLoading}
                scroll={{ x: 1200 }}
              />
            )}
          </Space>
        </Card>

        <Modal
          title={`Grade Assignment - ${currentAssignment?.student_name}`}
          visible={gradeModalVisible}
          onOk={submitGrade}
          onCancel={handleGradeModalClose}
          width={600}
          okText="Confirm"
          cancelText="Cancel"
          confirmLoading={tableLoading}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="grade"
              label="Grade (1-10)"
              help={gradeError}
              validateStatus={gradeError ? "error" : ""}
            >
              <Input
                placeholder="Enter grade from 1 to 10"
                onChange={handleGradeChange}
                type="number"
                suffix="/10"
              />
            </Form.Item>
            <Form.Item
              name="comment"
              label="Comments"
              rules={[
                {
                  max: 500,
                  message: "Comments cannot exceed 500 characters",
                },
              ]}
            >
              <TextArea
                placeholder="Enter comments for the submission"
                rows={4}
                showCount
                maxLength={500}
              />
            </Form.Item>
          </Form>
        </Modal>
      </motion.div>
    </div>
  );
};

export default FolderPage;
