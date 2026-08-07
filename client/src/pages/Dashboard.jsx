import "../styles/dashboard.css";

function Dashboard(){
    const dashboardCounts = [
        {
            id: "registered-sent-today",
            title: "Registered Mail Sent Today",
            count: 0,
        },
        {
            id: "normal-sent-today",
            title: "Normal Mail Sent Today",
            count: 0,
        },
        {
            id: "byhand-sent-today",
            title: "By Hand Mail Sent Today",
            count: 0,
        },
        {
            id: "draft-refitered-mail",
            title: "Draft Refitered Mail",
            count: 0,
        },
    ];

    return(
        <section className="dashboard-page">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <p>Today&apos;s mail summary</p>
            </div>

            <div className="dashboard-grid">
                {dashboardCounts.map((item) => (
                    <article className="dashboard-card" key={item.id}>
                        <h2>{item.title}</h2>
                        <p>{item.count}</p>
                    </article>
                ))}
            </div>

        </section>
    );
}

export default Dashboard;