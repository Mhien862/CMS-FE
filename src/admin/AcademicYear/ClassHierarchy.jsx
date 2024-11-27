import React, { useState, useEffect } from "react";
import { Select, Spin, Typography, Alert, Tabs } from "antd";
import {
  BookOutlined,
  CalendarOutlined,
  TeamOutlined,
  PlusOutlined,
  UserOutlined,
  BuildOutlined,
} from "@ant-design/icons";
import {
  getAcademicYears,
  getSemestersByYear,
  getClassesBySemester,
} from "../../services/academicYearService";
import CreateAcademicYear from "./CreateAcademicYear";
import ManageSemesters from "./ManageSemesters";
import "./style.scss";

const { Option } = Select;
const { Title } = Typography;

const AcademicYearManagement = () => {
  const [activeTab, setActiveTab] = useState("hierarchy");
  const [academicYears, setAcademicYears] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAcademicYears();
  }, []);

  const fetchAcademicYears = async () => {
    setLoading(true);
    try {
      const response = await getAcademicYears();
      setAcademicYears(response.data);
    } catch {
      setError("Failed to fetch academic years");
    } finally {
      setLoading(false);
    }
  };

  const fetchSemesters = async (yearId) => {
    setLoading(true);
    try {
      const response = await getSemestersByYear(yearId);
      setSemesters(response.data);
      setClasses([]);
    } catch {
      setError("Failed to fetch semesters");
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async (semesterId) => {
    setLoading(true);
    try {
      const response = await getClassesBySemester(semesterId);
      setClasses(response.data);
    } catch {
      setError("Failed to fetch classes");
    } finally {
      setLoading(false);
    }
  };

  const handleYearChange = (value) => {
    setSelectedYear(value);
    setSelectedSemester(null);
    fetchSemesters(value);
  };

  const handleSemesterChange = (value) => {
    setSelectedSemester(value);
    fetchClasses(value);
  };

  const ClassHierarchy = () => (
    <div className="hierarchy-section">
      <div className="filters-section">
        <Title level={2}>Class Hierarchy</Title>
        <div className="selects-wrapper">
          <Select
            placeholder="Select Academic Year"
            onChange={handleYearChange}
            value={selectedYear}
            suffixIcon={<CalendarOutlined />}
          >
            {academicYears.map((year) => (
              <Option key={year.id} value={year.id}>
                {year.name}
              </Option>
            ))}
          </Select>

          <Select
            placeholder="Select Semester"
            onChange={handleSemesterChange}
            value={selectedSemester}
            disabled={!selectedYear}
            suffixIcon={<TeamOutlined />}
          >
            {semesters.map((semester) => (
              <Option key={semester.id} value={semester.id}>
                {semester.name}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      {selectedSemester ? (
        <div className="classes-grid">
          {classes.map((classItem) => (
            <div key={classItem.id} className="class-card">
              <div className="card-header">
                <h3>{classItem.name}</h3>
              </div>
              <div className="card-content">
                <div className="info-item">
                  <BuildOutlined />
                  <span className="label">Faculty:</span>
                  <span className="value">{classItem.faculty_name}</span>
                </div>
                <div className="info-item">
                  <UserOutlined />
                  <span className="label">Teacher:</span>
                  <span className="value">{classItem.teacher_name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <BookOutlined />
          <h3>No Classes Selected</h3>
          <p>
            Please select both an academic year and semester to view classes
          </p>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="academic-year-container">
        <div className="loading-state">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="academic-year-container">
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          className="error-alert"
        />
      </div>
    );
  }

  const items = [
    {
      key: "hierarchy",
      label: (
        <span>
          <BookOutlined />
          Class Hierarchy
        </span>
      ),
      children: <ClassHierarchy />,
    },
    {
      key: "createYear",
      label: (
        <span>
          <PlusOutlined />
          Create Academic Year
        </span>
      ),
      children: <CreateAcademicYear />,
    },
    {
      key: "manageSemesters",
      label: (
        <span>
          <CalendarOutlined />
          Manage Semesters
        </span>
      ),
      children: <ManageSemesters />,
    },
  ];

  return (
    <div className="academic-year-container">
      <div className="page-header">
        <h1>Academic Year Management</h1>
      </div>

      <div className="tabs-container">
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
      </div>
    </div>
  );
};

export default AcademicYearManagement;
