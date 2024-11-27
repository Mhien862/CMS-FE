import { useEffect, useState } from "react";
import { Form, Select, Button, Input, message, Spin } from "antd";
import { CalendarOutlined, PlusOutlined } from "@ant-design/icons";
import {
  getAcademicYears,
  createSemester,
} from "../../services/academicYearService";
import "./style.scss";

const ManageSemesters = () => {
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAcademicYears();
  }, []);

  const fetchAcademicYears = async () => {
    setLoading(true);
    try {
      const response = await getAcademicYears();
      if (response.data && Array.isArray(response.data)) {
        setAcademicYears(response.data);
      } else {
        throw new Error("Invalid data format");
      }
    } catch (error) {
      console.error("Error fetching academic years:", error);
      message.error({
        content: "Failed to fetch academic years",
        style: {
          borderRadius: "8px",
          marginTop: "20px",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      await createSemester(values);
      message.success({
        content: "Semester created successfully!",
        style: {
          borderRadius: "8px",
          marginTop: "20px",
        },
      });
      form.resetFields();
    } catch {
      message.error({
        content: "Failed to create semester",
        style: {
          borderRadius: "8px",
          marginTop: "20px",
        },
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="manage-semesters-container">
        <div className="form-card">
          <div className="loading-state">
            <Spin size="large" />
            <p>Loading academic years...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-semesters-container">
      <div className="form-card">
        <div className="form-title">
          <h2>Create Semester</h2>
          <p>Add a new semester to an existing academic year</p>
        </div>

        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
          validateTrigger="onBlur"
        >
          <Form.Item
            label="Semester Name"
            name="name"
            rules={[
              { required: true, message: "Please input the semester name!" },
              { max: 50, message: "Name cannot be longer than 50 characters" },
              {
                pattern: /^[a-zA-Z0-9\s-]+$/,
                message:
                  "Only letters, numbers, spaces and hyphens are allowed",
              },
            ]}
          >
            <Input
              prefix={<CalendarOutlined />}
              placeholder="e.g., Fall 2023"
            />
          </Form.Item>

          <Form.Item
            label="Academic Year"
            name="academic_year_id"
            rules={[
              { required: true, message: "Please select an academic year!" },
            ]}
          >
            <Select
              placeholder="Select an academic year"
              showSearch
              optionFilterProp="children"
            >
              {academicYears.map((year) => (
                <Select.Option key={year.id} value={year.id}>
                  {year.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            className="submit-button"
            loading={submitting}
            icon={<PlusOutlined />}
          >
            Create Semester
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ManageSemesters;
