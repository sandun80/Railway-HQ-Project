import { useState } from "react";
import "../styles/sendingForms.css";

function RegisteredLetters() {
    const [formData, setFormData] = useState({
        letterNumber: "",
        letterTitle: "",
        destination: "",
        registeredPostNumber: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        alert("Registered post sending details saved.");
    };

    return (
        <section className="letter-form-section">
            <h3>Registered Post - Sending Register</h3>
            <form className="letter-form" onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="field-group">
                        <label htmlFor="reg-letter-number">Letter Number</label>
                        <input
                            id="reg-letter-number"
                            name="letterNumber"
                            type="text"
                            value={formData.letterNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="field-group">
                        <label htmlFor="reg-letter-title">Letter Title</label>
                        <input
                            id="reg-letter-title"
                            name="letterTitle"
                            type="text"
                            value={formData.letterTitle}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="field-group">
                        <label htmlFor="reg-destination">Destination</label>
                        <input
                            id="reg-destination"
                            name="destination"
                            type="text"
                            value={formData.destination}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="field-group">
                        <label htmlFor="reg-post-number">Registered Post Number</label>
                        <input
                            id="reg-post-number"
                            name="registeredPostNumber"
                            type="text"
                            value={formData.registeredPostNumber}
                            onChange={handleChange}
                            placeholder="Can be updated later"
                        />
                    </div>
                </div>

                <button type="submit">Save Registered Sending Entry</button>
            </form>
        </section>
    );
}

export default RegisteredLetters;