import { useState, useEffect } from "react";
import { Table, Button, Dropdown, Menu, Modal, Input, Select } from "antd";
import { getUser, deleteUser, updateStatusUser } from "../../services/user";
import { useNavigate } from "react-router-dom";
import { useRole } from "../../hook/useRole";
import { useFaculty } from "../../hook/useFaculty";
import {
  IdcardOutlined,
  EditOutlined,
  DeleteOutlined,
  ApiOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import "./style.scss";

const { Search } = Input;
const { Option } = Select;

const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const navigate = useNavigate();
  const { roles } = useRole();
  const { faculty } = useFaculty();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const getUsers = async () => {
    try {
      const response = await getUser();
      setUsers(response.data);
      setFilteredUsers(response.data); // Set initial filtered users to full user list
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  // Handle search input change
  const handleSearch = (value) => {
    setSearchTerm(value);
    filterUsers(value, selectedRole, selectedFaculty);
  };

  // Handle role select change
  const handleRoleChange = (value) => {
    setSelectedRole(value);
    filterUsers(searchTerm, value, selectedFaculty);
  };

  // Handle faculty select change
  const handleFacultyChange = (value) => {
    setSelectedFaculty(value);
    filterUsers(searchTerm, selectedRole, value);
  };

  // Filter users based on search term, role, and faculty
  const filterUsers = (searchTerm, role, faculty) => {
    const filtered = users.filter((user) => {
      const matchesUsername = user.username
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesEmail = user.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesRole = role ? user.role_id === role : true;
      const matchesFaculty = faculty ? user.faculty_id === faculty : true;
      return (matchesUsername || matchesEmail) && matchesRole && matchesFaculty;
    });
    setFilteredUsers(filtered);
  };

  // Clear all filters and search
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedRole(null);
    setSelectedFaculty(null);
    setFilteredUsers(users); // Reset to full user list
  };

  const handleCreateUser = () => {
    navigate("/create-user");
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
      setFilteredUsers(filteredUsers.filter((user) => user.id !== id)); // Update filtered users too
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

  const menu = (record) => (
    <Menu>
      <Menu.Item
        key="edit"
        icon={<EditOutlined />}
        onClick={() => navigate(`/edit-user/${record.id}`)}
      >
        Edit
      </Menu.Item>
      <Menu.Item
        key="delete"
        icon={<DeleteOutlined />}
        danger
        onClick={() => showDeleteConfirm(record.id)}
      >
        Delete
      </Menu.Item>
      <Menu.Item
        key="deactivate"
        icon={<ApiOutlined />}
        onClick={() => showStatusConfirm(record)}
      >
        {record.is_active ? "Deactivate" : "Activate"}
      </Menu.Item>
    </Menu>
  );

  const showStatusConfirm = (record) => {
    const statusAction = record.is_active ? "deactivate" : "activate";
    const newStatus = !record.is_active;

    Modal.confirm({
      title: `Are you sure you want to ${statusAction} this user?`,
      content: `The user is currently ${
        record.is_active ? "active" : "inactive"
      }.`,
      okText: "Yes",
      cancelText: "No",
      onOk: () => handleUpdateStatusUser(record.id, newStatus),
    });
  };

  const handleUpdateStatusUser = async (id, newStatus) => {
    try {
      await updateStatusUser(id, { is_active: newStatus });
      getUsers(); // Refresh the user list after updating the status
    } catch (error) {
      console.error("Error updating user status:", error);
    }
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
      title: "Status",
      dataIndex: "is_active",
      key: "status",
      render: (isActive) => (
        <span style={{ color: isActive ? "green" : "red" }}>
          {isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      title: "Faculty",
      dataIndex: "faculty_id",
      key: "faculty",
      render: (facultyId) => getFacultyName(facultyId),
    },
    {
      title: "",
      key: "actions",
      render: (text, record) => (
        <Dropdown overlay={menu(record)} trigger={["click"]}>
          <Button type="link" icon={<IdcardOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="list-user">
      <div className="header-list">
        <div className="title-list">List User</div>
        <Button
          icon={<PlusOutlined />}
          type="primary"
          onClick={handleCreateUser}
        >
          Create User
        </Button>
      </div>
      {/* Search Bar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <Search
          placeholder="Search by username or email"
          onChange={(e) => handleSearch(e.target.value)} // Call handleSearch on input change
          value={searchTerm} // Set the value of input to searchTerm state
          style={{ width: 300 }}
        />
        {/* Select for Role */}
        <Select
          placeholder="Select Role"
          onChange={handleRoleChange}
          style={{ width: 150 }}
          value={selectedRole} // Set the value of select to selectedRole state
          allowClear
        >
          {roles.map((role) => (
            <Option key={role.id} value={role.id}>
              {role.name}
            </Option>
          ))}
        </Select>
        {/* Select for Faculty */}
        <Select
          placeholder="Select Faculty"
          onChange={handleFacultyChange}
          style={{ width: 150 }}
          value={selectedFaculty} // Set the value of select to selectedFaculty state
          allowClear
        >
          {faculty.map((fac) => (
            <Option key={fac.id} value={fac.id}>
              {fac.name}
            </Option>
          ))}
        </Select>
        {/* Clear Filters Button */}
        <Button onClick={handleClearFilters} type="default">
          Clear Filters
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={filteredUsers} // Use filteredUsers instead of users
        loading={loading}
        rowKey="id"
        style={{ flex: 1 }}
      />

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
    </div>
  );
};

export default ListUser;
