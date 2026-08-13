import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "../styles/reports.css";

function Reports() {
    const { t } = useTranslation();
    const todayStr = new Date().toISOString().split("T")[0];

    const [category, setCategory] = useState("all");
    const [flow, setFlow] = useState("all");
    const [period, setPeriod] = useState("daily");
    const [startDate, setStartDate] = useState(todayStr);
    const [endDate, setEndDate] = useState(todayStr);
    const [subject, setSubject] = useState("");
    const [search, setSearch] = useState("");

    const [letters, setLetters] = useState([]);
    const [summary, setSummary] = useState({
        total: 0,
        sending: 0,
        receiving: 0,
        registered: 0,
        normal: 0,
        byhand: 0,
        specialByhand: 0
    });
    const [loading, setLoading] = useState(false);

    // Predefined By-Hand Subjects and Officers from BRP
    const byHandSubjectOptions = [
        "Training",
        "Pathway",
        "Transfers",
        "General Administration",
        "Cabinet",
        "Establishment",
        "Retirement",
        "Stores",
        "Employee Relations",
        "Coordination Secretary",
        "Discipline",
        "GRM",
        "GMA",
        "GMO",
        "OPS"
    ];

    const fetchReportData = async () => {
        setLoading(true);
        try {
            const params = {
                category,
                flow,
                period,
                startDate,
                endDate,
                subject,
                search
            };

            const response = await axios.get("http://localhost:5000/api/letters/reports", { params });
            setLetters(response.data.letters || []);
            setSummary(response.data.summary || {
                total: 0,
                sending: 0,
                receiving: 0,
                registered: 0,
                normal: 0,
                byhand: 0,
                specialByhand: 0
            });
        } catch (error) {
            console.error("Error fetching report data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReportData();
    }, [category, flow, period, startDate, endDate, subject]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchReportData();
    };

    const handleResetFilters = () => {
        setCategory("all");
        setFlow("all");
        setPeriod("daily");
        setStartDate(todayStr);
        setEndDate(todayStr);
        setSubject("");
        setSearch("");
    };

    const formatDate = (val) => {
        if (!val) return "-";
        const d = new Date(val);
        if (isNaN(d.getTime())) return "-";
        return d.toLocaleDateString();
    };

    const getRegisterTitle = () => {
        if (category === "registered" && flow === "sending") return "REGISTERED POST LETTERS - SENDING REGISTER";
        if (category === "registered" && flow === "receiving") return "REGISTERED POST LETTERS - RECEIVING REGISTER";
        if (category === "normal" && flow === "sending") return "NORMAL POST LETTERS - SENDING REGISTER";
        if (category === "normal" && flow === "receiving") return "NORMAL POST LETTERS - RECEIVING REGISTER";
        if (category === "byhand") return `BY HAND LETTERS REGISTER ${subject ? `(${subject.toUpperCase()})` : ""}`;
        if (category === "specialByhand") return "SPECIAL BY-HAND REGISTER (MINISTRY OF PUBLIC ADMINISTRATION)";
        if (category === "registered") return "REGISTERED POST LETTERS REGISTER (ALL)";
        if (category === "normal") return "NORMAL POST LETTERS REGISTER (ALL)";
        return "CENTRAL LETTER MANAGEMENT REGISTER REPORT";
    };

    const handlePrint = () => {
        window.print();
    };

    const exportToCSV = () => {
        if (!letters || letters.length === 0) {
            alert("No letter records available to export.");
            return;
        }

        const headers = [
            "Index",
            "Letter Number",
            "Category",
            "Flow",
            "Title",
            "Sender",
            "Destination",
            "Subject/Officer",
            "Reg Post Number",
            "Date Received/Sent",
            "Status"
        ];

        const rows = letters.map((l, index) => [
            index + 1,
            `"${l.letterNumber || ""}"`,
            `"${l.category || ""}"`,
            `"${l.flow || ""}"`,
            `"${(l.title || "").replace(/"/g, '""')}"`,
            `"${(l.sender || "").replace(/"/g, '""')}"`,
            `"${(l.destination || "").replace(/"/g, '""')}"`,
            `"${(l.subject_department_or_officer || "").replace(/"/g, '""')}"`,
            `"${(l.registeredPostNumber || "").replace(/"/g, '""')}"`,
            `"${formatDate(l.letterDate || l.dateRecived || l.createdAt)}"`,
            `"${l.status || "Registered"}"`
        ]);

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Railway_HQ_LMS_Register_Report_${todayStr}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="reports-container">
            {/* Screen Header */}
            <div className="reports-header">
                <div className="header-title">
                    <h1>{t("reports.title")}</h1>
                    <p>{t("reports.subtitle")}</p>
                </div>
                <div className="header-actions">
                    <button type="button" className="btn-action btn-print" onClick={handlePrint}>
                        {t("reports.print")}
                    </button>
                    <button type="button" className="btn-action btn-csv" onClick={exportToCSV}>
                        {t("reports.exportCsv")}
                    </button>
                    <button type="button" className="btn-action btn-reset" onClick={handleResetFilters}>
                        {t("reports.reset")}
                    </button>
                </div>
            </div>

            {/* Filter Control Bar */}
            <div className="reports-filter-card">
                <form onSubmit={handleSearchSubmit}>
                    <div className="filter-grid">
                        <div className="filter-group">
                            <label>{t("reports.letterCategory")}</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option value="all">{t("reports.allCategories")}</option>
                                <option value="registered">{t("reports.registeredPost")}</option>
                                <option value="normal">{t("reports.normalPost")}</option>
                                <option value="byhand">{t("reports.byHand")}</option>
                                <option value="specialByhand">{t("reports.specialByHand")}</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>{t("reports.flowType")}</label>
                            <select value={flow} onChange={(e) => setFlow(e.target.value)}>
                                <option value="all">{t("reports.allFlows")}</option>
                                <option value="sending">{t("reports.sending")}</option>
                                <option value="receiving">{t("reports.receiving")}</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>{t("reports.subjectOfficer")}</label>
                            <input
                                type="text"
                                list="subject-options"
                                placeholder={t("reports.subjectOfficerPlaceholder")}
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            />
                            <datalist id="subject-options">
                                {byHandSubjectOptions.map((opt) => (
                                    <option key={opt} value={opt} />
                                ))}
                            </datalist>
                        </div>

                        <div className="filter-group">
                            <label>{t("reports.reportPeriod")}</label>
                            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
                                <option value="daily">{t("reports.daily")}</option>
                                <option value="weekly">{t("reports.weekly")}</option>
                                <option value="monthly">{t("reports.monthly")}</option>
                                <option value="custom">{t("reports.custom")}</option>
                            </select>
                        </div>

                        {period === "daily" ? (
                            <div className="filter-group">
                                <label>{t("reports.date")}</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => {
                                        setStartDate(e.target.value);
                                        setEndDate(e.target.value);
                                    }}
                                />
                            </div>
                        ) : (
                            <>
                                <div className="filter-group">
                                    <label>{t("reports.startDate")}</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                                <div className="filter-group">
                                    <label>{t("reports.endDate")}</label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                            </>
                        )}

                        <div className="filter-group">
                            <label>{t("reports.searchKeyword")}</label>
                            <div style={{ display: "flex", gap: "6px" }}>
                                <input
                                    type="text"
                                    placeholder={t("reports.searchPlaceholder")}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <button type="submit" className="btn-action btn-print" style={{ padding: "10px 14px" }}>
                                    {t("reports.search")}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {/* Metric Summary Cards */}
            <div className="summary-cards-grid">
                <div className="stat-card primary">
                    <span className="stat-label">{t("reports.totalRecords")}</span>
                    <span className="stat-value">{summary.total}</span>
                </div>
                <div className="stat-card success">
                    <span className="stat-label">{t("reports.sendingLetters")}</span>
                    <span className="stat-value">{summary.sending}</span>
                </div>
                <div className="stat-card info">
                    <span className="stat-label">{t("reports.receivingLetters")}</span>
                    <span className="stat-value">{summary.receiving}</span>
                </div>
                <div className="stat-card warning">
                    <span className="stat-label">{t("reports.registeredPost")}</span>
                    <span className="stat-value">{summary.registered}</span>
                </div>
                <div className="stat-card purple">
                    <span className="stat-label">{t("reports.normalByHand")}</span>
                    <span className="stat-value">{summary.normal + summary.byhand + summary.specialByhand}</span>
                </div>
            </div>

            {/* Official Register Document Output */}
            <div className="register-document">
                {/* Government Print Header */}
                <div className="print-register-header">
                    <h2>SRI LANKA RAILWAYS - HEADQUARTERS</h2>
                    <h3>{getRegisterTitle()}</h3>
                    <div className="register-meta-bar">
                        <span><strong>Period:</strong> {period.toUpperCase()} ({startDate} to {endDate})</span>
                        <span><strong>Generated On:</strong> {new Date().toLocaleString()}</span>
                        <span><strong>Total Records:</strong> {letters.length}</span>
                    </div>
                </div>

                {loading ? (
                    <div className="no-records">{t("reports.loadingRecords")}</div>
                ) : letters.length === 0 ? (
                    <div className="no-records">{t("reports.noRecords")}</div>
                ) : (
                    <div className="register-table-wrapper">
                        {/* Dynamic Table Layout matching BRP Physical Registers */}
                        {category === "registered" && flow === "sending" && (
                            <table className="register-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: "50px" }}>#</th>
                                        <th>Letter Number</th>
                                        <th>Letter Title</th>
                                        <th>Destination</th>
                                        <th>Registered Post No.</th>
                                        <th>Date Sent</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {letters.map((l, i) => (
                                        <tr key={l._id}>
                                            <td>{i + 1}</td>
                                            <td><strong>{l.letterNumber}</strong></td>
                                            <td>{l.title}</td>
                                            <td>{l.destination || "-"}</td>
                                            <td>{l.registeredPostNumber || "Pending"}</td>
                                            <td>{formatDate(l.letterDate || l.createdAt)}</td>
                                            <td><span className="badge badge-sending">{l.status || "Dispatched"}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {category === "registered" && flow === "receiving" && (
                            <table className="register-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: "50px" }}>#</th>
                                        <th>Date Received</th>
                                        <th>Sender</th>
                                        <th>Letter Number</th>
                                        <th>Letter Title</th>
                                        <th>Reg. Post No.</th>
                                        <th>Destination Branch</th>
                                        <th>Receiving Proof</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {letters.map((l, i) => (
                                        <tr key={l._id}>
                                            <td>{i + 1}</td>
                                            <td>{formatDate(l.dateRecived || l.letterDate || l.createdAt)}</td>
                                            <td>{l.sender || "-"}</td>
                                            <td><strong>{l.letterNumber}</strong></td>
                                            <td>{l.title}</td>
                                            <td>{l.registeredPostNumber || "-"}</td>
                                            <td>{l.destination || "-"}</td>
                                            <td><span className="badge badge-receiving">{l.status || "Received & Signed"}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {category === "normal" && flow === "sending" && (
                            <table className="register-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: "50px" }}>#</th>
                                        <th>Letter Number</th>
                                        <th>Letter Title</th>
                                        <th>Destination</th>
                                        <th>Date Sent</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {letters.map((l, i) => (
                                        <tr key={l._id}>
                                            <td>{i + 1}</td>
                                            <td><strong>{l.letterNumber}</strong></td>
                                            <td>{l.title}</td>
                                            <td>{l.destination || "-"}</td>
                                            <td>{formatDate(l.letterDate || l.createdAt)}</td>
                                            <td><span className="badge badge-normal">{l.status || "Dispatched"}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {category === "normal" && flow === "receiving" && (
                            <table className="register-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: "50px" }}>#</th>
                                        <th>Date Received</th>
                                        <th>Sender</th>
                                        <th>Letter Number</th>
                                        <th>Letter Title</th>
                                        <th>Destination Branch</th>
                                        <th>Receiving Proof</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {letters.map((l, i) => (
                                        <tr key={l._id}>
                                            <td>{i + 1}</td>
                                            <td>{formatDate(l.dateRecived || l.letterDate || l.createdAt)}</td>
                                            <td>{l.sender || "-"}</td>
                                            <td><strong>{l.letterNumber}</strong></td>
                                            <td>{l.title}</td>
                                            <td>{l.destination || "-"}</td>
                                            <td><span className="badge badge-receiving">{l.status || "Delivered"}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {category === "byhand" && (
                            <table className="register-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: "50px" }}>#</th>
                                        <th>Date</th>
                                        <th>Letter Number</th>
                                        <th>Letter Title</th>
                                        <th>Subject / Direct Officer</th>
                                        <th>Destination / Sender</th>
                                        <th>Signature / Proof</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {letters.map((l, i) => (
                                        <tr key={l._id}>
                                            <td>{i + 1}</td>
                                            <td>{formatDate(l.letterDate || l.dateRecived || l.createdAt)}</td>
                                            <td><strong>{l.letterNumber}</strong></td>
                                            <td>{l.title}</td>
                                            <td>{l.subject_department_or_officer || "-"}</td>
                                            <td>{l.destination || l.sender || "-"}</td>
                                            <td><span className="badge badge-byhand">{l.status || "Acknowledged"}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {category === "specialByhand" && (
                            <table className="register-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: "50px" }}>#</th>
                                        <th>Date Received</th>
                                        <th>Letter Number</th>
                                        <th>Letter Title</th>
                                        <th>Destination</th>
                                        <th>Person Receiving</th>
                                        <th>Receiving Office</th>
                                        <th>Date Received by Resp. Officer</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {letters.map((l, i) => (
                                        <tr key={l._id}>
                                            <td>{i + 1}</td>
                                            <td>{formatDate(l.dateRecived || l.letterDate || l.createdAt)}</td>
                                            <td><strong>{l.letterNumber}</strong></td>
                                            <td>{l.title}</td>
                                            <td>{l.destination || "-"}</td>
                                            <td>{l.personReceivingLetter || l.receiver || "-"}</td>
                                            <td>{l.recivingOffice || "-"}</td>
                                            <td>{formatDate(l.dateReceivedByResponsibleOfficer || l.updatedAt)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {(category === "all" || (flow === "all" && category !== "byhand" && category !== "specialByhand")) && (
                            <table className="register-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: "50px" }}>#</th>
                                        <th>Category</th>
                                        <th>Flow</th>
                                        <th>Letter Number</th>
                                        <th>Title</th>
                                        <th>Sender / Dest</th>
                                        <th>Subject / Officer</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {letters.map((l, i) => (
                                        <tr key={l._id}>
                                            <td>{i + 1}</td>
                                            <td><span className={`badge badge-${l.category}`}>{l.category}</span></td>
                                            <td><span className={`badge badge-${l.flow}`}>{l.flow}</span></td>
                                            <td><strong>{l.letterNumber}</strong></td>
                                            <td>{l.title}</td>
                                            <td>{l.flow === "sending" ? `To: ${l.destination || "-"}` : `From: ${l.sender || "-"}`}</td>
                                            <td>{l.subject_department_or_officer || "-"}</td>
                                            <td>{formatDate(l.letterDate || l.dateRecived || l.createdAt)}</td>
                                            <td>{l.status || "Recorded"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* Print Verification & Signature Block */}
                <div className="print-signature-footer">
                    <div className="sig-box">
                        <div className="sig-line"></div>
                        <span className="sig-title">Prepared By (MSO Staff)</span>
                    </div>
                    <div className="sig-box">
                        <div className="sig-line"></div>
                        <span className="sig-title">Verified By (Officer in Charge)</span>
                    </div>
                    <div className="sig-box">
                        <div className="sig-line"></div>
                        <span className="sig-title">Date & Official Headquarters Stamp</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Reports;