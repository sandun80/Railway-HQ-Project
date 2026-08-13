import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../styles/sendingForms.css";
import axios from "axios";

function RegisteredLetters() {
    const { t } = useTranslation();
    const today = new Date().toISOString().split("T")[0];

    const [formData, setFormData] = useState({
        letterNumber: "",
        letterTitle: "",
        destination: "",
        registeredPostNumber: "",
        letterDate:"",
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
    const [isLetterLoaded, setIsLetterLoaded] = useState(false);

    const convertPdfToBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

    useEffect(() => {

        getRoles();

        if (!pdfFile) {
            setPdfPreviewUrl("");
            return;
        }

        const objectUrl = URL.createObjectURL(pdfFile);
        setPdfPreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);

    }, [pdfFile]);

    const getRoles = async () => {
        try{
            const response = await axios.get("http://localhost:5000/api/roles/getroles");
            setRoles(response.data);

        }catch (error) {
            console.log(error);

        }
        
    }

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
            <h3>{t("registeredLetters.heading")}</h3>
            <div className="form-preview-layout">
                <form className="letter-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="field-group">
                            <label htmlFor="reg-letter-number">{t("registeredLetters.letterNumber")}</label>
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
                                    {t("registeredLetters.searchBtn")}
                                </button>
                            </div>
                        </div>

                        <div className="field-group">
                            <label htmlFor="reg-date">{t("registeredLetters.date")}</label>
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
                            <label htmlFor="reg-letter-title">{t("registeredLetters.letterTitle")}</label>
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
                            <label htmlFor="reg-destination">{t("registeredLetters.destination")}</label>

                            <select
                                id="reg-destination"
                                name="destination"
                                value={formData.destination}
                                onChange={handleChange}
                                required
                                disabled={isLetterLoaded}
                            >
                                <option value="">{t("registeredLetters.selectRole")}</option>

                                {departmentRoles.map((role) => (
                                    <option
                                        key={role._id}
                                        value={role.name}
                                    >
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="field-group">
                            <label htmlFor="reg-post-number">{t("registeredLetters.registeredPostNumber")}</label>
                            <input
                                id="reg-post-number"
                                name="registeredPostNumber"
                                type="text"
                                value={formData.registeredPostNumber}
                                onChange={handleChange}
                                placeholder={t("registeredLetters.registeredPostNumberPlaceholder")}
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="reg-pdf-upload">{t("registeredLetters.uploadPdf")}</label>
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
                            {t("registeredLetters.draftSave")}
                        </button>
                        <button type="submit">{t("registeredLetters.saveEntry")}</button>
                    </div>
                </form>

                <aside className="pdf-preview-panel" aria-label="Registered PDF preview">

                    <div className="field-group">
                            <label htmlFor="reg-current-date">{t("registeredLetters.currentDate")}</label>
                            <input 
                                className="current-date"
                                name="current-date"
                                value={today}
                                readOnly
                            />
                    </div>

                    <h4>{t("registeredLetters.pdfPreview")}</h4>
                    {pdfPreviewUrl ? (
                        <iframe title="Registered sending PDF preview" src={pdfPreviewUrl} />
                    ) : (
                        <p>{t("registeredLetters.noPdfSelected")}</p>
                    )}
                </aside>
            </div>
        </section>
    );
}

export default RegisteredLetters;