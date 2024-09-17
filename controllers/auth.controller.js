const express = require('express')
const bcrypt = require('bcrypt')
const { expressjwt: expjwt } = require('express-jwt')
const jwt = require('jsonwebtoken') 
const User = require('../models/user.model')

const validateJWT = expjwt({
    secret: process.env.SECRET,
    algorithms: ['HS256']
})

const signToken = _id => jwt.sign({ _id },process.env.SECRET)

const findAndAssingUser = async (req, res, next) => {
    try{
        const findUser = await User.findById(req.auth._id)
        if(!findUser){
            return res.status(401).end()
        }
        req.user = findUser
        next()
    } catch(err){
        next(err)
    }
}

const isAuthenticated = express.Router().use(validateJWT, findAndAssingUser)

const Auth = {
    login: async(req, res) => {
        const { body } = req 
        try{
            const user = await User.findOne({ email: body.email })
            if (!user){
                return res.status(401).send("User and/or password incorrect!")
            } else {
                const isMatch = await bcrypt.compare(body.password, user.password)
                if (isMatch){
                    const signed = signToken(user._id)
                    res.status(200).send(signed)

                } else {
                    return res.status(401).send("User and/or password incorrect!")
                }
            }
        } catch(err){
            res.send(err.message)
        }
    },
    register: async(req, res) => {
        const { body } = req
        try{
            const isUser = await User.findOne({ email: req.email })
            if(isUser){
                res.send("Usuario ya registrado!")
            } else {
                const salt = await bcrypt.genSalt()
                const hashed = await bcrypt.hash(body.password, salt)
                const user = await User.create({email: body.email, password: hashed, salt })
                const signed = signToken(user._id)
                res.send(signed)
            }
        }catch(err){
            res.status(500).send(err.message)
        }
    },
}

module.exports = { Auth, isAuthenticated }