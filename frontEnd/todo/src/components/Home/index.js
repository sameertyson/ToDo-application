import { Component, Fragment } from "react";
import Header from "../Header";
import './index.css'
import Cookies from "js-cookie";
import {v4 as uuidV4} from 'uuid'

const progress = [{value:"Started",display:"Started"},{value:'IN PROGRESS',display:'In Progress'},{value:'COMPLETED',display:'Completed'}]

class Home extends Component{

    state ={title:'',progressVal:progress[0].value,description:'',date:'',titleErr:false,totalAlert:false,succ:false,succMsg:''}


    CreateTodo=async(event)=>{
        event.preventDefault()
        const{title,progressVal,description,date} =this.state
        const id = uuidV4()
        const token = Cookies.get('jwt_token')
        const url = 'http://localhost:8004/postTodo'
        const options = {
            method:'POST',
            headers:{
                authorization:`Barer ${token}`,
                Accept:'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({title:title,progress:progressVal,description:description,date:date,id:id})
        }

        if (title === '' || date === ''){
            this.setState({totalAlert:true})
        }else{
            const response = await fetch(url,options)
            const data = await response.json()
            this.setState({succ:true,succMsg:data.message})
        }

        

    }

    getErrBlur=()=>{
        const {title}=this.state
        if(title===''){
            this.setState({titleErr:true})
        }
        else{
            this.setState({titleErr:false})
        }
    }

    getTitle=(event)=>{
        this.setState({title:event.target.value})
    }

    getDate=(event)=>{
        this.setState({date:event.target.value})
    }

    getDescription=(event)=>{
        this.setState({description:event.target.value})
    }

    changeProgress=(event)=>{
        this.setState({progressVal:event.target.value})
    }

    render(){
        const{title,progressVal,description,date,titleErr,totalAlert ,succ,succMsg} =this.state
        console.log(date)
        return<Fragment>
        <Header/>
            <div className="hom-con">
                <h1>Create Your ToDo</h1>
                    <form className="form-con-todo" onSubmit={this.CreateTodo}>
                    <label htmlFor="title">Title</label>
                    <input className="input-bars" value={title} type="text" onBlur={this.getErrBlur} placeholder="Enter your title" onChange={this.getTitle} />
                    {titleErr&&<p>*Required</p>}
                    <lable htmlFor="progress">Progress</lable>
                    <select className="input-bars" value={progressVal} onChange={this.changeProgress}>
                        {progress.map(item=><option key={item.value} id={item.value}>{item.display}</option>)}
                    </select>
                    <label htmlFor="desc">Description</label>
                    <textarea value={description} rows={10} cols={50} id="desc" className="input-bars" onChange={this.getDescription} ></textarea>
                    <label htmlFor="date">Date</label>
                    <input type="date" id ="date" className="input-bars" value={date} onChange={this.getDate} />
                    <button type="submit" className="sign ad-todo">Add Todo</button>
                    {totalAlert&&<p>*please Enter All Values</p>}
                </form>
                {succ&&<p className="succ">{succMsg}</p>}
            </div>
        </Fragment>
    }
}
export default Home