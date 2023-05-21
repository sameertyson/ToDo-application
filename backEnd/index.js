const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')

const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')

const app = express()
const cors = require("cors")
app.use(cors())
app.use(express.json())

const dbPath = path.join(__dirname,'index.db')

let db = null

async function installDbAndServer(){
    try{
        db = await open({
            filename:dbPath,
            driver:sqlite3.Database
        })
        app.listen(8004,()=>{
            console.log('server is started at http://localhost:8004')
        })

    }catch(e){
        console.log(`db error ${e.message}`)
        process.exit(1)
    }
}

installDbAndServer()



// Register ===============================================================>>> api_1 <<<
app.post('/register/',async(req,res)=>{
    const {id,username,password} = req.body
    console.log(username,password)
    const hashedPassword = await bcrypt.hash(password,10)
    const query = `INSERT INTO user(id,username,password)
    VALUES ('${id}','${username}','${hashedPassword}');`
    const CheckQuery = `SELECT * FROM user WHERE username="${username}";`
    console.log(hashedPassword)
    if(password.length < 6){
        res.status(400)
        res.send({err_message:"password is too short. Try another"})
    }else{
        const checkData = await db.get(CheckQuery)
        console.log(checkData)
        if (checkData===undefined){
            await db.run(query)
            res.send({message:'Successfully Registered !!!'})
        }
        else{
            res.status(400)
            res.send({err_message:'Username is already existed! Try another One!!'})
        }
    
    
    }
})

// Login ==============================================================>>> api_2 <<<

app.post('/login/', async(req,res)=>{
    const {username,password} = req.body
    console.log(username,password)
    const CheckQuery = `SELECT * FROM user WHERE username='${username}';`
    const CheckedData = await db.get(CheckQuery)
    console.log(CheckedData)
    if(CheckedData===undefined){
        res.status(400)
        res.send({err_message:'User name is not Registerd!'})
    }
    else{
        const passCheck =await bcrypt.compare(password,CheckedData.password)
        if(passCheck===true){
            const payload = {username:username,id:CheckedData.id}
            console.log(payload)
            const token = jwt.sign(payload,"secret_token")
            console.log(token)
            res.send({jwt_token:token})
        }else{
            res.status(400)
            res.send({err_message:"Wrong Password"})
        }
    }
})


// Authentication =========================================================>>> api <<<

const AuthenticationTest = (request,response,next)=>{
    let jwtToken;
    const authHeader = request.headers["authorization"]
    if(authHeader!==undefined){
        jwtToken = authHeader.split(' ')[1]
    }
    if(jwtToken === undefined){
        response.status(401)
        response.send({err_message:"Invalid JWT token"})
    }
    else{
        jwt.verify(jwtToken,"secret_token",(error,payload)=>{
            if(error){
                response.status(401)
                response.send({err_message:"Invalid JWT token"})
            }
            else{
                
                request.userid = payload.id
                next()
            }
        })
    }
}


// userDetails ===============================================================>>> api_4<<<
app.get('/',AuthenticationTest,async(req,res)=>{
    const {userid} = req
    const query = `SELECT * FROM user WHERE id = '${userid}'`
    const data = await db.get(query)
    res.send(data)
})
// todopost =================================================================>>> api_5 <<<

app.use(AuthenticationTest)
app.post("/postTodo",AuthenticationTest,async(request,response)=>{
    const {title,progress,description,date,id} = request.body
    const {userid} = request
    const postQuery = `INSERT INTO todos(id,title,progress,description,date,userid)
    VALUES ('${id}',"${title}",'${progress}','${description}',"${date}",'${userid}');`
    await db.run(postQuery)
    response.send({message:"Added Suessfully!"})
})

// todoList =============================================================>>> api_6 <<<

app.get("/todoList",AuthenticationTest,async(req,res)=>{
    const {userid} = req
    const getQuery = `SELECT * FROM todos WHERE userid="${userid}";`
    const data = await db.all(getQuery)
    res.send(data)
})

// delete Todo ============================================================>>> api_7 <<<
app.delete('/todo/:id',AuthenticationTest,async(req,res)=>{
    const {userid} = req
    const {id} = req.params
    const dltQuery = `DELETE FROM todos WHERE id="${id}" AND userid="${userid}";`
    await db.run(dltQuery)
    res.send({message:"Deleted Successfully!!!"})
})


// update ===============================================================>>> api_7 <<<
app.put("/updateTodo",AuthenticationTest,async(req,res)=>{
    const {userid} = req
    const {id,title,date,description,progress} = req.body
    const upQuery = `UPDATE todos SET title="${title}",date='${date}',description='${description}',progress='${progress}' WHERE id="${id}" AND userid='${userid}';`
    await db.run(upQuery)
    res.send({message:"saved successfully!!!"})
})