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
  Modal,
} from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { getAllClass, getListTeacher, deleteClass } from "../../services/class";
import { useFaculty } from "../../hook/useFaculty";
import "./style.scss";
import { useNavigate } from "react-router-dom";

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
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);

  const navigate = useNavigate();
  const { faculty } = useFaculty();

  // data all classes
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
  }, [
    searchTerm,
    selectedFaculty,
    selectedTeacher,
    selectedAcademicYear,
    selectedSemester,
    classes,
  ]);

  // Filter teachers by selected faculty
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

  // Filter classes
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

    if (selectedAcademicYear) {
      filtered = filtered.filter(
        (classItem) => classItem.academic_year_name === selectedAcademicYear
      );
    }

    if (selectedSemester) {
      filtered = filtered.filter(
        (classItem) => classItem.semester_name === selectedSemester
      );
    }

    setFilteredClasses(filtered);
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

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedFaculty(null);
    setSelectedTeacher(null);
    setSelectedAcademicYear(null);
    setSelectedSemester(null);
  };

  if (loading) return <Spin size="large" />;
  if (error) return <Alert message={error} type="error" />;

  // console.log(classes);
  console.log(filteredClasses);
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
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
          prefix={<SearchOutlined />}
          className="search-input"
        />
        <Select
          placeholder="Select Faculty"
          onChange={(value) => setSelectedFaculty(value)}
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
            onChange={(value) => setSelectedTeacher(value)}
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
        <Select
          placeholder="Select Academic Year"
          onChange={(value) => setSelectedAcademicYear(value)}
          value={selectedAcademicYear}
          className="academic-year-select"
        >
          {[
            ...new Set(
              classes.map((classItem) => classItem.academic_year_name)
            ),
          ].map((year) => (
            <Option key={year} value={year}>
              {year}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Select Semester"
          onChange={(value) => setSelectedSemester(value)}
          value={selectedSemester}
          className="semester-select"
        >
          {[
            ...new Set(classes.map((classItem) => classItem.semester_name)),
          ].map((semester) => (
            <Option key={semester} value={semester}>
              {semester}
            </Option>
          ))}
        </Select>
        <Button onClick={clearFilters} className="clear-filters-btn">
          Clear Filters
        </Button>
      </div>

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
                <Text>{classItem.faculty_name}</Text>
                <Text strong>Teacher:</Text>
                <Text>{classItem.teacher_name}</Text>
                <Text strong>Academic Year:</Text>
                <Text>{classItem.academic_year_name}</Text>
                <Text strong>Semester:</Text>
                <Text>{classItem.semester_name}</Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ClassList;
