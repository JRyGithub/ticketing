import express from 'express'

const router = express.Router()

router.get(`/api/users/currentUser`, (req,res) => {
    res.send(`Hello Current User`)
})

export {router as currentUserRouter}