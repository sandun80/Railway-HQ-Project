import { useState } from "react";
import "../styles/userMngAdmin.css";

function UserMngAdmin() {

    const [search, setSearch] = useState("");

    const [users, setUsers] = useState([
        {
            id: 1,
            username: "Kasun",
            password: "kasun234",
            role: "officer"
        },
        {
            id: 2,
            username: "Nimal",
            password: "nimal123",
            role: "officer"
        },
        {
            id: 3,
            username: "Admin",
            password: "admin123",
            role: "admin"
        },
        {
            id: 4,
            username: "Viewer",
            password: "viewer123",
            role: "viewer"
        }
    ]);

    const [editingUser, setEditingUser] = useState(null);

    const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(search.toLowerCase()) ||
        user.role.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmDelete) return;

        setUsers((prevUsers) =>
            prevUsers.filter((user) => user.id !== id)
        );
    };

    const handleEdit = (user) => {
        setEditingUser({ ...user });
    };

    const handleUpdateChange = (e) => {

        const { name, value } = e.target;

        setEditingUser((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdate = () => {

        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === editingUser.id
                    ? editingUser
                    : user
            )
        );

        setEditingUser(null);
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

                                <tr key={user.id}>

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
                                            {user.password}
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

                                    <option value="admin">
                                        Admin
                                    </option>

                                    <option value="officer">
                                        Officer
                                    </option>

                                    <option value="viewer">
                                        Viewer
                                    </option>

                                    <option value="replyperson">
                                        Reply Person
                                    </option>

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