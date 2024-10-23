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
} from "@ant-design/icons";
import { getAssignmentsByFolder, gradeAssignment } from "../services/class";
import { motion } from "framer-motion";
import "./style.scss";

const { Title, Text } = Typography;
const { Search } = Input;
const { TextArea } = Input;

const FolderPage = () => {
  // State Management
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

  // Initial Data Fetch
  useEffect(() => {
    fetchAssignments();
  }, [classId, folderId]);

  // Data Fetching Function
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

  // Grade Validation
  const validateGrade = (value) => {
    // Check if value is empty
    if (!value || value.trim() === "") {
      setGradeError("Vui lòng nhập điểm!");
      return false;
    }

    const numberValue = Number(value);

    // Check if it's a valid number
    if (isNaN(numberValue)) {
      setGradeError("Điểm phải là số!");
      return false;
    }

    // Check if it's an integer
    if (!Number.isInteger(numberValue)) {
      setGradeError("Điểm phải là số nguyên!");
      return false;
    }

    // Check range
    if (numberValue < 1 || numberValue > 10) {
      setGradeError("Điểm phải từ 1 đến 10!");
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

  // Grade Modal Handlers
  const handleGrade = (assignment) => {
    setCurrentAssignment(assignment);
    form.setFieldsValue({
      grade: assignment.grade || "",
      comment: assignment.comment || "",
    });
    setGradeError(""); // Reset grade error when opening modal
    setGradeModalVisible(true);
  };

  const handleGradeModalClose = () => {
    setGradeModalVisible(false);
    setGradeError(""); // Reset grade error when closing modal
    form.resetFields();
    setCurrentAssignment(null);
  };

  const submitGrade = async () => {
    try {
      const values = form.getFieldsValue();

      // Validate grade before submitting
      if (!validateGrade(values.grade)) {
        return;
      }

      setTableLoading(true);

      await gradeAssignment(classId, currentAssignment.id, {
        grade: Number(values.grade),
        comment: values.comment,
      });

      message.success("Đã chấm điểm thành công!");
      handleGradeModalClose();
      await fetchAssignments();
    } catch (error) {
      console.error("Error submitting grade:", error);
      message.error(
        "Lỗi khi chấm điểm: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setTableLoading(false);
    }
  };

  // Sort and Filter Functions
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

  // Table Columns Configuration
  const columns = [
    {
      title: "Tên sinh viên",
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
      title: "Tiêu đề",
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
      title: "Thời gian nộp",
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
      title: "File nộp",
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
              Tải xuống
            </Button>
          </Space>
        ),
    },
    {
      title: "Điểm & Nhận xét",
      key: "grade",
      width: "25%",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Space>
            <Tag color={getGradeColor(record.grade)}>
              {record.grade ? `Điểm: ${record.grade}/10` : "Chưa chấm điểm"}
            </Tag>
            <Button
              type="primary"
              icon={record.grade ? <EditOutlined /> : <CheckOutlined />}
              onClick={() => handleGrade(record)}
              size="small"
            >
              {record.grade ? "Cập nhật" : "Chấm điểm"}
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

  // Loading State
  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  // Main Render
  return (
    <div className="folder-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <Space direction="vertical" style={{ width: "100%", gap: "20px" }}>
            {/* Header Section */}
            <Space style={{ justifyContent: "space-between", width: "100%" }}>
              <Title level={2} style={{ margin: 0 }}>
                Danh sách bài nộp
              </Title>
              <Space>
                <Search
                  placeholder="Tìm theo tên sinh viên"
                  allowClear
                  enterButton="Tìm kiếm"
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 300 }}
                />
                <Button
                  type="primary"
                  icon={<SortAscendingOutlined />}
                  onClick={toggleSort}
                >
                  {sortUngradedFirst
                    ? "Hiện thị tất cả"
                    : "Hiện bài chưa chấm trước"}
                </Button>
              </Space>
            </Space>

            {/* Error Alert */}
            {error && (
              <Alert
                message="Lỗi"
                description={error}
                type="error"
                showIcon
                className="error-alert"
              />
            )}

            {/* Table Section */}
            {assignments.length === 0 ? (
              <Alert
                message="Không có bài nộp"
                description="Chưa có bài nộp nào trong thư mục này."
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
                  showTotal: (total) => `Tổng số ${total} bài nộp`,
                }}
                loading={tableLoading}
                scroll={{ x: 1200 }}
              />
            )}
          </Space>
        </Card>

        {/* Grade Modal */}
        <Modal
          title={`Chấm điểm - ${currentAssignment?.student_name}`}
          visible={gradeModalVisible}
          onOk={submitGrade}
          onCancel={handleGradeModalClose}
          width={600}
          okText="Xác nhận"
          cancelText="Hủy"
          confirmLoading={tableLoading}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="grade"
              label="Điểm (1-10)"
              help={gradeError}
              validateStatus={gradeError ? "error" : ""}
            >
              <Input
                placeholder="Nhập điểm từ 1 đến 10"
                onChange={handleGradeChange}
                type="number"
                suffix="/10"
              />
            </Form.Item>
            <Form.Item
              name="comment"
              label="Nhận xét"
              rules={[
                {
                  max: 500,
                  message: "Nhận xét không được vượt quá 500 ký tự",
                },
              ]}
            >
              <TextArea
                placeholder="Nhập nhận xét cho bài nộp"
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
