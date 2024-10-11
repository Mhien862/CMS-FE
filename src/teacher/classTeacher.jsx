import { useEffect, useState } from "react";
import { getClassesByTeacherId, teacherCheckClass } from "../services/class";
import {
  Card,
  List,
  Typography,
  Spin,
  Button,
  message,
  notification,
} from "antd";
import "./style.scss";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

function TeacherClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.id) {
          const response = await getClassesByTeacherId(user.id);
          setClasses(response.data);
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
        message.error("Failed to fetch classes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleEnterClass = async (classItem) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) {
      notification.error({
        message: "User information not found. Please log in again.",
      });
      return;
    }

    try {
      const response = await teacherCheckClass({
        classId: classItem.id,
        teacherId: user.id,
      });

      const { isTeacher, message } = response.data || response;

      if (typeof isTeacher === "undefined") {
        throw new Error("Unexpected response format from server");
      }

      notification[isTeacher ? "success" : "warning"]({
        message:
          message ||
          (isTeacher
            ? "You are the teacher of this class"
            : "You are not the teacher of this class"),
      });
      if (isTeacher) {
        navigate(`/teacher/class/${classItem.id}`);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred";
      notification.error({ message: "Error", description: errorMessage });
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div className="my-class">
      <Title level={2} style={{ marginBottom: 16 }}>
        My Classes
      </Title>
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={classes}
        renderItem={(classItem) => (
          <List.Item>
            <Card
              hoverable
              className="class-card"
              bodyStyle={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div className="class-info">
                <Title level={4} style={{ textAlign: "center" }}>
                  {classItem.name}
                </Title>
                <Text className="faculty-name">{classItem.faculty_name}</Text>
              </div>
              <div className="class-actions">
                <Button
                  type="primary"
                  onClick={() => handleEnterClass(classItem)}
                >
                  Enter Class
                </Button>
                <Button type="default" style={{ marginTop: 8 }}>
                  View Details
                </Button>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
}

export default TeacherClasses;
