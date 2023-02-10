import { UserDatabase } from "../database/UserDatabase"
import { UserDTO } from "../dtos/UserDTO"
import { BadRequestError } from "../errors/BadRequestError"
import { NotFoundError } from "../errors/NotFoundError"
import { UserDB } from "../interfaces/types"
import { User } from "../models/User"

export class UserBusiness {
    constructor(private userDatabase: UserDatabase, private userDTO: UserDTO) { }

    public getUsers = async (input: any) => {
        const { q } = input

        const usersDB = await this.userDatabase.findUsers(q)

        const users: User[] = usersDB.map((userDB) => new User(
            userDB.id,
            userDB.name,
            userDB.email,
            userDB.password,
            userDB.role
        ))

        return users
    }

    public createUser = async (input: any) => {
        const { id, name, email, password, role } = input

        if (name.length < 2) {
            throw new BadRequestError("'name' deve possuir pelo menos 2 caracteres")
        }

        if (!email.includes('@')) {
            throw new BadRequestError("'email' incorreto")
        }

        if (password.length < 4) {
            throw new BadRequestError("'password' deve possuir pelo menos 4 caracteres")
        }

        if (role !== "user" && role !== "admin") {
            throw new BadRequestError("'role' incorreto, deve ser user ou admin")
        }

        const userDBExists = await this.userDatabase.findUserById(id)

        if (userDBExists) {
            throw new BadRequestError("'id' já existe")
        }

        const newUser = new User(
            id,
            name,
            password,
            email,
            role
        )

        const newUserDB: UserDB = {
            id: newUser.getId(),
            name: newUser.getName(),
            password: newUser.getPassword(),
            email: newUser.getEmail(),
            role: newUser.getRole()
        }

        await this.userDatabase.insertUser(newUserDB)

        const output = this.userDTO.createUserOutputDTO(newUser)

        return output
    }

    public editUser = async (input: any) => {
        const {
            idToEdit,
            newId,
            newName,
            newEmail,
            newPassword,
            newRole
        } = input

        if (newName.length < 2) {
            throw new BadRequestError("'name' deve possuir pelo menos 2 caracteres")
        }

        if (!newEmail.includes('@')) {
            throw new BadRequestError("'email' incorreto")
        }

        if (newPassword.length < 4) {
            throw new BadRequestError("'password' deve possuir pelo menos 4 caracteres")
        }

        if (newRole !== "user" && newRole !== "admin") {
            throw new BadRequestError("'role' incorreto, deve ser 'user' ou 'admin'")
        }

        const userToEditDB = await this.userDatabase.findUserById(idToEdit)

        if (!userToEditDB) {
            throw new NotFoundError("'id' para editar não existe")
        }

        const user = new User(
            userToEditDB.id,
            userToEditDB.name,
            userToEditDB.email,
            userToEditDB.password,
            userToEditDB.role
        )

        newId && user.setId(newId)
        newName && user.setName(newName)
        newEmail && user.setEmail(newEmail)
        newPassword && user.setPassword(newPassword)
        newRole && user.setRole(newRole)

        const updatedUserDB: UserDB = {
            id: user.getId(),
            name: user.getName(),
            email: user.getEmail(),
            password: user.getPassword(),
            role: user.getRole()
        }

        await this.userDatabase.updateUser(updatedUserDB)

        const output = this.userDTO.editUserOutputDTO(user)

        return output
    }

    public deleteUser = async (input: any) => {
        const { idToDelete } = input

        const userToDeleteDB = await this.userDatabase.findUserById(idToDelete)

        if (!userToDeleteDB) {
            throw new NotFoundError("'id' para deletar não existe")
        }

        await this.userDatabase.deleteUserById(userToDeleteDB.id)

        const output = {
            message: "'User' deletado com sucesso"
        }

        return output
    }
}