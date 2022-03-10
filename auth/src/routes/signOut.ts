import express from 'express'

const router = express.Router()

router.get(`/api/users/signOut`, (req,res) => {
    res.send(`Hello Sign Out!`)
})

export {router as signOutRouter}