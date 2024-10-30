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
  Tabs,
  Table,
} from "antd";
import {
  FolderOutlined,
  PlusOutlined,
  UserOutlined,
  CalendarOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  getClassById,
  createFolder,
  getFoldersByClassId,
  getStudentsInClass,
} from "../services/class";
import "./style.scss";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

// StudentList Component
const StudentList = ({ classId }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getStudentsInClass(classId);
        setStudents(response.data || []);
      } catch (error) {
        notification.error({
          message: "Failed to fetch students",
          description: error.message || "Failed to load student list",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [classId]);

  const columns = [
    {
      title: "Student Name",
      dataIndex: "username",
      key: "username",
    },

    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Joined Date",
      dataIndex: "joined_at",
      key: "joined_at",
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <Card className="student-list-card">
      <Table
        loading={loading}
        columns={columns}
        dataSource={students}
        rowKey="id"
        pagination={false}
      />
    </Card>
  );
};

// Folder List Component
const FolderList = ({ folders, onFolderClick }) => {
  return (
    <List
      grid={{ gutter: 16, column: 3 }}
      dataSource={folders}
      renderItem={(folder) => (
        <List.Item>
          <Card
            hoverable
            className="folder-card"
            onClick={() => onFolderClick(folder.id)}
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
  );
};

// Main ClassPage Component
const ClassPage = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [classInfo, setClassInfo] = useState(null);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("1");

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

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="class-tabs"
        >
          <TabPane
            tab={
              <span>
                <FolderOutlined />
                Folders
              </span>
            }
            key="1"
          >
            <div className="folder-actions">
              <Button
                type="primary"
                onClick={showModal}
                icon={<PlusOutlined />}
              >
                Create Folder
              </Button>
            </div>

            {Array.isArray(folders) && folders.length > 0 ? (
              <FolderList folders={folders} onFolderClick={handleFolderClick} />
            ) : (
              <Text>No folders found.</Text>
            )}
          </TabPane>

          <TabPane
            tab={
              <span>
                <TeamOutlined />
                Students
              </span>
            }
            key="2"
          >
            <StudentList classId={classId} />
          </TabPane>
        </Tabs>

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
      </Space>
    </div>
  );
};

export default ClassPage;
