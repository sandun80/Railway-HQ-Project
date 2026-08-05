import { useEffect, useState } from "react";
import "../styles/receivingForms.css";

function RegisteredRecieve() {

    const today = new Date().toISOString().split("T")[0];

    const [formData, setFormData] = useState({
        sender: "",
        dateReceived: "",
        letterTitle: "",
        registeredPostNumber: "",
        destinationBranch: "",
        receivingConfirmation: "",
    });
    const [pdfFile, setPdfFile] = useState(null);
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState("");

    useEffect(() => {
        if (!pdfFile) {
            setPdfPreviewUrl("");
            return;
        }

        const objectUrl = URL.createObjectURL(pdfFile);
        setPdfPreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [pdfFile]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        alert("Registered post receiving details saved.");
    };

    const handlePdfChange = (event) => {
        const file = event.target.files?.[0] || null;
        setPdfFile(file);
    };

    return (
        <section className="letter-form-section receiving-section">
            <h3>Registered Post - Receiving Register</h3>
            <div className="form-preview-layout">
                <form className="letter-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="field-group">
                            <label htmlFor="rec-reg-sender">Sender</label>
                            <input
                                id="rec-reg-sender"
                                name="sender"
                                type="text"
                                value={formData.sender}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="reg-date">Date</label>
                            <input
                                id="recieveReg-letter-date"
                                name="letterDate"
                                type="date"
                                value={formData.letterDate}
                                onChange={handleChange}
                                required
                            />
                        </div>


                        <div className="field-group">
                            <label htmlFor="rec-reg-date">Date Received</label>
                            <input
                                id="rec-reg-date"
                                name="dateReceived"
                                type="date"
                                value={formData.dateReceived}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="rec-reg-title">Letter Title</label>
                            <input
                                id="rec-reg-title"
                                name="letterTitle"
                                type="text"
                                value={formData.letterTitle}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="rec-reg-number">Registered Post Number</label>
                            <input
                                id="rec-reg-number"
                                name="registeredPostNumber"
                                type="text"
                                value={formData.registeredPostNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="rec-reg-branch">Destination Branch</label>
                            <input
                                id="rec-reg-branch"
                                name="destinationBranch"
                                type="text"
                                value={formData.destinationBranch}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="rec-reg-confirm">Receiving Confirmation</label>
                            <input
                                id="rec-reg-confirm"
                                name="receivingConfirmation"
                                type="text"
                                value={formData.receivingConfirmation}
                                onChange={handleChange}
                                placeholder="Name / acknowledgement"
                                required
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="rec-reg-pdf-upload">Upload Letter PDF</label>
                            <input
                                id="rec-reg-pdf-upload"
                                name="pdfUpload"
                                type="file"
                                accept="application/pdf"
                                onChange={handlePdfChange}
                            />
                        </div>
                    </div>

                    <button type="submit">Save Registered Receiving Entry</button>
                </form>

                <aside className="pdf-preview-panel" aria-label="Registered receive PDF preview">

                    <div className="field-group">
                            <label htmlFor="reg-current-date">Current Date</label>
                            <input 
                                className="current-date"
                                name="current-date"
                                value={today}
                                readOnly
                            />
                    </div>


                    <h4>PDF Preview</h4>
                    {pdfPreviewUrl ? (
                        <iframe title="Registered receiving PDF preview" src={pdfPreviewUrl} />
                    ) : (
                        <p>No PDF selected.</p>
                    )}
                </aside>
            </div>
        </section>
    );
}

export default RegisteredRecieve;