import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import "../styles/historyLogs.css";

function HistoryLogs() {
  const { t } = useTranslation();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUsername = user?.username || "";
  const currentRole = user?.role || "officer";

  const isGlobalView = currentRole === "viewer" || currentRole === "admin";

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");

  useEffect(() => {
    fetchLogs();
  }, [currentUsername, currentRole]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/logs", {
        params: {
          username: currentUsername,
          role: currentRole
        }
      });
      setLogs(response.data || []);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActionBadgeClass = (action) => {
    switch (action) {
      case "CREATE":
        return "action-badge badge-create";
      case "UPDATE":
        return "action-badge badge-update";
      case "DELETE":
        return "action-badge badge-delete";
      case "REPLY":
        return "action-badge badge-reply";
      case "LOGIN":
        return "action-badge badge-login";
      default:
        return "action-badge";
    }
  };

  const formatTimestamp = (dateString) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    return d.toLocaleString("en-GB", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };

  const filteredLogs = logs.filter((log) => {
    // Action filter
    if (actionFilter !== "ALL" && log.action !== actionFilter) {
      return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchUsername = log.username?.toLowerCase().includes(q);
      const matchDetails = log.details?.toLowerCase().includes(q);
      const matchLetterNumber = log.letterNumber?.toLowerCase().includes(q);
      const matchRole = log.userRole?.toLowerCase().includes(q);

      return matchUsername || matchDetails || matchLetterNumber || matchRole;
    }

    return true;
  });

  return (
    <div className="history-logs-page">
      <div className="logs-header-card">
        <div className="logs-header-title">
          <h1>
            {isGlobalView ? t("logs.systemLogsTitle", "System History Logs") : t("logs.myLogsTitle", "My Activity Logs")}
          </h1>
          <p>
            {isGlobalView
              ? t("logs.systemLogsSubtitle", "Complete audit trail of system activities across all users and departments.")
              : t("logs.myLogsSubtitle", "History log of all actions performed by your account.")}
          </p>
        </div>

        <div className="logs-count-badge">
          <span>{filteredLogs.length}</span>
          <small>{t("logs.totalEntries", "Total Logs")}</small>
        </div>
      </div>

      <div className="logs-filter-bar">
        <div className="filter-item search-item">
          <label>{t("common.search", "Search")}</label>
          <input
            type="text"
            placeholder={t("logs.searchPlaceholder", "Search by user, letter number, details...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-item select-item">
          <label>{t("logs.filterAction", "Filter Action")}:</label>
          <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}>
            <option value="ALL">{t("logs.allActions", "All Actions")}</option>
            <option value="CREATE">{t("logs.actionCreate", "Create")}</option>
            <option value="UPDATE">{t("logs.actionUpdate", "Update")}</option>
            <option value="REPLY">{t("logs.actionReply", "Reply")}</option>
            <option value="DELETE">{t("logs.actionDelete", "Delete")}</option>
            <option value="LOGIN">{t("logs.actionLogin", "Login")}</option>
          </select>
        </div>

        <button type="button" className="logs-refresh-btn" onClick={fetchLogs}>
          {t("logs.refreshBtn", "Refresh Logs")}
        </button>
      </div>

      <div className="logs-table-container">
        {loading ? (
          <div className="logs-loading">{t("common.loading", "Loading history logs...")}</div>
        ) : filteredLogs.length === 0 ? (
          <div className="no-logs">{t("logs.noLogsFound", "No activity logs found.")}</div>
        ) : (
          <table className="logs-table">
            <thead>
              <tr>
                <th>{t("logs.timestamp", "Timestamp")}</th>
                <th>{t("logs.user", "User")}</th>
                <th>{t("logs.role", "Role")}</th>
                <th>{t("logs.action", "Action")}</th>
                <th>{t("logs.letterNumber", "Ref. Letter #")}</th>
                <th>{t("logs.details", "Details")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log._id}>
                  <td className="timestamp-cell">{formatTimestamp(log.createdAt)}</td>
                  <td className="user-cell">
                    <div className="user-pill">
                      <span className="avatar">{log.username?.charAt(0).toUpperCase()}</span>
                      <span className="uname">{log.username}</span>
                    </div>
                  </td>
                  <td>
                    <span className="role-tag">{log.userRole}</span>
                  </td>
                  <td>
                    <span className={getActionBadgeClass(log.action)}>{log.action}</span>
                  </td>
                  <td className="ref-letter-cell">{log.letterNumber || "—"}</td>
                  <td className="details-cell">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default HistoryLogs;
