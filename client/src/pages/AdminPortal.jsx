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

    useEffect(() => {
        getRoles();
        
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
                name: newRole.trim()
            }
        );

        alert(response.data.message);

        setNewRole("");

        // Reload dropdown
        getRoles();

    } catch (error) {

        console.error(error);

        alert(
            error.response?.data?.message ||
            "Failed to create role"
        );
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

        </section>
    );
}

export default AdminPortal;