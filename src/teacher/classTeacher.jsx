import { useEffect, useState } from "react";
import { getClassesByTeacherId } from "../services/class";
import { Card, List, Typography, Spin, Button } from "antd";
import "./style.scss";

const { Title, Text } = Typography;

function TeacherClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

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
        // Optionally show an error notification here
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleJoinClass = (classId) => {
    console.log(`Joining class with ID: ${classId}`);
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
                {/* Add any additional information here */}
              </div>
              <div className="class-actions">
                <Button
                  type="primary"
                  onClick={() => handleJoinClass(classItem.id)}
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
