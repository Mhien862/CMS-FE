import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Input,
  Modal,
  notification,
  Card,
  Space,
  Typography,
  Spin,
  List,
} from "antd";
import {
  FolderOutlined,
  PlusOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import {
  getClassById,
  createFolder,
  getFoldersByClassId,
} from "../services/class";
import "./style.scss";

const { Title, Text } = Typography;

const ClassPage = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [classInfo, setClassInfo] = useState(null);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  }, [classId, navigate]);

  const fetchFolders = useCallback(async () => {
    try {
      const response = await getFoldersByClassId(classId);
      if (response && response.data && Array.isArray(response.data.folders)) {
        setFolders(response.data.folders);
      } else if (response && Array.isArray(response)) {
        setFolders(response);
      } else {
        throw new Error("Unexpected data structure");
      }
    } catch (error) {
      notification.error({
        message: "Failed to fetch folders",
        description: error.message || "An unknown error occurred",
      });
      setFolders([]);
    }
  }, [classId]);

  useEffect(() => {
    if (classId) {
      fetchClassInfo();
      fetchFolders();
    }
  }, [classId, fetchClassInfo, fetchFolders]);

  const showModal = () => setIsModalVisible(true);
  const handleFolderClick = (folderId) => {
    navigate(`/teacher/class/${classId}/folder/${folderId}`);
  };

  const handleOk = async () => {
    try {
      await createFolder(classId, { name: folderName });
      notification.success({ message: "Folder created successfully" });
      setIsModalVisible(false);
      setFolderName("");
      fetchFolders();
    } catch (error) {
      notification.error({
        message: "Failed to create folder",
        description: error.response?.data?.message || "An error occurred",
      });
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setFolderName("");
  };

  if (loading) {
    return <Spin size="large" className="page-loader" />;
  }

  if (!classInfo) {
    return <Text>No class information available.</Text>;
  }

  return (
    <div className="class-page">
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card className="class-info-card">
          <Title level={2}>{classInfo.name}</Title>
          <Space direction="vertical">
            <Text>
              <strong>Faculty:</strong> {classInfo.faculty_name}
            </Text>
            <Text>
              <strong>Teacher:</strong> {classInfo.teacher_name}
            </Text>
          </Space>
        </Card>

        <div className="folder-actions">
          <Button type="primary" onClick={showModal} icon={<PlusOutlined />}>
            Create Folder
          </Button>
        </div>

        <Modal
          title="Create New Folder"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Input
            placeholder="Enter folder name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
          />
        </Modal>

        <Title level={3}>Folders</Title>
        {Array.isArray(folders) && folders.length > 0 ? (
          <List
            grid={{ gutter: 16, column: 3 }}
            dataSource={folders}
            renderItem={(folder) => (
              <List.Item>
                <Card
                  hoverable
                  className="folder-card"
                  onClick={() => handleFolderClick(folder.id)}
                >
                  <Space direction="vertical">
                    <Space>
                      <FolderOutlined className="folder-icon" />
                      <Text strong className="folder-name">
                        {folder.name || "Unnamed Folder"}
                      </Text>
                    </Space>
                    <Space className="folder-info">
                      <UserOutlined />
                      <Text>Created by: {folder.created_by || "Unknown"}</Text>
                    </Space>
                    <Space className="folder-info">
                      <CalendarOutlined />
                      <Text>
                        Created at:{" "}
                        {folder.created_at
                          ? new Date(folder.created_at).toLocaleString()
                          : "Unknown"}
                      </Text>
                    </Space>
                  </Space>
                </Card>
              </List.Item>
            )}
          />
        ) : (
          <Text>No folders found.</Text>
        )}
      </Space>
    </div>
  );
};

export default ClassPage;
