import 'bootstrap/dist/css/bootstrap.css'
import buildClient from '../api/buildClient'
import Header from '../components/header'

const AppComponent = ({Component, pageProps,currentUser}) => {
    return (
    <>
        <Header/>
        <Component {...pageProps}/>
    </>
    )
}
AppComponent.getInitialProps = async(appContext) => {
    const client = buildClient(appContext.ctx)
    const { data } = await client.get(`/api/users/currentUser`)
    let pageProps= {}
    //This allows other pages to use initial props
    if(appContext.Component.getInitialProps) pageProps = await appContext.Component.getInitialProps(appContext.ctx)
    return {pageProps, ...data}  
}

export default AppComponent