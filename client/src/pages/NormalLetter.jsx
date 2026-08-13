import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../styles/sendingForms.css";
import axios from "axios";

function NormalLetter() {
    const { t } = useTranslation();
    const today = new Date().toISOString().split("T")[0];

    const [formData, setFormData] = useState({
        letterNumber: "",
        letterDate: "",
        letterTitle: "",
        destination: "",
    });

    const [roles, setRoles] = useState([]);
    const excludedRoleNames = ["officer", "viewer", "admin"];
    const filteredRoles = roles.filter(
        (role) => !excludedRoleNames.includes(String(role.name).toLowerCase())
    );
    const departmentRoles = filteredRoles.length > 0 ? filteredRoles : roles;

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

    useEffect(() => {
        const getRoles = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/roles/getroles");
                setRoles(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        getRoles();
    }, []);

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
            <h3>{t("normalLetter.heading")}</h3>
            <div className="form-preview-layout">
                <form className="letter-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="field-group">
                            <label htmlFor="normal-letter-number">{t("normalLetter.letterNumber")}</label>
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
                            <label htmlFor="reg-date">{t("normalLetter.date")}</label>
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
                            <label htmlFor="normal-letter-title">{t("normalLetter.letterTitle")}</label>
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
                            <label htmlFor="normal-destination">{t("normalLetter.destination")}</label>
                            <select
                                id="normal-destination"
                                name="destination"
                                value={formData.destination}
                                onChange={handleChange}
                                required
                            >
                                <option value="">{t("normalLetter.selectRole")}</option>

                                {departmentRoles.map((role) => (
                                    <option key={role._id} value={role.name}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="field-group">
                            <label htmlFor="normal-pdf-upload">{t("normalLetter.uploadPdf")}</label>
                            <input
                                id="normal-pdf-upload"
                                name="pdfUpload"
                                type="file"
                                accept="application/pdf"
                                onChange={handlePdfChange}
                            />
                        </div>
                    </div>

                    <button type="submit">{t("normalLetter.saveEntry")}</button>
                </form>

                <aside className="pdf-preview-panel" aria-label="Normal PDF preview">

                    <div className="field-group">
                            <label htmlFor="reg-current-date">{t("normalLetter.currentDate")}</label>
                            <input 
                                className="current-date"
                                name="current-date"
                                value={today}
                                readOnly
                            />
                    </div>

                    <h4>{t("normalLetter.pdfPreview")}</h4>
                    {pdfPreviewUrl ? (
                        <iframe title="Normal sending PDF preview" src={pdfPreviewUrl} />
                    ) : (
                        <p>{t("normalLetter.noPdfSelected")}</p>
                    )}
                </aside>
            </div>
        </section>
    );
}

export default NormalLetter;