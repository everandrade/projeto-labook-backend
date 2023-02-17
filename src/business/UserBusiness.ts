import { UserDatabase } from "../database/UserDatabase"
import { GetUsersInput, GetUsersOutput, LoginInput, LoginOutput, SignupInput, SignupOutput } from "../dtos/UserDTO"
import { BadRequestError } from "../errors/BadRequestError"
import { ForbiddenRequestError } from "../errors/ForbiddenRequestError"
import { NotFoundError } from "../errors/NotFoundError"
import { TokenPayload, USER_ROLES } from "../interfaces/types"
import { User } from "../models/User"
import { HashManager } from "../services/HashManager"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"

export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase,
        private hashManager: HashManager,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) { }

    public getUsers = async (input: GetUsersInput): Promise<GetUsersOutput> => {
        const { q, token } = input

        if (typeof q !== "string" && q !== undefined) {
            throw new BadRequestError("'q' must be string or undefined")
        }

        if (!token) {
            throw new BadRequestError(`Invalid token`)
        }

        const tokenPayload = this.tokenManager.getPayload(token as string)

        if (tokenPayload === null) {
            throw new BadRequestError(`Invalid token payload`)
        }

        if (tokenPayload.role !== USER_ROLES.ADMIN) {
            throw new ForbiddenRequestError(`User ${tokenPayload.role} is not an administrator`)
        }

        const usersDB = await this.userDatabase.findUsers(q)

        const users = usersDB.map((userDB) => {
            const user = new User(
                userDB.id,
                userDB.name,
                userDB.email,
                userDB.password,
                userDB.role,
                userDB.created_at
            )

            return user.toBusinessModel()
        })

        const output: GetUsersOutput = users

        return output
    }

    // public createUser = async (input: any) => {
    //     const { id, name, email, password, role } = input

    //     if (name.length < 2) {
    //         throw new BadRequestError("'name' deve possuir pelo menos 2 caracteres")
    //     }

    //     if (!email.includes('@')) {
    //         throw new BadRequestError("'email' incorreto")
    //     }

    //     if (password.length < 4) {
    //         throw new BadRequestError("'password' deve possuir pelo menos 4 caracteres")
    //     }

    //     if (role !== "user" && role !== "admin") {
    //         throw new BadRequestError("'role' incorreto, deve ser user ou admin")
    //     }

    //     const userDBExists = await this.userDatabase.findUserById(id)

    //     if (userDBExists) {
    //         throw new BadRequestError("'id' já existe")
    //     }

    //     const newUser = new User(
    //         id,
    //         name,
    //         password,
    //         email,
    //         role
    //     )

    //     const newUserDB: UserDB = {
    //         id: newUser.getId(),
    //         name: newUser.getName(),
    //         password: newUser.getPassword(),
    //         email: newUser.getEmail(),
    //         role: newUser.getRole()
    //     }

    //     await this.userDatabase.insertUser(newUserDB)

    //     const output = this.userDTO.createUserOutputDTO(newUser)

    //     return output
    // }

    // public editUser = async (input: any) => {
    //     const {
    //         idToEdit,
    //         newId,
    //         newName,
    //         newEmail,
    //         newPassword,
    //         newRole
    //     } = input

    //     if (newName.length < 2) {
    //         throw new BadRequestError("'name' deve possuir pelo menos 2 caracteres")
    //     }

    //     if (!newEmail.includes('@')) {
    //         throw new BadRequestError("'email' incorreto")
    //     }

    //     if (newPassword.length < 4) {
    //         throw new BadRequestError("'password' deve possuir pelo menos 4 caracteres")
    //     }

    //     if (newRole !== "user" && newRole !== "admin") {
    //         throw new BadRequestError("'role' incorreto, deve ser 'user' ou 'admin'")
    //     }

    //     const userToEditDB = await this.userDatabase.findUserById(idToEdit)

    //     if (!userToEditDB) {
    //         throw new NotFoundError("'id' para editar não existe")
    //     }

    //     const user = new User(
    //         userToEditDB.id,
    //         userToEditDB.name,
    //         userToEditDB.email,
    //         userToEditDB.password,
    //         userToEditDB.role
    //     )

    //     newId && user.setId(newId)
    //     newName && user.setName(newName)
    //     newEmail && user.setEmail(newEmail)
    //     newPassword && user.setPassword(newPassword)
    //     newRole && user.setRole(newRole)

    //     const updatedUserDB: UserDB = {
    //         id: user.getId(),
    //         name: user.getName(),
    //         email: user.getEmail(),
    //         password: user.getPassword(),
    //         role: user.getRole()
    //     }

    //     await this.userDatabase.updateUser(updatedUserDB)

    //     const output = this.userDTO.editUserOutputDTO(user)

    //     return output
    // }

    // public deleteUser = async (input: any) => {
    //     const { idToDelete } = input

    //     const userToDeleteDB = await this.userDatabase.findUserById(idToDelete)

    //     if (!userToDeleteDB) {
    //         throw new NotFoundError("'id' para deletar não existe")
    //     }

    //     await this.userDatabase.deleteUserById(userToDeleteDB.id)

    //     const output = {
    //         message: "'User' deletado com sucesso"
    //     }

    //     return output
    // }

    public signup = async (input: SignupInput): Promise<SignupOutput> => {
        const { name, email, password } = input

        if (typeof name !== "string") {
            throw new BadRequestError("'name' must be string")
        }

        if (typeof email !== "string") {
            throw new BadRequestError("'email' must be string")
        }

        if (typeof password !== "string") {
            throw new BadRequestError("'password' must be string")
        }

        const emailDBexists = await this.userDatabase.findUserByEmail(email)

        if (emailDBexists) {
            throw new BadRequestError("'email' already registered")
        }

        const hashedPassword = await this.hashManager.hash(password)

        const id = this.idGenerator.generate()

        const newUser = new User(
            id,
            name,
            email,
            hashedPassword,
            USER_ROLES.NORMAL,
            new Date().toISOString()
        )

        const newUserDB = newUser.toDBModel()
        await this.userDatabase.insertUser(newUserDB)

        const tokenPayload: TokenPayload = {
            id: newUser.getId(),
            name: newUser.getName(),
            role: newUser.getRole()
        }

        const token = this.tokenManager.createToken(tokenPayload)

        const output: SignupOutput = {
            message: "Registration done successfully",
            token
        }
        return output
    }

    public login = async (input: LoginInput): Promise<LoginOutput> => {
        const { email, password } = input

        if (typeof email !== "string") {
            throw new Error("'email' must be string")
        }

        if (typeof password !== "string") {
            throw new Error("'password' must be string")
        }

        const userDB = await this.userDatabase.findUserByEmail(email)

        if (!userDB) {
            throw new NotFoundError("'email' not found")
        }

        const user = new User(
            userDB.id,
            userDB.name,
            userDB.email,
            userDB.password,
            userDB.role,
            userDB.created_at
        )

        const isPasswordCorrect = await this.hashManager.compare(password, user.getPassword())

        if (isPasswordCorrect === false) {
            throw new BadRequestError("Incorrect 'email' or 'password'")
        }

        const payload: TokenPayload = {
            id: user.getId(),
            name: user.getName(),
            role: user.getRole()
        }

        const token = this.tokenManager.createToken(payload)

        const output: LoginOutput = {
            message: "Login successful",
            token
        }

        return output
    }
}