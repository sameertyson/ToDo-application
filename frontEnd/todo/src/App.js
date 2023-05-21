import {BrowserRouter,Switch} from 'react-router-dom/cjs/react-router-dom.min'
import { Route } from 'react-router-dom/cjs/react-router-dom.min'
import Register from './components/Register'
import Login from './components/Login'
import Home from './components/Home'
import ProctedRoute from './components/ProctedRoute'
import TodoList from './components/TodoList'

const App =()=><BrowserRouter>
<Switch>
  <Route exact path="/register/" component={Register}/>
  <Route exact path="/login/" component={Login}/>
  <ProctedRoute exact path="/" component={Home}/>
  <ProctedRoute exact path="/todoList" component={TodoList}/>
</Switch>
</BrowserRouter>
export default App