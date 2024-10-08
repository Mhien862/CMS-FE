import { useState, useEffect } from "react";
import { Form, Input, Button, Select, notification } from "antd";
import { createClass, getListTeacher } from "../../services/class";
import { useFaculty } from "../../hook/useFaculty";
import { useNavigate } from "react-router-dom";

const CreateClassForm = () => {
  const [form] = Form.useForm();
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const navigate = useNavigate();
  const { faculty, loading: loadingFaculty } = useFaculty();

  // Gọi API lấy danh sách giáo viên
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

  // Sử dụng useEffect để gọi API lấy giáo viên khi component được mount
  useEffect(() => {
    fetchTeachers();
  }, []);

  // Khi Faculty thay đổi, lọc danh sách giáo viên dựa trên Faculty đã chọn
  const handleFacultyChange = (facultyId) => {
    setSelectedFaculty(facultyId);
    const filtered = teachers.filter(
      (teacher) => teacher.faculty_id === facultyId
    );
    setFilteredTeachers(filtered);
    form.setFieldsValue({ teacher_id: undefined }); // Reset teacher select khi đổi faculty
  };

  const onFinish = async (values) => {
    try {
      const result = await createClass(values);
      console.log("Class created:", result);
      notification.success({
        message: "Success",
        description: result.message || "Class created successfully",
      });
      navigate("/list-class");
      form.resetFields();
    } catch (error) {
      console.error("Error creating class:", error);
      notification.error({
        message: "Error",
        description:
          error.response?.data?.message ||
          "An error occurred while creating the class",
      });
    }
  };

  return (
    <Form
      form={form}
      name="createClass"
      onFinish={onFinish}
      layout="vertical"
      style={{ maxWidth: 600, margin: "auto", height: "100vh" }}
    >
      {/* Class Name Input */}
      <Form.Item
        name="name"
        label="Class Name"
        rules={[{ required: true, message: "Please input the class name!" }]}
      >
        <Input />
      </Form.Item>

      {/* Faculty Select (from useFaculty) */}
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

      {/* Teacher Select (Disabled until a faculty is selected) */}
      <Form.Item
        name="teacher_id"
        label="Teacher"
        rules={[{ required: true, message: "Please select a teacher!" }]}
      >
        <Select
          loading={loadingTeachers}
          placeholder="Select a teacher"
          disabled={!selectedFaculty}
        >
          {filteredTeachers.map((teacher) => (
            <Select.Option key={teacher.id} value={teacher.id}>
              {teacher.username}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {/* Password Input */}
      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: true, message: "Please input the password!" }]}
      >
        <Input.Password />
      </Form.Item>

      {/* Submit Button */}
      <Form.Item style={{ textAlign: "center" }}>
        <Button block type="primary" htmlType="submit">
          Create Class
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateClassForm;
