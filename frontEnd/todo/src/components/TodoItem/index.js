import {AiTwotoneDelete} from 'react-icons/ai'
import {BiEdit} from 'react-icons/bi'
import './index.css'
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min'
import { Component } from 'react'
import React from 'react';
import Popup from 'reactjs-popup';
import Cookies from 'js-cookie'

const progressST = [{value:"Started",display:"Started"},{value:'IN PROGRESS',display:'In Progress'},{value:'COMPLETED',display:'Completed'}]

class TodoItem extends Component{
    constructor(props){
        super(props)
        const {todoDetails} = this.props
        const {title,description,date,progress} = todoDetails 
        this.state ={title,description,date,progress,newTitle:title,newDate:date,newDesc:description,newProgress:progressST[0].value}
    }

    SaveData=async(event)=>{
        event.preventDefault()
        const {todoDetails,getTodoList} = this.props
        const {id} = todoDetails
        const {newTitle,newDate,newProgress,newDesc} = this.state
        const upDetails = {id:id,title:newTitle,date:newDate,progress:newProgress,description:newDesc}
        const token = Cookies.get('jwt_token')
        const url = 'http://localhost:8004/updateTodo'
        const options = {
            method:'PUT',
            headers:{
                authorization:`Bearer ${token}`,
                Accept:'application/json',
                'Content-Type' :'application/json'
            },
            body:JSON.stringify(upDetails)
        }
        const response = await fetch(url,options)
        const data = await response.json()
        console.log(data)
        getTodoList()
    }

    getTitle = (event)=>{
        this.setState({newTitle:event.target.value})
    }

    changeProgress =(event)=>{
        this.setState({newProgress:event.target.value})
    }

    getDescription=(event)=>{
        this.setState({newDesc:event.target.value})
    }

    getDate=(event)=>{
        this.setState({newDate:event.target.value})
    }
    

    DeleteItem=async()=>{
        const {DeleteYourTodo,todoDetails} = this.props
        const {id} =  todoDetails
        DeleteYourTodo(id)

    }


    render(){
    const {title,description,date,progress,newTitle,newDate,newDesc,newProgress} = this.state

    
    let progressClass;
    switch(progress){
        case "Started":
            progressClass="start"
            break;
        case 'In Progress':
            progressClass ='progress'
            break;
        default:
            progressClass = "success"
        
    }

    return<li className='item-card'>
        <div className='title-date'>
        <h1>{title}</h1>
        <p>DATE: {date}</p>
        </div>
        <hr/>
        <p>DESCRIPTION: {description}</p>
        <p className={`prog ${progressClass}`}>{progress}</p>
        <div className='edit-dlt-con'>
        <Popup
                trigger={<button className="login"> Edit <BiEdit/> </button>}
                modal
                nested
            >
                {close => (
                <div className="modal">
                    <button className="close" onClick={close}>
                    &times;
                    </button>
                    <div className="header"> 
                    Edit Todo </div>
                    <div className="content">
                    <form className="form-con-todo" onSubmit={this.SaveData}>
                    <label htmlFor="title">Title</label>
                    <input className="input-bars" value={newTitle} type="text" placeholder="Enter your title" onChange={this.getTitle} />
                    <lable htmlFor="progress">Progress</lable>
                    <select className="input-bars" value={newProgress} onChange={this.changeProgress}>
                        {progressST.map(item=><option key={item.value} id={item.value}>{item.display}</option>)}
                    </select>
                    <label htmlFor="desc">Description</label>
                    <textarea value={newDesc} rows={10} cols={50} id="desc" className="input-bars" onChange={this.getDescription} ></textarea>
                    <label htmlFor="date">Date</label>
                    <input type="date" id ="date" className="input-bars" value={newDate} onChange={this.getDate} />
                    <button type="submit" className="sign ad-todo" > Save</button>
                </form>
                    </div>
                    <div className="actions">
                    
                    <button
                        className="button"
                        onClick={() => {
                        console.log('modal closed ');
                        close();
                        }}
                    >
                        close modal
                    </button>
                    </div>
                </div>
                )}
            </Popup>
            
            <button type='button' className='icon-btn' onClick={this.DeleteItem} ><AiTwotoneDelete/></button>
        </div>
    </li>
}}
export default withRouter(TodoItem)