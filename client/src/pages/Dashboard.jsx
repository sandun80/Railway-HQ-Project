import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "../styles/dashboard.css";

/* ── SVG icons ── */
const IconRegistered = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16v16H4z" rx="2" />
        <polyline points="22,6 12,13 2,6" />
        <path d="M9 12l-2 2 2 2" />
        <path d="M15 12l2 2-2 2" />
    </svg>
);

const IconNormal = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);

const IconByHand = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="9" y1="15" x2="15" y2="15" />
        <line x1="9" y1="11" x2="13" y2="11" />
    </svg>
);

const IconDraft = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
);

function Dashboard() {
    const { t } = useTranslation();
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user?.username || "User";

    const [counts, setCounts] = useState({
        registered: 0,
        normal: 0,
        byhand: 0,
        draft: 0,
    });

    useEffect(() => {
        getDashboardCounts();
    }, []);

    const getDashboardCounts = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/letters/getcounts"
            );
            setCounts(response.data);
        } catch (error) {
            console.error("Failed to get dashboard counts:", error);
        }
    };

    const dashboardCards = [
        {
            id: "registered",
            colorClass: "card-registered",
            title: t("dashboard.registeredTitle"),
            count: counts.registered,
            icon: <IconRegistered />,
        },
        {
            id: "normal",
            colorClass: "card-normal",
            title: t("dashboard.normalTitle"),
            count: counts.normal,
            icon: <IconNormal />,
        },
        {
            id: "byhand",
            colorClass: "card-byhand",
            title: t("dashboard.byhandTitle"),
            count: counts.byhand,
            icon: <IconByHand />,
        },
        {
            id: "draft",
            colorClass: "card-draft",
            title: t("dashboard.draftTitle"),
            count: counts.draft,
            icon: <IconDraft />,
        },
    ];

    /* Today's date for the subtitle */
    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <section className="dashboard-page">

            <div className="dashboard-header">
                <span className="greeting">{t("dashboard.greeting")}</span>
                <h1>{t("dashboard.welcomeBack", { username })}</h1>
                <p className="subtitle">{today}</p>
            </div>

            <div className="dashboard-grid">
                {dashboardCards.map((item) => (
                    <article
                        className={`dashboard-card ${item.colorClass}`}
                        key={item.id}
                    >
                        <div className="card-top">
                            <h2>{item.title}</h2>
                            <div className="card-icon">{item.icon}</div>
                        </div>
                        <p className="card-count">{item.count}</p>
                        <p className="card-label">{t("dashboard.lettersLabel")}</p>
                    </article>
                ))}
            </div>

        </section>
    );
}

export default Dashboard;