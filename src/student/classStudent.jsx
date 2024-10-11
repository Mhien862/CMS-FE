import { useState, useEffect } from "react";
import { List, Card, Input, Button, notification } from "antd";
import { getAllClasses, joinClass } from "../services/classService";

const StudentAllClasses = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classCode, setClassCode] = useState("");

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await getAllClasses();
      setClasses(response.data);
    } catch {
      notification.error({
        message: "Failed to fetch classes",
        description:
          "There was an error loading the classes. Please try again.",
      });
    }
  };

  const handleClassSelect = (classItem) => {
    setSelectedClass(classItem);
  };

  const handleJoinClass = async () => {
    if (!selectedClass) {
      notification.warning({ message: "Please select a class first" });
      return;
    }
    try {
      await joinClass(selectedClass.id, classCode);
      notification.success({ message: "Successfully joined the class" });
    } catch (error) {
      notification.error({
        message: "Failed to join class",
        description: error.response?.data?.message || "An error occurred",
      });
    }
  };

  return (
    <div>
      <h1>Available Classes</h1>
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={classes}
        renderItem={(item) => (
          <List.Item>
            <Card
              title={item.name}
              extra={
                <Button onClick={() => handleClassSelect(item)}>Select</Button>
              }
            >
              <p>Faculty: {item.faculty_name}</p>
              <p>Teacher: {item.teacher_name}</p>
            </Card>
          </List.Item>
        )}
      />
      {selectedClass && (
        <div>
          <h2>Join {selectedClass.name}</h2>
          <Input
            placeholder="Enter class code"
            value={classCode}
            onChange={(e) => setClassCode(e.target.value)}
          />
          <Button onClick={handleJoinClass}>Join Class</Button>
        </div>
      )}
    </div>
  );
};

export default StudentAllClasses;
