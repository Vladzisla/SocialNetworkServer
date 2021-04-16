const jwt = require("jsonwebtoken");
bcrypt = require("bcryptjs")
const User = require('../models/users.model')
fs = require("fs")
const SECRET_KEY = 'secret'

class DBUsersService {

    getAll = async () => {
        return await User.findAll({
            attributes:['id','login','role']
        })
    }

    get = async (id) => {
        return await User.findAll({
            where: {
                id: id
            }
        })
    }

    create = async (userBody) => {
        const user = await User.findOne({
            where: {
                login: userBody.login
            }
        })
        if (user) {
            return {message: 'This login is already taken.'}
        } else {
            await User.create({
                email: userBody.email,
                login: userBody.login,
                password: userBody.password,
                firstName: userBody.firstName,
                secondName: userBody.secondName
            });
            return {message: 'User was created.'}
        }
    }

    login = async (userBody) => {
        const login = userBody.login;

        const user = await User.findOne({
            where: {
                login: userBody.login
            }
        })

        if (user) {
            if (bcrypt.compareSync(userBody.password, user.password)) {
                const token = jwt.sign({login, type: 'access'}, SECRET_KEY)
                return {token, user}
            } else {
                return {message: 'Incorrect password.'}
            }
        }
        else {
            return {message: 'User does not exist.'}
        }
    }

    update = async (id, userBody) => {
        if(userBody.file){
            userBody.filePath = userBody.file.path
        }
        const user = await User.findOne({
            where: {
                id: id
            }
        })

        if (user) {
            try{
                await User.update(userBody,{
                    where:{
                        id: id
                    }
                })
            }
            catch (e) {
                console.log(e);
                try{
                    if(e.errors[0].path == 'filePath'){
                        try {
                            fs.unlinkSync(userBody.file.path)
                        }
                        catch (e) {
                            return {message: 'Failed to save file on DB and to delete file from server'}
                        }
                        return {message: 'Failed to save file on DB'}
                    }
                }
                catch (e) {

                }
                return {message: e.message}
            }
            return {message: 'User was updated.'}
        }
        else {
            return {message: 'User does not exist.'}
        }
    }

    delete = async (id) => {
        const user = await User.findOne({
            where: {
                id: id
            }
        })

        if(user){
            await User.destroy({
                where: {
                    id: id
                }
            })
            return {message: 'User has been deleted.'}
        }
        else {
            return {message: 'User does not exist.'}
        }
    }
}

module.exports = new DBUsersService();
