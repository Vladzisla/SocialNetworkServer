const jwt = require("jsonwebtoken");

bcrypt = require("bcryptjs")
fs = require("fs")

class JSONUsersService {
    usersList = JSON.parse(fs.readFileSync("users.json", "ascii"))

    writeToFile(data){
        fs.writeFileSync("users.json", JSON.stringify(data), 'ascii')
    }

    get = (id) => {
        return this.usersList.find((el) => {
            return el.id == id
        })
    }
    create = (userBody) => {
        if(this.usersList.some((el) => {return el.login == userBody.login})){
            return {message: 'This login is already taken.'}
        }
        else {
            return new Promise((resolve, reject) => {
                bcrypt.hash(userBody.password, 10, (err, hash) => {
                    userBody.password = hash
                    userBody.role = 'user'
                    this.usersList.push({id: new Date(), ...userBody, });
                    this.writeToFile(this.usersList);
                    resolve(err)
                })
            }).then(res => {
                if(!res){
                    return {message: 'User was created.'}
                }
            })
        }
    }
    login = (login, password) => {
        if(this.usersList.some((el) => {return el.login == login})){
            const user = this.usersList.find((el) => {return el.login == login})

            return new Promise((resolve, reject) => {
                bcrypt.compare(password, user.password, (err, res) => {
                    resolve(res)
                })
            }).then(resp => {
                if(resp){
                    const SECRET_KEY = 'secret'
                    const token = jwt.sign({login, type:'access'}, SECRET_KEY)
                    return {token, user}
                }
                else {
                    return {message: 'Incorrect password.'}
                }
                return resp
            })
        }
        else {
            return {message: 'User does not exist.'}
        }

    }
    update = (id, ...userBody) => {
        if(this.usersList.some((el) => {return el.id == id})){
            if(this.usersList.some((el) => {return el.login == userBody[0].login})){
                return {message: 'This login is already taken.'}
            }
            Object.assign(this.usersList.find((el) => {return el.id == id}), ...userBody)

            this.writeToFile(this.usersList);
            return {message: 'User was updated.'}
        }
        else {
            return {message: 'User does not exist.'}
        }

    }
    delete = (id) => {
        if(this.usersList.some((el) => {return el.id == id})) {
            this.usersList.splice(this.usersList.findIndex((el, index) => {
                return el.id == id
            }), 1);

            this.writeToFile(this.usersList);
            return {message: 'User was deleted.'}
        }
        else {
                return {message: 'User does not exist.'}
        }
    }
}
module.exports = new JSONUsersService();