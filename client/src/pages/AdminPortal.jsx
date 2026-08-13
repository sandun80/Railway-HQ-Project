import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "../styles/adminPortal.css";

function AdminPortal() {
    const { t } = useTranslation();

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

    const getRoles = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/roles/getroles");
            setRoles(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateRole = async () => {
        if (!newRole.trim()) {
            alert("Enter a role name");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/api/roles/createrole", {
                name: newRole.trim().toLowerCase()
            });
            alert(response.data.message);
            setNewRole("");
            getRoles();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to create role");
        }
    };

    const handleDeleteRole = async (roleId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this role?");
        if (!confirmDelete) return;

        try {
            const response = await axios.delete(`http://localhost:5000/api/roles/${roleId}`);
            alert(response.data.message);
            getRoles();
            if (formData.role === roles.find((r) => r._id === roleId)?.name) {
                setFormData((prev) => ({ ...prev, role: "officer" }));
            }
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to delete role");
        }
    };

    const handleEditRole = (role) => {
        setEditingRole({ ...role, name: role.name });
    };

    const handleUpdateRole = async () => {
        if (!editingRole) return;
        try {
            const response = await axios.put(`http://localhost:5000/api/roles/${editingRole._id}`, {
                name: editingRole.name.trim().toLowerCase()
            });
            alert(response.data.message);
            setEditingRole(null);
            getRoles();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to update role");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const response = await axios.post("http://localhost:5000/api/user/createuser", {
                username: formData.username,
                password: formData.password,
                role: formData.role
            });

            alert(response.data.message);
            setFormData({ username: "", password: "", role: "officer" });
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to create user");
        }
    };

    const handleRoleInputChange = (e) => {
        setEditingRole((prev) => ({ ...prev, name: e.target.value }));
    };

    const getDepartments = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/departments/getdepartments");
            setDepartments(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateDepartment = async () => {
        if (!newDepartment.trim()) {
            alert("Enter a department name");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/api/departments/createdepartment", {
                name: newDepartment.trim()
            });
            alert(response.data.message);
            setNewDepartment("");
            getDepartments();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to create department");
        }
    };

    const handleDeleteDepartment = async (departmentId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this department?");
        if (!confirmDelete) return;

        try {
            const response = await axios.delete(`http://localhost:5000/api/departments/${departmentId}`);
            alert(response.data.message);
            getDepartments();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to delete department");
        }
    };

    const handleEditDepartment = (department) => {
        setEditingDepartment({ ...department, name: department.name });
    };

    const handleUpdateDepartment = async () => {
        if (!editingDepartment) return;

        try {
            const response = await axios.put(`http://localhost:5000/api/departments/${editingDepartment._id}`, {
                name: editingDepartment.name.trim()
            });
            alert(response.data.message);
            setEditingDepartment(null);
            getDepartments();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to update department");
        }
    };

    const handleDepartmentInputChange = (e) => {
        setEditingDepartment((prev) => ({ ...prev, name: e.target.value }));
    };

    return (
        <div className="admin-portal-container">
            {/* Header */}
            <div className="admin-portal-header">
                <div>
                    <h1>{t("adminPortal.title")}</h1>
                    <p>Configure system users, roles, and department structures</p>
                </div>
            </div>

            {/* Main Action Cards Grid */}
            <div className="admin-grid-two">
                {/* Create User Card */}
                <div className="admin-card">
                    <h3>{t("adminPortal.createUser")}</h3>

                    {message && <div className="admin-alert success">{message}</div>}
                    {error && <div className="admin-alert error">{error}</div>}

                    <form onSubmit={handleSubmit} className="admin-form">
                        <div className="admin-field-group">
                            <label>{t("adminPortal.username")}</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder={t("adminPortal.usernamePlaceholder")}
                                required
                            />
                        </div>

                        <div className="admin-field-group">
                            <label>{t("adminPortal.password")}</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder={t("adminPortal.passwordPlaceholder")}
                                required
                            />
                        </div>

                        <div className="admin-field-group">
                            <label>{t("adminPortal.role")}</label>
                            <select name="role" value={formData.role} onChange={handleChange} required>
                                <option value="">{t("adminPortal.selectRole")}</option>
                                {roles.map((r) => (
                                    <option key={r._id} value={r.name}>
                                        {r.name.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button type="submit" className="admin-btn-primary">
                            {t("adminPortal.createUserBtn")}
                        </button>
                    </form>
                </div>

                {/* Quick Add Roles & Departments Card */}
                <div className="admin-card">
                    <h3>Quick Configuration</h3>

                    <div className="admin-quick-section">
                        <label>{t("adminPortal.createRole")}</label>
                        <div className="admin-inline-group">
                            <input
                                type="text"
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value)}
                                placeholder={t("adminPortal.enterNewRole")}
                            />
                            <button type="button" className="admin-btn-accent" onClick={handleCreateRole}>
                                {t("adminPortal.addRole")}
                            </button>
                        </div>
                    </div>

                    <div className="admin-quick-section" style={{ marginTop: "24px" }}>
                        <label>{t("adminPortal.createDepartment")}</label>
                        <div className="admin-inline-group">
                            <input
                                type="text"
                                value={newDepartment}
                                onChange={(e) => setNewDepartment(e.target.value)}
                                placeholder={t("adminPortal.enterNewDepartment")}
                            />
                            <button type="button" className="admin-btn-accent" onClick={handleCreateDepartment}>
                                {t("adminPortal.addDepartment")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Management Cards Grid */}
            <div className="admin-grid-two" style={{ marginTop: "28px" }}>
                {/* Manage Roles Card */}
                <div className="admin-card">
                    <div className="card-header-bar">
                        <h3>{t("adminPortal.manageRoles")}</h3>
                        <span className="count-badge">{roles.length} Roles</span>
                    </div>

                    <div className="role-list">
                        {roles.map((r) => (
                            <div key={r._id} className="role-item">
                                <span className="role-name">{r.name}</span>
                                <div className="role-actions">
                                    <button type="button" className="edit-role-btn" onClick={() => handleEditRole(r)}>
                                        {t("common.edit")}
                                    </button>
                                    <button type="button" className="delete-role-btn" onClick={() => handleDeleteRole(r._id)}>
                                        {t("common.delete")}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Manage Departments Card */}
                <div className="admin-card">
                    <div className="card-header-bar">
                        <h3>{t("adminPortal.manageDepartments")}</h3>
                        <span className="count-badge">{departments.length} Departments</span>
                    </div>

                    <div className="role-list">
                        {departments.length === 0 ? (
                            <p style={{ color: "#64748b", padding: "12px 0" }}>No departments created yet.</p>
                        ) : (
                            departments.map((d) => (
                                <div key={d._id} className="role-item">
                                    <span className="role-name">{d.name}</span>
                                    <div className="role-actions">
                                        <button type="button" className="edit-role-btn" onClick={() => handleEditDepartment(d)}>
                                            {t("common.edit")}
                                        </button>
                                        <button
                                            type="button"
                                            className="delete-role-btn"
                                            onClick={() => handleDeleteDepartment(d._id)}
                                        >
                                            {t("common.delete")}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Role Modal */}
            {editingRole && (
                <div className="edit-role-modal">
                    <div className="edit-role-card">
                        <div className="modal-header">
                            <h3>{t("adminPortal.editRole")}</h3>
                            <button type="button" className="close-modal-btn" onClick={() => setEditingRole(null)}>
                                ×
                            </button>
                        </div>
                        <div className="edit-role-field">
                            <label>{t("adminPortal.roleName")}</label>
                            <input type="text" value={editingRole.name} onChange={handleRoleInputChange} />
                        </div>
                        <div className="modal-actions">
                            <button type="button" className="cancel-btn" onClick={() => setEditingRole(null)}>
                                {t("common.cancel") || "Cancel"}
                            </button>
                            <button type="button" className="save-user-btn" onClick={handleUpdateRole}>
                                {t("common.save") || "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Department Modal */}
            {editingDepartment && (
                <div className="edit-role-modal">
                    <div className="edit-role-card">
                        <div className="modal-header">
                            <h3>{t("adminPortal.editDepartment")}</h3>
                            <button type="button" className="close-modal-btn" onClick={() => setEditingDepartment(null)}>
                                ×
                            </button>
                        </div>
                        <div className="edit-role-field">
                            <label>{t("adminPortal.departmentName")}</label>
                            <input type="text" value={editingDepartment.name} onChange={handleDepartmentInputChange} />
                        </div>
                        <div className="modal-actions">
                            <button type="button" className="cancel-btn" onClick={() => setEditingDepartment(null)}>
                                {t("common.cancel") || "Cancel"}
                            </button>
                            <button type="button" className="save-user-btn" onClick={handleUpdateDepartment}>
                                {t("common.save") || "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminPortal;