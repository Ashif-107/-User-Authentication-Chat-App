const express = require('express')
const bcrypt = require('bcrypt');
const app = express()
const Collection = require('./config');
const { name } = require('ejs');

app.use(express.json());
app.set('views','./views')
app.set('view engine','ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}));

app.get('/',(req,res) => {
    res.render('login')
})
app.get("/signup",(req,res) =>{
    res.render("signup");
})



//register user


app.post("/signup",async(req,res)=>{
    const data = {
        name: req.body.username,
        password: req.body.password,
    }

    
    //check existing user
    
    const existingUser = await Collection.findOne({name:data.name});
    
    if(existingUser){
        res.send("User Already Exists");
    }
    else{

        //hash the password
        
        const saltrounds = 10;
        const hashpass = await bcrypt.hash(data.password,saltrounds);
        data.password = hashpass;
        
        
        const userdata = await Collection.insertMany(data);
        console.log(userdata);
        res.render('login')
    }
    
})

let uname

app.post("/login", async(req,res)=>{
    try{
        const check = await Collection.findOne({name: req.body.username});
        if(!check){
            res.send("Username Cannot find");
        }
        const ispass = await bcrypt.compare(req.body.password, check.password);
        if(ispass){
            res.render("index");
            uname = req.body.username; 
            
        }else{
            res.send("Wrong pasword");
        }
    }
    catch{
        res.send("Wrong Details");
    }
})


var io = require('socket.io')(3000)

const users = { }



io.on('connection', socket => {
    users[socket.id] = uname
    socket.broadcast.emit('user-connected',uname)

    socket.emit('user-connec',uname)

    socket.on('send-chat-message',msg => {
        socket.broadcast.emit('chat-message',{msg: msg, name:users[socket.id]})
    })
    socket.on('disconnect',() => {
        socket.broadcast.emit('user-disconnected',users[socket.id])
        delete users[socket.id]
        
    })
});





const port = 5000;

app.listen(port,()=>{
    console.log(`server runtime on port: ${port}`);
})


