import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "../styles/replyDashboard.css";

function ReplayDashboard() {
    const { t } = useTranslation();
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role;

    const [letters, setLetters] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [replyText, setReplyText] = useState("");
    const [replyFile, setReplyFile] = useState(null);
    const [isSending, setIsSending] = useState(false);

    const convertPdfToBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

    const getLetters = async () => {
        if (!role) return;

        try {
            const response = await axios.get("http://localhost:5000/api/letters/getlettersforreply", {
                params: { role }
            });

            setLetters(response.data);
        } catch (error) {
            console.error("Failed to get letters for reply:", error);
        }
    };

    useEffect(() => {
        getLetters();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [role]);

    const filteredLetters = useMemo(() => {
        if (!searchTerm.trim()) return letters;

        return letters.filter((letter) =>
            (letter.letterNumber || "").toLowerCase().includes(searchTerm.trim().toLowerCase())
        );
    }, [letters, searchTerm]);

    const selectedLetter = useMemo(
        () =>
            letters.find((letter) => (letter._id || letter.letterNumber) === selectedId) ||
            filteredLetters[0] ||
            null,
        [letters, filteredLetters, selectedId]
    );

    const handleSelectLetter = (letterId) => {
        setSelectedId(letterId);
        setReplyText("");
        setReplyFile(null);
    };

    const handleSendReply = async () => {
        if (!replyText.trim()) {
            alert("Please add a reply message before sending.");
            return;
        }

        if (!selectedLetter?.letterNumber) {
            alert("No letter selected.");
            return;
        }

        try {
            setIsSending(true);

            const replyPdf = replyFile ? await convertPdfToBase64(replyFile) : "";

            const response = await axios.put(
                `http://localhost:5000/api/letters/${selectedLetter.letterNumber}/reply`,
                {
                    reply: replyText,
                    replyPdf
                }
            );

            const updatedLetter = response.data;

            setLetters((prev) =>
                prev.map((letter) =>
                    letter._id === updatedLetter._id ? updatedLetter : letter
                )
            );

            alert("Reply sent successfully.");
            setReplyText("");
            setReplyFile(null);
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Failed to send reply.";
            alert(errorMessage);
            console.error(error);
        } finally {
            setIsSending(false);
        }
    };

    const formatDate = (value) => {
        if (!value) return "-";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "-";
        return date.toLocaleDateString();
    };

    return (
        <div className="reply-dashboard-page">
            <div className="reply-dashboard-shell">
                <aside className="inbox-sidebar">
                    <div className="sidebar-header">
                        <div>
                            <p className="eyebrow">{t("replayDashboard.inbox")}</p>
                            <h2>{t("replayDashboard.yourMails")}</h2>
                        </div>
                        <span className="sidebar-badge">{letters.length}</span>
                    </div>

                    <div className="mail-search-box">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder={t("replayDashboard.searchPlaceholder")}
                            aria-label="Search letter by number"
                        />
                        <button type="button">{t("replayDashboard.search")}</button>
                    </div>

                    <div className="inbox-list">
                        {filteredLetters.map((letter) => (
                            <button
                                key={letter._id || letter.letterNumber}
                                type="button"
                                className={`inbox-item ${(selectedLetter?._id || selectedLetter?.letterNumber) === (letter._id || letter.letterNumber) ? "active" : ""}`}
                                onClick={() => handleSelectLetter(letter._id || letter.letterNumber)}
                            >
                                <div className="inbox-top-row">
                                    <span className="sender-name">{letter.sender || "-"}</span>
                                    {letter.status !== "Replied" && <span className="unread-dot" />}
                                </div>
                                <p className="letter-subject">{letter.title}</p>
                                <div className="inbox-meta-row">
                                    <span>{letter.letterNumber}</span>
                                    <span>{formatDate(letter.letterDate)}</span>
                                </div>
                            </button>
                        ))}

                        {filteredLetters.length === 0 && (
                            <p className="empty-state">{t("replayDashboard.noLetters")}</p>
                        )}
                    </div>
                </aside>

                <main className="inbox-main">
                    {selectedLetter ? (
                        <>
                            <div className="letter-header-card">
                                <div>
                                    <p className="eyebrow">{t("replayDashboard.letterDetails")}</p>
                                    <h3>{selectedLetter.title}</h3>
                                </div>
                                <div className="status-group">
                                    <span className="status-pill" data-status={selectedLetter.status}>{selectedLetter.status || "-"}</span>
                                </div>
                            </div>

                            <div className="detail-grid">
                                <div className="detail-card">
                                    <label>{t("replayDashboard.from")}</label>
                                    <p>{selectedLetter.sender || "-"}</p>
                                </div>
                                <div className="detail-card">
                                    <label>{t("replayDashboard.letterNo")}</label>
                                    <p>{selectedLetter.letterNumber}</p>
                                </div>
                                <div className="detail-card">
                                    <label>{t("replayDashboard.category")}</label>
                                    <p>{selectedLetter.category || "-"}</p>
                                </div>
                                <div className="detail-card">
                                    <label>{t("replayDashboard.flow")}</label>
                                    <p>{selectedLetter.flow || "-"}</p>
                                </div>
                                <div className="detail-card">
                                    <label>{t("replayDashboard.received")}</label>
                                    <p>{formatDate(selectedLetter.letterDate)}</p>
                                </div>
                                <div className="detail-card">
                                    <label>{t("replayDashboard.attachment")}</label>
                                    <p>{selectedLetter.pdf ? t("replayDashboard.pdfAvailable") : t("replayDashboard.noPdf")}</p>
                                </div>
                            </div>

                            <div className="summary-card">
                                <label>{t("replayDashboard.subjectDeptOfficer")}</label>
                                <p>{selectedLetter.subject_department_or_officer || "-"}</p>
                            </div>

                            <div className="letter-actions-row">
                                {selectedLetter.pdf && (
                                    <a
                                        href={selectedLetter.pdf}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="primary-link-btn"
                                    >
                                        {t("replayDashboard.openPdf")}
                                    </a>
                                )}
                            </div>

                            <div className="reply-panel">
                                <div className="reply-header-row">
                                    <h4>{t("replayDashboard.replyToLetter")}</h4>
                                    {selectedLetter.status === "Replied" && <span className="draft-indicator">{t("replayDashboard.alreadyReplied")}</span>}
                                </div>

                                {selectedLetter.reply && (
                                    <div className="summary-card">
                                        <label>{t("replayDashboard.currentReply")}</label>
                                        <p>{selectedLetter.reply}</p>
                                    </div>
                                )}

                                <textarea
                                    value={replyText}
                                    onChange={(event) => setReplyText(event.target.value)}
                                    placeholder={t("replayDashboard.replyPlaceholder")}
                                />

                                <div className="reply-footer-row">
                                    <label className="file-upload-label">
                                        <input
                                            type="file"
                                            accept="application/pdf"
                                            onChange={(event) => setReplyFile(event.target.files?.[0] || null)}
                                        />
                                        <span>{replyFile ? `${replyFile.name}` : t("replayDashboard.attachPdf")}</span>
                                    </label>

                                    <div className="reply-actions">
                                        <button
                                            type="button"
                                            className="primary-send-btn"
                                            onClick={handleSendReply}
                                            disabled={isSending}
                                        >
                                            {isSending ? t("replayDashboard.sending") : t("replayDashboard.sendReply")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="empty-state">{t("replayDashboard.noLetterSelected")}</div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default ReplayDashboard;
