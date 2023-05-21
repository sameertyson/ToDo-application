import { Redirect, Route } from "react-router-dom/cjs/react-router-dom.min"
import Cookies from "js-cookie"

const ProctedRoute = (props)=>{
    if(Cookies.get("jwt_token")===undefined){
        return<Redirect to="/login/"/>
    }
    return<Route {...props}/>
}
export default ProctedRoute