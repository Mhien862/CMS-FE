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
  Input,
  Empty,
} from "antd";
import { SearchOutlined, LoginOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./style.scss";

const { Title, Text } = Typography;

function TeacherClasses() {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    setFilteredClasses(
      classes.filter((classItem) =>
        classItem.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, classes]);

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
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="teacher-classes">
      <Title level={2}>My Classes</Title>
      <Input
        prefix={<SearchOutlined />}
        placeholder="Search classes"
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      {filteredClasses.length > 0 ? (
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 4 }}
          dataSource={filteredClasses}
          renderItem={(classItem) => (
            <List.Item>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card hoverable className="class-card">
                  <Title level={4}>{classItem.name}</Title>
                  <Text className="faculty-name">{classItem.faculty_name}</Text>
                  <div className="class-actions">
                    <Button
                      type="primary"
                      icon={<LoginOutlined />}
                      onClick={() => handleEnterClass(classItem)}
                    >
                      Enter Class
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </List.Item>
          )}
        />
      ) : (
        <Empty
          description="No classes found"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </div>
  );
}

export default TeacherClasses;
