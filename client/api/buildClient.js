import axios from "axios";

const buildClient = ({req}) => {
     //This will check to make sure it is being run server side not client side!! As window does not exist server side
     //servicename.namespace.svc.cluster.local{url}
    if(typeof window === `undefined`){
        return axios.create({
            baseURL: `http://ingress-nginx-controller.ingress-nginx.svc.cluster.local`,
            headers: req.headers
        })
    }else{
        return axios.create({ baseURL: `/`})
    }
}

export default buildClient