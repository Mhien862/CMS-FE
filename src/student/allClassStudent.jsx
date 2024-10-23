import { useState, useEffect } from "react";
import { Input, Button, notification } from "antd";
import { useNavigate } from "react-router-dom";
import {
  getClassesByFaculty,
  joinClass,
  checkEnrollmentStatus,
} from "../services/class";
import { motion } from "framer-motion";
import "./style.scss";

const StudentAllClasses = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classPassword, setClassPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [joiningClass, setJoiningClass] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await getClassesByFaculty(user.faculty_id);
      setClasses(response.data);
    } catch (error) {
      notification.error({
        message: "Failed to fetch classes",
        description: error.response?.data?.message || "An error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClassSelect = async (classItem) => {
    setSelectedClass(classItem);
    setClassPassword("");
    setJoiningClass(true);

    try {
      const status = await checkEnrollmentStatus(classItem.id);
      if (status.isEnrolled) {
        navigate(`/student/class/${classItem.id}/folder`);
      } else {
        setJoiningClass(false);
      }
    } catch (error) {
      setJoiningClass(false);
      if (error.response?.status === 403) {
        // Hiển thị form nhập password
        setSelectedClass(classItem);
      } else {
        notification.error({
          message: "Error",
          description:
            error.response?.data?.message || "Failed to check class status",
        });
      }
    }
  };

  const handleJoinClass = async () => {
    if (!selectedClass) {
      notification.warning({ message: "Please select a class first" });
      return;
    }

    if (!classPassword.trim()) {
      notification.warning({ message: "Please enter the class password" });
      return;
    }

    setJoiningClass(true);
    try {
      await joinClass(selectedClass.id, classPassword);
      notification.success({ message: "Successfully joined the class" });
      navigate(`/student/class/${selectedClass.id}/folder`);
    } catch (error) {
      notification.error({
        message: "Failed to join class",
        description: error.response?.data?.message || "Incorrect password",
      });
      setClassPassword("");
    } finally {
      setJoiningClass(false);
    }
  };

  const filteredClasses = classes.filter((classItem) =>
    classItem.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="student-all-classes">
      <h1>Available Classes</h1>
      <Input
        placeholder="Search classes"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <div className="class-grid">
        {filteredClasses.map((classItem) => (
          <motion.div
            key={classItem.id}
            className={`class-card ${
              selectedClass?.id === classItem.id ? "selected" : ""
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleClassSelect(classItem)}
          >
            <h2>{classItem.name}</h2>
            <p>Faculty: {classItem.faculty_name}</p>
            <p>Teacher: {classItem.teacher_name}</p>
          </motion.div>
        ))}
      </div>

      {selectedClass && !joiningClass && (
        <motion.div
          className="join-class-form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2>Join {selectedClass.name}</h2>
          <Input.Password
            placeholder="Enter class password"
            value={classPassword}
            onChange={(e) => setClassPassword(e.target.value)}
            onPressEnter={handleJoinClass}
          />
          <Button
            type="primary"
            onClick={handleJoinClass}
            loading={joiningClass}
          >
            Join Class
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default StudentAllClasses;
