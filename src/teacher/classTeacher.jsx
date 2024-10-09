import { useEffect, useState } from "react";
import { getClassesByTeacherId } from "../services/class";
import { Card, List, Typography, Spin, Button } from "antd";

const { Title } = Typography;

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
        // Có thể hiển thị thông báo lỗi ở đây
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
    <div>
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
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
              bodyStyle={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <Title level={4}>{classItem.name}</Title>
                {/* Thêm các thông tin khác của lớp học nếu cần */}
              </div>
              <Button
                type="primary"
                onClick={() => handleJoinClass(classItem.id)}
                style={{ marginTop: "auto" }}
              >
                Join Class
              </Button>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
}

export default TeacherClasses;
