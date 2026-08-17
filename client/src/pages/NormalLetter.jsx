import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../styles/sendingForms.css";
import axios from "axios";
import MessageModal from "../components/MessageModal";

function NormalLetter() {
    const { t } = useTranslation();
    const today = new Date().toISOString().split("T")[0];

    const [modalInfo, setModalInfo] = useState({ isOpen: false, title: "", message: "", type: "success" });
    const closeModal = () => setModalInfo((prev) => ({ ...prev, isOpen: false }));

    const [formData, setFormData] = useState({
        letterNumber: "",
        letterDate: "",
        letterTitle: "",
        destination: "",
    });

    const [roles, setRoles] = useState([]);
    const excludedRoleNames = ["admin", "viewer"];
    const filteredRoles = roles.filter(
        (role) => !excludedRoleNames.includes(String(role.name).toLowerCase())
    );
    const defaultRolesList = [
        { _id: "r1", name: "gmr" },
        { _id: "r2", name: "officer" },
        { _id: "r3", name: "additional_secretary" },
        { _id: "r4", name: "chief_engineer" },
        { _id: "r5", name: "senior_clerk" },
        { _id: "r6", name: "staff" },
        { _id: "r7", name: "replyperson" }
    ];
    const departmentRoles = filteredRoles.length > 0 ? filteredRoles : (roles.length > 0 ? roles : defaultRolesList);

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

            setModalInfo({
                isOpen: true,
                title: "Letter Saved",
                message: "Normal post sending details saved successfully.",
                type: "success"
            });

        }catch(error){
            const errorMessage = error?.response?.data?.message || "Failed to save normal sending letter.";
            setModalInfo({
                isOpen: true,
                title: "Error",
                message: errorMessage,
                type: "error"
            });
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
                            <label htmlFor="reg-letter-no">{t("normalLetter.letterNo")}</label>
                            <input
                                id="reg-letter-no"
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
                                id="reg-date"
                                name="letterDate"
                                type="date"
                                value={formData.letterDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="reg-letter-title">{t("normalLetter.letterTitle")}</label>
                            <input
                                id="reg-letter-title"
                                name="letterTitle"
                                type="text"
                                value={formData.letterTitle}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="reg-subject">{t("normalLetter.subject")}</label>
                            <select
                                id="reg-subject"
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
                            <label htmlFor="reg-pdf-upload">{t("normalLetter.uploadPdf")}</label>
                            <input
                                id="reg-pdf-upload"
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
            <MessageModal
                isOpen={modalInfo.isOpen}
                title={modalInfo.title}
                message={modalInfo.message}
                type={modalInfo.type}
                onClose={closeModal}
            />
        </section>
    );
}

export default NormalLetter;