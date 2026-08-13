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

export const getAllLettersForReplyingc = async (req, res) => {
    try{

        const { getAllLettersByRole } = req.user.role; 
        
        if (!destination) {
            return res.status(400).json({
                message: "Username is required"
            });
        }

        const letters = await Letter.find({
            destination: role
        }).sort({ createdAt: -1 });

        res.status(200).json(letters);


    }catch(error){
        console.log(error);
        
    }
}

export const getAllLetters = async (req, res) => {
    try {
        const requestedRole = String(req.query.role || "").trim().toLowerCase();

        if (requestedRole !== "viewer") {
            return res.status(403).json({
                message: "Only viewer role can view all letters."
            });
        }

        const letters = await Letter.find().sort({ createdAt: -1 });

        res.status(200).json(letters);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }
};

export const getAllLettersByRole = async (req, res) => { 
    try {
        const { username } = req.query;

        if (!username) {
            return res.status(400).json({
                message: "Username is required"
            });
        }

        const letters = await Letter.find({
            sender: username
        }).sort({ createdAt: -1 });

        res.status(200).json(letters);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }
};

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

export const getReportData = async (req, res) => {
    try {
        const {
            category,
            flow,
            subject,
            period,
            startDate,
            endDate,
            date,
            search
        } = req.query;

        const query = {};

        // Category filter
        if (category && category !== "all") {
            query.category = category;
        }

        // Flow filter
        if (flow && flow !== "all") {
            query.flow = flow;
        }

        // Subject / Department / Officer filter
        if (subject?.trim()) {
            query.subject_department_or_officer = {
                $regex: subject.trim(),
                $options: "i"
            };
        }

        // Search keyword across fields
        if (search?.trim()) {
            const searchRegex = { $regex: search.trim(), $options: "i" };
            query.$or = [
                { letterNumber: searchRegex },
                { title: searchRegex },
                { sender: searchRegex },
                { destination: searchRegex },
                { subject_department_or_officer: searchRegex },
                { registeredPostNumber: searchRegex },
                { recivingOffice: searchRegex },
                { personReceivingLetter: searchRegex }
            ];
        }

        // Date range handling
        let start = null;
        let end = null;

        const refDate = startDate || date;

        if (period === "daily") {
            const targetDate = refDate ? new Date(refDate) : new Date();
            start = new Date(targetDate.setHours(0, 0, 0, 0));
            end = new Date(targetDate.setHours(23, 59, 59, 999));
        } else if (period === "weekly") {
            if (startDate && endDate) {
                start = new Date(`${startDate}T00:00:00`);
                end = new Date(`${endDate}T23:59:59.999`);
            } else {
                const now = refDate ? new Date(refDate) : new Date();
                end = new Date(now.setHours(23, 59, 59, 999));
                start = new Date(end);
                start.setDate(start.getDate() - 6);
                start.setHours(0, 0, 0, 0);
            }
        } else if (period === "monthly") {
            if (startDate) {
                const d = new Date(startDate);
                start = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
                end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
            } else {
                const now = new Date();
                start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
                end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
            }
        } else if (period === "custom" || (startDate && endDate)) {
            if (startDate) start = new Date(`${startDate}T00:00:00`);
            if (endDate) end = new Date(`${endDate}T23:59:59.999`);
        }

        if (start || end) {
            const dateConditions = [];
            if (start && end) {
                dateConditions.push({ letterDate: { $gte: start, $lte: end } });
                dateConditions.push({ dateRecived: { $gte: start, $lte: end } });
                dateConditions.push({ createdAt: { $gte: start, $lte: end } });
            } else if (start) {
                dateConditions.push({ letterDate: { $gte: start } });
                dateConditions.push({ dateRecived: { $gte: start } });
                dateConditions.push({ createdAt: { $gte: start } });
            } else if (end) {
                dateConditions.push({ letterDate: { $lte: end } });
                dateConditions.push({ dateRecived: { $lte: end } });
                dateConditions.push({ createdAt: { $lte: end } });
            }

            if (query.$or) {
                // Combine existing $or with date $or using $and
                query.$and = [
                    { $or: query.$or },
                    { $or: dateConditions }
                ];
                delete query.$or;
            } else {
                query.$or = dateConditions;
            }
        }

        const letters = await Letter.find(query).sort({ createdAt: -1 });

        // Calculate metrics
        const summary = {
            total: letters.length,
            sending: letters.filter(l => l.flow === "sending").length,
            receiving: letters.filter(l => l.flow === "receiving").length,
            registered: letters.filter(l => l.category === "registered").length,
            normal: letters.filter(l => l.category === "normal").length,
            byhand: letters.filter(l => l.category === "byhand").length,
            specialByhand: letters.filter(l => l.category === "specialByhand").length,
        };

        res.status(200).json({
            summary,
            letters,
            queryMeta: {
                category: category || "all",
                flow: flow || "all",
                period: period || "all",
                startDate: start ? start.toISOString() : null,
                endDate: end ? end.toISOString() : null
            }
        });
    } catch (error) {
        console.error("Get report data error:", error);
        res.status(500).json({ message: error.message });
    }
};