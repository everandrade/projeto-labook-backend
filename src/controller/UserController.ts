import { Request, Response } from "express"
import { UserBusiness } from "../business/UserBusiness"
import { GetUsersInput, LoginInput, SignupInput } from "../dtos/UserDTO"

export class UserController {
    constructor(
        private userBusiness: UserBusiness, 
        ) { }

    public getUsers = async (req: Request, res: Response) => {
        try {
            const input: GetUsersInput = {
                q: req.query.q,
                token: req.headers.authorization
            }

            const output = await this.userBusiness.getUsers(input)
    
            res.status(200).send(output)
        } catch (error) {
            console.log(error)
    
            if (req.statusCode === 200) {
                res.status(500)
            }
    
            if (error instanceof Error) {
                res.send(error.message)
            } else {
                res.send("Unexpected error")
            }
        }
    }

    // public createUser = async (req: Request, res: Response) => {
    //     try {
    //         const input = this.userDTO.createUserInputDTO(req.body.id, req.body.name, req.body.email, req.body.password, req.body.role)

    //         const output = await this.userBusiness.createUser(input)

    //         res.status(201).send(output)
    //     } catch (error) {
    //         console.log(error)

    //         if (error instanceof BaseError) {
    //             res.status(error.statusCode).send(error.message)
    //         } else {
    //             res.status(500).send("Erro inesperado")
    //         }
    //     }
    // }

    // public editUser = async (req: Request, res: Response) => {
    //     try {
    //         const input = this.userDTO.editUserInputDTO(req.params.id, req.body.id, req.body.name, req.body.email, req.body.password, req.body.role)

    //         const output = await this.userBusiness.editUser(input)

    //         res.status(200).send(output)
    //     } catch (error) {
    //         console.log(error)

    //         if (error instanceof BaseError) {
    //             res.status(error.statusCode).send(error.message)
    //         } else {
    //             res.status(500).send("Erro inesperado")
    //         }
    //     }
    // }

    // public deleteUser = async (req: Request, res: Response) => {
    //     try {
    //         const input = {
    //             idToDelete: req.params.id
    //         }

    //         const output = await this.userBusiness.deleteUser(input)

    //         res.status(200).send(output)
    //     } catch (error) {
    //         console.log(error)

    //         if (error instanceof BaseError) {
    //             res.status(error.statusCode).send(error.message)
    //         } else {
    //             res.status(500).send("Erro inesperado")
    //         }
    //     }
    // }

    public signup = async (req: Request, res: Response) => {
        try {
            const input: SignupInput = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            }
            
            const output = await this.userBusiness.signup(input)
    
            res.status(201).send(output)
        } catch (error) {
            console.log(error)
    
            if (req.statusCode === 200) {
                res.status(500)
            }
    
            if (error instanceof Error) {
                res.send(error.message)
            } else {
                res.send("Unexpected error")
            }
        }
    }

    public login = async (req: Request, res: Response) => {
        try {
            const input: LoginInput = {
                email: req.body.email,
                password: req.body.password
            }

            const output = await this.userBusiness.login(input)
    
            res.status(200).send(output)
        } catch (error) {
            console.log(error)
    
            if (req.statusCode === 200) {
                res.status(500)
            }
    
            if (error instanceof Error) {
                res.send(error.message)
            } else {
                res.send("Unexpected error")
            }
        }
    }
}
