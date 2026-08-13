import User from "../models/users.js";
import Role from "../models/roles.js";
import bcrypt from "bcryptjs";

export const seedDefaultData = async () => {
    try {
        // Ensure default roles exist
        const defaultRoles = ["admin", "officer", "viewer"];
        for (const roleName of defaultRoles) {
            const existingRole = await Role.findOne({ name: roleName });
            if (!existingRole) {
                await Role.create({ name: roleName });
                console.log(`[Seed] Role created: ${roleName}`);
            }
        }

        // Seed default users if no users exist or default admin is missing
        const userCount = await User.countDocuments();
        const adminExists = await User.findOne({ username: "admin" });

        if (userCount === 0 || !adminExists) {
            console.log("[Seed] Seeding default local accounts...");

            const defaultAccounts = [
                { username: "admin", password: "admin123", role: "admin" },
                { username: "officer", password: "officer123", role: "officer" },
                { username: "viewer", password: "viewer123", role: "viewer" }
            ];

            for (const acc of defaultAccounts) {
                const existing = await User.findOne({ username: acc.username });
                if (!existing) {
                    const hashedPassword = await bcrypt.hash(acc.password, 10);
                    await User.create({
                        username: acc.username,
                        password: hashedPassword,
                        role: acc.role
                    });
                    console.log(`[Seed] User created: ${acc.username} (${acc.role})`);
                }
            }
            console.log("[Seed] Default local accounts ready.");
        } else {
            console.log("[Seed] Existing user accounts verified.");
        }
    } catch (error) {
        console.error("[Seed] Error seeding default data:", error.message);
    }
};
