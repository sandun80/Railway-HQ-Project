import { useState } from "react";
import "../styles/receivingForms.css";

function NormalReceive() {
    const [formData, setFormData] = useState({
        sender: "",
        dateReceived: "",
        letterTitle: "",
        destinationBranch: "",
        receivingConfirmation: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        alert("Normal post receiving details saved.");
    };

    return (
        <section className="letter-form-section receiving-section">
            <h3>Normal Post - Receiving Register</h3>
            <form className="letter-form" onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="field-group">
                        <label htmlFor="rec-normal-sender">Sender</label>
                        <input
                            id="rec-normal-sender"
                            name="sender"
                            type="text"
                            value={formData.sender}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="field-group">
                        <label htmlFor="rec-normal-date">Date Received</label>
                        <input
                            id="rec-normal-date"
                            name="dateReceived"
                            type="date"
                            value={formData.dateReceived}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="field-group">
                        <label htmlFor="rec-normal-title">Letter Title</label>
                        <input
                            id="rec-normal-title"
                            name="letterTitle"
                            type="text"
                            value={formData.letterTitle}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="field-group">
                        <label htmlFor="rec-normal-branch">Destination Branch</label>
                        <input
                            id="rec-normal-branch"
                            name="destinationBranch"
                            type="text"
                            value={formData.destinationBranch}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="field-group">
                        <label htmlFor="rec-normal-confirm">Receiving Confirmation</label>
                        <input
                            id="rec-normal-confirm"
                            name="receivingConfirmation"
                            type="text"
                            value={formData.receivingConfirmation}
                            onChange={handleChange}
                            placeholder="Name / acknowledgement"
                            required
                        />
                    </div>
                </div>

                <button type="submit">Save Normal Receiving Entry</button>
            </form>
        </section>
    );
}

export default NormalReceive;