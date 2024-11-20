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
  Tag,
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
  getStudentsGradesInClass,
  getStudentClasses,
} from "../services/class";
import "./style.scss";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

// StudentList Component
const StudentList = ({ classId }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStudentClasses, setSelectedStudentClasses] = useState([]);
  const [selectedStudentName, setSelectedStudentName] = useState("");
  const [loadingClasses, setLoadingClasses] = useState(false);

  // Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getStudentsGradesInClass(classId);
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

  // Fetch classes for a specific student
  const handleViewClasses = async (studentId, username) => {
    setModalVisible(true);
    setSelectedStudentName(username);
    setLoadingClasses(true);

    try {
      const response = await getStudentClasses(studentId);
      setSelectedStudentClasses(response.data || []);
    } catch (error) {
      notification.error({
        message: "Failed to fetch student classes",
        description: error.message || "Failed to load class details",
      });
    } finally {
      setLoadingClasses(false);
    }
  };

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
      title: "Assignments",
      key: "assignments",
      render: (_, record) => (
        <Space>
          <Tag>{record.assignments?.length || 0} submitted</Tag>
          {record.assignments?.some((a) => a.grade) && (
            <Tag color="success">
              {record.assignments.filter((a) => a.grade).length} graded
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Average Grade",
      dataIndex: "average_grade",
      key: "average_grade",
      render: (grade) => {
        if (!grade) return <Tag>No grade</Tag>;
        let color = "default";
        if (grade >= 8.5) color = "success";
        else if (grade >= 7) color = "processing";
        else if (grade >= 5) color = "warning";
        else color = "error";
        return <Tag color={color}>{grade}</Tag>;
      },
    },
    {
      title: "Joined Date",
      dataIndex: "joined_at",
      key: "joined_at",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          onClick={() => handleViewClasses(record.id, record.username)}
        >
          View Classes
        </Button>
      ),
    },
  ];

  // Render class details in modal
  const renderClassItem = (item) => (
    <List.Item>
      <List.Item.Meta
        title={item.class_name}
        description={
          <Space direction="vertical" size="small">
            <Text>
              <strong>Teacher:</strong> {item.teacher_name}
            </Text>
            <Text>
              <strong>Average Grade:</strong>{" "}
              <Tag color="blue">{item.average_grade || "No grade"}</Tag>
            </Text>
            <Text>
              <strong>Joined:</strong>{" "}
              {new Date(item.joined_at).toLocaleDateString()}
            </Text>
          </Space>
        }
      />
    </List.Item>
  );

  return (
    <>
      <Card className="student-list-card">
        <Table
          loading={loading}
          columns={columns}
          dataSource={students}
          rowKey="id"
          pagination={false}
          scroll={{ x: "max-content" }}
        />
      </Card>

      <Modal
        title={`Classes for ${selectedStudentName}`}
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setSelectedStudentClasses([]);
        }}
        footer={null}
      >
        <List
          dataSource={selectedStudentClasses}
          loading={loadingClasses}
          renderItem={renderClassItem}
          locale={{ emptyText: "No classes found" }}
        />
      </Modal>
    </>
  );
};

// FolderList Component
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
            onClick={() => onFolderClick(folder.id)} // Gọi hàm điều hướng khi nhấn
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
      const folders = await getFoldersByClassId(classId);
      setFolders(folders || []);
    } catch (error) {
      console.error("Error fetching folders:", error);
      notification.error({
        message: "Failed to fetch folders",
        description: error.message || "An unknown error occurred",
      });
      setFolders([]);
    }
  }, [classId]);

  const handleFolderClick = (folderId) => {
    navigate(`/teacher/class/${classId}/folder/${folderId}`); // Điều hướng đến trang chi tiết folder
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
        description: error.response?.data?.message || "Failed to create folder",
      });
    }
  };

  const handleCancel = () => setIsModalVisible(false);

  useEffect(() => {
    if (classId) {
      fetchClassInfo();
      fetchFolders();
    }
  }, [classId, fetchClassInfo, fetchFolders]);

  if (loading) return <Spin size="large" className="page-loader" />;
  if (!classInfo) return <Text>No class information available.</Text>;

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
            <FolderList folders={folders} onFolderClick={handleFolderClick} />
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
