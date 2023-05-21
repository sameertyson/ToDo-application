import { withRouter,Link } from "react-router-dom/cjs/react-router-dom.min"
import { Component } from "react"
import Cookies from "js-cookie"
import './index.css'


class Header extends Component{

    state ={username:undefined}


    componentDidMount(){
        this.getuserDetails()
    }

    getuserDetails=async()=>{
        const Token = Cookies.get('jwt_token')
        const url = 'http://localhost:8004/'
        const options ={
            method:'GET',
            headers:{
                authorization:`Bearer ${Token}`
            }
        }
        const response = await fetch(url,options)
        const data = await response.json()
        this.setState({username:data.username})
        
    }

    logout =()=>{
        Cookies.remove("jwt_token")
        const {history} = this.props
        history.replace("/login/")
    }

render(){
   
    const {username} =  this.state
    let names ;
    if (username!==undefined){
        names = username.toUpperCase().slice(0,1)
    }
    return<nav className="nav-con">
            <Link className="link" to="/">
            <div className="todo-hed-con">
                <h1 className="hed-to">To</h1>
                <h1 className="hed-Do">Do</h1>
            </div> 
            </Link>
            <ul className="menu-con">
                <li>
                    <Link className="link" to="/"><p className="menu_item">Create</p></Link>
                </li>
                <li>
                    <Link to="/todoList" className="link"><p className="menu_item">Todo List</p></Link>
                </li>
                <li>
                    <Link className="link" to="/login/"><button type="button" className="logout" onClick={this.logout}>Logout</button></Link>
                </li>
                <li >
                    <h1 className="pr-name">{names}</h1>
                </li>

            </ul>
        </nav>}}
export default withRouter(Header)