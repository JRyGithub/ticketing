import express from 'express'

const router = express.Router()

router.get(`/api/users/signIn`, (req,res) => {
    res.send(`Hello Sign In!`)
})

export {router as signInRouter}