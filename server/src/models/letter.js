import mongoose from "mongoose";


const letterSchema = new mongoose.Schema({

    letterNumber: {
        type: String,
        required: true,
        unique: true
    },

    flow: {
        type: String,
        required: true,
        enum: ["sending", "receiving"]
    },

    category: {
        type: String,
        required: true,
        enum: ["registered", "normal", "byhand","specialByhand"]
    },

    title: {
        type: String,
        required: true
    },

    sender: {
        type: String
    },

    receiver: {
        type: String
    },

    destination: {
        type: String
    },

    letterDate: {
        type: Date
    },

    registeredPostNumber: {
        type: String
    },


    subject_department_or_officer: {
        type: String
    },

    dateRecived: {
        type: Date
    },

    recivingOffice: {
        type: String
    },

    personReceivingLetter: {
        type: String
    },

    dateReceivedByResponsibleOfficer: {
        type: Date
    },

    pdf: {
        type: String
    },

    status: {
        type: String
    },

    reply: {
        type: String
    },

    replyPdf: {
        type: String
    }

}, {
    timestamps: true
});


const Letter = mongoose.model("Letter", letterSchema);


export default Letter;