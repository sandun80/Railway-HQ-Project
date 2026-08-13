import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/adminPortal.css";

function AdminPortal() {

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        role: "officer"
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [roles, setRoles] = useState([]);
    const [newRole, setNewRole] = useState("");
    const [editingRole, setEditingRole] = useState(null);

    const [departments, setDepartments] = useState([]);
    const [newDepartment, setNewDepartment] = useState("");
    const [editingDepartment, setEditingDepartment] = useState(null);

    useEffect(() => {
        getRoles();
        getDepartments();
        
    }, []);

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

    const handleCreateRole = async () => {

    if (!newRole.trim()) {
        alert("Enter a role name");
        return;
    }

    try {

        const response = await axios.post(
            "http://localhost:5000/api/roles/createrole",
            {
                name: newRole.trim().toLowerCase()
            }
        );

        alert(response.data.message);

        setNewRole("");

        getRoles();

    } catch (error) {

        console.error(error);

        alert(
            error.response?.data?.message ||
            "Failed to create role"
        );
    }
};

    const handleDeleteRole = async (roleId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this role?");

        if (!confirmDelete) return;

        try {
            const response = await axios.delete(`http://localhost:5000/api/roles/${roleId}`);
            alert(response.data.message);
            getRoles();

            if (formData.role === roles.find((role) => role._id === roleId)?.name) {
                setFormData((prev) => ({ ...prev, role: "officer" }));
            }
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to delete role");
        }
    };

    const handleEditRole = (role) => {
        setEditingRole({ ...role, name: role.name });
    };

    const handleUpdateRole = async () => {
        if (!editingRole) return;

        try {
            const response = await axios.put(
                `http://localhost:5000/api/roles/${editingRole._id}`,
                { name: editingRole.name.trim().toLowerCase() }
            );

            alert(response.data.message);
            setEditingRole(null);
            getRoles();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to update role");
        }
    };

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        try {

            const response = await axios.post(
                "http://localhost:5000/api/user/createuser",{

                    username: formData.username,
                    password: formData.password,
                    role: formData.role,

                });

            alert(response.data.message);

            // Clear form
            setFormData({
                username: "",
                password: "",
                role: "officer"
            });

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to create user"
            );
        }
    };

    const handleRoleInputChange = (e) => {
        setEditingRole((prev) => ({
            ...prev,
            name: e.target.value
        }));
    };

    const getDepartments = async () => {

        try{

            const response = await axios.get(
                "http://localhost:5000/api/departments/getdepartments"
            );

            setDepartments(response.data);

        }catch(error){
            console.log(error);
            
        }
    };

    const handleCreateDepartment = async () => {

        if (!newDepartment.trim()) {
            alert("Enter a department name");
            return;
        }

        try {

            const response = await axios.post(
                "http://localhost:5000/api/departments/createdepartment",
                {
                    name: newDepartment.trim()
                }
            );

            alert(response.data.message);

            setNewDepartment("");

            getDepartments();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to create department"
            );
        }
    };

    const handleDeleteDepartment = async (departmentId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this department?");

        if (!confirmDelete) return;

        try {
            const response = await axios.delete(`http://localhost:5000/api/departments/${departmentId}`);
            alert(response.data.message);
            getDepartments();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to delete department");
        }
    };

    const handleEditDepartment = (department) => {
        setEditingDepartment({ ...department, name: department.name });
    };

    const handleUpdateDepartment = async () => {
        if (!editingDepartment) return;

        try {
            const response = await axios.put(
                `http://localhost:5000/api/departments/${editingDepartment._id}`,
                { name: editingDepartment.name.trim() }
            );

            alert(response.data.message);
            setEditingDepartment(null);
            getDepartments();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to update department");
        }
    };

    const handleDepartmentInputChange = (e) => {
        setEditingDepartment((prev) => ({
            ...prev,
            name: e.target.value
        }));
    };

    return (
        <section>

            <h1>Admin Portal</h1>

            <h2>Create User</h2>

            {message && (
                <p>{message}</p>
            )}

            {error && (
                <p>{error}</p>
            )}

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Username</label>

                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Enter username"
                        required
                    />
                </div>

                <div>
                    <label>Password</label>

                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        required
                    />
                </div>

                <div>
                    <label>Create Role</label>

                    <div className="role-create-container">

                        <input
                            type="text"
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            placeholder="Enter new role"
                        />

                        <button
                            type="button"
                            onClick={handleCreateRole}
                        >
                            Add Role
                        </button>

                    </div>
                </div>

                <div>
                    <label>Create Department</label>

                    <div className="role-create-container">

                        <input
                            type="text"
                            value={newDepartment}
                            onChange={(e) => setNewDepartment(e.target.value)}
                            placeholder="Enter new department"
                        />

                        <button
                            type="button"
                            onClick={handleCreateDepartment}
                        >
                            Add Department
                        </button>

                    </div>
                </div>

                <div>
                    <label>Role</label>

                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
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

                <button type="submit">
                    Create User
                </button>

            </form>

            <div className="role-list-section">
                <h3>Manage Roles</h3>

                <div className="role-list">
                    {roles.map((role) => (
                        <div key={role._id} className="role-item">
                            <span>{role.name}</span>

                            <div className="role-actions">
                                <button
                                    type="button"
                                    className="edit-role-btn"
                                    onClick={() => handleEditRole(role)}
                                >
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    className="delete-role-btn"
                                    onClick={() => handleDeleteRole(role._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="role-list-section">
                <h3>Manage Departments</h3>

                <div className="role-list">
                    {departments.map((department) => (
                        <div key={department._id} className="role-item">
                            <span>{department.name}</span>

                            <div className="role-actions">
                                <button
                                    type="button"
                                    className="edit-role-btn"
                                    onClick={() => handleEditDepartment(department)}
                                >
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    className="delete-role-btn"
                                    onClick={() => handleDeleteDepartment(department._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {editingRole && (
                <div className="edit-role-modal">
                    <div className="edit-role-card">
                        <div className="modal-header">
                            <h3>Edit Role</h3>
                            <button type="button" className="close-modal-btn" onClick={() => setEditingRole(null)}>×</button>
                        </div>

                        <div className="edit-role-field">
                            <label>Role Name</label>
                            <input
                                type="text"
                                value={editingRole.name}
                                onChange={handleRoleInputChange}
                            />
                        </div>

                        <div className="modal-actions">
                            <button type="button" className="cancel-btn" onClick={() => setEditingRole(null)}>Cancel</button>
                            <button type="button" className="save-user-btn" onClick={handleUpdateRole}>Save</button>
                        </div>
                    </div>
                </div>
            )}

            {editingDepartment && (
                <div className="edit-role-modal">
                    <div className="edit-role-card">
                        <div className="modal-header">
                            <h3>Edit Department</h3>
                            <button type="button" className="close-modal-btn" onClick={() => setEditingDepartment(null)}>×</button>
                        </div>

                        <div className="edit-role-field">
                            <label>Department Name</label>
                            <input
                                type="text"
                                value={editingDepartment.name}
                                onChange={handleDepartmentInputChange}
                            />
                        </div>

                        <div className="modal-actions">
                            <button type="button" className="cancel-btn" onClick={() => setEditingDepartment(null)}>Cancel</button>
                            <button type="button" className="save-user-btn" onClick={handleUpdateDepartment}>Save</button>
                        </div>
                    </div>
                </div>
            )}

        </section>
    );
}

export default AdminPortal;