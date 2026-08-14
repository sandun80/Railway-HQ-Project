import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../styles/sendingForms.css";
import axios from "axios";

function Byhand() {
    const { t } = useTranslation();

    const today = new Date().toISOString().split("T")[0];

    const specialRegisterOptions = [
        { key: "publicAdministration", label: "Ministry of Public Administration" },
        { key: "transportMinistry", label: "Transport Ministry" },
        { key: "publicServiceCommission", label: "Public Service Commission" },
    ];

    const user = JSON.parse(localStorage.getItem("user"));
    const username = user?.username;

    const [formData, setFormData] = useState({
        letterNumber: "",
        letterDate: "",
        letterTitle: "",
        department: "",
        subject: "",
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
    const [departments, setDepartments] = useState([]);
    const defaultDepartmentList = [
        { _id: "dep-1", name: "Administration" },
        { _id: "dep-2", name: "Commercial & Traffic" },
        { _id: "dep-3", name: "Engineering" },
        { _id: "dep-4", name: "Finance & Accounts" },
        { _id: "dep-5", name: "Human Resource Management" },
        { _id: "dep-6", name: "Operations & Transportation" },
        { _id: "dep-7", name: "Procurement & Stores" }
    ];
    const availableDepartments = departments.length > 0 ? departments : defaultDepartmentList;
    const [activeSpecialRegister, setActiveSpecialRegister] = useState("publicAdministration");
    const [specialForms, setSpecialForms] = useState({
        publicAdministration: {
            dateReceived: "",
            letterNumber: "",
            letterDate: "",
            letterTitle: "",
            destination: "",
            personReceivingLetter: "",
            receivingOffice: "",
            dateReceivedByResponsibleOfficer: "",
        },
        transportMinistry: {
            dateReceived: "",
            letterNumber: "",
            letterDate: "",
            letterTitle: "",
            destination: "",
            personReceivingLetter: "",
            receivingOffice: "",
            dateReceivedByResponsibleOfficer: "",
        },
        publicServiceCommission: {
            dateReceived: "",
            letterNumber: "",
            letterDate: "",
            letterTitle: "",
            destination: "",
            personReceivingLetter: "",
            receivingOffice: "",
            dateReceivedByResponsibleOfficer: "",
        },
    });
    const [pdfFile, setPdfFile] = useState(null);
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState("");
    const [specialPdfFiles, setSpecialPdfFiles] = useState({
        publicAdministration: null,
        transportMinistry: null,
        publicServiceCommission: null,
    });
    const [specialPdfPreviewUrls, setSpecialPdfPreviewUrls] = useState({
        publicAdministration: "",
        transportMinistry: "",
        publicServiceCommission: "",
    });

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

    useEffect(() => {
        const getDepartments = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/departments/getdepartments");
                setDepartments(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        getDepartments();
    }, []);

    useEffect(() => {
        const objectUrls = [];
        const nextPreviewUrls = {
            publicAdministration: "",
            transportMinistry: "",
            publicServiceCommission: "",
        };

        Object.entries(specialPdfFiles).forEach(([key, file]) => {
            if (file) {
                const objectUrl = URL.createObjectURL(file);
                nextPreviewUrls[key] = objectUrl;
                objectUrls.push(objectUrl);
            }
        });

        setSpecialPdfPreviewUrls(nextPreviewUrls);

        return () => {
            objectUrls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [specialPdfFiles]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const pdfData = pdfFile ? await convertPdfToBase64(pdfFile) : "";

            const deptInfo = formData.department ? `Department: ${formData.department} | ` : "";

            await axios.post("http://localhost:5000/api/letters", {
                letterNumber: formData.letterNumber,
                flow: "sending",
                category: "byhand",
                title: formData.letterTitle,
                destination: formData.subject || formData.department || "General",
                receiver: formData.subject || "",
                subject_department_or_officer: `${deptInfo}Target Role: ${formData.subject}`,
                letterDate: formData.letterDate,
                status: "Sent",
                sender: username,
                pdf: pdfData,
            });

            alert("By-hand sending details saved.");
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Failed to save by-hand sending letter.";
            alert(errorMessage);
            console.log(error);
        }
    };

    const handlePdfChange = (event) => {
        const file = event.target.files?.[0] || null;
        setPdfFile(file);
    };

    const handleSpecialChange = (event) => {
        const { name, value } = event.target;
        setSpecialForms((prev) => ({
            ...prev,
            [activeSpecialRegister]: {
                ...prev[activeSpecialRegister],
                [name]: value,
            },
        }));
    };

    const handleSpecialPdfChange = (event) => {
        const file = event.target.files?.[0] || null;
        setSpecialPdfFiles((prev) => ({
            ...prev,
            [activeSpecialRegister]: file,
        }));
    };

    const handleSpecialSubmit = (event) => {
        event.preventDefault();
        const activeLabel = specialRegisterOptions.find(
            (option) => option.key === activeSpecialRegister
        )?.label;
        alert(`${activeLabel} special register save is frontend-only.`);
    };

    const activeSpecialForm = specialForms[activeSpecialRegister];
    const activeSpecialPreviewUrl = specialPdfPreviewUrls[activeSpecialRegister];

    return (
        <section className="letter-form-section">
            <h3>{t("byhandLetter.heading")}</h3>
            <div className="form-preview-layout">
                <form className="letter-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="field-group">
                            <label htmlFor="byhand-letter-number">{t("byhandLetter.letterNumber")}</label>
                            <input
                                id="byhand-letter-number"
                                name="letterNumber"
                                type="text"
                                value={formData.letterNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="reg-date">{t("byhandLetter.date")}</label>
                            <input
                                id="byhand-letter-date"
                                name="letterDate"
                                type="date"
                                value={formData.letterDate}
                                onChange={handleChange}
                                required
                            />
                        </div>


                        <div className="field-group">
                            <label htmlFor="byhand-letter-title">{t("byhandLetter.letterTitle")}</label>
                            <input
                                id="byhand-letter-title"
                                name="letterTitle"
                                type="text"
                                value={formData.letterTitle}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div className="field-group">
                            <label htmlFor="subject-officer-name">
                                {t("byhandLetter.department")}
                            </label>
                            <select
                                id="subject-officer-name"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                            >
                                <option value="">{t("byhandLetter.selectDepartment")}</option>
                                {availableDepartments.map((department) => (
                                    <option key={department._id || department.name} value={department.name}>
                                        {department.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="field-group">
                            <label htmlFor="byhand-subject">{t("byhandLetter.subject")}</label>
                            <select
                                id="byhand-subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            >
                                <option value="">{t("byhandLetter.selectRole")}</option>
                                {departmentRoles.map((role) => (
                                    <option key={role._id} value={role.name}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="field-group">
                            <label htmlFor="byhand-pdf-upload">{t("byhandLetter.uploadPdf")}</label>
                            <input
                                id="byhand-pdf-upload"
                                name="pdfUpload"
                                type="file"
                                accept="application/pdf"
                                onChange={handlePdfChange}
                            />
                        </div>
                    </div>

                    <button type="submit">{t("byhandLetter.saveEntry")}</button>
                </form>

                <aside className="pdf-preview-panel" aria-label="By-hand PDF preview">

                    <div className="field-group">
                            <label htmlFor="reg-current-date">{t("byhandLetter.currentDate")}</label>
                            <input 
                                className="current-date"
                                name="current-date"
                                value={today}
                                readOnly
                            />
                    </div>

                    <h4>{t("byhandLetter.pdfPreview")}</h4>
                    {pdfPreviewUrl ? (
                        <iframe title="By-hand sending PDF preview" src={pdfPreviewUrl} />
                    ) : (
                        <p>{t("byhandLetter.noPdfSelected")}</p>
                    )}
                </aside>
            </div>

            <h3 className="secondary-heading">{t("byhandLetter.specialRegistersHeading")}</h3>
            <div className="special-switch-group" role="tablist" aria-label="Special register switch">
                {specialRegisterOptions.map((option) => (
                    <button
                        key={option.key}
                        type="button"
                        className={
                            activeSpecialRegister === option.key
                                ? "special-switch-btn active"
                                : "special-switch-btn"
                        }
                        onClick={() => setActiveSpecialRegister(option.key)}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            <div className="form-preview-layout">
                <form className="letter-form" onSubmit={handleSpecialSubmit}>
                    <p className="special-register-title">
                        {t("byhandLetter.activeRegister")} {
                            specialRegisterOptions.find(
                                (option) => option.key === activeSpecialRegister
                            )?.label
                        }
                    </p>

                    <div className="form-grid">
                        <div className="field-group">
                            <label htmlFor="special-date-received">{t("byhandLetter.dateReceived")}</label>
                            <input
                                id="special-date-received"
                                name="dateReceived"
                                type="date"
                                value={activeSpecialForm.dateReceived}
                                onChange={handleSpecialChange}
                                required
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="special-letter-number">{t("byhandLetter.letterNumber")}</label>
                            <input
                                id="special-letter-number"
                                name="letterNumber"
                                type="text"
                                value={activeSpecialForm.letterNumber}
                                onChange={handleSpecialChange}
                                required
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="special-letter-date">{t("byhandLetter.date")}</label>
                            <input
                                id="special-letter-date"
                                name="letterDate"
                                type="date"
                                value={activeSpecialForm.letterDate}
                                onChange={handleSpecialChange}
                                required
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="special-letter-title">{t("byhandLetter.letterTitle")}</label>
                            <input
                                id="special-letter-title"
                                name="letterTitle"
                                type="text"
                                value={activeSpecialForm.letterTitle}
                                onChange={handleSpecialChange}
                                required
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="special-destination">{t("byhandLetter.destination")}</label>
                            <input
                                id="special-destination"
                                name="destination"
                                type="text"
                                value={activeSpecialForm.destination}
                                onChange={handleSpecialChange}
                                required
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="special-person">{t("byhandLetter.personReceiving")}</label>
                            <input
                                id="special-person"
                                name="personReceivingLetter"
                                type="text"
                                value={activeSpecialForm.personReceivingLetter}
                                onChange={handleSpecialChange}
                                required
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="special-office">{t("byhandLetter.receivingOffice")}</label>
                            <input
                                id="special-office"
                                name="receivingOffice"
                                type="text"
                                value={activeSpecialForm.receivingOffice}
                                onChange={handleSpecialChange}
                                required
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="special-byhand-pdf-upload">{t("byhandLetter.uploadPdf")}</label>
                            <input
                                id="special-byhand-pdf-upload"
                                name="pdfUpload"
                                type="file"
                                accept="application/pdf"
                                onChange={handleSpecialPdfChange}
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit">{t("byhandLetter.saveSpecialEntry")}</button>
                    </div>
                </form>

                <aside className="pdf-preview-panel" aria-label="Special by-hand PDF preview">
                    <h4>{t("byhandLetter.pdfPreview")}</h4>
                    {activeSpecialPreviewUrl ? (
                        <iframe title="Special by-hand PDF preview" src={activeSpecialPreviewUrl} />
                    ) : (
                        <p>{t("byhandLetter.noPdfSelected")}</p>
                    )}
                </aside>
            </div>
        </section>
    );
}

export default Byhand;