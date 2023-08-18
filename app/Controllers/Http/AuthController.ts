import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import Role from 'App/Models/Role';
import User from 'App/Models/User';
import * as cryptoJs from 'crypto-js';

export default class AuthController {

    public async login({ request, auth }: HttpContextContract) {
        let response: any = {};

    try {
        const email = request.input("email");
        const pass = request.input("password");
        const password = cryptoJs.AES.decrypt(pass, 'lxgJMPRqhU').toString(cryptoJs.enc.Utf8);
    
        const token = await auth.use("api").attempt(email, password).then(result => result?.toJSON());
        const user = await this.getUser(email);

        response.success = true;
        response.message = {
            user: user,
            token: token
        };
        return response;

        } catch (error) {
            response.success = false;
            response.error = error;

            return response;
        }
    
    }
    
    public async register({ request, auth }: HttpContextContract) {
        let response: any = {};

        try {
            const email = request.input("email");
            const pass = request.input("password");
            const password = cryptoJs.AES.decrypt(pass, 'lxgJMPRqhU').toString(cryptoJs.enc.Utf8);
            const firstName = request.input("lastName");
            const lastName = request.input("firstName");
            const phoneNumber = request.input("phoneNumber");
            
            const newUser = new User();
            newUser.email = email;
            newUser.password = password;
            newUser.firstName = firstName;
            newUser.lastName = lastName;
            newUser.phoneNumber = phoneNumber;
            const clientRole = await Role.query().where('role','client').firstOrFail();
            newUser.roleId = clientRole?.id;
            await newUser.save();

            
            response.success = true;
        return response;

        } catch (error) {
            response.success = false;
            response.error = error;

            return response;
        }
       
    }

    public async getUser(email) {
        const user = await Database.from('users as u')
        .join('roles as r', 'r.id', 'u.role_id')
        .leftJoin('employees as e', 'e.user_id', 'u.id')
        .select('u.id', 'u.email', 'u.first_name', 'u.last_name', 'u.phone_number', 'r.role', 'e.badge', 'e.branch_id')
        .where('email', email)
        .first();

        if (!user.badge) {
            delete user.badge
            delete user.branch_id;
        }
        return user;
    }
}
