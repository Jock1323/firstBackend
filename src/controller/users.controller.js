import path from "path"
import { customErrorClass } from "../errors/customError.js";
import { HOST } from "../utils/config.js";
import { read, write } from "../utils/fs.js";
import {sign, verify} from "../utils/jwt.js"
import dotenv from "dotenv"
import sha256 from "sha256";
dotenv.config()
const userImage=(req,res)=>{
    res.sendFile(path.join(process.cwd(),"uploads",req.params.name))
}
const register=(req,res,next)=>{
    try {
        const {username,password}=req.body
        const {filename}=req.file
        const allUsers=read("users.json")
        if(allUsers){
            const foundedUser=allUsers.find(user=>user.username==username)
        if(foundedUser){
            res.status(400).json({
                message:"user is already exists",
                status:400
            })
            return
        }
        allUsers.push({
            id:allUsers.at(-1)?.id+1 || 1,
            username,
            password:sha256(password),
            avatar:`${HOST}${filename}`
        })
        write("users.json",allUsers)
        const userAgent=req.headers["user-agent"]
        const ip=req.ip
        res.status(201).json({
            message:"success",
            status:201,
            token:sign({
                id:allUsers.at(-1).id,
                userAgent,
                ip
            })
        })
        }
        else{
            throw new Error("path not found")
        }
    } catch (error) {
        next(new customErrorClass(error.message,500))
    }
}
const login=(req,res,next)=>{
    try {
        const {username,password}=req.filteredValue
        const allUsers=read("users.json")
        if(allUsers){
            const foundedUser=allUsers.find(user=>user.username==username && user.password==sha256(password))
        if(!foundedUser){
            throw new Error("password or username is wrong")
        }
        res.status(201).json({
            message:"welcome",
            status:201,
            token:sign({
                id:foundedUser.id
            })
        })
        }
        else{
            throw new Error("path not found")
        }
    } catch (error) {
        next(new customErrorClass(error.message,500))
    }
}
const users=(_,res,next)=>{
   try {
    const allUsers=read("users.json").filter(user=>delete user.password)
    if(!allUsers) throw new Error()
    res.status(200).json({
        message:"all users",
        count:allUsers.length,
        data:allUsers
    })
   } catch (error) {
        next(new customErrorClass(error.message,500))
   }
}
export{
    register,
    login,
    users,
    userImage
}