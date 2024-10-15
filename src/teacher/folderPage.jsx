import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  List,
  Card,
  Space,
  Typography,
  Button,
  Modal,
  Input,
  message,
  Alert,
  Spin,
  Tag,
} from "antd";
import {
  FileOutlined,
  CalendarOutlined,
  EditOutlined,
  CheckOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { getAssignmentsByFolder, gradeAssignment } from "../services/class";
import { motion } from "framer-motion";
import "./style.scss";

const { Title, Text } = Typography;

const FolderPage = () => {
  const { classId, folderId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gradeModalVisible, setGradeModalVisible] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [grade, setGrade] = useState("");

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

  const handleGrade = (assignment) => {
    setCurrentAssignment(assignment);
    setGrade(assignment.grade || "");
    setGradeModalVisible(true);
  };

  const submitGrade = async () => {
    try {
      await gradeAssignment(classId, currentAssignment.id, {
        grade: Number(grade),
      });
      message.success("Grade submitted successfully");
      setGradeModalVisible(false);
      fetchAssignments();
    } catch (error) {
      console.error("Error submitting grade:", error);
      message.error(
        "Failed to submit grade: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

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
        <Title level={2}>Folder Assignments</Title>
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
            message="No Assignments"
            description="There are no assignments in this folder yet."
            type="info"
            showIcon
            className="info-alert"
          />
        ) : (
          <List
            dataSource={assignments}
            renderItem={(assignment) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <List.Item key={assignment.id}>
                  <Card className="assignment-card">
                    <Space direction="vertical" style={{ width: "100%" }}>
                      {/* Đưa student_name lên trên cùng */}
                      <Tag color="blue" icon={<UserOutlined />}>
                        {assignment.student_name}
                      </Tag>

                      <Space className="assignment-header">
                        <FileOutlined className="icon" />
                        <Text strong>{assignment.title}</Text>
                      </Space>
                      <Text>{assignment.description}</Text>
                      {assignment.file_url && (
                        <Space>
                          <FileOutlined className="icon" />
                          <a
                            href={assignment.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Assignment File
                          </a>
                        </Space>
                      )}
                      <Space>
                        <CalendarOutlined className="icon" />
                        <Text>
                          Submitted at:{" "}
                          {new Date(assignment.submitted_at).toLocaleString()}
                        </Text>
                      </Space>
                      <Space className="grade-section">
                        <Text>Grade: {assignment.grade || "Not graded"}</Text>
                        <Button
                          type="primary"
                          icon={
                            assignment.grade ? (
                              <EditOutlined />
                            ) : (
                              <CheckOutlined />
                            )
                          }
                          onClick={() => handleGrade(assignment)}
                        >
                          {assignment.grade ? "Update Grade" : "Grade"}
                        </Button>
                      </Space>
                    </Space>
                  </Card>
                </List.Item>
              </motion.div>
            )}
          />
        )}

        <Modal
          title="Grade Assignment"
          visible={gradeModalVisible}
          onOk={submitGrade}
          onCancel={() => setGradeModalVisible(false)}
        >
          <Input
            placeholder="Enter grade"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            type="number"
          />
        </Modal>
      </motion.div>
    </div>
  );
};

export default FolderPage;
