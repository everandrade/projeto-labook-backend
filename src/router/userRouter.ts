import express from "express"
import { UserBusiness } from "../business/UserBusiness"
import { UserController } from "../controller/UserController"
import { UserDatabase } from "../database/UserDatabase"
import { UserDTO } from "../dtos/UserDTO"

export const userRouter = express.Router()

const userController = new UserController(
    new UserBusiness(new UserDatabase, new UserDTO),
    new UserDTO

)

userRouter.get("/", userController.getUsers)
userRouter.post("/", userController.createUser)
userRouter.put("/:id", userController.editUser)
userRouter.delete("/:id", userController.deleteUser)