import { useState, useEffect} from "react";
import "../styles/userMngAdmin.css";
import axios from "axios";

function UserMngAdmin() {

    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);

    useEffect(() => {
         getUsers();
         getRoles();
    }, []);

    const getUsers = async() => {
        try{

            const response = await axios.get(
                "http://localhost:5000/api/user/getusers"
            ); 
            
            const users = response.data.map((user) => ({
                ...user,
                id: user._id,
                password: "",
                passwordDisplay: "Password"
            }));

            setUsers(users);

        }catch(error){
            console.log(error);
            
        }
    }

    const getRoles = async() => {

        try{

            const response = await axios.get(
                "http://localhost:5000/api/roles/getroles"
            );

            setRoles(response.data);

        }catch(error){
            console.log(error);
            
        }
    };

    const [editingUser, setEditingUser] = useState(null);

    const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(search.toLowerCase()) ||
        user.role.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:5000/api/user/${id}`);

            setUsers((prevUsers) =>
                prevUsers.filter((user) => (user._id || user.id) !== id)
            );

            if (editingUser && (editingUser._id || editingUser.id) === id) {
                setEditingUser(null);
            }

            alert("User deleted successfully.");
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to delete user.";
            alert(message);
            console.error(error);
        }
    };

    const handleEdit = (user) => {
        setEditingUser({ ...user, password: "" });
    };

    const handleUpdateChange = (e) => {

        const { name, value } = e.target;

        setEditingUser((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdate = async () => {

        if (!editingUser) return;

        try {
            const payload = {
                username: editingUser.username,
                role: editingUser.role
            };

            if (editingUser.password && editingUser.password.trim()) {
                payload.password = editingUser.password;
            }

            const response = await axios.put(
                `http://localhost:5000/api/user/${editingUser._id || editingUser.id}`,
                payload
            );

            const updatedUser = response.data.user;

            setUsers((prevUsers) =>
                prevUsers.map((user) => {
                    const currentId = user._id || user.id;
                    const nextId = updatedUser._id || updatedUser.id;

                    if (currentId === nextId) {
                        return {
                            ...updatedUser,
                            id: nextId,
                            password: "",
                            passwordDisplay: "Password"
                        };
                    }

                    return user;
                })
            );

            setEditingUser(null);
            alert("User updated successfully.");
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to update user.";
            alert(message);
            console.error(error);
        }
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
    };

    return (
        <section className="user-management-page">

            <div className="user-management-header">

                <div>
                    <h1>User Management</h1>
                    <p>
                        Manage system users, roles and account details.
                    </p>
                </div>

                <div className="user-count">
                    <span>{users.length}</span>
                    <small>Total Users</small>
                </div>

            </div>


            {/* Search */}
            <div className="user-search-section">

                <input
                    type="text"
                    placeholder="Search by username or role..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <span>
                    {filteredUsers.length} user
                    {filteredUsers.length !== 1 ? "s" : ""} found
                </span>

            </div>


            {/* Users Table */}
            <div className="users-table-container">

                <table className="users-table">

                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Password</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {filteredUsers.length > 0 ? (

                            filteredUsers.map((user) => (

                                <tr key={user._id || user.id}>

                                    <td>
                                        <div className="username-cell">
                                            <div className="user-avatar">
                                                {user.username
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                            <span>
                                                {user.username}
                                            </span>
                                        </div>
                                    </td>

                                    <td>
                                        <span className="password-cell">
                                            {user.passwordDisplay || "Password"}
                                        </span>
                                    </td>

                                    <td>
                                        <span
                                            className={`role-badge role-${user.role}`}
                                        >
                                            {user.role}
                                        </span>
                                    </td>

                                    <td>

                                        <div className="action-buttons">

                                            <button
                                                className="edit-user-btn"
                                                onClick={() =>
                                                    handleEdit(user)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-user-btn"
                                                onClick={() =>
                                                    handleDelete(user.id)
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>
                                <td
                                    colSpan="4"
                                    className="no-users"
                                >
                                    No users found.
                                </td>
                            </tr>

                        )}

                    </tbody>

                </table>

            </div>


            {/* Edit User Modal */}
            {editingUser && (

                <div className="edit-modal-overlay">

                    <div className="edit-user-modal">

                        <div className="modal-header">

                            <div>
                                <h2>Edit User</h2>
                                <p>
                                    Update the user's account details.
                                </p>
                            </div>

                            <button
                                className="close-modal-btn"
                                onClick={handleCancelEdit}
                            >
                                ×
                            </button>

                        </div>


                        <div className="edit-form">

                            <div className="edit-field">

                                <label>
                                    Username
                                </label>

                                <input
                                    type="text"
                                    name="username"
                                    value={editingUser.username}
                                    onChange={handleUpdateChange}
                                />

                            </div>


                            <div className="edit-field">

                                <label>
                                    Password
                                </label>

                                <input
                                    type="text"
                                    name="password"
                                    value={editingUser.password}
                                    onChange={handleUpdateChange}
                                />

                            </div>


                            <div className="edit-field">

                                <label>
                                    Role
                                </label>

                                <select
                                    name="role"
                                    value={editingUser.role}
                                    onChange={handleUpdateChange}
                                >
                                    <option value="">
                                        Select Role
                                    </option>

                                    {roles.map((role) => (
                                        <option
                                            key={role._id}
                                            value={role.name}
                                        >
                                            {role.name}
                                        </option>
                                    ))}
                                </select>

                            </div>

                        </div>


                        <div className="modal-actions">

                            <button
                                className="cancel-btn"
                                onClick={handleCancelEdit}
                            >
                                Cancel
                            </button>

                            <button
                                className="save-user-btn"
                                onClick={handleUpdate}
                            >
                                Save Changes
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </section>
    );
}

export default UserMngAdmin;