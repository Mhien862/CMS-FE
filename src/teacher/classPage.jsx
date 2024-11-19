import { useState, useEffect } from "react";
import {
  Button,
  notification,
  Card,
  Space,
  Table,
  Tag,
  Modal,
  List,
  Typography,
} from "antd";
import { FolderOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom"; // Lấy classId trực tiếp từ URL
import { getStudentsGradesInClass, getStudentClasses } from "../services/class";
import "./style.scss";

const { Text } = Typography;

const StudentList = () => {
  const { classId } = useParams(); // Lấy classId từ URL
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStudentClasses, setSelectedStudentClasses] = useState([]);
  const [selectedStudentName, setSelectedStudentName] = useState("");
  const [loadingClasses, setLoadingClasses] = useState(false);

  // Fetch students when classId changes
  useEffect(() => {
    if (!classId) {
      console.warn("Missing classId. Cannot fetch students.");
      setLoading(false); // Ngừng loading nếu không có classId
      return;
    }

    const fetchStudents = async () => {
      setLoading(true);
      try {
        console.log("Fetching students for classId:", classId);
        const response = await getStudentsGradesInClass(classId);
        console.log("Response from getStudentsGradesInClass:", response);

        if (response?.data) {
          setStudents(response.data);
          console.log("Students data set:", response.data);
        } else {
          console.warn("No data found in response:", response);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
        notification.error({
          message: "Failed to fetch students",
          description: error.message || "Failed to load student list",
        });
      } finally {
        setLoading(false);
        console.log("Loading state set to false.");
      }
    };

    fetchStudents();
  }, [classId]);

  // Fetch classes for a specific student
  const handleViewClasses = async (studentId, username) => {
    if (!studentId) {
      console.warn("Missing studentId. Cannot fetch classes.");
      return;
    }

    console.log(
      "Fetching classes for studentId:",
      studentId,
      "Username:",
      username
    );
    setModalVisible(true);
    setSelectedStudentName(username);
    setLoadingClasses(true);

    try {
      const response = await getStudentClasses(studentId);
      console.log("Response from getStudentClasses:", response);

      if (response?.data) {
        setSelectedStudentClasses(response.data);
        console.log("Classes data set for student:", response.data);
      } else {
        console.warn("No data found in response:", response);
      }
    } catch (error) {
      console.error("Error fetching student classes:", error);
      notification.error({
        message: "Failed to fetch student classes",
        description: error.message || "Could not load class details",
      });
    } finally {
      setLoadingClasses(false);
      console.log("LoadingClasses state set to false.");
    }
  };

  // Determine grade color based on value
  const getGradeColor = (grade) => {
    console.log("Getting grade color for grade:", grade);
    if (!grade) return "default";
    if (grade >= 8.5) return "success";
    if (grade >= 7) return "processing";
    if (grade >= 5) return "warning";
    return "error";
  };

  // Define table columns
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
      render: (grade) => (
        <Tag color={getGradeColor(grade)}>{grade || "No grade"}</Tag>
      ),
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
          icon={<FolderOutlined />}
          onClick={() => handleViewClasses(record.id, record.username)}
          size="small"
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
              <Tag color={getGradeColor(item.average_grade)}>
                {item.average_grade || "No grade"}
              </Tag>
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
        {classId ? (
          <Table
            loading={loading}
            columns={columns}
            dataSource={students}
            rowKey="id"
            pagination={false}
            scroll={{ x: "max-content" }}
          />
        ) : (
          <Text type="warning">Class ID is missing. Please check the URL.</Text>
        )}
      </Card>

      <Modal
        title={`Classes for ${selectedStudentName}`}
        open={modalVisible}
        onCancel={() => {
          console.log("Closing modal.");
          setModalVisible(false);
          setSelectedStudentClasses([]);
          setSelectedStudentName("");
        }}
        footer={null}
        width={600}
      >
        <List
          className="student-classes-list"
          loading={loadingClasses}
          dataSource={selectedStudentClasses}
          renderItem={renderClassItem}
          locale={{ emptyText: "No classes found" }}
        />
      </Modal>
    </>
  );
};

export default StudentList;
