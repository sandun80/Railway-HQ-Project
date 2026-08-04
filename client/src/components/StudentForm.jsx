import { useState } from "react";
import "../styles/form.css"

function StudentForm(){

    const[name, setName] = useState("");
    const[age, setAge] = useState("");
    const[course, setCourse] = useState("");

    return(
        <div className="student-form">
            <h2>Add Student</h2>

            <label>Student Name</label>
            <input type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            ></input>

            <label>Student Age</label>
            <input
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
            />

            <label>Student Course</label>
            <input
                type="text"
                placeholder="Course"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
            />

            <button>
                Add Student
            </button>

        </div>
    );
}

export default StudentForm;