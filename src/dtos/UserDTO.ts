import { BadRequestError } from "../errors/BadRequestError"
import { EditUserInputDTO, EditUserOutputDTO, UserInputDTO, UserOutputDTO } from "../interfaces/types"
import { User } from "../models/User"

export class UserDTO {
    public createUserInputDTO(
        id: unknown,
        name: unknown,
        email: unknown,
        password: unknown,
        role: unknown): UserInputDTO {
        if (typeof id !== "string") {
            throw new BadRequestError("'id' deve ser string")
        }

        if (typeof name !== "string") {
            throw new BadRequestError("'name' deve ser string")
        }

        if (typeof email !== "string") {
            throw new BadRequestError("'email' deve ser string")
        }

        if (typeof password !== "string") {
            throw new BadRequestError("'password' deve ser string")
        }

        if (typeof role !== "string") {
            throw new BadRequestError("'role' deve ser string")
        }

        const dto: UserInputDTO = {
            id,
            name,
            email,
            password,
            role
        }
        return dto
    }

    public createUserOutputDTO(parameter: User): UserOutputDTO {
        const dto: UserOutputDTO = {
            message: "Usuário registrado com sucesso",
            User: {
                id: parameter.getId(),
                name: parameter.getName(),
                email: parameter.getEmail(),
                password: parameter.getPassword(),
                role: parameter.getRole()
            }
        }
        return dto
    }

    public editUserInputDTO(idToEdit: string, newId: unknown, newName: unknown, newEmail: unknown, newPassword: unknown, newRole: unknown): EditUserInputDTO {
        if (newId !== undefined) {
            if (typeof newId !== "string") {
                throw new BadRequestError("'id' deve ser string")
            }
        }

        if (newName !== undefined) {
            if (typeof newName !== "string") {
                throw new BadRequestError("'name' deve ser string")
            }
        }

        if (newEmail !== undefined) {
            if (typeof newEmail !== "string") {
                throw new BadRequestError("'email' deve ser string")
            }
        }

        if (newPassword !== undefined) {
            if (typeof newPassword !== "string") {
                throw new BadRequestError("'password' deve ser string")
            }
        }

        if (newRole !== undefined) {
            if (typeof newRole !== "string") {
                throw new BadRequestError("'role' deve ser string")
            }
        }

        const dto: EditUserInputDTO = {
            idToEdit,
            newId,
            newName,
            newEmail,
            newPassword,
            newRole
        }
        return dto
    }

    public editUserOutputDTO(parameter: User): EditUserOutputDTO {
        const dto: EditUserOutputDTO = {
            message: "'User' editado com sucesso",
            User: {
                id: parameter.getId(),
                name: parameter.getName(),
                email: parameter.getEmail(),
                password: parameter.getPassword(),
                role: parameter.getRole()
            }
        }
        return dto
    }
}