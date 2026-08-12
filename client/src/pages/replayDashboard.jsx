import { useMemo, useState } from "react";
import "../styles/replyDashboard.css";

const initialLetters = [
    {
        id: 1,
        letterNumber: "RHL-2026-041",
        sender: "Ministry of Transport",
        subject: "Budget approval review",
        category: "Registered",
        flow: "Receiving",
        status: "Pending",
        date: "2026-08-11",
        summary:
            "Please review the revised transport budget submission and confirm whether the office can proceed with approval before the end of this week.",
        pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        unread: true
    },
    {
        id: 2,
        letterNumber: "RHL-2026-038",
        sender: "Regional Audit Office",
        subject: "Inspection follow-up",
        category: "Normal",
        flow: "Receiving",
        status: "In Review",
        date: "2026-08-10",
        summary:
            "Kindly provide supporting records related to the last quarter inspection report and indicate your response timeline.",
        pdfUrl: "",
        unread: false
    },
    {
        id: 3,
        letterNumber: "RHL-2026-033",
        sender: "Human Resources Division",
        subject: "Staff transfer notice",
        category: "By Hand",
        flow: "Sending",
        status: "Replied",
        date: "2026-08-08",
        summary:
            "This letter contains the official transfer notice for staff deployment coordination and required acknowledgment.",
        pdfUrl: "",
        unread: false
    }
];

function ReplayDashboard() {
    const [letters, setLetters] = useState(initialLetters);
    const [selectedId, setSelectedId] = useState(initialLetters[0]?.id ?? null);
    const [searchTerm, setSearchTerm] = useState("");
    const [replyText, setReplyText] = useState("");
    const [replyFile, setReplyFile] = useState(null);
    const [draftSaved, setDraftSaved] = useState(false);

    const filteredLetters = useMemo(() => {
        if (!searchTerm.trim()) return letters;

        return letters.filter((letter) =>
            letter.letterNumber.toLowerCase().includes(searchTerm.trim().toLowerCase())
        );
    }, [letters, searchTerm]);

    const selectedLetter = useMemo(
        () => letters.find((letter) => letter.id === selectedId) || letters[0],
        [letters, selectedId]
    );

    const handleSelectLetter = (letterId) => {
        setSelectedId(letterId);
        setDraftSaved(false);
        setReplyText("");
        setReplyFile(null);

        setLetters((prev) =>
            prev.map((letter) =>
                letter.id === letterId ? { ...letter, unread: false } : letter
            )
        );
    };

    const handleSendReply = () => {
        if (!replyText.trim()) {
            alert("Please add a reply message before sending.");
            return;
        }

        alert(
            `Reply prepared for ${selectedLetter?.letterNumber}. ${replyFile ? `Attachment: ${replyFile.name}` : "No PDF attached."}`
        );
        setReplyText("");
        setReplyFile(null);
        setDraftSaved(false);
    };

    const handleSaveDraft = () => {
        setDraftSaved(true);
        alert("Reply draft saved locally.");
    };

    return (
        <div className="reply-dashboard-page">
            <div className="reply-dashboard-shell">
                <aside className="inbox-sidebar">
                    <div className="sidebar-header">
                        <div>
                            <p className="eyebrow">Inbox</p>
                            <h2>Your Mails</h2>
                        </div>
                        <span className="sidebar-badge">{letters.length}</span>
                    </div>

                    <div className="mail-search-box">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Search by letter no."
                            aria-label="Search letter by number"
                        />
                        <button type="button">Search</button>
                    </div>

                    <div className="inbox-list">
                        {filteredLetters.map((letter) => (
                            <button
                                key={letter.id}
                                type="button"
                                className={`inbox-item ${selectedLetter?.id === letter.id ? "active" : ""}`}
                                onClick={() => handleSelectLetter(letter.id)}
                            >
                                <div className="inbox-top-row">
                                    <span className="sender-name">{letter.sender}</span>
                                    {letter.unread && <span className="unread-dot" />}
                                </div>
                                <p className="letter-subject">{letter.subject}</p>
                                <div className="inbox-meta-row">
                                    <span>{letter.letterNumber}</span>
                                    <span>{letter.date}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </aside>

                <main className="inbox-main">
                    {selectedLetter ? (
                        <>
                            <div className="letter-header-card">
                                <div>
                                    <p className="eyebrow">Letter details</p>
                                    <h3>{selectedLetter.subject}</h3>
                                </div>
                                <div className="status-group">
                                    <span className="status-pill" data-status={selectedLetter.status}>{selectedLetter.status}</span>
                                </div>
                            </div>

                            <div className="detail-grid">
                                <div className="detail-card">
                                    <label>From</label>
                                    <p>{selectedLetter.sender}</p>
                                </div>
                                <div className="detail-card">
                                    <label>Letter No.</label>
                                    <p>{selectedLetter.letterNumber}</p>
                                </div>
                                <div className="detail-card">
                                    <label>Category</label>
                                    <p>{selectedLetter.category}</p>
                                </div>
                                <div className="detail-card">
                                    <label>Flow</label>
                                    <p>{selectedLetter.flow}</p>
                                </div>
                                <div className="detail-card">
                                    <label>Received</label>
                                    <p>{selectedLetter.date}</p>
                                </div>
                                <div className="detail-card">
                                    <label>Attachment</label>
                                    <p>{selectedLetter.pdfUrl ? "PDF available" : "No PDF"}</p>
                                </div>
                            </div>

                            <div className="summary-card">
                                <label>Message</label>
                                <p>{selectedLetter.summary}</p>
                            </div>

                            <div className="letter-actions-row">
                                {selectedLetter.pdfUrl && (
                                    <a
                                        href={selectedLetter.pdfUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="primary-link-btn"
                                    >
                                        Open PDF
                                    </a>
                                )}
                                <button type="button" className="secondary-outline-btn">
                                    View full letter
                                </button>
                            </div>

                            <div className="reply-panel">
                                <div className="reply-header-row">
                                    <h4>Reply to letter</h4>
                                    {draftSaved && <span className="draft-indicator">Draft saved</span>}
                                </div>

                                <textarea
                                    value={replyText}
                                    onChange={(event) => setReplyText(event.target.value)}
                                    placeholder="Write your response here..."
                                />

                                <div className="reply-footer-row">
                                    <label className="file-upload-label">
                                        <input
                                            type="file"
                                            accept="application/pdf"
                                            onChange={(event) => setReplyFile(event.target.files?.[0] || null)}
                                        />
                                        <span>{replyFile ? `Attached: ${replyFile.name}` : "Attach PDF"}</span>
                                    </label>

                                    <div className="reply-actions">
                                        <button type="button" className="secondary-outline-btn" onClick={handleSaveDraft}>
                                            Save draft
                                        </button>
                                        <button type="button" className="primary-send-btn" onClick={handleSendReply}>
                                            Send reply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="empty-state">No letter selected.</div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default ReplayDashboard;
