import { useEffect, useState } from "react";
import "../styles/receivingForms.css";

function ByhandReceive() {
    const specialRegisterOptions = [
        { key: "publicAdministration", label: "Ministry of Public Administration" },
        { key: "transportMinistry", label: "Transport Ministry" },
        { key: "publicServiceCommission", label: "Public Service Commission" },
    ];

    const today = new Date().toISOString().split("T")[0];

    const [routingForm, setRoutingForm] = useState({
        letterNumber: "",
        letterTitle: "",
        registerType: "subject",
        subjectOrOfficer: "",
        receivingConfirmation: "",
    });

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

    const handleRoutingSubmit = (event) => {
        event.preventDefault();
        alert("By-hand receiving routing details saved.");
    };

    const handleSpecialSubmit = (event) => {
        event.preventDefault();
        const activeLabel = specialRegisterOptions.find(
            (option) => option.key === activeSpecialRegister
        )?.label;
        alert(`${activeLabel} special register details saved.`);
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
            <h3>By Hand - Subject / Direct Officer Register</h3>
            <div className="form-preview-layout">
                <form className="letter-form" onSubmit={handleRoutingSubmit}>
                    <div className="form-grid">
                        <div className="field-group">
                            <label htmlFor="rec-byhand-number">Letter Number</label>
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
                            <label htmlFor="reg-date">Date</label>
                            <input
                                id="recieveByhand-letter-date"
                                name="letterDate"
                                type="date"
                                required
                            />
                        </div>


                        <div className="field-group">
                            <label htmlFor="rec-byhand-title">Letter Title</label>
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
                            <label htmlFor="rec-byhand-register-type">Register Type</label>
                            <select
                                id="rec-byhand-register-type"
                                name="registerType"
                                value={routingForm.registerType}
                                onChange={handleRoutingChange}
                            >
                                <option value="subject">Subject / Department Register</option>
                                <option value="officer">Direct Officer Register</option>
                            </select>
                        </div>

                        <div className="field-group">
                            <label htmlFor="rec-byhand-subject-officer">
                                Subject / Department or Officer
                            </label>
                            <input
                                id="rec-byhand-subject-officer"
                                name="subjectOrOfficer"
                                type="text"
                                value={routingForm.subjectOrOfficer}
                                onChange={handleRoutingChange}
                                required
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="rec-byhand-confirm">Receiving Confirmation</label>
                            <input
                                id="rec-byhand-confirm"
                                name="receivingConfirmation"
                                type="text"
                                value={routingForm.receivingConfirmation}
                                onChange={handleRoutingChange}
                                placeholder="Recipient name / acknowledgement"
                                required
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="rec-byhand-pdf-upload">Upload Letter PDF</label>
                            <input
                                id="rec-byhand-pdf-upload"
                                name="pdfUpload"
                                type="file"
                                accept="application/pdf"
                                onChange={handleRoutingPdfChange}
                            />
                        </div>
                    </div>

                    <button type="submit">Save By-Hand Routing Entry</button>
                </form>

                <aside className="pdf-preview-panel" aria-label="By-hand receive routing PDF preview">
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
                    {routingPdfPreviewUrl ? (
                        <iframe title="By-hand receiving routing PDF preview" src={routingPdfPreviewUrl} />
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
                            <label htmlFor="special-responsible-date">
                                Date Received by Responsible Officer
                            </label>
                            <input
                                id="special-responsible-date"
                                name="dateReceivedByResponsibleOfficer"
                                type="date"
                                value={activeSpecialForm.dateReceivedByResponsibleOfficer}
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

                    <button type="submit">Save Special By-Hand Entry</button>
                </form>

                <aside className="pdf-preview-panel" aria-label="Special by-hand PDF preview">
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

export default ByhandReceive;