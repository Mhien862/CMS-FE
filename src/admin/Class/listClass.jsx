import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Spin,
  Alert,
  Button,
  Dropdown,
  Menu,
  Input,
  Select,
  Space,
} from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { getAllClass, getListTeacher } from "../../services/class";
import { useFaculty } from "../../hook/useFaculty";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import { deleteClass } from "../../services/class";
import { Modal } from "antd";
const { confirm } = Modal;
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
    // Lọc danh sách giảng viên khi khoa được chọn
    if (selectedFaculty) {
      const filtered = teachers.filter(
        (teacher) => teacher.faculty_id === selectedFaculty
      );
      setFilteredTeachers(filtered);
    } else {
      setFilteredTeachers([]); // Khi chưa chọn khoa, giảng viên không được hiển thị
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
    setSelectedTeacher(null); // Reset selected teacher khi thay đổi khoa
  };

  const handleTeacherChange = (value) => {
    setSelectedTeacher(value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedFaculty(null);
    setSelectedTeacher(null);
  };

  const menu = (classId) => (
    <Menu>
      <Menu.Item key="edit" onClick={() => handleEditClass(classId)}>
        Edit
      </Menu.Item>
      <Menu.Item key="delete" onClick={() => showDeleteConfirm(classId)}>
        Delete
      </Menu.Item>
    </Menu>
  );

  if (loading) return <Spin size="large" />;
  if (error) return <Alert message={error} type="error" />;

  return (
    <div className="list-class" style={{ padding: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>All Classes</h1>
        <Button type="primary" onClick={handleCreateClass}>
          Create Class
        </Button>
      </div>

      <Space style={{ marginBottom: "16px" }} size="middle">
        <Search
          placeholder="Search classes"
          onChange={handleSearch}
          value={searchTerm}
          style={{ width: 200 }}
        />
        <Select
          style={{ width: 200 }}
          placeholder="Select Faculty"
          onChange={handleFacultyChange}
          value={selectedFaculty}
        >
          {faculty.map((f) => (
            <Option key={f.id} value={f.id}>
              {f.name}
            </Option>
          ))}
        </Select>
        {selectedFaculty && (
          <Select
            style={{ width: 200 }}
            placeholder="Select Teacher"
            onChange={handleTeacherChange}
            value={selectedTeacher}
          >
            {filteredTeachers.map((t) => (
              <Option key={t.id} value={t.id}>
                {t.username}
              </Option>
            ))}
          </Select>
        )}
        <Button onClick={clearFilters}>Clear Filters</Button>
      </Space>

      <Row gutter={[16, 16]}>
        {filteredClasses.map((classItem) => (
          <Col xs={24} sm={12} md={8} lg={6} key={classItem.id}>
            <Card
              hoverable
              title={classItem.name}
              extra={
                <Dropdown overlay={menu(classItem.id)} trigger={["click"]}>
                  <a onClick={(e) => e.preventDefault()}>
                    <EllipsisOutlined style={{ fontSize: "20px" }} />
                  </a>
                </Dropdown>
              }
              style={{ height: "100%" }}
            >
              <p>
                <strong>Faculty: </strong>
                {getFacultyName(classItem.faculty_id)}
              </p>
              <p>
                <strong>Teacher Name: </strong>
                {getTeacherName(classItem.teacher_id)}
              </p>
              <p>
                <strong>Class ID: </strong> {classItem.id}
              </p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ClassList;
