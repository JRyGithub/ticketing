import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'

import { currentUserRouter } from './routes/currentUser'
import { signInRouter } from './routes/signIn'
import { signUpRouter } from './routes/signUp'
import { signOutRouter } from './routes/signOut'
import { errorHandler,NotFoundError } from '@ryweb.solutions/common'

const app = express()
app.set(`trust proxy`, true)
app.use(json())
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV != 'test'
    })
)
app.use(currentUserRouter)
app.use(signInRouter)
app.use(signUpRouter)
app.use(signOutRouter)

//Could use next(new NotFoundError())
app.all('*',async()=> {
    throw new NotFoundError()
})

app.use(errorHandler)

export { app }