import { useEffect } from "react";
import "../styles/allLetter.css";
import { useState } from "react";
import axios from "axios";

function AllLetter() {

    const [letters, setLetters] = useState([]);

    const [filters, setFilters] = useState({
        letterNumber: "",
        sentTo: "",
        receivedFrom: "",
        date: ""
    });

    useEffect(() => {
        getLetters();
    }, []);

    const getLetters = async() =>{
        try{

            const response = await axios.get(
                 "http://localhost:5000/api/letters/getallletters"
            );

            setLetters(response.data);

        }catch(e){
            console.log(e);
        }
    }

    const handleFilterChange = (event) => {
    const { name, value } = event.target;

        setFilters((prev) => ({
            ...prev,
            [name]: value
        }));
    };



    const handleSearch = async () => {

    try {

        const response = await axios.get(
            "http://localhost:5000/api/letters/filter",
            {
                params: filters
            }
        );

        setLetters(response.data);

    } catch (error) {

        console.error("Search failed:", error);

        }
    };


    const handleReset = async () => {

    setFilters({
        letterNumber: "",
        sentTo: "",
        receivedFrom: "",
        date: ""
    });

    getLetters();

    };



    return (
        <div className="all-letter-page">

            <div className="search-filter">

                <input
                    type="text"
                    placeholder="Letter No."
                    name="letterNumber"
                    value={filters.letterNumber}
                    onChange={handleFilterChange}
                />

                <input
                    type="text"
                    placeholder="Sent To"
                    name="sentTo"
                    value={filters.sentTo}
                    onChange={handleFilterChange}
                />

                <input
                    type="text"
                    placeholder="Received From"
                    name="receivedFrom"
                    value={filters.receivedFrom}
                    onChange={handleFilterChange}
                />

                <input
                    type="date"
                    name="date"
                    value={filters.date}
                    onChange={handleFilterChange}
                />

                <button className="search-btn" onClick={handleSearch}>
                    Search
                </button>

                <button className="reset-btn" onClick={handleReset}>
                    Reset
                </button>

            </div>
            <div className="table-container">

                <table className="letter-table">

                    <thead>

                        <tr>
                            <th>Letter No.</th>
                            <th>Flow</th>
                            <th>Category</th>
                            <th>Title</th>
                            <th>Destination</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>

                    </thead>

                    <tbody>

                        {letters.map((letter) => (

                             <tr key={letter._id || letter.letterNo}>

                                <td>{letter.letterNumber}</td>
                                <td>{letter.flow}</td>
                                <td>{letter.category}</td>
                                <td>{letter.title}</td>
                                <td>{letter.destination}</td>
                                <td>{new Date(letter.letterDate).toLocaleDateString()}</td>
                                <td>{letter.status}</td>

                                <td>
                                    <button className="view-btn">
                                        View
                                    </button>
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default AllLetter;