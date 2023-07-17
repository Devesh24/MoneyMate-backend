const User = require('../models/User')
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken')
const router = require('express').Router()
const jwt = require('jsonwebtoken')


//get user by token
router.post('/', async (req, res) => {
    const {token} = req.body
    try{
        const user = jwt.verify(token, process.env.JWT_SEC)
        // console.log(user);
        const userEmail = user.email
        const data = await User.find({email: userEmail})
        res.status(200).json(data)
    }
    catch(err){
        res.status(500).json(err)
    }
})


//update a user
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    if(req.body.password)
    {
        req.body.password = CryptoJS.AES.encrypt(req.body.password , process.env.PASS_SEC).toString()
    }
    
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true})
        res.status(200).json(updatedUser)
    }
    catch(err){
        res.status(500).json(err)
    }
})


//delete a user
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User Deleted")
    }
    catch(err){
        res.status(500).json(err)
    }
})


// get a user by id
router.get('/:id', async (req, res) => {
    try{
        const user = await User.findById(req.params.id)
        const {password, ...others} = user._doc
        res.status(200).json(others)
    }
    catch(err){
        res.status(500).json(err)
    }
})



//get all users
router.get('/', verifyTokenAndAdmin, async (req, res) => {
    try{
        const user = await User.find()
        res.status(200).json(user)
    }
    catch(err){
        res.status(500).json(err)
    }
})


module.exports = router