import { useState, useEffect } from "react";
import { Form, Input, Button, Select, notification, Spin } from "antd";
import { EditOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { getClassById, getListTeacher } from "../../services/class";
import { useFaculty } from "../../hook/useFaculty";
import { updateClass } from "../../services/class";
import {
  getAcademicYears,
  getSemestersByYear,
} from "../../services/academicYearService";

const { Option } = Select;

const EditClassForm = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loadingClass, setLoadingClass] = useState(true);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [classData, setClassData] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const { faculty, loading: loadingFaculty } = useFaculty();

  const fetchClassData = async () => {
    try {
      const response = await getClassById(id);
      setClassData(response.data);

      form.setFieldsValue({
        name: response.data.name,
        faculty_id: response.data.faculty_id,
        teacher_id: response.data.teacher_id,
        password: response.data.password,
        academic_year_id: response.data.academic_year_id,
        semester_id: response.data.semester_id,
      });

      // data semesters by academic year
      if (response.data.academic_year_id) {
        fetchSemesters(response.data.academic_year_id);
      }
    } catch (error) {
      console.error("Error fetching class data:", error);
      notification.error({
        message: "Error",
        description: "Failed to fetch class data",
      });
    } finally {
      setLoadingClass(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await getListTeacher();
      setTeachers(response.data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      notification.error({
        message: "Error",
        description: "Failed to fetch teachers data",
      });
    } finally {
      setLoadingTeachers(false);
    }
  };

  const fetchAcademicYears = async () => {
    try {
      const response = await getAcademicYears();
      setAcademicYears(response.data);
    } catch (error) {
      console.error("Error fetching academic years:", error);
      notification.error({
        message: "Error",
        description: "Failed to fetch academic years",
      });
    }
  };

  const fetchSemesters = async (academicYearId) => {
    try {
      const response = await getSemestersByYear(academicYearId);
      setSemesters(response.data);
    } catch (error) {
      console.error("Error fetching semesters:", error);
      notification.error({
        message: "Error",
        description: "Failed to fetch semesters",
      });
    }
  };

  useEffect(() => {
    fetchClassData();
    fetchTeachers();
    fetchAcademicYears();
  }, [id]);

  useEffect(() => {
    if (classData && teachers.length > 0) {
      filterTeachers(classData.faculty_id, teachers);
    }
  }, [classData, teachers]);

  const filterTeachers = (facultyId, teacherList = teachers) => {
    const filtered = teacherList.filter(
      (teacher) => teacher.faculty_id === facultyId
    );
    setFilteredTeachers(filtered);
  };

  const handleFacultyChange = (facultyId) => {
    filterTeachers(facultyId);
    form.setFieldsValue({ teacher_id: undefined });
  };

  const handleAcademicYearChange = (academicYearId) => {
    fetchSemesters(academicYearId);
    form.setFieldsValue({ semester_id: undefined });
  };

  if (loadingClass || loadingTeachers || loadingFaculty) {
    return (
      <div className="edit-class-container">
        <div className="loading-state">
          <Spin size="large" />
          <p>Loading class information...</p>
        </div>
      </div>
    );
  }

  const handleFormSubmit = async (values) => {
    try {
      await updateClass(id, values);
      notification.success({
        message: "Success",
        description: "Class updated successfully",
      });
      navigate("/list-class");
    } catch (error) {
      console.error("Error updating class:", error);
      notification.error({
        message: "Error",
        description: "Failed to update class",
      });
    }
  };

  return (
    <div className="edit-class-container">
      <Button
        className="back-button"
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
      />
      <div className="form-card">
        <div className="form-title">
          <h2>Edit Class</h2>
          <p>Update class information and assignments</p>
        </div>

        <Form
          form={form}
          name="editClass"
          layout="vertical"
          onFinish={handleFormSubmit}
          requiredMark={false}
        >
          <Form.Item
            name="name"
            label="Class Name"
            rules={[
              { required: true, message: "Please input the class name!" },
            ]}
          >
            <Input placeholder="Enter class name" />
          </Form.Item>

          <Form.Item
            name="faculty_id"
            label="Faculty"
            rules={[{ required: true, message: "Please select a faculty!" }]}
          >
            <Select
              loading={loadingFaculty}
              placeholder="Select a faculty"
              onChange={handleFacultyChange}
            >
              {faculty.map((facultyItem) => (
                <Select.Option key={facultyItem.id} value={facultyItem.id}>
                  {facultyItem.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="teacher_id"
            label="Teacher"
            rules={[{ required: true, message: "Please select a teacher!" }]}
          >
            <Select loading={loadingTeachers} placeholder="Select a teacher">
              {filteredTeachers.map((teacher) => (
                <Select.Option key={teacher.id} value={teacher.id}>
                  {teacher.username}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="academic_year_id"
            label="Academic Year"
            rules={[
              { required: true, message: "Please select an academic year!" },
            ]}
          >
            <Select
              placeholder="Select Academic Year"
              onChange={handleAcademicYearChange}
            >
              {academicYears.map((year) => (
                <Select.Option key={year.id} value={year.id}>
                  {year.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="semester_id"
            label="Semester"
            rules={[{ required: true, message: "Please select a semester!" }]}
          >
            <Select placeholder="Select Semester">
              {semesters.map((semester) => (
                <Select.Option key={semester.id} value={semester.id}>
                  {semester.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="password"
            label="Class Code"
            rules={[
              { required: true, message: "Please input the class code!" },
            ]}
          >
            <Input.Password placeholder="Enter class code" />
          </Form.Item>

          <Button
            className="submit-button"
            type="primary"
            htmlType="submit"
            icon={<EditOutlined />}
          >
            Update Class
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default EditClassForm;
