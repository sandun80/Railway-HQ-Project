import "../styles/allLetter.css";

function AllLetter() {

    const letters = [
        {
            id: 1,
            letterNo: "RL001",
            category: "Registered",
            title: "Budget Report",
            destination: "Colombo",
            date: "2026-08-06",
            status: "Sent"
        },
        {
            id: 2,
            letterNo: "RL002",
            category: "Normal",
            title: "Transfer Letter",
            destination: "Kandy",
            date: "2026-08-05",
            status: "Pending"
        },
        {
            id: 3,
            letterNo: "RL003",
            category: "By Hand",
            title: "Meeting Notice",
            destination: "Galle",
            date: "2026-08-04",
            status: "Delivered"
        }
    ];

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

                            <tr key={letter.id}>

                                <td>{letter.letterNo}</td>
                                <td>{letter.category}</td>
                                <td>{letter.title}</td>
                                <td>{letter.destination}</td>
                                <td>{letter.date}</td>
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