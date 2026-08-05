import { useState } from "react";
import "../styles/receivingForms.css";

function ByhandReceive() {
    const [routingForm, setRoutingForm] = useState({
        letterNumber: "",
        letterTitle: "",
        registerType: "subject",
        subjectOrOfficer: "",
        receivingConfirmation: "",
    });

    const [specialForm, setSpecialForm] = useState({
        dateReceived: "",
        letterNumber: "",
        letterTitle: "",
        destination: "",
        personReceivingLetter: "",
        receivingOffice: "",
        dateReceivedByResponsibleOfficer: "",
    });

    const handleRoutingChange = (event) => {
        const { name, value } = event.target;
        setRoutingForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSpecialChange = (event) => {
        const { name, value } = event.target;
        setSpecialForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleRoutingSubmit = (event) => {
        event.preventDefault();
        alert("By-hand receiving routing details saved.");
    };

    const handleSpecialSubmit = (event) => {
        event.preventDefault();
        alert("Special by-hand register details saved.");
    };

    return (
        <section className="letter-form-section receiving-section">
            <h3>By Hand - Subject / Direct Officer Register</h3>
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
                </div>

                <button type="submit">Save By-Hand Routing Entry</button>
            </form>

            <h3 className="secondary-heading">
                Special By-Hand Register (Ministry of Public Administration)
            </h3>
            <form className="letter-form" onSubmit={handleSpecialSubmit}>
                <div className="form-grid">
                    <div className="field-group">
                        <label htmlFor="special-date-received">Date Received</label>
                        <input
                            id="special-date-received"
                            name="dateReceived"
                            type="date"
                            value={specialForm.dateReceived}
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
                            value={specialForm.letterNumber}
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
                            value={specialForm.letterTitle}
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
                            value={specialForm.destination}
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
                            value={specialForm.personReceivingLetter}
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
                            value={specialForm.receivingOffice}
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
                            value={specialForm.dateReceivedByResponsibleOfficer}
                            onChange={handleSpecialChange}
                            required
                        />
                    </div>
                </div>

                <button type="submit">Save Special By-Hand Entry</button>
            </form>
        </section>
    );
}

export default ByhandReceive;