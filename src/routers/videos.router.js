import { Router } from "express";
import { allVideos, postVideo,videoShow } from "../controller/videos.controller.js";
import dotenv from "dotenv"
import multer from "multer"
dotenv.config()
const router=Router()
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null,uniqueSuffix+file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })
router.get("/",allVideos)
router.get("/user/videos/:name",upload.single("thumbnail"),videoShow)
router.post("/user/videos",upload.single("thumbnail"),postVideo)
export default router