import Department from "../models/department.js";

export const createDepartment = async (req, res) => {
    try {

        const { name } = req.body;
        const normalizedName = String(name || "").trim();

        if (!normalizedName) {
            return res.status(400).json({
                message: "Department name is required"
            });
        }

        const existingDepartment = await Department.findOne({
            name: normalizedName
        });

        if (existingDepartment) {
            return res.status(400).json({
                message: "Department already exists"
            });
        }

        const department = await Department.create({
            name: normalizedName
        });

        res.status(201).json({
            message: "Department created successfully",
            department
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to create department"
        });
    }
};

export const updateDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const normalizedName = String(name || "").trim();

        if (!normalizedName) {
            return res.status(400).json({
                message: "Department name is required"
            });
        }

        const duplicateDepartment = await Department.findOne({
            name: normalizedName,
            _id: { $ne: id }
        });

        if (duplicateDepartment) {
            return res.status(409).json({
                message: "Department already exists"
            });
        }

        const updatedDepartment = await Department.findByIdAndUpdate(
            id,
            { name: normalizedName },
            { new: true, runValidators: true }
        );

        if (!updatedDepartment) {
            return res.status(404).json({
                message: "Department not found"
            });
        }

        res.status(200).json({
            message: "Department updated successfully",
            department: updatedDepartment
        });
    } catch (error) {
        console.error("Update department error:", error);
        res.status(500).json({
            message: "Failed to update department"
        });
    }
};

export const deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedDepartment = await Department.findByIdAndDelete(id);

        if (!deletedDepartment) {
            return res.status(404).json({
                message: "Department not found"
            });
        }

        res.status(200).json({
            message: "Department deleted successfully",
            department: deletedDepartment
        });
    } catch (error) {
        console.error("Delete department error:", error);
        res.status(500).json({
            message: "Failed to delete department"
        });
    }
};

export const getDepartments = async (req, res) => {
    try {
        let departments = await Department.find().sort({ name: 1 });

        if (!departments || departments.length === 0) {
            const defaultDeptNames = [
                "Administration",
                "Commercial & Traffic",
                "Engineering",
                "Finance & Accounts",
                "Human Resource Management",
                "Motive Power & Rolling Stock",
                "Operations & Transportation",
                "Planning & Development",
                "Procurement & Stores",
                "Signals & Telecommunication"
            ];

            try {
                const seedDocs = defaultDeptNames.map((name) => ({ name }));
                departments = await Department.insertMany(seedDocs, { ordered: false });
            } catch (seedErr) {
                console.log("Department auto-seed notice:", seedErr.message);
                departments = await Department.find().sort({ name: 1 });
            }
        }

        res.status(200).json(departments);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to get departments"
        });
    }
};
