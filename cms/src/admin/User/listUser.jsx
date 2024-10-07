import { useState, useEffect } from "react";
import { Table, Button } from "antd";
import { getUser } from "../../services/user";
import { useNavigate } from "react-router-dom";
import { useRole } from "../../hook/useRole";
import { useFaculty } from "../../hook/useFaculty";
import "./style.scss";
import { deleteUser } from "../../services/user";
import { Modal } from "antd";

const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { roles } = useRole();
  const { faculty } = useFaculty();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const getUsers = async () => {
    try {
      const response = await getUser();
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleCreateUser = () => {
    navigate("/create-user");
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const getRoleName = (roleId) => {
    const role = roles.find((role) => role.id === roleId);
    return role ? role.name : null;
  };

  const getFacultyName = (facultyId) => {
    const facultyName = faculty.find((faculty) => faculty.id === facultyId);
    return facultyName ? facultyName.name : null;
  };

  const showDeleteConfirm = (id) => {
    setSelectedUserId(id);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    if (selectedUserId) {
      await handleDeleteUser(selectedUserId);
      setIsModalVisible(false);
      setSelectedUserId(null);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedUserId(null);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role_id",
      key: "role",
      render: (roleId) => getRoleName(roleId),
    },
    {
      title: "Faculty",
      dataIndex: "faculty_id",
      key: "faculty",
      render: (facultyId) => getFacultyName(facultyId),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div>
          <Button
            type="link"
            onClick={() => navigate(`/edit-user/${record.id}`)}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            onClick={() => showDeleteConfirm(record.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="list-user">
      <div className="header-list">
        <div className="title-list">List User</div>
        <Button type="primary" onClick={handleCreateUser}>
          Create User
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="id"
        style={{ flex: 1 }}
        scroll={{ y: "calc(100vh - 200px)" }}
      />

      <div>
        <>
          <Modal
            title="Confirm Delete"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Yes"
            cancelText="No"
          >
            <p>Are you sure you want to delete this user?</p>
          </Modal>
        </>
      </div>
    </div>
  );
};

export default ListUser;
