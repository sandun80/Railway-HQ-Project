import { useEffect } from "react";
import "../styles/allLetter.css";
import { useState } from "react";
import axios from "axios";

function AllLetter() {

    const [letters, setLetters] = useState([]);

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

    return (
        <div className="all-letter-page">

            <div className="search-filter">

                <input
                    type="text"
                    placeholder="Letter No."
                />

                <input
                    type="text"
                    placeholder="Sender"
                />

                <input
                    type="text"
                    placeholder="Receiver"
                />

                <input
                    type="date"
                />

                <button className="search-btn">
                    Search
                </button>

                <button className="reset-btn">
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