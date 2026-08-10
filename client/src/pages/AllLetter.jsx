import { useEffect } from "react";
import "../styles/allLetter.css";
import { useState } from "react";
import axios from "axios";

function AllLetter() {

    const [letters, setLetters] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    const formatDateForInput = (value) => {
        if (!value) return "";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "";
        return date.toISOString().split("T")[0];
    };

    const getLetters = async() =>{
        try{

            const response = await axios.get(
                 "http://localhost:5000/api/letters/getallletters"
            );

            setLetters(response.data);

        }catch(e){
            console.log(e);
        }
    }

    const handleFilterChange = (event) => {
    const { name, value } = event.target;

        setFilters((prev) => ({
            ...prev,
            [name]: value
        }));
    };



    const handleSearch = async () => {

    try {

        const response = await axios.get(
            "http://localhost:5000/api/letters/filter",
            {
                params: filters
            }
        );

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

    const openPopupPanel = (letter) => {
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
            pdf: letter.pdf || ""
        });

        setIsModalOpen(true);
    };

    const closePopupPanel = () => {
        setIsModalOpen(false);
        setSelectedLetterNumber("");
        setEditPdfFile(null);
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
            closePopupPanel();
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Failed to update letter.";
            alert(errorMessage);
            console.error(error);
        } finally {
            setIsUpdating(false);
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

                             <tr key={letter._id || letter.letterNo}>

                                <td>{letter.letterNumber}</td>
                                <td>{letter.flow}</td>
                                <td>{letter.category}</td>
                                <td>{letter.title}</td>
                                <td>{letter.destination}</td>
                                <td>{letter.letterDate ? new Date(letter.letterDate).toLocaleDateString() : "-"}</td>
                                <td>{letter.status}</td>

                                <td>
                                    <button
                                        className="view-btn"
                                        onClick={() => openPopupPanel(letter)}
                                    >
                                        View
                                    </button>
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            {isModalOpen && (
                <div className="letter-modal-overlay" onClick={closePopupPanel}>
                    <div className="letter-modal" onClick={(event) => event.stopPropagation()}>
                        <div className="letter-modal-header">
                            <h3>Letter Details</h3>
                            <button type="button" className="letter-modal-close" onClick={closePopupPanel}>
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
                            <button type="button" className="reset-btn" onClick={closePopupPanel}>
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

        </div>
    );
}

export default AllLetter;