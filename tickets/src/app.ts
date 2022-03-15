import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import { createTicketRouter } from './routes/new'
import { errorHandler,NotFoundError,currentUser } from '@ryweb.solutions/common'

const app = express()
app.set(`trust proxy`, true)
app.use(json())
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV != 'test'
    })
)
app.use(currentUser)

app.use(createTicketRouter)
//Could use next(new NotFoundError())
app.all('*',async()=> {
    throw new NotFoundError()
})

app.use(errorHandler)

export { app }