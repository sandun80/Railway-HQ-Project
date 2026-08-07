import { useEffect, useState } from "react";
import "../styles/receivingForms.css";
import axios from "axios";

function NormalReceive() {

    const today = new Date().toISOString().split("T")[0];

    const [formData, setFormData] = useState({
        letterNumber: "",
        letterDate: "",
        sender: "",
        dateReceived: "",
        letterTitle: "",
        destinationBranch: "",
        receivingConfirmation: "",
    });
    const [pdfFile, setPdfFile] = useState(null);
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState("");

    const convertPdfToBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

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

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const pdfData = pdfFile ? await convertPdfToBase64(pdfFile) : "";

            await axios.post("http://localhost:5000/api/letters", {
                letterNumber: formData.letterNumber,
                flow: "receiving",
                category: "normal",
                sender: formData.sender,
                title: formData.letterTitle,
                destination: formData.destinationBranch,
                letterDate: formData.letterDate,
                dateRecived: formData.dateReceived,
                status: "Received",
                pdf: pdfData,
            });

            alert("Normal post receiving details saved.");
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Failed to save normal receiving letter.";
            alert(errorMessage);
            console.log(error);
        }
    };

    const handlePdfChange = (event) => {
        const file = event.target.files?.[0] || null;
        setPdfFile(file);
    };

    return (
        <section className="letter-form-section receiving-section">
            <h3>Normal Post - Receiving Register</h3>
            <div className="form-preview-layout">
                <form className="letter-form" onSubmit={handleSubmit}>
                    <div className="form-grid">

                        <div className="field-group">
                            <label htmlFor="rec-normal-number">Letter Number</label>
                            <input
                                id="rec-normal-number"
                                name="letterNumber"
                                type="text"
                                value={formData.letterNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="rec-normal-sender">Sender</label>
                            <input
                                id="rec-normal-sender"
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
                                id="recieveNormal-letter-date"
                                name="letterDate"
                                type="date"
                                value={formData.letterDate}
                                onChange={handleChange}
                                required
                            />
                        </div>


                        <div className="field-group">
                            <label htmlFor="rec-normal-date">Date Received</label>
                            <input
                                id="rec-normal-date"
                                name="dateReceived"
                                type="date"
                                value={formData.dateReceived}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="rec-normal-title">Letter Title</label>
                            <input
                                id="rec-normal-title"
                                name="letterTitle"
                                type="text"
                                value={formData.letterTitle}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="rec-normal-branch">Destination Branch</label>
                            <input
                                id="rec-normal-branch"
                                name="destinationBranch"
                                type="text"
                                value={formData.destinationBranch}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="rec-normal-pdf-upload">Upload Letter PDF</label>
                            <input
                                id="rec-normal-pdf-upload"
                                name="pdfUpload"
                                type="file"
                                accept="application/pdf"
                                onChange={handlePdfChange}
                            />
                        </div>
                    </div>

                    <button type="submit">Save Normal Receiving Entry</button>
                </form>

                <aside className="pdf-preview-panel" aria-label="Normal receive PDF preview">
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
                        <iframe title="Normal receiving PDF preview" src={pdfPreviewUrl} />
                    ) : (
                        <p>No PDF selected.</p>
                    )}
                </aside>
            </div>
        </section>
    );
}

export default NormalReceive;