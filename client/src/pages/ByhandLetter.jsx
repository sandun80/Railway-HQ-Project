import { useEffect, useState } from "react";
import "../styles/sendingForms.css";
import axios from "axios";

function Byhand() {

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
    const excludedRoleNames = ["officer", "viewer", "admin"];
    const departmentRoles = roles.filter(
        (role) => !excludedRoleNames.includes(String(role.name).toLowerCase())
    );
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

            await axios.post("http://localhost:5000/api/letters", {
                letterNumber: formData.letterNumber,
                flow: "sending",
                category: "byhand",
                title: formData.letterTitle,
                destination: formData.department,
                subject_department_or_officer: `Department: ${formData.department} | Subject: ${formData.subject}`,
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
            <h3>By Hand - Routing Register</h3>
            <div className="form-preview-layout">
                <form className="letter-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="field-group">
                            <label htmlFor="byhand-letter-number">Letter Number</label>
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
                            <label htmlFor="reg-date">Date</label>
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
                            <label htmlFor="byhand-letter-title">Letter Title</label>
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
                                Department
                            </label>
                            <input
                                id="subject-officer-name"
                                name="department"
                                type="text"
                                value={formData.department}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="byhand-subject">Subject</label>
                            <select
                                id="byhand-subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select role</option>
                                {departmentRoles.map((role) => (
                                    <option key={role._id} value={role.name}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="field-group">
                            <label htmlFor="byhand-pdf-upload">Upload Letter PDF</label>
                            <input
                                id="byhand-pdf-upload"
                                name="pdfUpload"
                                type="file"
                                accept="application/pdf"
                                onChange={handlePdfChange}
                            />
                        </div>
                    </div>

                    <button type="submit">Save By-Hand Routing Entry</button>
                </form>

                <aside className="pdf-preview-panel" aria-label="By-hand PDF preview">

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
                        <iframe title="By-hand sending PDF preview" src={pdfPreviewUrl} />
                    ) : (
                        <p>No PDF selected.</p>
                    )}
                </aside>
            </div>

            <h3 className="secondary-heading">Special By-Hand Registers</h3>
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
                        Active Register: {
                            specialRegisterOptions.find(
                                (option) => option.key === activeSpecialRegister
                            )?.label
                        }
                    </p>

                    <div className="form-grid">
                        <div className="field-group">
                            <label htmlFor="special-date-received">Date Received</label>
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
                            <label htmlFor="special-letter-number">Letter Number</label>
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
                            <label htmlFor="special-letter-date">Date</label>
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
                            <label htmlFor="special-letter-title">Letter Title</label>
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
                            <label htmlFor="special-destination">Destination</label>
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
                            <label htmlFor="special-person">Person Receiving the Letter</label>
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
                            <label htmlFor="special-office">Receiving Office</label>
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
                            <label htmlFor="special-byhand-pdf-upload">Upload Letter PDF</label>
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
                        <button type="submit">Save Special By-Hand Entry</button>
                    </div>
                </form>

                <aside className="pdf-preview-panel" aria-label="Special by-hand PDF preview">
                    <h4>PDF Preview</h4>
                    {activeSpecialPreviewUrl ? (
                        <iframe title="Special by-hand PDF preview" src={activeSpecialPreviewUrl} />
                    ) : (
                        <p>No PDF selected.</p>
                    )}
                </aside>
            </div>
        </section>
    );
}

export default Byhand;