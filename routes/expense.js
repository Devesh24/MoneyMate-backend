const Expense = require('../models/Expense')
const { verifyToken, verifyTokenAndAuthorization } = require('./verifyToken')
const router = require('express').Router()


//add an Expense
router.post('/', async (req, res) => {
    const newExpense = new Expense(req.body)

    try{
        const savedExpense = await newExpense.save()
        res.status(200).json(savedExpense)
    }
    catch(err){
        res.status(500).json(err)
    }
})


//update expense
router.put('/:id', async (req, res) => {
    try{
        const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true})
        res.status(200).json(updatedExpense)
    }
    catch(err){
        res.status(500).json(err)
    }
})



//delete an Expense by id of a user
router.delete('/:userId/:id', async (req, res) => {
    try{
        await Expense.findByIdAndDelete(req.params.id, {
            userId: req.params.userId
        })
        res.status(200).json("Deleted..")
    }
    catch(err){
        res.status(500).json(err)
    }
})


//delete all Expenses of a user
router.delete('/:userId', verifyTokenAndAuthorization, async (req, res) => {
    try{
        await Expense.deleteMany({
            userId: req.params.userId
        })
        res.status(200).json("Deleted..")
    }
    catch(err){
        res.status(500).json(err)
    }
})


//get all Expenses of a user
// router.get('/:userId', verifyToken, async (req, res) => {
router.get('/:userId', async (req, res) => {
    qDate = req.query.date //dd.mm.yyyy
    qDay = req.query.day //dd
    qMonth = req.query.month //mm
    qYear = req.query.year //yyyy

    try{
        let expense;
        if(qDate)
        {
            const dateArray = qDate.split('-')
            expense = await Expense.find({
                userId: req.params.userId,
                day: dateArray[2],
                month: dateArray[1],
                year: dateArray[0]
            })
        }
        else if(qDay)
        {
            expense = await Expense.find({
                userId: req.params.userId,
                day: qDay
            })
        }
        else if(qMonth)
        {
            const dateArray = qMonth.split('-')
            expense = await Expense.find({
                userId: req.params.userId,
                month: dateArray[1],
                year: dateArray[0]
            })
        }
        else if(qYear)
        {
            expense = await Expense.find({
                userId: req.params.userId,
                year: qYear
            })
        }
        else
        {
            expense = await Expense.find({
                userId: req.params.userId
            })
        }
        res.status(200).json(expense)
    }
    catch(err){
        res.status(500).json(err)
    }
})

module.exports = router