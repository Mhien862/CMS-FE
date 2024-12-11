import { useState, useMemo } from "react";
import { Form, Select, Input, Button, notification, message } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { createAcademicYear } from "../../services/academicYearService";
import "./style.scss";

const CreateAcademicYear = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedStartYear, setSelectedStartYear] = useState(null);

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => ({
      value: currentYear + i,
      label: (currentYear + i).toString(),
    }));
  }, []);

  const endYearOptions = useMemo(() => {
    if (!selectedStartYear) return [];
    return yearOptions.filter((option) => option.value > selectedStartYear);
  }, [selectedStartYear, yearOptions]);

  const handleStartYearChange = (value) => {
    setSelectedStartYear(value);
    form.setFieldsValue({
      end_year: null,
      name: null,
    });
  };

  const handleEndYearChange = (value) => {
    const startYear = form.getFieldValue("start_year");
    if (startYear) {
      form.setFieldsValue({
        name: `${startYear}-${value}`,
      });
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await createAcademicYear(values);
      message.success({
        content: "Academic year created successfully!",
        placement: "topRight",
        style: {
          marginTop: "20px",
        },
      });
      form.resetFields();
      setSelectedStartYear(null);
    } catch {
      message.error({
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
              rules={[
                { required: true, message: "Please select end year!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("start_year") < value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("End year must be after start year!")
                    );
                  },
                }),
              ]}
            >
              <Select
                placeholder="Select end year"
                options={endYearOptions}
                disabled={!selectedStartYear}
                onChange={handleEndYearChange}
              />
            </Form.Item>
          </div>

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
