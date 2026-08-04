
function Student(){
    return(
        <div>
            <h1>Students Page</h1>

            <StudentCard
                name = "Sandun"
                age = {21}
                course = "SE"
             />

             <StudentCard 
                name = "Shehan"
                age = {23}
                course = "CS"
             
             />

        </div>
    );
}

export default Student;