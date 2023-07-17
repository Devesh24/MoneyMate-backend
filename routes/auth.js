const User = require('../models/User')
const router = require('express').Router()
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')


router.post('/register', async (req, res) => {
    const newUser = new User({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password , process.env.PASS_SEC).toString()
    })

    try{
        const oldUsername = await User.findOne({username: req.body.username})
        const oldEmail = await User.findOne({email: req.body.email})
        if(oldUsername)
        {
            alert("Username already exists!!")
            res.status(400).json("Username already exists!!")
        }
        else if(oldEmail)
        {
            alert("Email already exists!!")  
            res.status(400).json("Email already exists!!")
        }
        else
        {
            const savedUser = await newUser.save()
            res.status(200).json(savedUser)
        }
    }
    catch(err){
        res.status(500).json(err)
    }
})


router.post('/login', async (req, res) => {
    try{
        const user = await User.findOne({email: req.body.email})
        if(!user)
        {
            alert("Wrong Cradentials")  
            res.status(401).json("Wrong Credentials!")
        } 
        else
        {
            const decryptedPass = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC).toString(CryptoJS.enc.Utf8) 
            if(decryptedPass !== req.body.password)
            {
                alert("Wrong Password") 
                return res.status(401).json("Wrong Password!")
            }

            const accessToken = jwt.sign(
                {
                    email: user.email
                },
                process.env.JWT_SEC,
                {expiresIn: "3d"}
            )

            const {password, ...others} = user._doc;
            decryptedPass === req.body.password && res.status(200).json({...others, accessToken})
        }
    }
    catch(err){
        res.status(500).json(err)
    }
})

module.exports = router