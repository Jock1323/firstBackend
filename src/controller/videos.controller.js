import dotenv from "dotenv"
import path from "path"
import { read, write } from "../utils/fs.js";
import {customErrorClass} from "../errors/customError.js"
import {verify} from "../utils/jwt.js"
import {HOST} from "../utils/config.js"
dotenv.config()
const videoShow=(req,res,next)=>{
    try{
        const {name}=req.params
    if(!name){
        throw new Error("image not found")
    }
    res.download(path.join(process.cwd(),"uploads",name))
    }
    catch(error){
        next(new customErrorClass(
            error.message,404
        ))
    }
}
const allVideos=(req,res,next)=>{
    try {
        const {search,userId}=req.query
        const allUsers=read("users.json")
        if(search){
            const foundedVideos=read("videos.json").filter(video=>video.title.toLowerCase().includes(search.toLowerCase())).map(video=>{
                video.author=allUsers.find(user=>user.id==video.author)?.username
                return video
            })
            if(!foundedVideos){
                throw new Error
            }
            res.status(200).json({
                message:"founded videos",
                count:foundedVideos.length,
                data:foundedVideos
            })
        }
        else if(userId){
            const foundedVideos=read("videos.json").filter(video=>video.author==userId).map(video=>{
                video.author=allUsers.find(user=>user.id==video.author)?.username
                return video
            })
            if(!foundedVideos){
                throw new Error
            }
            res.status(200).json({
                message:"founded videos",
                count:foundedVideos.length,
                data:foundedVideos
            })
        }
        else{
        const allVideos=read("videos.json").map(video=>{
            video.author=allUsers.find(user=>user.id==video.author)?.username
            return video
        })
        if(!allVideos){
            throw new Error
        }
        res.status(200).json({
            message:"all videos",
            count:allVideos.length,
            data:allVideos
        })
        }
    } catch (error) {
        next(new customErrorClass("videos not found",404))
    }
}
const postVideo=async(req,res,next)=>{
    try {
        const{token}=req.headers
        const {title}=req.body
        const {filename,size}=req.file
        const decode=await verify(token).catch(err=>next(new customErrorClass(err,400)))
        const allUsers=read("users.json")
        const allVideo=read("videos.json")
        if(decode){
            const {id} =decode
            const foundedUser=allUsers.find(user=>user.id==id)
            if(!foundedUser) throw new Error("user not found")
            allVideo.push({
                id:allVideo.at(-1)?.id+1 ||1,
                title,
                author:String(foundedUser.id),
                thumbnail:`${HOST}user/videos/${filename}`,
                size:`${size/1000000}`,
                date:`${new Date().getFullYear()}/${new Date().getMonth()+1}/${new Date().getDate()}`,
                time:`${new Date().toLocaleTimeString()}`
            })
            write("videos.json",allVideo)
            res.status(201).json({
                message:"video added",
                status:201
            })
        }
    } catch (error) {
        next (new customErrorClass((error.message),400))
    }
}
const getAdminVideos=async(req,res,next)=>{
    try {
        const{token}=req.headers
        const decode=await verify(token).catch(err=>next(new customErrorClass(err,400)))
        if(decode){
            const allUsers=read("users.json")
            const {id}=decode
            const foundedVideos=read("videos.json").filter(video=>video.author==id).map(video=>{
                video.author=allUsers.find(user=>user.id==video.author)?.username
                return video
            })
            if(!foundedVideos){
                throw new Error
            }
            res.status(200).json({
                message:"founded videos",
                count:foundedVideos.length,
                data:foundedVideos
            })
        }
    } catch (error) {
        next (new customErrorClass((error.message),400))
    }
}
export{
    allVideos,
    getAdminVideos,
    videoShow,
    postVideo
}