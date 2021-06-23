const router = require('express').Router();
const bcrypt = require('bcryptjs')
const User = require('../../models/UserModel')
const jwt = require("jsonwebtoken");
const { validationResult } = require('express-validator');
const {registrationValidator, loginValidator} = require('./authValidator');

const errorFormatter = ({ location, msg, param }) => {
    return `[${param}]: ${msg}`;
};

//REGISTRATION HANDLER
//Add Validators here and account fields in UserModel.js
router.post("/register", registrationValidator, async (req,res) => {
    try{
        const inputs = req.body;
        
        //Various Validators
        const errors = validationResult(req).formatWith(errorFormatter);
        if(!errors.isEmpty()){ return res.status(422).json({errorMessage: errors.array()})};
        
        if(!inputs) return res.status(401).json({errorMessage: 'Input tidak boleh kosong'});
        
        if(inputs.password !== inputs.passwordVerify)
        return res.status(400).json({errorMessage: "Password dan verifikasi tidak sama"})

        let existingUser = await User.findOne({ email: inputs.email });
        if(existingUser)
        return res.status(400).json({ errorMessage: "Email telah terdaftar, mohon gunakan email yang lain"})
        
        existingUser = await User.findOne({username: inputs.username});
        if(existingUser){
            return res.status(400).json({errorMessage: "Username tersebut sudah terdaftar, mohon gunakan username yang lain"})
        }

        /*if(inputs.password !== inputs.passwordVerify)
        return res.status(400).json({errorMessage: "Password dan verifikasi tidak sama"})*/

        //Password Hashing
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(inputs.password, salt);
        
        //Add user to database
        const newUser = User({
            username: inputs.username, 
            email: inputs.email,
            passwordHash: passwordHash,
        });

        await newUser.save();

        //Log the user in after registration

        //Sign JWT Token
        const token = jwt.sign({ 
            User: newUser._id,
            username: newUser.username,
            email: newUser.email,
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.accessToken
        });

        //Send token via HTTP-Only cookie
        res.cookie("token", token, { httpOnly: true });
        res.send();

    } catch (err) {
        console.log(err);
        res.status(500).json({errorMessage: err.message});
    }
});

//Login
router.post("/login", loginValidator ,async(req,res) => {
    try{
        
        const { email, password } = req.body;
        //Validator
        if(!email || !password) 
        return res.status(400).json({ 
            errorMessage: "Mohon isi semua informasi registrasi anda." 
        });

        const existingUser = await User.findOne({ email });
        if(!existingUser) return res.status(400).json({errorMessage: 'Email tersebut belum terdaftar, silahkan registrasi terlebih dahulu'})
        const passwordCorrect = await bcrypt.compare(password, existingUser.passwordHash);

        if(!passwordCorrect || !existingUser)
        return res.status(401).json({errorMessage: "email atau password yang anda masukkan salah, mohon cek ulang"})
        
        //Sign JWT Token
        const token = await jwt.sign({ 
            User: existingUser._id,
            username: existingUser.username,
            email: existingUser.email,
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.accessToken
        });

        //Send token via HTTP-Only cookie
        res.cookie("token", token, { httpOnly: true });
        res.send();

    }catch(err){
        console.error(err);
        res.status(500).json({errorMessage: err.message});
    }
});

//Logout
router.get("/logout", (req,res) => {

    res.cookie("token", "", {
        httpOnly: true,
        //Sets expiry date to the past so browsers will clear cookie by default
        expires: new Date(0)
    }).status(200).send();
});

module.exports = router;