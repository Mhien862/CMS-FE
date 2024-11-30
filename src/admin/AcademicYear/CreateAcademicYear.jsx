import { useState, useMemo } from "react";
import { Form, Select, Input, Button, notification } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { createAcademicYear } from "../../services/academicYearService";
import "./style.scss";

const CreateAcademicYear = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => ({
      value: currentYear + i,
      label: (currentYear + i).toString(),
    }));
  }, []);

  const handleStartYearChange = (value) => {
    const endYear = value + 1;
    form.setFieldsValue({
      end_year: endYear,
      name: ` ${value}-${endYear}`,
    });
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await createAcademicYear(values);
      notification.success({
        content: "Academic year created successfully!",
        style: {
          marginTop: "20px",
        },
      });
      form.resetFields();
    } catch {
      notification.error({
        content: "Failed to create academic year",
        style: {
          marginTop: "20px",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-academic-year-container">
      <div className="form-card">
        <div className="form-title">
          <h2>Create Academic Year</h2>
          <p>Set up a new academic year for your institution</p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            label="Academic Year Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input the academic year name!",
              },
            ]}
          >
            <Input placeholder="e.g., Academic Year 2024-2025" />
          </Form.Item>

          <div className="year-selects">
            <Form.Item
              label="Start Year"
              name="start_year"
              rules={[{ required: true, message: "Please select start year!" }]}
            >
              <Select
                placeholder="Select start year"
                options={yearOptions}
                onChange={handleStartYearChange}
              />
            </Form.Item>

            <Form.Item
              label="End Year"
              name="end_year"
              rules={[{ required: true, message: "Please select end year!" }]}
            >
              <Select
                placeholder="Select end year"
                options={yearOptions}
                disabled
              />
            </Form.Item>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            className="submit-button"
            loading={loading}
            icon={<CalendarOutlined />}
          >
            Create Academic Year
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default CreateAcademicYear;
