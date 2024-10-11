import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Spin,
  Alert,
  Button,
  Typography,
  Input,
  Select,
  Avatar,
} from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { getAllClass, getListTeacher } from "../../services/class";
import { useFaculty } from "../../hook/useFaculty";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import { deleteClass } from "../../services/class";
import { Modal } from "antd";

const { confirm } = Modal;
const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const navigate = useNavigate();

  const { faculty } = useFaculty();

  const getClasses = async () => {
    try {
      const response = await getAllClass();
      setClasses(response.data);
      setFilteredClasses(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch classes");
      setLoading(false);
    }
  };

  const getTeachers = async () => {
    try {
      const response = await getListTeacher();
      setTeachers(response.data);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch teachers");
    }
  };

  useEffect(() => {
    getClasses();
    getTeachers();
  }, []);

  useEffect(() => {
    filterClasses();
  }, [searchTerm, selectedFaculty, selectedTeacher, classes]);

  useEffect(() => {
    if (selectedFaculty) {
      const filtered = teachers.filter(
        (teacher) => teacher.faculty_id === selectedFaculty
      );
      setFilteredTeachers(filtered);
    } else {
      setFilteredTeachers([]);
    }
  }, [selectedFaculty, teachers]);

  const filterClasses = () => {
    let filtered = classes;

    if (searchTerm) {
      filtered = filtered.filter((classItem) =>
        classItem.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedFaculty) {
      filtered = filtered.filter(
        (classItem) => classItem.faculty_id === selectedFaculty
      );
    }

    if (selectedTeacher) {
      filtered = filtered.filter(
        (classItem) => classItem.teacher_id === selectedTeacher
      );
    }

    setFilteredClasses(filtered);
  };

  const getTeacherName = (teacherId) => {
    const teacher = teachers.find((t) => t.id === teacherId);
    return teacher ? teacher.username : "Unknown";
  };

  const getFacultyName = (facultyId) => {
    const facultyItem = faculty.find((f) => f.id === facultyId);
    return facultyItem ? facultyItem.name : "Unknown Faculty";
  };

  const handleCreateClass = () => {
    navigate("/create-class");
  };

  const handleEditClass = (classId) => {
    navigate(`/edit-class/${classId}`);
  };

  const showDeleteConfirm = (classId) => {
    confirm({
      title: "Are you sure you want to delete this class?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        handleDeleteClass(classId);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleDeleteClass = async (classId) => {
    try {
      await deleteClass(classId);
      setClasses(classes.filter((classItem) => classItem.id !== classId));
      getClasses();
    } catch (error) {
      console.error("Failed to delete class", error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFacultyChange = (value) => {
    setSelectedFaculty(value);
    setSelectedTeacher(null);
  };

  const handleTeacherChange = (value) => {
    setSelectedTeacher(value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedFaculty(null);
    setSelectedTeacher(null);
  };

  if (loading) return <Spin size="large" />;
  if (error) return <Alert message={error} type="error" />;

  return (
    <div className="class-list">
      <div className="class-list__header">
        <Title level={2}>All Classes</Title>
        <Button
          type="primary"
          onClick={handleCreateClass}
          icon={<PlusOutlined />}
          className="create-class-btn"
        >
          Create Class
        </Button>
      </div>

      <div className="class-list__filters">
        <Search
          placeholder="Search classes"
          onChange={handleSearch}
          value={searchTerm}
          prefix={<SearchOutlined />}
          className="search-input"
        />
        <Select
          placeholder="Select Faculty"
          onChange={handleFacultyChange}
          value={selectedFaculty}
          className="faculty-select"
        >
          {faculty.map((f) => (
            <Option key={f.id} value={f.id}>
              {f.name}
            </Option>
          ))}
        </Select>
        {selectedFaculty && (
          <Select
            placeholder="Select Teacher"
            onChange={handleTeacherChange}
            value={selectedTeacher}
            className="teacher-select"
          >
            {filteredTeachers.map((t) => (
              <Option key={t.id} value={t.id}>
                {t.username}
              </Option>
            ))}
          </Select>
        )}
        <Button onClick={clearFilters} className="clear-filters-btn">
          Clear Filters
        </Button>
      </div>

      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : error ? (
        <Alert message={error} type="error" />
      ) : (
        <Row gutter={[24, 24]} className="class-list__grid">
          {filteredClasses.map((classItem) => (
            <Col xs={24} sm={12} md={8} lg={6} key={classItem.id}>
              <Card
                hoverable
                className="class-card"
                actions={[
                  <Button
                    key={`edit-${classItem.id}`}
                    onClick={() => handleEditClass(classItem.id)}
                    type="link"
                  >
                    Edit
                  </Button>,
                  <Button
                    key={`delete-${classItem.id}`}
                    onClick={() => showDeleteConfirm(classItem.id)}
                    type="link"
                    danger
                  >
                    Delete
                  </Button>,
                ]}
              >
                <div className="class-card__header">
                  <Avatar size={64} className="class-avatar">
                    {classItem.name.charAt(0)}
                  </Avatar>
                  <Title level={4}>{classItem.name}</Title>
                </div>
                <div className="class-card__content">
                  <Text strong>Faculty:</Text>
                  <Text>{getFacultyName(classItem.faculty_id)}</Text>
                  <Text strong>Teacher:</Text>
                  <Text>{getTeacherName(classItem.teacher_id)}</Text>
                  <Text strong>Class ID:</Text>
                  <Text>{classItem.id}</Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default ClassList;
