import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../styles/receivingForms.css";
import axios from "axios";

function RegisteredRecieve() {
    const { t } = useTranslation();

    const today = new Date().toISOString().split("T")[0];

    const [formData, setFormData] = useState({
        letterNumber: "",
        letterDate: "",
        sender: "",
        dateReceived: "",
        letterTitle: "",
        registeredPostNumber: "",
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
                category: "registered",
                sender: formData.sender,
                title: formData.letterTitle,
                destination: formData.destinationBranch,
                letterDate: formData.letterDate,
                dateRecived: formData.dateReceived,
                registeredPostNumber: formData.registeredPostNumber,
                status: "Received",
                pdf: pdfData,
            });

            alert("Registered post receiving details saved.");
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Failed to save registered receiving letter.";
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
            <h3>{t("registeredReceive.heading")}</h3>
            <div className="form-preview-layout">
                <form className="letter-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="field-group">

                            <div className="field-group">
                            <label htmlFor="rec-reg-number">{t("registeredReceive.letterNumber")}</label>
                            <input
                                id="rec-reg-letter-number"
                                name="letterNumber"
                                type="text"
                                value={formData.letterNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>

                            <label htmlFor="rec-reg-sender">{t("registeredReceive.sender")}</label>
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
                            <label htmlFor="reg-date">{t("registeredReceive.date")}</label>
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
                            <label htmlFor="rec-reg-date">{t("registeredReceive.dateReceived")}</label>
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
                            <label htmlFor="rec-reg-title">{t("registeredReceive.letterTitle")}</label>
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
                            <label htmlFor="rec-reg-number">{t("registeredReceive.registeredPostNumber")}</label>
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
                            <label htmlFor="rec-reg-branch">{t("registeredReceive.destinationBranch")}</label>
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
                            <label htmlFor="rec-reg-pdf-upload">{t("registeredReceive.uploadPdf")}</label>
                            <input
                                id="rec-reg-pdf-upload"
                                name="pdfUpload"
                                type="file"
                                accept="application/pdf"
                                onChange={handlePdfChange}
                            />
                        </div>
                    </div>

                    <button type="submit">{t("registeredReceive.saveEntry")}</button>
                </form>

                <aside className="pdf-preview-panel" aria-label="Registered receive PDF preview">

                    <div className="field-group">
                            <label htmlFor="reg-current-date">{t("registeredReceive.currentDate")}</label>
                            <input 
                                className="current-date"
                                name="current-date"
                                value={today}
                                readOnly
                            />
                    </div>


                    <h4>{t("registeredReceive.pdfPreview")}</h4>
                    {pdfPreviewUrl ? (
                        <iframe title="Registered receiving PDF preview" src={pdfPreviewUrl} />
                    ) : (
                        <p>{t("registeredReceive.noPdfSelected")}</p>
                    )}
                </aside>
            </div>
        </section>
    );
}

export default RegisteredRecieve;