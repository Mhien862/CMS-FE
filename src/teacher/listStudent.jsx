import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Card, Table, Space, Typography, Spin, notification } from "antd";
import { getStudentsInClass } from "../services/class";

const { Title } = Typography;

const StudentList = ({ classId }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await getStudentsInClass(classId);
        setStudents(response.data);
      } catch (error) {
        notification.error({
          message: "Failed to fetch students",
          description:
            error.message || "An error occurred while fetching students",
        });
      } finally {
        setLoading(false);
      }
    };

    if (classId) {
      fetchStudents();
    }
  }, [classId]);

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
      title: "Joined Date",
      dataIndex: "joined_at",
      key: "joined_at",
      className: "text-left p-4",
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Card className="w-full mt-4">
      <div className="p-4">
        <Title className="text-xl font-bold mb-4">Class Students</Title>
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
              {students.map((student, index) => (
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
                        ? column.render(student[column.dataIndex])
                        : student[column.dataIndex]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {students.length === 0 && (
            <div className="text-center p-4 text-gray-500">
              No students enrolled in this class yet.
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
StudentList.propTypes = {
  classId: PropTypes.string.isRequired,
};

export default StudentList;
