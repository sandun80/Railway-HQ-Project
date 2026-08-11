import { useEffect, useState } from "react";
import "../styles/sendingForms.css";
import axios from "axios";

function RegisteredLetters() {
    const today = new Date().toISOString().split("T")[0];

    const [formData, setFormData] = useState({
        letterNumber: "",
        letterTitle: "",
        destination: "",
        registeredPostNumber: "",
        letterDate:"",
    });

    const user = JSON.parse(localStorage.getItem("user"));
    const username = user?.username;

    const [pdfFile, setPdfFile] = useState(null);
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState("");
    const [isLetterLoaded, setIsLetterLoaded] = useState(false);

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

    const handleSubmit = async (event, status) => {
        event.preventDefault();

        try{
            
            const response = await axios.put(
                `http://localhost:5000/api/letters/${formData.letterNumber}`,
                {
                    
                    registeredPostNumber: formData.registeredPostNumber,
                    status: "Sent",

                }
            )

            alert("Registered post sending details saved.");

        }catch(e){
            const errorMessage = e?.response?.data?.message || "Failed to save registered letter.";
            alert(errorMessage);
            console.log(e);

        }
    };

    const handleDraftSave = async () => {
        
        try{
            const pdfData = pdfFile ? await convertPdfToBase64(pdfFile) : "";

            const response = await axios.post(
                "http://localhost:5000/api/letters",
                {
                    letterNumber: formData.letterNumber,
                    flow: "sending",
                    category: "registered",
                    title: formData.letterTitle,
                    destination: formData.destination,
                    letterDate: formData.letterDate,
                    registeredPostNumber: formData.registeredPostNumber,
                    status: "Draft",
                    sender: username,
                    pdf: pdfData,
                }
            )

            alert("Draft saved successfully.");

        }catch(error){
            const errorMessage = error?.response?.data?.message || "Failed to save draft.";
            alert(errorMessage);
            console.log(error);
            
        }
    };

    const handleSearchFromLetterNumber = async () => {
        
        try{

            const response = await axios.get(
            `http://localhost:5000/api/letters/${formData.letterNumber}`
        );

        const letter = response.data;

         setFormData({
            letterNumber: letter.letterNumber || "",
            letterTitle: letter.title || "",
            destination: letter.destination || "",
            registeredPostNumber: letter.registeredPostNumber || "",
            letterDate: letter.letterDate
                ? letter.letterDate.split("T")[0]
                : ""
        });

        setPdfPreviewUrl(letter.pdf || "");

        setIsLetterLoaded(true);

        alert("Letter data loaded successfully.");

        }catch(error){
            const errorMessage = error?.response?.data?.message || "Letter search failed.";
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
            <h3>Registered Post - Sending Register</h3>
            <div className="form-preview-layout">
                <form className="letter-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="field-group">
                            <label htmlFor="reg-letter-number">Letter Number</label>
                            <div className="inline-input-action">
                                <input
                                    id="reg-letter-number"
                                    name="letterNumber"
                                    type="text"
                                    value={formData.letterNumber}
                                    onChange={handleChange}
                                    required
                                    readOnly={isLetterLoaded}
                                />
                                <button
                                    type="button"
                                    className="small-search-btn"
                                    onClick={handleSearchFromLetterNumber}
                                >
                                    Search
                                </button>
                            </div>
                        </div>

                        <div className="field-group">
                            <label htmlFor="reg-date">Date</label>
                            <input
                                id="letter-date"
                                name="letterDate"
                                type="date"
                                value={formData.letterDate}
                                onChange={handleChange}
                                required
                                readOnly={isLetterLoaded}
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="reg-letter-title">Letter Title</label>
                            <input
                                id="reg-letter-title"
                                name="letterTitle"
                                type="text"
                                value={formData.letterTitle}
                                onChange={handleChange}
                                required
                                readOnly={isLetterLoaded}
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="reg-destination">Destination</label>
                            <input
                                id="reg-destination"
                                name="destination"
                                type="text"
                                value={formData.destination}
                                onChange={handleChange}
                                required
                                readOnly={isLetterLoaded}
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="reg-post-number">Registered Post Number</label>
                            <input
                                id="reg-post-number"
                                name="registeredPostNumber"
                                type="text"
                                value={formData.registeredPostNumber}
                                onChange={handleChange}
                                placeholder="Can be updated later"
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="reg-pdf-upload">Upload Letter PDF</label>
                            <input
                                id="reg-pdf-upload"
                                name="pdfUpload"
                                type="file"
                                accept="application/pdf"
                                onChange={handlePdfChange}
                                readOnly={isLetterLoaded}
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="draft-save-btn"
                            onClick={handleDraftSave}
                        >
                            Draft Save
                        </button>
                        <button type="submit">Save Registered Sending Entry</button>
                    </div>
                </form>

                <aside className="pdf-preview-panel" aria-label="Registered PDF preview">

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
                        <iframe title="Registered sending PDF preview" src={pdfPreviewUrl} />
                    ) : (
                        <p>No PDF selected.</p>
                    )}
                </aside>
            </div>
        </section>
    );
}

export default RegisteredLetters;