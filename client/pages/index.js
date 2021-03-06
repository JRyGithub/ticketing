import axios from "axios"
import buildClient from "../api/buildClient"

const LandingPage = ({currentUser}) => {
    return currentUser ? <h1>You are signed In!</h1> : <h1>You are signed out!</h1>
}

LandingPage.getInitialProps = async(context) => {
    const client = buildClient(context)
    const { data } = await client.get(`/api/users/currentUser`)
    return data  
}
export default LandingPage