import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  notification,
  Card,
  Typography,
  Spin,
  List,
  Avatar,
  Button,
} from "antd";
import {
  FolderOutlined,
  UserOutlined,
  CalendarOutlined,
  LeftOutlined,
} from "@ant-design/icons"; // Import LeftOutlined
import { getClassById, getFoldersForStudent } from "../services/class";
import { motion } from "framer-motion";
import "./style.scss";

const { Title, Text } = Typography;

const ClassFolders = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [classInfo, setClassInfo] = useState(null);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleFolderClick = (folderId) => {
    navigate(`/student/class/${classId}/folder/${folderId}/submit`);
  };

  const fetchClassInfo = useCallback(async () => {
    try {
      const response = await getClassById(classId);
      setClassInfo(response.data);
    } catch (error) {
      notification.error({
        message: "Failed to fetch class information",
        description: "An error occurred while fetching class details.",
      });
      if (error.response?.status === 403) {
        navigate("/");
      }
    }
  }, [classId, navigate]);

  const fetchFolders = useCallback(async () => {
    try {
      const response = await getFoldersForStudent(classId);
      if (response && response.folders) {
        setFolders(response.folders);
      } else {
        throw new Error("Unexpected data structure");
      }
    } catch (error) {
      notification.error({
        message: "Failed to fetch folders",
        description: error.message || "An unknown error occurred",
      });
      setFolders([]);
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    if (classId) {
      fetchClassInfo();
      fetchFolders();
    }
  }, [classId, fetchClassInfo, fetchFolders]);

  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  if (!classInfo) {
    return <Text>No class information available.</Text>;
  }

  return (
    <div className="class-folders">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Button with ArrowLeft Icon */}
        <Button
          onClick={handleGoBack}
          icon={<LeftOutlined />}
          className="go-back-button"
          type="text"
        >
          Go Back
        </Button>

        <Title level={2}>{classInfo.name}</Title>

        <Card className="class-info-card">
          <div className="info-item">
            <UserOutlined className="info-icon" />
            <Text strong>Faculty:</Text> {classInfo.faculty_name}
          </div>
          <div className="info-item">
            <UserOutlined className="info-icon" />
            <Text strong>Teacher:</Text> {classInfo.teacher_name}
          </div>
        </Card>

        <Title level={3} className="folders-title">
          Assignments
        </Title>
        {Array.isArray(folders) && folders.length > 0 ? (
          <List
            className="folder-list"
            dataSource={folders}
            renderItem={(folder, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <List.Item
                  onClick={() => handleFolderClick(folder.id)}
                  className="folder-item"
                >
                  <Card hoverable className="folder-card">
                    <div className="folder-header">
                      <Avatar
                        icon={<FolderOutlined />}
                        className="folder-icon"
                      />
                      <Text strong className="folder-name">
                        {folder.name || "Unnamed Folder"}
                      </Text>
                    </div>
                    <div className="folder-info">
                      <div className="info-row">
                        <UserOutlined className="info-icon" />
                        <Text>
                          Created by: {folder.created_by || "Unknown"}
                        </Text>
                      </div>
                      <div className="info-row">
                        <CalendarOutlined className="info-icon" />
                        <Text>
                          Created at:{" "}
                          {folder.created_at
                            ? new Date(folder.created_at).toLocaleString()
                            : "Unknown"}
                        </Text>
                      </div>
                    </div>
                  </Card>
                </List.Item>
              </motion.div>
            )}
          />
        ) : (
          <Text>No folders found.</Text>
        )}
      </motion.div>
    </div>
  );
};

export default ClassFolders;
