const Income = require('../models/Income')
const { verifyToken, verifyTokenAndAuthorization } = require('./verifyToken')

const router = require('express').Router()


//add an income
router.post('/', async (req, res) => {
    const newIncome = new Income(req.body)

    try{
        const savedIncome = await newIncome.save()
        res.status(200).json(savedIncome)
    }
    catch(err){
        res.status(500).json(err)
    }
})


//update income
router.put('/:id', async (req, res) => {
    try{
        const updatedIncome = await Income.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true})
        res.status(200).json(updatedIncome)
    }
    catch(err){
        res.status(500).json(err)
    }
})



//delete an income by id of a user
router.delete('/:userId/:id', async (req, res) => {
    try{
        await Income.findByIdAndDelete(req.params.id, {
            userId: req.params.userId
        })
        res.status(200).json("Deleted..")
    }
    catch(err){
        res.status(500).json(err)
    }
})


//delete all incomes of a user
router.delete('/:userId', verifyTokenAndAuthorization, async (req, res) => {
    try{
        await Income.deleteMany({
            userId: req.params.userId
        })
        res.status(200).json("Deleted..")
    }
    catch(err){
        res.status(500).json(err)
    }
})


//get all incomes of a user
// router.get('/:userId', verifyToken, async (req, res) => {
router.get('/:userId', async (req, res) => {
    qDate = req.query.date //dd.mm.yyyy
    qDay = req.query.day //dd
    qMonth = req.query.month //mm
    qYear = req.query.year //yyyy

    try{
        let income;
        if(qDate)
        {
            const dateArray = qDate.split('-')
            income = await Income.find({
                userId: req.params.userId,
                day: dateArray[2],
                month: dateArray[1],
                year: dateArray[0]
            })
        }
        else if(qDay)
        {
            income = await Income.find({
                userId: req.params.userId,
                day: qDay
            })
        }
        else if(qMonth)
        {
            const dateArray = qMonth.split('-')
            income = await Income.find({
                userId: req.params.userId,
                month: dateArray[1],
                year: dateArray[0]
            })
        }
        else if(qYear)
        {
            income = await Income.find({
                userId: req.params.userId,
                year: qYear
            })
        }
        else
        {
            income = await Income.find({
                userId: req.params.userId
            })
        }
        res.status(200).json(income)
    }
    catch(err){
        res.status(500).json(err)
    }
})

module.exports = router