import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/dashboard.css";

function Dashboard() {

    const user = JSON.parse(localStorage.getItem("user"));
    const username = user?.username || "user";

    const [counts, setCounts] = useState({
        registered: 0,
        normal: 0,
        byhand: 0,
        draft: 0
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

    const dashboardCounts = [
        {
            id: "registered-sent-today",
            title: "Registered Mail Sent Today",
            count: counts.registered,
        },
        {
            id: "normal-sent-today",
            title: "Normal Mail Sent Today",
            count: counts.normal,
        },
        {
            id: "byhand-sent-today",
            title: "By Hand Mail Sent Today",
            count: counts.byhand,
        },
        {
            id: "draft-registered-mail",
            title: "Draft Registered Mail",
            count: counts.draft,
        },
    ];

    return (
        <section className="dashboard-page">

            <div className="dashboard-header">
                <h1>Welcome {username}</h1><br />
                <h1>Dashboard</h1>
                <p>Today&apos;s mail summary</p>
            </div>

            <div className="dashboard-grid">

                {dashboardCounts.map((item) => (
                    <article
                        className="dashboard-card"
                        key={item.id}
                    >
                        <h2>{item.title}</h2>
                        <p>{item.count}</p>
                    </article>
                ))}

            </div>

        </section>
    );
}

export default Dashboard;