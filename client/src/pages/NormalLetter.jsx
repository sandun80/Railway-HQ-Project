import { useState } from "react";
import "../styles/sendingForms.css";

function NormalLetter() {
    const [formData, setFormData] = useState({
        letterNumber: "",
        letterTitle: "",
        destination: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        alert("Normal post sending details saved.");
    };

    return (
        <section className="letter-form-section">
            <h3>Normal Post - Sending Register</h3>
            <form className="letter-form" onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="field-group">
                        <label htmlFor="normal-letter-number">Letter Number</label>
                        <input
                            id="normal-letter-number"
                            name="letterNumber"
                            type="text"
                            value={formData.letterNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="field-group">
                        <label htmlFor="normal-letter-title">Letter Title</label>
                        <input
                            id="normal-letter-title"
                            name="letterTitle"
                            type="text"
                            value={formData.letterTitle}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="field-group">
                        <label htmlFor="normal-destination">Destination</label>
                        <input
                            id="normal-destination"
                            name="destination"
                            type="text"
                            value={formData.destination}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <button type="submit">Save Normal Sending Entry</button>
            </form>
        </section>
    );
}

export default NormalLetter;