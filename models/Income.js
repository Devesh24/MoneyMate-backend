const mongoose = require('mongoose')

const IncomeSchema = new mongoose.Schema(
    {
        userId: {type: String, required: true},
        amount: {type: Number, required: true},
        day: {type: Number, required: true},
        month: {type: Number, required: true},
        year: {type: Number, required: true},
        category: {type: String, required: true},
        note: {type: String}
    },
    {timestamps: true}
)

module.exports = mongoose.model("Income", IncomeSchema)