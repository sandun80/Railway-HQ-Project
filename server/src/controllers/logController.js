import ActivityLog from "../models/activityLog.js";

/**
 * Helper function to create an activity log entry.
 */
export const createLogEntry = async ({ username, userRole, action, details, letterNumber = "" }) => {
  try {
    if (!username || !userRole || !action || !details) {
      console.warn("Log creation skipped: missing required log metadata.");
      return null;
    }

    const log = await ActivityLog.create({
      username: username.trim(),
      userRole: userRole.trim(),
      action,
      details,
      letterNumber: letterNumber || ""
    });

    return log;
  } catch (error) {
    console.error("Error creating activity log:", error);
    return null;
  }
};

/**
 * API Controller to fetch activity logs based on user role permissions.
 * - 'viewer' or 'admin': Returns all system logs.
 * - 'officer' / other roles: Returns ONLY logs matching user's username.
 */
export const getActivityLogs = async (req, res) => {
  try {
    const role = String(req.query.role || "").trim().toLowerCase();
    const username = String(req.query.username || "").trim();

    if (!username) {
      return res.status(400).json({
        message: "Username parameter is required"
      });
    }

    let query = {};

    // Role-based visibility scoping
    if (role === "viewer" || role === "admin") {
      // Viewer and Admin can view all system logs
      query = {};
    } else {
      // Staff / Officers can ONLY view their own logs
      query = { username };
    }

    const logs = await ActivityLog.find(query).sort({ createdAt: -1 });

    res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    res.status(500).json({
      message: error.message || "Failed to fetch activity logs"
    });
  }
};
