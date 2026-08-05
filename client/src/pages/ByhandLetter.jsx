import { useState } from "react";
import "../styles/sendingForms.css";

function Byhand() {
    const [formData, setFormData] = useState({
        letterNumber: "",
        letterTitle: "",
        registerType: "subject",
        subjectOrOfficer: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        alert("By-hand routing details saved.");
    };

    return (
        <section className="letter-form-section">
            <h3>By Hand - Routing Register</h3>
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
                        <label htmlFor="register-type">Register Type</label>
                        <select
                            id="register-type"
                            name="registerType"
                            value={formData.registerType}
                            onChange={handleChange}
                        >
                            <option value="subject">Subject / Department Register</option>
                            <option value="officer">Direct Officer Register</option>
                        </select>
                    </div>

                    <div className="field-group">
                        <label htmlFor="subject-officer-name">
                            Subject / Department or Officer
                        </label>
                        <input
                            id="subject-officer-name"
                            name="subjectOrOfficer"
                            type="text"
                            value={formData.subjectOrOfficer}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <button type="submit">Save By-Hand Routing Entry</button>
            </form>
        </section>
    );
}

export default Byhand;