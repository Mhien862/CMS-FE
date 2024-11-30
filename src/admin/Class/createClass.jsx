import { useState, useEffect } from "react";
import { Form, Input, Button, Select, notification } from "antd";
import { BookOutlined } from "@ant-design/icons";
import { createClass, getListTeacher } from "../../services/class";
import {
  getAcademicYears,
  getSemestersByYear,
} from "../../services/academicYearService";
import { useFaculty } from "../../hook/useFaculty";
import { useNavigate } from "react-router-dom";
import "./style.scss";

const CreateClassForm = () => {
  const [form] = Form.useForm();
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const navigate = useNavigate();
  const { faculty, loading: loadingFaculty } = useFaculty();

  // data teachers
  const fetchTeachers = async () => {
    try {
      const response = await getListTeacher();
      setTeachers(response.data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    } finally {
      setLoadingTeachers(false);
    }
  };

  // data academic years
  const fetchAcademicYears = async () => {
    try {
      const response = await getAcademicYears();
      setAcademicYears(response.data || []);
    } catch (error) {
      console.error("Error fetching academic years:", error);
    }
  };

  // data semesters
  const fetchSemesters = async (academicYearId) => {
    try {
      const response = await getSemestersByYear(academicYearId);
      setSemesters(response.data || []);
    } catch (error) {
      console.error("Error fetching semesters:", error);
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchAcademicYears();
  }, []);

  const handleFacultyChange = (facultyId) => {
    setSelectedFaculty(facultyId);
    const filtered = teachers.filter(
      (teacher) => teacher.faculty_id === facultyId
    );
    setFilteredTeachers(filtered);
    form.setFieldsValue({ teacher_id: undefined });
  };

  const handleAcademicYearChange = (academicYearId) => {
    fetchSemesters(academicYearId);
    form.setFieldsValue({ semester_id: undefined });
  };

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      const result = await createClass(values);
      notification.success({
        message: "Success",
        description: result.message || "Class created successfully",
        placement: "topRight",
      });
      navigate("/list-class");
      form.resetFields();
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "Failed to create class",
        placement: "topRight",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-class-container">
      <div className="form-card">
        <div className="form-title">
          <h2>Create New Class</h2>
          <p>Set up a new class with faculty and teacher assignment</p>
        </div>

        <Form
          form={form}
          name="createClass"
          onFinish={onFinish}
          layout="vertical"
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
            <Select
              loading={loadingTeachers}
              placeholder={
                selectedFaculty
                  ? "Select a teacher"
                  : "Please select a faculty first"
              }
              disabled={!selectedFaculty}
            >
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
              placeholder="Select an academic year"
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
            <Select
              placeholder={
                semesters.length
                  ? "Select a semester"
                  : "Please select an academic year first"
              }
              disabled={!semesters.length}
            >
              {semesters.map((semester) => (
                <Select.Option key={semester.id} value={semester.id}>
                  {semester.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="password"
            label="Class Password"
            rules={[
              { required: true, message: "Please input the class password!" },
            ]}
          >
            <Input.Password placeholder="Enter class password" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            className="submit-button"
            loading={submitting}
            icon={<BookOutlined />}
          >
            Create Class
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default CreateClassForm;
