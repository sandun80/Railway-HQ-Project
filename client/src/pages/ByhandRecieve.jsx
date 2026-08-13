import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../styles/receivingForms.css";
import axios from "axios";

function ByhandReceive() {
    const { t } = useTranslation();
    const specialRegisterOptions = [
        { key: "publicAdministration", label: "Ministry of Public Administration" },
        { key: "transportMinistry", label: "Transport Ministry" },
        { key: "publicServiceCommission", label: "Public Service Commission" },
    ];

    const today = new Date().toISOString().split("T")[0];

    const [routingForm, setRoutingForm] = useState({
        letterNumber: "",
        letterDate: "",
        letterTitle: "",
        registerType: "subject",
        department: "",
        subject: "",
        receivingConfirmation: "",
    });
    const [roles, setRoles] = useState([]);
    const excludedRoleNames = ["officer", "viewer", "admin"];
    const departmentRoles = roles.filter(
        (role) => !excludedRoleNames.includes(String(role.name).toLowerCase())
    );
    const [departments, setDepartments] = useState([]);

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
    const [routingPdfFile, setRoutingPdfFile] = useState(null);
    const [routingPdfPreviewUrl, setRoutingPdfPreviewUrl] = useState("");
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
        if (!routingPdfFile) {
            setRoutingPdfPreviewUrl("");
            return;
        }

        const objectUrl = URL.createObjectURL(routingPdfFile);
        setRoutingPdfPreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [routingPdfFile]);

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

    const handleRoutingChange = (event) => {
        const { name, value } = event.target;
        setRoutingForm((prev) => ({ ...prev, [name]: value }));
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

    const handleRoutingSubmit = async (event) => {
        event.preventDefault();

        try {
            const pdfData = routingPdfFile ? await convertPdfToBase64(routingPdfFile) : "";

            await axios.post("http://localhost:5000/api/letters", {
                letterNumber: routingForm.letterNumber,
                flow: "receiving",
                category: "byhand",
                title: routingForm.letterTitle,
                destination: routingForm.department,
                subject_department_or_officer: `Department: ${routingForm.department} | Subject: ${routingForm.subject}`,
                letterDate: routingForm.letterDate,
                status: "Received",
                pdf: pdfData,
            });

            alert("By-hand receiving routing details saved.");
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Failed to save by-hand receiving letter.";
            alert(errorMessage);
            console.log(error);
        }
    };

    const handleSpecialSubmit = (event) => {
        event.preventDefault();
        const activeLabel = specialRegisterOptions.find(
            (option) => option.key === activeSpecialRegister
        )?.label;
        alert(`${activeLabel} special register save is frontend-only.`);
    };

    const handleRoutingPdfChange = (event) => {
        const file = event.target.files?.[0] || null;
        setRoutingPdfFile(file);
    };

    const handleSpecialPdfChange = (event) => {
        const file = event.target.files?.[0] || null;
        setSpecialPdfFiles((prev) => ({
            ...prev,
            [activeSpecialRegister]: file,
        }));
    };

    const activeSpecialForm = specialForms[activeSpecialRegister];
    const activeSpecialPreviewUrl = specialPdfPreviewUrls[activeSpecialRegister];

    return (
        <section className="letter-form-section receiving-section">
            <h3>{t("byhandReceive.heading")}</h3>
            <div className="form-preview-layout">
                <form className="letter-form" onSubmit={handleRoutingSubmit}>
                    <div className="form-grid">
                        <div className="field-group">
                            <label htmlFor="rec-byhand-number">{t("byhandReceive.letterNumber")}</label>
                            <input
                                id="rec-byhand-number"
                                name="letterNumber"
                                type="text"
                                value={routingForm.letterNumber}
                                onChange={handleRoutingChange}
                                required
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="reg-date">{t("byhandReceive.date")}</label>
                            <input
                                id="recieveByhand-letter-date"
                                name="letterDate"
                                type="date"
                                value={routingForm.letterDate}
                                onChange={handleRoutingChange}
                                required
                            />
                        </div>


                        <div className="field-group">
                            <label htmlFor="rec-byhand-title">{t("byhandReceive.letterTitle")}</label>
                            <input
                                id="rec-byhand-title"
                                name="letterTitle"
                                type="text"
                                value={routingForm.letterTitle}
                                onChange={handleRoutingChange}
                                required
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="rec-byhand-subject-officer">
                                {t("byhandReceive.department")}
                            </label>
                            <select
                                id="rec-byhand-subject-officer"
                                name="department"
                                value={routingForm.department}
                                onChange={handleRoutingChange}
                                required
                            >
                                <option value="">{t("byhandReceive.selectDepartment")}</option>
                                {departments.map((department) => (
                                    <option key={department._id} value={department.name}>
                                        {department.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="field-group">
                            <label htmlFor="rec-byhand-subject">{t("byhandReceive.subject")}</label>
                            <select
                                id="rec-byhand-subject"
                                name="subject"
                                value={routingForm.subject}
                                onChange={handleRoutingChange}
                                required
                            >
                                <option value="">{t("byhandReceive.selectRole")}</option>
                                {departmentRoles.map((role) => (
                                    <option key={role._id} value={role.name}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="field-group">
                            <label htmlFor="rec-byhand-pdf-upload">{t("byhandReceive.uploadPdf")}</label>
                            <input
                                id="rec-byhand-pdf-upload"
                                name="pdfUpload"
                                type="file"
                                accept="application/pdf"
                                onChange={handleRoutingPdfChange}
                            />
                        </div>
                    </div>

                    <button type="submit">{t("byhandReceive.saveEntry")}</button>
                </form>

                <aside className="pdf-preview-panel" aria-label="By-hand receive routing PDF preview">
                     <div className="field-group">
                            <label htmlFor="reg-current-date">{t("byhandReceive.currentDate")}</label>
                            <input 
                                className="current-date"
                                name="current-date"
                                value={today}
                                readOnly
                            />
                    </div>

                    <h4>{t("byhandReceive.pdfPreview")}</h4>
                    {routingPdfPreviewUrl ? (
                        <iframe title="By-hand receiving routing PDF preview" src={routingPdfPreviewUrl} />
                    ) : (
                        <p>{t("byhandReceive.noPdfSelected")}</p>
                    )}
                </aside>
            </div>

            <h3 className="secondary-heading">{t("byhandReceive.specialRegistersHeading")}</h3>
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
                        {t("byhandReceive.activeRegister")} {
                            specialRegisterOptions.find(
                                (option) => option.key === activeSpecialRegister
                            )?.label
                        }
                    </p>
                    <div className="form-grid">
                        <div className="field-group">
                            <label htmlFor="special-date-received">{t("byhandReceive.dateReceived")}</label>
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
                            <label htmlFor="special-letter-number">{t("byhandReceive.letterNumber")}</label>
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
                            <label htmlFor="reg-date">Date</label>
                            <input
                                id="recieveByhandSPC-letter-date"
                                name="letterDate"
                                type="date"
                                value={activeSpecialForm.letterDate}
                                onChange={handleSpecialChange}
                                required
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="special-letter-title">{t("byhandReceive.letterTitle")}</label>
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
                            <label htmlFor="special-destination">{t("byhandReceive.destination")}</label>
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
                            <label htmlFor="special-person">{t("byhandReceive.personReceiving")}</label>
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
                            <label htmlFor="special-office">{t("byhandReceive.receivingOffice")}</label>
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
                            <label htmlFor="special-byhand-pdf-upload">{t("byhandReceive.uploadPdf")}</label>
                            <input
                                id="special-byhand-pdf-upload"
                                name="pdfUpload"
                                type="file"
                                accept="application/pdf"
                                onChange={handleSpecialPdfChange}
                            />
                        </div>
                    </div>

                    <button type="submit">{t("byhandReceive.saveSpecialEntry")}</button>
                </form>

                <aside className="pdf-preview-panel" aria-label="Special by-hand PDF preview">
                    <div className="field-group">
                            <label htmlFor="reg-current-date">{t("byhandReceive.currentDate")}</label>
                            <input 
                                className="current-date"
                                name="current-date"
                                value={today}
                                readOnly
                            />
                    </div>
                    
                    <h4>{t("byhandReceive.pdfPreview")}</h4>
                    {activeSpecialPreviewUrl ? (
                        <iframe title="Special by-hand PDF preview" src={activeSpecialPreviewUrl} />
                    ) : (
                        <p>{t("byhandReceive.noPdfSelected")}</p>
                    )}
                </aside>
            </div>
        </section>
    );
}

export default ByhandReceive;