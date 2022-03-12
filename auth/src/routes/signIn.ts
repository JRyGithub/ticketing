import express, {Request,Response} from 'express'
import {body} from 'express-validator'
import { BadRequestError } from '../errors/badRequestError'
import { validateRequest } from '../middlewares/validateRequest'
import { User } from '../models/user'
import { Password } from '../services/password'
import jwt from 'jsonwebtoken'
const router = express.Router()

router.post(`/api/users/signIn`,[
    body(`email`)
        .isEmail()
        .exists()
        .withMessage(`Email must be valid`),
    body(`password`)
        .trim()
        .notEmpty()
        .exists()
        .withMessage(`You must apply a password`)
],
validateRequest,
async(req: Request,res: Response) => {
   const {email,password} = req.body
   const existingUser = await User.findOne({ email })
   if(!existingUser) throw new BadRequestError(`Invalid credentials`)
   
   const passwordsMatch = await Password.compare(existingUser.password,password)
   if(!passwordsMatch) throw new BadRequestError(`Invalid credentials`)

     //Generate JWT
    const userJwt = jwt.sign({
        id: existingUser.id,
        email: existingUser.email,
    }, process.env.JWT_KEY!)

    //Store It on Session
    req.session = {
        jwt: userJwt
    }

    res.status(200).send(existingUser)
})

export {router as signInRouter}