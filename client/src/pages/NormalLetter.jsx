import { useEffect, useState } from "react";
import "../styles/sendingForms.css";
import axios from "axios";

function NormalLetter() {
    const today = new Date().toISOString().split("T")[0];

    const [formData, setFormData] = useState({
        letterNumber: "",
        letterDate: "",
        letterTitle: "",
        destination: "",
    });

    const user = JSON.parse(localStorage.getItem("user"));
    const username = user?.username;
    
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
        
        try{
            const pdfData = pdfFile ? await convertPdfToBase64(pdfFile) : "";

            const response = await axios.post(
                "http://localhost:5000/api/letters",
                {
                    letterNumber: formData.letterNumber,
                    flow: "sending",
                    category: "normal",
                    letterDate: formData.letterDate,
                    title: formData.letterTitle,
                    destination: formData.destination,
                    status: "Sent",
                    sender: username,
                    pdf: pdfData,

                }
            )

            alert("Normal post sending details saved.");

        }catch(error){
            const errorMessage = error?.response?.data?.message || "Failed to save normal sending letter.";
            alert(errorMessage);
            console.log(error);
            
        }
    };

    const handlePdfChange = (event) => {
        const file = event.target.files?.[0] || null;
        setPdfFile(file);
    };

    return (
        <section className="letter-form-section">
            <h3>Normal Post - Sending Register</h3>
            <div className="form-preview-layout">
                <form className="letter-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="field-group">
                            <label htmlFor="normal-letter-number">Letter Number</label>
                            <input
                                id="normal-letter-number"
                                name="letterNumber"
                                type="text"
                                value={formData.letterNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="reg-date">Date</label>
                            <input
                                id="normal-letter-date"
                                name="letterDate"
                                type="date"
                                value={formData.letterDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="normal-letter-title">Letter Title</label>
                            <input
                                id="normal-letter-title"
                                name="letterTitle"
                                type="text"
                                value={formData.letterTitle}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="normal-destination">Destination</label>
                            <input
                                id="normal-destination"
                                name="destination"
                                type="text"
                                value={formData.destination}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="normal-pdf-upload">Upload Letter PDF</label>
                            <input
                                id="normal-pdf-upload"
                                name="pdfUpload"
                                type="file"
                                accept="application/pdf"
                                onChange={handlePdfChange}
                            />
                        </div>
                    </div>

                    <button type="submit">Save Normal Sending Entry</button>
                </form>

                <aside className="pdf-preview-panel" aria-label="Normal PDF preview">

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
                        <iframe title="Normal sending PDF preview" src={pdfPreviewUrl} />
                    ) : (
                        <p>No PDF selected.</p>
                    )}
                </aside>
            </div>
        </section>
    );
}

export default NormalLetter;