import { useState, useEffect } from "react";
import { Form, Input, Button, Select, notification, Spin } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { getClassById, getListTeacher } from "../../services/class";
import { useFaculty } from "../../hook/useFaculty";
import { updateClass } from "../../services/class";

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
      });
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

  useEffect(() => {
    fetchClassData();
    fetchTeachers();
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

  if (loadingClass || loadingTeachers || loadingFaculty) {
    return <Spin size="large" />;
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
    <Form
      form={form}
      name="editClass"
      layout="vertical"
      style={{ maxWidth: 600, margin: "auto", height: "100vh" }}
      onFinish={handleFormSubmit}
    >
      <Form.Item
        name="name"
        label="Class Name"
        rules={[{ required: true, message: "Please input the class name!" }]}
      >
        <Input />
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
            <Option key={facultyItem.id} value={facultyItem.id}>
              {facultyItem.name}
            </Option>
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
            <Option key={teacher.id} value={teacher.id}>
              {teacher.username}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: true, message: "Please input the password!" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item style={{ textAlign: "center" }}>
        <Button block type="primary" htmlType="submit">
          Update Class
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditClassForm;
