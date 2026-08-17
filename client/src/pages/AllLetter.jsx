import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../styles/allLetter.css";
import axios from "axios";

function AllLetter() {
    const { t } = useTranslation();
    const [letters, setLetters] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedLetter, setSelectedLetter] = useState(null);
    const [selectedLetterNumber, setSelectedLetterNumber] = useState("");
    const [editPdfFile, setEditPdfFile] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [editForm, setEditForm] = useState({
        letterNumber: "",
        flow: "",
        category: "",
        title: "",
        sender: "",
        receiver: "",
        destination: "",
        letterDate: "",
        registeredPostNumber: "",
        subject_department_or_officer: "",
        dateRecived: "",
        recivingOffice: "",
        status: "",
        reply: "",
        pdf: ""
    });
    const [filters, setFilters] = useState({
        letterNumber: "",
        sentTo: "",
        receivedFrom: "",
        date: ""
    });

    const convertPdfToBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role;
    const username = user?.username;

    useEffect(() => {
        if (username) {
            getLetters(username, role);
        }
    }, [username, role]);

    const formatDate = (value) => {
        if (!value) {
            return "-";
        }

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return "-";
        }

        return date.toLocaleDateString();
    };

    const formatDateForInput = (value) => {
        if (!value) return "";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "";
        return date.toISOString().split("T")[0];
    };

    const getReplyText = (reply) => {
        if (!reply) {
            return "No reply added.";
        }

        if (typeof reply === "string") {
            return reply;
        }

        if (typeof reply === "object") {
            return JSON.stringify(reply, null, 2);
        }

        return String(reply);
    };

    const getLetters = async (userName = username, currentRole = role) => {
        try {
            const isViewer = currentRole === "viewer";
            const endpoint = isViewer
                ? "http://localhost:5000/api/letters/getallletter"
                : "http://localhost:5000/api/letters/getalllettersbyrole";

            const response = await axios.get(endpoint, {
                params: isViewer
                    ? { role: currentRole }
                    : { username: userName }
            });

            setLetters(response.data);
        } catch (error) {
            console.error("Failed to get letters:", error);
        }
    };

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/letters/filter", {
                params: filters
            });

            setLetters(response.data);
        } catch (error) {
            console.error("Search failed:", error);
        }
    };

    const handleEditFieldChange = (event) => {
        const { name, value } = event.target;
        setEditForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const openEditPanel = (letter) => {
        setSelectedLetterNumber(letter.letterNumber || "");
        setEditPdfFile(null);
        setEditForm({
            letterNumber: letter.letterNumber || "",
            flow: letter.flow || "",
            category: letter.category || "",
            title: letter.title || "",
            sender: letter.sender || "",
            receiver: letter.receiver || "",
            destination: letter.destination || "",
            letterDate: formatDateForInput(letter.letterDate),
            registeredPostNumber: letter.registeredPostNumber || "",
            subject_department_or_officer: letter.subject_department_or_officer || "",
            dateRecived: formatDateForInput(letter.dateRecived),
            recivingOffice: letter.recivingOffice || "",
            status: letter.status || "",
            reply: letter.reply || "",
            pdf: letter.pdf || ""
        });
        setIsEditModalOpen(true);
    };

    const openViewPanel = (letter) => {
        setSelectedLetter(letter);
        setIsViewModalOpen(true);
    };

    const closeEditPanel = () => {
        setIsEditModalOpen(false);
        setSelectedLetterNumber("");
        setEditPdfFile(null);
    };

    const closeViewPanel = () => {
        setIsViewModalOpen(false);
        setSelectedLetter(null);
    };

    const handleEditPdfChange = (event) => {
        const file = event.target.files?.[0] || null;
        setEditPdfFile(file);
    };

    const handleUpdateLetter = async () => {
        if (!selectedLetterNumber) {
            alert("No letter selected for update.");
            return;
        }

        try {
            setIsUpdating(true);

            const nextPdf = editPdfFile
                ? await convertPdfToBase64(editPdfFile)
                : editForm.pdf;

            const payload = {
                letterNumber: editForm.letterNumber,
                flow: editForm.flow,
                category: editForm.category,
                title: editForm.title,
                sender: editForm.sender,
                receiver: editForm.receiver,
                destination: editForm.destination,
                letterDate: editForm.letterDate || null,
                registeredPostNumber: editForm.registeredPostNumber,
                subject_department_or_officer: editForm.subject_department_or_officer,
                dateRecived: editForm.dateRecived || null,
                recivingOffice: editForm.recivingOffice,
                status: editForm.status,
                reply: editForm.reply,
                pdf: nextPdf
            };

            const response = await axios.put(
                `http://localhost:5000/api/letters/${selectedLetterNumber}`,
                payload
            );

            const updatedLetter = response.data;

            setLetters((prev) =>
                prev.map((letter) =>
                    letter._id === updatedLetter._id ? updatedLetter : letter
                )
            );

            alert("Letter updated successfully.");
            closeEditPanel();
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Failed to update letter.";
            alert(errorMessage);
            console.error(error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteLetter = async (letter) => {
        const letterIdentifier = letter?.letterNumber || "this letter";
        const shouldDelete = window.confirm(`Are you sure you want to delete letter ${letterIdentifier}? This action cannot be undone.`);

        if (!shouldDelete) {
            return;
        }

        try {
            const response = await axios.delete(
                `http://localhost:5000/api/letters/${letterIdentifier}`
            );

            const deletedLetter = response.data?.deletedLetter || letter;
            setLetters((prev) =>
                prev.filter((item) =>
                    (item._id || item.letterNumber) !== (deletedLetter._id || deletedLetter.letterNumber)
                )
            );

            alert("Letter deleted successfully.");
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Failed to delete letter.";
            alert(errorMessage);
            console.error(error);
        }
    };

    const handleReset = async () => {
        setFilters({
            letterNumber: "",
            sentTo: "",
            receivedFrom: "",
            date: ""
        });

        getLetters(username, role);
    };

    return (
        <div className="all-letter-page">
            <div className="search-filter">
                <input
                    type="text"
                    placeholder={t("allLetter.letterNumberPlaceholder")}
                    name="letterNumber"
                    value={filters.letterNumber}
                    onChange={handleFilterChange}
                />

                <input
                    type="text"
                    placeholder={t("allLetter.sentToPlaceholder")}
                    name="sentTo"
                    value={filters.sentTo}
                    onChange={handleFilterChange}
                />

                <input
                    type="text"
                    placeholder={t("allLetter.receivedFromPlaceholder")}
                    name="receivedFrom"
                    value={filters.receivedFrom}
                    onChange={handleFilterChange}
                />

                <input
                    type="date"
                    name="date"
                    value={filters.date}
                    onChange={handleFilterChange}
                />

                <button className="search-btn" onClick={handleSearch}>
                    {t("common.search")}
                </button>

                <button className="reset-btn" onClick={handleReset}>
                    {t("common.reset")}
                </button>
            </div>

            <div className="table-container">
                <table className="letter-table">
                    <thead>
                        <tr>
                            <th>{t("allLetter.tableLetterNumber")}</th>
                            <th>{t("allLetter.tableFlow")}</th>
                            <th>{t("allLetter.tableCategory")}</th>
                            <th>{t("allLetter.tableTitle")}</th>
                            <th>{t("allLetter.tableDestination")}</th>
                            <th>{t("allLetter.tableDate")}</th>
                            <th>{t("allLetter.tableStatus")}</th>
                            <th>{t("allLetter.tableAction")}</th>
                        </tr>
                    </thead>

                    <tbody>
                        {letters.map((letter) => (
                            <tr key={letter._id || letter.letterNumber}>
                                <td>{letter.letterNumber}</td>
                                <td>{letter.flow}</td>
                                <td>{letter.category}</td>
                                <td>{letter.title}</td>
                                <td>{letter.destination}</td>
                                <td>{formatDate(letter.letterDate)}</td>
                                <td>{letter.status || "-"}</td>
                                <td className="action-cell">
                                    {role === "officer" && (
                                        <>
                                            <button
                                                className="view-btn"
                                                onClick={() => openEditPanel(letter)}
                                            >
                                                {t("common.edit")}
                                            </button>

                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDeleteLetter(letter)}
                                            >
                                                {t("common.delete")}
                                            </button>
                                        </>
                                    )}

                                    <button
                                        className="view-btn secondary-view-btn"
                                        onClick={() => openViewPanel(letter)}
                                    >
                                        {t("common.view")}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="letter-modal-overlay" onClick={closeEditPanel}>
                    <div className="letter-modal" onClick={(event) => event.stopPropagation()}>
                        <div className="letter-modal-header">
                            <div>
                                <p className="modal-kicker">UPDATE RECORD</p>
                                <h3>{t("allLetter.editLetter")}{editForm.letterNumber ? `: ${editForm.letterNumber}` : ""}</h3>
                            </div>
                            <button type="button" className="letter-modal-close" onClick={closeEditPanel}>
                                ×
                            </button>
                        </div>

                        <div className="letter-modal-body">
                            <div className="letter-modal-grid">
                                <div className="field-group">
                                    <label htmlFor="edit-letter-number">{t("allLetter.letterNumberLabel")}</label>
                                    <input
                                        id="edit-letter-number"
                                        name="letterNumber"
                                        value={editForm.letterNumber}
                                        onChange={handleEditFieldChange}
                                    />
                                </div>

                                <div className="field-group">
                                    <label htmlFor="edit-flow">{t("allLetter.flowLabel")}</label>
                                    <select
                                        id="edit-flow"
                                        name="flow"
                                        value={editForm.flow}
                                        onChange={handleEditFieldChange}
                                    >
                                        <option value="">{t("allLetter.selectFlow")}</option>
                                        <option value="sending">sending</option>
                                        <option value="receiving">receiving</option>
                                    </select>
                                </div>

                                <div className="field-group">
                                    <label htmlFor="edit-category">{t("allLetter.categoryLabel")}</label>
                                    <select
                                        id="edit-category"
                                        name="category"
                                        value={editForm.category}
                                        onChange={handleEditFieldChange}
                                    >
                                        <option value="">{t("allLetter.selectCategory")}</option>
                                        <option value="registered">registered</option>
                                        <option value="normal">normal</option>
                                        <option value="byhand">byhand</option>
                                        <option value="specialByhand">specialByhand</option>
                                    </select>
                                </div>

                                <div className="field-group">
                                    <label htmlFor="edit-title">{t("allLetter.titleLabel")}</label>
                                    <input
                                        id="edit-title"
                                        name="title"
                                        value={editForm.title}
                                        onChange={handleEditFieldChange}
                                    />
                                </div>

                                <div className="field-group">
                                    <label htmlFor="edit-sender">{t("allLetter.senderLabel")}</label>
                                    <input
                                        id="edit-sender"
                                        name="sender"
                                        value={editForm.sender}
                                        onChange={handleEditFieldChange}
                                        readOnly
                                    />
                                </div>

                                <div className="field-group">
                                    <label htmlFor="edit-receiver">{t("allLetter.receiverLabel")}</label>
                                    <input
                                        id="edit-receiver"
                                        name="receiver"
                                        value={editForm.receiver}
                                        onChange={handleEditFieldChange}
                                    />
                                </div>

                                <div className="field-group">
                                    <label htmlFor="edit-destination">{t("allLetter.destinationLabel")}</label>
                                    <input
                                        id="edit-destination"
                                        name="destination"
                                        value={editForm.destination}
                                        onChange={handleEditFieldChange}
                                    />
                                </div>

                                <div className="field-group">
                                    <label htmlFor="edit-letter-date">{t("allLetter.letterDateLabel")}</label>
                                    <input
                                        id="edit-letter-date"
                                        type="date"
                                        name="letterDate"
                                        value={editForm.letterDate}
                                        onChange={handleEditFieldChange}
                                    />
                                </div>

                                <div className="field-group">
                                    <label htmlFor="edit-reg-post-number">{t("allLetter.registeredPostNumberLabel")}</label>
                                    <input
                                        id="edit-reg-post-number"
                                        name="registeredPostNumber"
                                        value={editForm.registeredPostNumber}
                                        onChange={handleEditFieldChange}
                                    />
                                </div>

                                <div className="field-group">
                                    <label htmlFor="edit-subject-officer">{t("allLetter.subjectDeptOfficerLabel")}</label>
                                    <input
                                        id="edit-subject-officer"
                                        name="subject_department_or_officer"
                                        value={editForm.subject_department_or_officer}
                                        onChange={handleEditFieldChange}
                                    />
                                </div>

                                <div className="field-group">
                                    <label htmlFor="edit-date-received">{t("allLetter.dateReceivedLabel")}</label>
                                    <input
                                        id="edit-date-received"
                                        type="date"
                                        name="dateRecived"
                                        value={editForm.dateRecived}
                                        onChange={handleEditFieldChange}
                                    />
                                </div>

                                <div className="field-group">
                                    <label htmlFor="edit-receiving-office">{t("allLetter.receivingOfficeLabel")}</label>
                                    <input
                                        id="edit-receiving-office"
                                        name="recivingOffice"
                                        value={editForm.recivingOffice}
                                        onChange={handleEditFieldChange}
                                    />
                                </div>

                                <div className="field-group">
                                    <label htmlFor="edit-status">{t("allLetter.statusLabel")}</label>
                                    <input
                                        id="edit-status"
                                        name="status"
                                        value={editForm.status}
                                        onChange={handleEditFieldChange}
                                        readOnly
                                    />
                                </div>

                                <div className="field-group full-width-field">
                                    <label htmlFor="edit-pdf">{t("allLetter.replacePdf")}</label>
                                    <input
                                        id="edit-pdf"
                                        type="file"
                                        accept="application/pdf"
                                        onChange={handleEditPdfChange}
                                    />
                                </div>

                                {editForm.pdf && !editPdfFile && (
                                    <a
                                        className="existing-pdf-link"
                                        href={editForm.pdf}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {t("allLetter.openCurrentPdf")}
                                    </a>
                                )}

                                {editPdfFile && (
                                    <p className="new-pdf-name">{t("allLetter.selectedNewPdf")} {editPdfFile.name}</p>
                                )}
                            </div>
                        </div>

                        <div className="letter-modal-footer">
                            <button type="button" className="reset-btn" onClick={closeEditPanel}>
                                {t("allLetter.cancel")}
                            </button>
                            <button
                                type="button"
                                className="search-btn"
                                onClick={handleUpdateLetter}
                                disabled={isUpdating}
                            >
                                {isUpdating ? t("allLetter.updating") : t("allLetter.update")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Details Sheet Card Modal */}
            {isViewModalOpen && selectedLetter && (
                <div className="letter-modal-overlay" onClick={closeViewPanel}>
                    <div className="modal-card" onClick={(event) => event.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title-area">
                                <span className="modal-badge-id">
                                    {selectedLetter.letterNumber || "NO-REF"}
                                </span>
                                <h3>Letter Details Sheet</h3>
                            </div>
                            <button type="button" className="modal-close" onClick={closeViewPanel}>
                                ×
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="detail-grid">
                                <div className="detail-cell">
                                    <span className="detail-label">Reference Number</span>
                                    <span className="detail-value">{selectedLetter.letterNumber || "-"}</span>
                                </div>

                                <div className="detail-cell">
                                    <span className="detail-label">Date Received / Date</span>
                                    <span className="detail-value">{formatDate(selectedLetter.dateRecived || selectedLetter.letterDate)}</span>
                                </div>

                                <div className="detail-cell">
                                    <span className="detail-label">Source Stream</span>
                                    <span className="detail-value">
                                        {selectedLetter.flow ? selectedLetter.flow.toUpperCase() : "N/A"} ({selectedLetter.category || "Normal"})
                                    </span>
                                </div>

                                <div className="detail-cell">
                                    <span className="detail-label">Current Letter Status</span>
                                    <span className={`detail-value badge badge-status-${(selectedLetter.status || "normal").toLowerCase()}`}>
                                        {selectedLetter.status || "Normal"}
                                    </span>
                                </div>

                                <div className="detail-cell span-2">
                                    <span className="detail-label">Sender / Organization</span>
                                    <span className="detail-value font-semibold">{selectedLetter.sender || "-"}</span>
                                </div>

                                <div className="detail-cell span-2">
                                    <span className="detail-label">Subject Title / Description</span>
                                    <span className="detail-value">{selectedLetter.title || "-"}</span>
                                </div>

                                <div className="detail-cell">
                                    <span className="detail-label">Assigned Division / Destination</span>
                                    <span className="detail-value">{selectedLetter.destination || "-"}</span>
                                </div>

                                <div className="detail-cell">
                                    <span className="detail-label">Receiving Office / Receiver</span>
                                    <span className="detail-value">{selectedLetter.recivingOffice || selectedLetter.receiver || "-"}</span>
                                </div>

                                <div className="detail-cell span-2">
                                    <span className="detail-label">Subject / Dept / Officer</span>
                                    <span className="detail-value">{selectedLetter.subject_department_or_officer || "-"}</span>
                                </div>

                                {selectedLetter.registeredPostNumber && (
                                    <div className="detail-cell">
                                        <span className="detail-label">Registered Post Number</span>
                                        <span className="detail-value">{selectedLetter.registeredPostNumber}</span>
                                    </div>
                                )}

                                {selectedLetter.reply && (
                                    <div className="detail-cell span-2">
                                        <span className="detail-label">Reply Content</span>
                                        <div className="detail-value reply-box">{getReplyText(selectedLetter.reply)}</div>
                                    </div>
                                )}

                                <div className="detail-cell span-2">
                                    <span className="detail-label">Attached Document (PDF / Image)</span>
                                    <div className="detail-value">
                                        {selectedLetter.pdf ? (
                                            <div className="attachment-box">
                                                <div className="attachment-icon">📄</div>
                                                <div className="attachment-info">
                                                    <div className="attachment-title">View Attached PDF Document</div>
                                                    <div className="attachment-sub">Format: PDF Document</div>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="btn-open-pdf"
                                                    onClick={() => window.open(selectedLetter.pdf, "_blank", "noopener,noreferrer")}
                                                >
                                                    Open / View ↗
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="no-attachment-text">No PDF document attached</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Handling Timeline Section */}
                            <div className="modal-timeline-section">
                                <h4>Handling Timeline</h4>
                                <ul className="modal-timeline">
                                    <li>
                                        <span className="timeline-dot dot-green"></span>
                                        <div className="timeline-content">
                                            <h5>Registered</h5>
                                            <p>
                                                Sender: <strong>{selectedLetter.sender || "System"}</strong> → Destination: <strong>{selectedLetter.destination || "Registry"}</strong>
                                            </p>
                                            <span className="timeline-time">{formatDate(selectedLetter.letterDate || selectedLetter.createdAt)}</span>
                                        </div>
                                    </li>

                                    {selectedLetter.status === "Replied" && (
                                        <li>
                                            <span className="timeline-dot dot-blue"></span>
                                            <div className="timeline-content">
                                                <h5>Action Completed / Replied</h5>
                                                <p>
                                                    Assigned Handler: <strong>{selectedLetter.destination || "Officer"}</strong> replied to letter.
                                                </p>
                                                <span className="timeline-time">{formatDate(selectedLetter.updatedAt || new Date())}</span>
                                            </div>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn-close-sheet" onClick={closeViewPanel}>
                                Close Sheet
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AllLetter;
