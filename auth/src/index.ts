import express from 'express'
import { json } from 'body-parser'
import { currentUserRouter } from './routes/currentUser'
import { signInRouter } from './routes/signIn'
import { signUpRouter } from './routes/signUp'
import { signOutRouter } from './routes/signOut'

const app = express()
app.use(json())

app.use(currentUserRouter)
app.use(signInRouter)
app.use(signUpRouter)
app.use(signOutRouter)

app.listen(3000,() => {
    console.log(`Listening on 3000!!!!`)
})