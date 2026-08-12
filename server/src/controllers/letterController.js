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

export const deleteLetter = async (req, res) => {
    try {
        const { letterNumber } = req.params;

        const deletedLetter = await Letter.findOneAndDelete({ letterNumber });

        if (!deletedLetter) {
            return res.status(404).json({
                message: "Letter not found"
            });
        }

        res.status(200).json({
            message: "Letter deleted successfully",
            deletedLetter
        });
    } catch (error) {
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

export const getDashboardCounts = async (req, res) => {
    try {

        const counts = await Letter.aggregate([
            {
                $group: {
                    _id: null,

                    registered: {
                        $sum: {
                            $cond: [
                                { $eq: ["$category", "registered"] },
                                1,
                                0
                            ]
                        }
                    },

                    normal: {
                        $sum: {
                            $cond: [
                                { $eq: ["$category", "normal"] },
                                1,
                                0
                            ]
                        }
                    },

                    byhand: {
                        $sum: {
                            $cond: [
                                { $eq: ["$category", "byhand"] },
                                1,
                                0
                            ]
                        }
                    },

                    draft: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", "Draft"] },
                                1,
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        const result = counts[0] || {
            registered: 0,
            normal: 0,
            byhand: 0,
            draft: 0
        };

        res.status(200).json(result);

    } catch (error) {

        console.error("Dashboard count error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};


export const filterLetters = async (req, res) => {

    try {

        const {
            letterNumber,
            sentTo,
            receivedFrom,
            date
        } = req.query;

        const query = {};

        // Letter Number
        if (letterNumber?.trim()) {
            query.letterNumber = {
                $regex: letterNumber.trim(),
                $options: "i"
            };
        }

        // Sent To
        if (sentTo?.trim()) {
            query.destination = {
                $regex: sentTo.trim(),
                $options: "i"
            };
        }

        // Received From
        if (receivedFrom?.trim()) {
            query.sender = {
                $regex: receivedFrom.trim(),
                $options: "i"
            };
        }

        // Date
        if (date) {

            const startDate = new Date(`${date}T00:00:00`);
            const endDate = new Date(`${date}T23:59:59.999`);

            query.letterDate = {
                $gte: startDate,
                $lte: endDate
            };
        }

        const letters = await Letter
            .find(query)
            .sort({ createdAt: -1 });

        res.status(200).json(letters);

    } catch (error) {

        console.error("Filter letters error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};