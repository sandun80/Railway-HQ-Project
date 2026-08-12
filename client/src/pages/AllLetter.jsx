import { useEffect, useState } from "react";
import "../styles/allLetter.css";
import axios from "axios";

function AllLetter() {
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

    useEffect(() => {
        getLetters();
    }, []);

    const convertPdfToBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role;

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

    const getLetters = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/letters/getallletters");
            setLetters(response.data);
        } catch (error) {
            console.log(error);
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

        getLetters();
    };

    return (
        <div className="all-letter-page">
            <div className="search-filter">
                <input
                    type="text"
                    placeholder="Letter No."
                    name="letterNumber"
                    value={filters.letterNumber}
                    onChange={handleFilterChange}
                />

                <input
                    type="text"
                    placeholder="Sent To"
                    name="sentTo"
                    value={filters.sentTo}
                    onChange={handleFilterChange}
                />

                <input
                    type="text"
                    placeholder="Received From"
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
                    Search
                </button>

                <button className="reset-btn" onClick={handleReset}>
                    Reset
                </button>
            </div>

            <div className="table-container">
                <table className="letter-table">
                    <thead>
                        <tr>
                            <th>Letter No.</th>
                            <th>Flow</th>
                            <th>Category</th>
                            <th>Title</th>
                            <th>Destination</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Action</th>
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
                                                Edit
                                            </button>

                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDeleteLetter(letter)}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}

                                    <button
                                        className="view-btn secondary-view-btn"
                                        onClick={() => openViewPanel(letter)}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isEditModalOpen && (
                <div className="letter-modal-overlay" onClick={closeEditPanel}>
                    <div className="letter-modal" onClick={(event) => event.stopPropagation()}>
                        <div className="letter-modal-header">
                            <h3>Edit Letter</h3>
                            <button type="button" className="letter-modal-close" onClick={closeEditPanel}>
                                x
                            </button>
                        </div>

                        <div className="letter-modal-body">
                            <div className="letter-modal-grid">
                                <div className="field-group">
                                    <label htmlFor="edit-letter-number">Letter Number</label>
                                    <input
                                        id="edit-letter-number"
                                        name="letterNumber"
                                        value={editForm.letterNumber}
                                        onChange={handleEditFieldChange}
                                    />
                                </div>

                                <div className="field-group">
                                    <label htmlFor="edit-flow">Flow</label>
                                    <select
                                        id="edit-flow"
                                        name="flow"
                                        value={editForm.flow}
                                        onChange={handleEditFieldChange}
                                    >
                                        <option value="">Select flow</option>
                                        <option value="sending">sending</option>
                                        <option value="receiving">receiving</option>
                                    </select>
                                </div>

                                <div className="field-group">
                                    <label htmlFor="edit-category">Category</label>
                                    <select
                                        id="edit-category"
                                        name="category"
                                        value={editForm.category}
                                        onChange={handleEditFieldChange}
                                    >
                                        <option value="">Select category</option>
                                        <option value="registered">registered</option>
                                        <option value="normal">normal</option>
                                        <option value="byhand">byhand</option>
                                        <option value="specialByhand">specialByhand</option>
                                    </select>
                                </div>

                                <div className="field-group">
                                    <label htmlFor="edit-title">Title</label>
                                    <input
                                        id="edit-title"
                                        name="title"
                                        value={editForm.title}
                                        onChange={handleEditFieldChange}
                                    />
                                </div>

                                <div className="field-group">
                                    <label htmlFor="edit-sender">Sender</label>
                                    <input
                                        id="edit-sender"
                                        name="sender"
                                        value={editForm.sender}
                                        onChange={handleEditFieldChange}
                                        readOnly
                                    />
                                </div>

                                <div className="field-group">
                                    <label htmlFor="edit-receiver">Receiver</label>
                                    <input
                                        id="edit-receiver"
                                        name="receiver"
                                        value={editForm.receiver}
                                        onChange={handleEditFieldChange}
                                    />
                                </div>

                                <div className="field-group">
                                    <label htmlFor="edit-destination">Destination</label>
                                    <input
                                        id="edit-destination"
                                        name="destination"
                                        value={editForm.destination}
                                        onChange={handleEditFieldChange}
                                    />
                                </div>

                                <div className="field-group">
                                    <label htmlFor="edit-letter-date">Letter Date</label>
                                    <input
                                        id="edit-letter-date"
                                        type="date"
                                        name="letterDate"
                                        value={editForm.letterDate}
                                        onChange={handleEditFieldChange}
                                    />
                                </div>

                                <div className="field-group">
                                    <label htmlFor="edit-reg-post-number">Registered Post Number</label>
                                    <input
                                        id="edit-reg-post-number"
                                        name="registeredPostNumber"
                                        value={editForm.registeredPostNumber}
                                        onChange={handleEditFieldChange}
                                    />
                                </div>

                                <div className="field-group">
                                    <label htmlFor="edit-subject-officer">Subject / Department / Officer</label>
                                    <input
                                        id="edit-subject-officer"
                                        name="subject_department_or_officer"
                                        value={editForm.subject_department_or_officer}
                                        onChange={handleEditFieldChange}
                                    />
                                </div>

                                <div className="field-group">
                                    <label htmlFor="edit-date-received">Date Received</label>
                                    <input
                                        id="edit-date-received"
                                        type="date"
                                        name="dateRecived"
                                        value={editForm.dateRecived}
                                        onChange={handleEditFieldChange}
                                    />
                                </div>

                                <div className="field-group">
                                    <label htmlFor="edit-receiving-office">Receiving Office</label>
                                    <input
                                        id="edit-receiving-office"
                                        name="recivingOffice"
                                        value={editForm.recivingOffice}
                                        onChange={handleEditFieldChange}
                                    />
                                </div>

                                <div className="field-group">
                                    <label htmlFor="edit-status">Status</label>
                                    <input
                                        id="edit-status"
                                        name="status"
                                        value={editForm.status}
                                        onChange={handleEditFieldChange}
                                        readOnly
                                    />
                                </div>

                                

                                <div className="field-group full-width-field">
                                    <label htmlFor="edit-pdf">Replace PDF (optional)</label>
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
                                        Open current PDF
                                    </a>
                                )}

                                {editPdfFile && (
                                    <p className="new-pdf-name">Selected new PDF: {editPdfFile.name}</p>
                                )}
                            </div>
                        </div>

                        <div className="letter-modal-footer">
                            <button type="button" className="reset-btn" onClick={closeEditPanel}>
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="search-btn"
                                onClick={handleUpdateLetter}
                                disabled={isUpdating}
                            >
                                {isUpdating ? "Updating..." : "Update"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isViewModalOpen && selectedLetter && (
                <div className="letter-modal-overlay" onClick={closeViewPanel}>
                    <div className="letter-modal readonly-modal" onClick={(event) => event.stopPropagation()}>
                        <div className="letter-modal-header">
                            <div>
                                <p className="modal-kicker">Letter Details</p>
                                <h3>{selectedLetter.letterNumber || "-"}</h3>
                            </div>
                            <button type="button" className="letter-modal-close" onClick={closeViewPanel}>
                                ×
                            </button>
                        </div>

                        <div className="letter-modal-summary">
                            <span>{selectedLetter.flow || "-"}</span>
                            <span>{selectedLetter.category || "-"}</span>
                            <span>{selectedLetter.status || "-"}</span>
                        </div>

                        <div className="letter-modal-body">
                            <div className="letter-readonly-grid">
                                <div className="readonly-field">
                                    <label>Letter Number</label>
                                    <div>{selectedLetter.letterNumber || "-"}</div>
                                </div>

                                <div className="readonly-field">
                                    <label>Flow</label>
                                    <div>{selectedLetter.flow || "-"}</div>
                                </div>

                                <div className="readonly-field">
                                    <label>Category</label>
                                    <div>{selectedLetter.category || "-"}</div>
                                </div>

                                <div className="readonly-field">
                                    <label>Title</label>
                                    <div>{selectedLetter.title || "-"}</div>
                                </div>

                                <div className="readonly-field">
                                    <label>Sender</label>
                                    <div>{selectedLetter.sender || "-"}</div>
                                </div>

                                <div className="readonly-field">
                                    <label>Receiver</label>
                                    <div>{selectedLetter.receiver || "-"}</div>
                                </div>

                                <div className="readonly-field">
                                    <label>Destination</label>
                                    <div>{selectedLetter.destination || "-"}</div>
                                </div>

                                <div className="readonly-field">
                                    <label>Letter Date</label>
                                    <div>{formatDate(selectedLetter.letterDate)}</div>
                                </div>

                                <div className="readonly-field">
                                    <label>Registered Post Number</label>
                                    <div>{selectedLetter.registeredPostNumber || "-"}</div>
                                </div>

                                <div className="readonly-field">
                                    <label>Subject / Department / Officer</label>
                                    <div>{selectedLetter.subject_department_or_officer || "-"}</div>
                                </div>

                                <div className="readonly-field">
                                    <label>Date Received</label>
                                    <div>{formatDate(selectedLetter.dateRecived)}</div>
                                </div>

                                <div className="readonly-field">
                                    <label>Receiving Office</label>
                                    <div>{selectedLetter.recivingOffice || "-"}</div>
                                </div>

                                <div className="readonly-field">
                                    <label>Status</label>
                                    <div>{selectedLetter.status || "-"}</div>
                                </div>

                                <div className="readonly-field full-width-field reply-field">
                                    <label>Reply</label>
                                    <pre>{getReplyText(selectedLetter.reply)}</pre>
                                </div>

                                <div className="readonly-field full-width-field pdf-field">
                                    <label>Letter PDF</label>
                                    {selectedLetter.pdf ? (
                                        <button
                                            type="button"
                                            className="pdf-open-btn"
                                            onClick={() => window.open(selectedLetter.pdf, "_blank", "noopener,noreferrer")}
                                        >
                                            Open PDF in new tab
                                        </button>
                                    ) : (
                                        <div>No PDF attached.</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="letter-modal-footer">
                            <button type="button" className="search-btn" onClick={closeViewPanel}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AllLetter;
