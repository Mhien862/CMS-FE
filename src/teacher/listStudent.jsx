import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Card,
  Typography,
  Spin,
  notification,
  Empty,
  Input,
  Space,
  Tag,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
  getStudentsInClass,
  getStudentsGradesInClass,
} from "../services/class";

const { Title } = Typography;

// StudentList Component
// StudentList Component trong ClassPage
const StudentList = ({ classId }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await getStudentsGradesInClass(classId);
        setStudents(response.data || []);
      } catch (error) {
        notification.error({
          message: "Failed to fetch students",
          description: error.message || "Failed to load student list",
        });
      } finally {
        setLoading(false);
      }
    };

    if (classId) {
      fetchStudents();
    }
  }, [classId]);

  const filteredStudents = students.filter(
    (student) =>
      student.username.toLowerCase().includes(searchText.toLowerCase()) ||
      student.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Student Name",
      dataIndex: "username",
      key: "username",
      className: "text-left p-4",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      className: "text-left p-4",
    },
    {
      title: "Assignments",
      key: "assignments",
      className: "text-left p-4",
      render: (_, record) => {
        if (!record.assignments?.length) {
          return <Tag>No assignments</Tag>;
        }
        return (
          <Space>
            <Tag color="processing">{record.assignments.length} submitted</Tag>
            {record.assignments.some((a) => a.grade) && (
              <Tag color="success">
                {record.assignments.filter((a) => a.grade).length} graded
              </Tag>
            )}
          </Space>
        );
      },
    },
    {
      title: "Average Grade",
      dataIndex: "average_grade",
      key: "average_grade",
      className: "text-left p-4",
      render: (grade) => {
        if (!grade) return <Tag>No grade</Tag>;
        return (
          <Tag
            color={grade >= 7 ? "success" : grade >= 5 ? "warning" : "error"}
          >
            {grade}
          </Tag>
        );
      },
    },
    {
      title: "Joined Date",
      dataIndex: "joined_at",
      key: "joined_at",
      className: "text-left p-4",
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Title level={4}>Class Students</Title>
        <Input
          placeholder="Search students..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 250 }}
          allowClear
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Spin size="large" />
        </div>
      ) : (
        <Card className="w-full">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  {columns.map((column) => (
                    <th key={column.key} className={column.className}>
                      {column.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr
                    key={student.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    {columns.map((column) => (
                      <td
                        key={`${student.id}-${column.key}`}
                        className={column.className}
                      >
                        {column.render
                          ? column.render(student[column.dataIndex], student)
                          : student[column.dataIndex]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredStudents.length === 0 && (
              <div className="text-center p-8 text-gray-500">
                {searchText
                  ? "No students found matching your search"
                  : "No students enrolled in this class yet"}
              </div>
            )}
          </div>
          {filteredStudents.length > 0 && (
            <div className="p-4 border-t text-right text-gray-600">
              Total students: {filteredStudents.length}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default StudentList;
