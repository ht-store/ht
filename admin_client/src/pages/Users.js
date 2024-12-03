import React, { useState, useEffect } from "react";
import ReusableTable from "../components/ReusableTable";
import UserDetailModal from "../components/UserDetailModal";
import AddUserForm from "../components/AddUserForm";
import axios from "axios";
import UpdateUserForm from "../components/UpdateUserForm";
const Users = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8001/users");
        setUsers(response.data.data);
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleViewDetails = (id) => {
    const user = users.find((user) => user.id === id);
    setSelectedUser(user);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedUser(null);
  };

  const handleUpdateUser = (id) => {
    const user = users.find((user) => user.id === id);
    setSelectedUser(user);
    setOpenUpdateModal(true);
  };

  const handleUpdateSubmit = async (updatedData) => {
    const { email, name, password, roleId, phoneNumber } = updatedData;
    const newData = { email, name, password, roleId, phoneNumber };
    try {
      const response = await axios.put(
        `http://localhost:8001/users/${selectedUser.id}`,
        newData
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id ? { ...user, ...updatedData } : user
        )
      );
    } catch (error) {
      console.error("Failed to update user:", error);
      setError("Failed to update user");
    } finally {
      setOpenUpdateModal(false);
      setSelectedUser(null);
    }
  };

  const handleAddClick = () => {
    setOpenAddModal(true);
  };

  const handleAddUser = async (formData) => {
    try {
      const response = await axios.post(
        "http://localhost:8001/users",
        formData
      );
      setUsers((prevUsers) => [...prevUsers, response.data]);
    } catch (error) {
      console.error("Failed to add user:", error);
      setError("Failed to add user");
    } finally {
      setOpenAddModal(false);
    }
  };

  const handleDelete = async (rowsDeleted) => {
    const indexes = rowsDeleted.data.map((d) => d.dataIndex);
    const idsToDelete = indexes.map((index) => users[index].id);
    try {
      await axios.delete(`http://localhost:8001/users/${idsToDelete[0]}`);
      const updatedUsers = users.filter((_, index) => !indexes.includes(index));
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Failed to delete users:", error);
      setError("Failed to delete users");
    }
  };

  const columns = [
    { name: "id", label: "ID" },
    { name: "name", label: "Name" },
    { name: "email", label: "Email" },
    { name: "phoneNumber", label: "PhoneNumber" },
    { name: "roleId", label: "Role" },
    {
      name: "actions",
      label: "Actions",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          const id = tableMeta.rowData[0];
          return (
            <div className="flex space-x-2">
              <button
                onClick={() => handleViewDetails(id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                View Details
              </button>
              <button
                onClick={() => handleUpdateUser(id)}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Update
              </button>
            </div>
          );
        },
      },
    },
  ];

  const options = {
    filter: true,
    selectableRows: "none",
    responsive: "standard",
    download: true,
    print: true,
    pagination: true,
    onRowsDelete: handleDelete,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl">User Management</h1>
      </div>

      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <ReusableTable
          title="User List"
          columns={columns}
          data={users || []}
          options={options}
        />
      )}

      {selectedUser && (
        <UserDetailModal
          open={openModal}
          onClose={handleCloseModal}
          user={selectedUser}
        />
      )}

      {openAddModal && (
        <AddUserForm
          onSubmit={handleAddUser}
          onClose={() => setOpenAddModal(false)}
        />
      )}

      {openUpdateModal && selectedUser && (
        <UpdateUserForm
          initialData={selectedUser}
          onSubmit={handleUpdateSubmit}
          onClose={() => {
            setOpenUpdateModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
};

export default Users;
