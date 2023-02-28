import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

mongoose.connect('mongodb://127.0.0.1:27017/mycomponentsdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("DB conected")
})

const userSchema = new mongoose.Schema ({
    name : String,
    email : String,
    password : String,
    
})
const User = new mongoose.model("User", userSchema)

//Routes
app.post("/login", (req, res)=> {
    const { email, password } = req.body 
    User.findOne({email: email}, (err,user) => {
        if(user){
           if(password === user.password){
            res.send({message:"Login successful", user: user})
           } else {
            res.send( { message: "password didn't match" })
           }
        } else {
            res.send ({message:"user not found"})

        }
    })
})

app.post("/register", (req, res)=> {
    const { name, email, password } = req.body 
    User.findOne({email: email}, (err,user) => {
        if(user){
            res.send({message: "User already registered"})
        } else {
            const user = new User({
                name,
                email, 
                password
            })
            user.save( err => {
                if(err) {
                    res.send(err)
                } else {
                    res.send( { message: "Successfully Registered, please login now"})
                }
            })
         }   
    })
})


app.listen(3000, () => {
    console.log("started at port 3000")
})