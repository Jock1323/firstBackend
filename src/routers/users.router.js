import { Router } from "express";
import multer from "multer";
import { register,login,users,userImage } from "../controller/users.controller.js";
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
router.post("/signup", upload.single("avatar"),register)
router.post("/signin",login)
router.get("/users",users)
router.get("/:name",userImage)
export default router