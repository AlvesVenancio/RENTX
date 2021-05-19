import { inject, injectable } from 'tsyringe';
import { hash } from 'bcrypt';

import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { IUsersRepository } from "../../repositories/IUsersRepository";

@injectable()
class CreateUserUseCase {

    constructor(
        @inject('UsersRepository') //esse singleton foi criado em shared/container/index
        private usersRepository: IUsersRepository
    ){}

    async execute({ name, email, password, driver_license }: ICreateUserDTO): Promise<void> {
        
        const useralreadyExists = await this.usersRepository.findByEmail(email);

        if (useralreadyExists) {
            throw new Error('User already exists');
        }
        
        const passwordHash = await hash(password, 8);
        
        await this.usersRepository.create({
            name, email, password: passwordHash, driver_license
        });
    }
}

export { CreateUserUseCase };