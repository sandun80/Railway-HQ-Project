import Role from "../models/roles.js";

export const createRole = async (req, res) => {
    try {

        const { name } = req.body;
        const normalizedName = String(name || "").trim().toLowerCase();

        if (!normalizedName) {
            return res.status(400).json({
                message: "Role name is required"
            });
        }

        const existingRole = await Role.findOne({
            name: normalizedName
        });

        if (existingRole) {
            return res.status(400).json({
                message: "Role already exists"
            });
        }

        const role = await Role.create({
            name: normalizedName
        });

        res.status(201).json({
            message: "Role created successfully",
            role
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to create role"
        });
    }
};

export const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const normalizedName = String(name || "").trim().toLowerCase();

        if (!normalizedName) {
            return res.status(400).json({
                message: "Role name is required"
            });
        }

        const duplicateRole = await Role.findOne({
            name: normalizedName,
            _id: { $ne: id }
        });

        if (duplicateRole) {
            return res.status(409).json({
                message: "Role already exists"
            });
        }

        const updatedRole = await Role.findByIdAndUpdate(
            id,
            { name: normalizedName },
            { new: true, runValidators: true }
        );

        if (!updatedRole) {
            return res.status(404).json({
                message: "Role not found"
            });
        }

        res.status(200).json({
            message: "Role updated successfully",
            role: updatedRole
        });
    } catch (error) {
        console.error("Update role error:", error);
        res.status(500).json({
            message: "Failed to update role"
        });
    }
};

export const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedRole = await Role.findByIdAndDelete(id);

        if (!deletedRole) {
            return res.status(404).json({
                message: "Role not found"
            });
        }

        res.status(200).json({
            message: "Role deleted successfully",
            role: deletedRole
        });
    } catch (error) {
        console.error("Delete role error:", error);
        res.status(500).json({
            message: "Failed to delete role"
        });
    }
};

export const getRoles = async (req, res) => {
    try {

        const roles = await Role.find().sort({ name: 1 });

        res.status(200).json(roles);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to get roles"
        });
    }
};