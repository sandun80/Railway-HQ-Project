import { useState } from "react";
import "../styles/receivingForms.css";

function RegisteredRecieve() {
    const [formData, setFormData] = useState({
        sender: "",
        dateReceived: "",
        letterTitle: "",
        registeredPostNumber: "",
        destinationBranch: "",
        receivingConfirmation: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        alert("Registered post receiving details saved.");
    };

    return (
        <section className="letter-form-section receiving-section">
            <h3>Registered Post - Receiving Register</h3>
            <form className="letter-form" onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="field-group">
                        <label htmlFor="rec-reg-sender">Sender</label>
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
                        <label htmlFor="rec-reg-date">Date Received</label>
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
                        <label htmlFor="rec-reg-title">Letter Title</label>
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
                        <label htmlFor="rec-reg-number">Registered Post Number</label>
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
                        <label htmlFor="rec-reg-branch">Destination Branch</label>
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
                        <label htmlFor="rec-reg-confirm">Receiving Confirmation</label>
                        <input
                            id="rec-reg-confirm"
                            name="receivingConfirmation"
                            type="text"
                            value={formData.receivingConfirmation}
                            onChange={handleChange}
                            placeholder="Name / acknowledgement"
                            required
                        />
                    </div>
                </div>

                <button type="submit">Save Registered Receiving Entry</button>
            </form>
        </section>
    );
}

export default RegisteredRecieve;