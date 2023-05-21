import { Component } from "react";
import {v4 as uuidV4} from 'uuid'

import './index.css'

class Register extends Component{

    state = {username:'',password:'',showpass:false,err:'',showErr:false}

    submitRegisterForm=async(event)=>{
        event.preventDefault()
        const {username,password} = this.state
        const id = uuidV4()
        const userDetails = {id,username,password}
        console.log(userDetails)
        const url = "http://localhost:8004/register/"
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
            const {history} = this.props
            history.push("/login/")
            this.setState({showErr:false})
        }
        else{
            this.setState({showErr:true,err:data.err_message})
        }
    }

    getLogin=()=>{
        const {history} = this.props
        history.push('/login/')
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
                    <button className="btn sign " type="submit">Sign In</button>
                    <button className="btn login" type="button" onClick={this.getLogin}>Login</button>
                </div>
                {showErr&&<p>*{err}</p>}
            </form>
        </div>
    }
}
export default Register