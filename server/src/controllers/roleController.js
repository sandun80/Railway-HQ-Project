import Role from "../models/roles.js";

export const createRole = async (req, res) => {
    try {

        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Role name is required"
            });
        }

        const existingRole = await Role.findOne({
            name: name.trim()
        });

        if (existingRole) {
            return res.status(400).json({
                message: "Role already exists"
            });
        }

        const role = await Role.create({
            name: name.trim()
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