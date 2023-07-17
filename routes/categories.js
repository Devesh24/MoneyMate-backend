const Categories = require('../models/Categories')
const { verifyTokenAndAdmin } = require('./verifyToken')
const router = require('express').Router()
const CryptoJS = require('crypto-js')


//add a category
router.post('/', verifyTokenAndAdmin, async (req, res) => {
    const newCat = new Categories(req.body)

    try{
        const savedCat = await newCat.save()
        res.status(200).json(savedCat)
    }
    catch(err){
        res.status(500).json(err)
    }
})


router.get('/', async (req, res) => {
    try{
        const categories = await Categories.find()
        res.status(200).json(categories)
    }
    catch(err){
        res.status(500).json(err)
    }
})


//delete a category
router.delete('/:catId', verifyTokenAndAdmin, async (req, res) => {
    try{
        await Categories.findByIdAndDelete(req.params.catId)
        res.status(200).json("Category Deleted!")
    }
    catch(err){
        res.status(500).json(err)
    }
})


//update a category
router.put('/:catId', verifyTokenAndAdmin, async (req, res) => {
    try{
        const updatedCat = await Categories.findByIdAndUpdate(req.params.catId, {
            $set: req.body
        }, {new: true})
        res.status(200).json(updatedCat)
    }
    catch(err){
        res.status(500).json(err)
    }
})

module.exports = router