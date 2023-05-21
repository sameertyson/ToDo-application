import Cookies from "js-cookie";
import Header from "../Header";
import TodoItem from "../TodoItem";
import './index.css'

const { Component } = require("react");


class TodoList extends Component{

    state = {todoList:[],deletRes:'',dltSho:false}

    componentDidMount(){
        this.getTodoList()
    }

    getTodoList = async()=>{
        const token = Cookies.get('jwt_token')
        const url = "http://localhost:8004/todoList"
        const options = {
            method:'GET',
            headers:{
                authorization:`Barer ${token}`,
                Accept : 'application/json',
                'Content-Type':'application/json'
            }
        }
        const response = await fetch(url,options)
        const data = await response.json()
        this.setState({todoList:data})
    }

    DeleteYourTodo = async(id)=>{
        const token = Cookies.get("jwt_token")

        const url = `http://localhost:8004/todo/${id}`
        const options = {
            method : 'DELETE',
            headers:{
                authorization:`Bearer ${token}`,
                Accept:'application/json',
                "Content-Type":'application/json'
            }

        }
        const response = await fetch(url,options)
        const data = await response.json()
        console.log(data)
        this.setState({deletRes:data.message,dltSho:true})
        this.getTodoList()
    }

    render(){
        const {todoList} = this.state
        return<>
        <Header/>
        {todoList.length===0?<div className="no-todo-con">
            <h1>There Are No ToDos</h1>
        </div>
            :<div>
                <ul className="todo-list-ul">
                    {todoList.map(item=><TodoItem DeleteYourTodo={this.DeleteYourTodo} getTodoList={this.getTodoList} key={item.id} todoDetails={item}/>)}
                </ul>
            </div>}
        </>
    }
}
export default TodoList