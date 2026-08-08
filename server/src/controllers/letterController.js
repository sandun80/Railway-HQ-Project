import Letter from "../models/letter.js";

export const createLetter = async (req, res) => {
    try {

        console.log("Received data:", req.body);

        const letter = await Letter.create(req.body);

        res.status(201).json(letter);

    } catch (error) {

        console.error(error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message,
            });
        }

        if (error?.code === 11000) {
            return res.status(409).json({
                message: "Letter Number already exists.",
            });
        }

        res.status(500).json({
            message: error.message
        });

    }
};

export const updateLetter = async (req, res) => {
    try {

        const { letterNumber } = req.params;

        const updatedLetter = await Letter.findOneAndUpdate(
            { letterNumber: letterNumber },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedLetter) {
            return res.status(404).json({
                message: "Letter not found"
            });
        }

        res.status(200).json(updatedLetter);

    } catch (error) {

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: error.message
        });

    }
};

export const searchLetterByNumber = async(req, res) => {
    try{

       const { letterNumber } = req.params;

       const letter = await Letter.findOne({
            letterNumber,
            flow: "sending",
            category: "registered"
        });

       if(!letter){
        return res.status(404).json({
                message: "Letter not found"
            });

       }else{
        res.status(200).json(letter);
       }

    }catch(error){

         res.status(500).json({
            message: error.message
        });
        
    }
}

export const getAllLetters = async(req, res) => {
    try{

        const letters = await Letter.find().sort({ createdAt: -1 });

        res.status(200).json(letters);

    }catch(error){
        console.log(error);

         res.status(500).json({
            message: error.message
        });
        
    }
}