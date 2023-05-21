import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import { Component } from "react";
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component{

    state = {username:'',password:'',showpass:false,err:'',showErr:false}

    submitRegisterForm=async(event)=>{
        event.preventDefault()
        const {username,password} = this.state
        const userDetails = {username,password}
        console.log(userDetails)
        const url = "http://localhost:8004/login/"
        const options = {
            method :'POST',
            headers:{
                Accept:'application/json',
                'Content-Type':'application/json'
            },
            body : JSON.stringify(userDetails)
        }
        const response = await fetch(url,options)
        const data = await response.json()
        console.log(response,data)
        if (response.ok===true){
            Cookies.set("jwt_token",data.jwt_token,{expires:30})
            const {history} = this.props
            history.replace("/")
            this.setState({showErr:false})
        }
        else{
            this.setState({showErr:true,err:data.err_message})
        }
    }

    getLogin=()=>{
        const {history} = this.props
        history.push('/register/')
    }

    getName=(event)=>{
        this.setState({username:event.target.value})
    }

    ChangShowpass=()=>{
        this.setState(prev=>({showpass:!prev.showpass}))
    }

    getPass=(event)=>{
        this.setState({password:event.target.value})
    }

    render(){
        const {password,username,showpass,err,showErr} = this.state
        if(Cookies.get("jwt_token")!==undefined){
            return<Redirect to="/"/>
        }
        return<div className="register-con">
            <form className="register-form" onSubmit={this.submitRegisterForm}>
                <h1 className="register-heading">Todo</h1>
                <label htmlFor="name">NAME</label>
                <input id="name" className="input-bars" value={username} type="text" placeholder="Enter user name" onChange={this.getName} />
                <lable htmlFor="pass" >PASSWORD</lable>
                <input id="pass" className="input-bars" type={showpass?"text":"password"} value={password} placeholder="Enter Your password" onChange={this.getPass}/>
                <div>
                    <input type="checkbox" id='showpass' checked={showpass} onChange={this.ChangShowpass}/>
                    <lable htmlFor="showpass">Show Password</lable>
                </div>
                <div className="btn-con">
                    <button className="btn login " type="button" onClick={this.getLogin}>Sign In</button>
                    <button className="btn sign" type="submit" >Login</button>
                </div>
                {showErr&&<p>*{err}</p>}
            </form>
        </div>
    }
}
export default Login