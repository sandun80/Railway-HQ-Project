import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "../styles/dashboard.css";

function Dashboard() {
  const { t } = useTranslation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const username = user?.username || "Officer";

  const [stats, setStats] = useState({
    sendingToday: { registered: 0, normal: 0, byhand: 0, specialByhand: 0, total: 0 },
    sendingAllTime: { registered: 0, normal: 0, byhand: 0, specialByhand: 0, total: 0 },
    receivedToday: { registered: 0, normal: 0, byhand: 0, specialByhand: 0, total: 0 },
    receivedAllTime: { registered: 0, normal: 0, byhand: 0, specialByhand: 0, total: 0 },
  });

  const [selectedTimeframe, setSelectedTimeframe] = useState("all"); // "all" | "today"

  useEffect(() => {
    getDashboardCounts();
  }, []);

  const getDashboardCounts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/letters/getcounts");
      setStats(response.data);
    } catch (error) {
      console.error("Failed to get dashboard counts:", error);
    }
  };

  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const categories = [
    { key: "registered", name: "Registered Post" },
    { key: "normal", name: "Normal Post" },
    { key: "byhand", name: "By Hand Mail" },
    { key: "specialByhand", name: "Special By-Hand" },
  ];

  const maxSendingVal = Math.max(
    ...categories.map((c) => Math.max(stats.sendingToday[c.key] || 0, stats.sendingAllTime[c.key] || 0)),
    1
  );

  const maxReceivedVal = Math.max(
    ...categories.map((c) => Math.max(stats.receivedToday[c.key] || 0, stats.receivedAllTime[c.key] || 0)),
    1
  );

  const getBarHeight = (value, max) => {
    if (!max || max === 0) return 6; // minimum visible base height
    const pct = (value / max) * 100;
    return Math.max(Math.round(pct), 6);
  };

  return (
    <div className="dashboard-vertical-page">
      {/* Top Banner */}
      <header className="dashboard-header-banner">
        <div className="banner-left">
          <span className="banner-badge">SRI LANKA RAILWAYS • MAIL ANALYTICS</span>
          <h1>Welcome back, {username}</h1>
          <p className="banner-date">{todayDate}</p>
        </div>

        <div className="timeframe-segmented-control">
          <button
            type="button"
            className={selectedTimeframe === "today" ? "segment-btn active" : "segment-btn"}
            onClick={() => setSelectedTimeframe("today")}
          >
            Today Focus
          </button>
          <button
            type="button"
            className={selectedTimeframe === "all" ? "segment-btn active" : "segment-btn"}
            onClick={() => setSelectedTimeframe("all")}
          >
            Today vs All-Time
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="kpi-banner-row">
        <div className="kpi-box sending-kpi">
          <div className="kpi-tag-indicator tag-send">SENDING</div>
          <div>
            <span className="kpi-label">Sending Mails (Today)</span>
            <span className="kpi-val">{stats.sendingToday.total}</span>
            <small>All-Time Total: {stats.sendingAllTime.total}</small>
          </div>
        </div>

        <div className="kpi-box receiving-kpi">
          <div className="kpi-tag-indicator tag-rec">RECEIVING</div>
          <div>
            <span className="kpi-label">Received Mails (Today)</span>
            <span className="kpi-val">{stats.receivedToday.total}</span>
            <small>All-Time Total: {stats.receivedAllTime.total}</small>
          </div>
        </div>

        <div className="kpi-box total-kpi">
          <div className="kpi-tag-indicator tag-total">TOTAL</div>
          <div>
            <span className="kpi-label">System Active Mails</span>
            <span className="kpi-val">{stats.sendingToday.total + stats.receivedToday.total}</span>
            <small>All-Time System Total: {stats.sendingAllTime.total + stats.receivedAllTime.total}</small>
          </div>
        </div>
      </div>

      {/* Dual Vertical Bar Charts Grid */}
      <div className="vertical-charts-grid">
        {/* 1. SENDING LETTERS VERTICAL BAR CHART */}
        <div className="v-chart-card sending-card">
          <div className="v-chart-header">
            <div className="title-wrap">
              <div>
                <h2>Sending Letters Vertical Graph</h2>
                <p>Categorized volume comparison of outgoing mail</p>
              </div>
            </div>
            <div className="legend-pills">
              <span className="legend-pill today-pillar">Today</span>
              {selectedTimeframe === "all" && <span className="legend-pill all-pillar">All-Time</span>}
            </div>
          </div>

          <div className="vertical-graph-stage">
            {/* Y-Axis Scale Lines */}
            <div className="y-axis-grid">
              <div className="y-line"><span>{maxSendingVal}</span></div>
              <div className="y-line"><span>{Math.round(maxSendingVal * 0.75)}</span></div>
              <div className="y-line"><span>{Math.round(maxSendingVal * 0.5)}</span></div>
              <div className="y-line"><span>{Math.round(maxSendingVal * 0.25)}</span></div>
              <div className="y-line"><span>0</span></div>
            </div>

            {/* Vertical Bar Columns Area */}
            <div className="columns-flex-container">
              {categories.map((cat) => {
                const todayVal = stats.sendingToday[cat.key] || 0;
                const allVal = stats.sendingAllTime[cat.key] || 0;
                const hToday = getBarHeight(todayVal, maxSendingVal);
                const hAll = getBarHeight(allVal, maxSendingVal);

                return (
                  <div className="vertical-column-group" key={cat.key}>
                    <div className="bars-pair">
                      {/* Today Vertical Bar */}
                      <div className="v-bar-wrapper">
                        <span className="v-bar-val">{todayVal}</span>
                        <div
                          className="v-bar-pillar pillar-sending-today"
                          style={{ height: `${hToday}%` }}
                        />
                      </div>

                      {/* All-Time Vertical Bar */}
                      {selectedTimeframe === "all" && (
                        <div className="v-bar-wrapper">
                          <span className="v-bar-val">{allVal}</span>
                          <div
                            className="v-bar-pillar pillar-sending-all"
                            style={{ height: `${hAll}%` }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="x-axis-label">
                      <span className="x-name">{cat.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. RECEIVED LETTERS VERTICAL BAR CHART */}
        <div className="v-chart-card receiving-card">
          <div className="v-chart-header">
            <div className="title-wrap">
              <div>
                <h2>Received Letters Vertical Graph</h2>
                <p>Categorized volume comparison of incoming mail</p>
              </div>
            </div>
            <div className="legend-pills">
              <span className="legend-pill today-pillar">Today</span>
              {selectedTimeframe === "all" && <span className="legend-pill all-pillar">All-Time</span>}
            </div>
          </div>

          <div className="vertical-graph-stage">
            {/* Y-Axis Scale Lines */}
            <div className="y-axis-grid">
              <div className="y-line"><span>{maxReceivedVal}</span></div>
              <div className="y-line"><span>{Math.round(maxReceivedVal * 0.75)}</span></div>
              <div className="y-line"><span>{Math.round(maxReceivedVal * 0.5)}</span></div>
              <div className="y-line"><span>{Math.round(maxReceivedVal * 0.25)}</span></div>
              <div className="y-line"><span>0</span></div>
            </div>

            {/* Vertical Bar Columns Area */}
            <div className="columns-flex-container">
              {categories.map((cat) => {
                const todayVal = stats.receivedToday[cat.key] || 0;
                const allVal = stats.receivedAllTime[cat.key] || 0;
                const hToday = getBarHeight(todayVal, maxReceivedVal);
                const hAll = getBarHeight(allVal, maxReceivedVal);

                return (
                  <div className="vertical-column-group" key={cat.key}>
                    <div className="bars-pair">
                      {/* Today Vertical Bar */}
                      <div className="v-bar-wrapper">
                        <span className="v-bar-val">{todayVal}</span>
                        <div
                          className="v-bar-pillar pillar-receiving-today"
                          style={{ height: `${hToday}%` }}
                        />
                      </div>

                      {/* All-Time Vertical Bar */}
                      {selectedTimeframe === "all" && (
                        <div className="v-bar-wrapper">
                          <span className="v-bar-val">{allVal}</span>
                          <div
                            className="v-bar-pillar pillar-receiving-all"
                            style={{ height: `${hAll}%` }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="x-axis-label">
                      <span className="x-name">{cat.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;