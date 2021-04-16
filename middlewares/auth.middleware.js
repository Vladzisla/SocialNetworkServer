const jwt =  require('jsonwebtoken')
const User = require('../models/users.model')


const auth = (role) => async (req, res, next) => {
    try{
        const [, token] = req.headers['authorization'].split(' ');
        const result = jwt.verify(token, 'secret')

        const user = await User.findOne({
            where: {
                login: result.login
            }
        })
        if(user.dataValues.role === 'admin'){
            next();
        }
        else if(role === 'user'){
            if(+req.params.id !== user.dataValues.id){
                throw new Error('Access denied.')
            }
            if(!user){
                throw new Error('User is not found.')
            }
            if(role !== user.role){
                throw new Error('Role is incorrect for this operation.')
            }
            else {
                next()
            }
        }


    }
    catch (e) {
        res.status(401).send(e.message)
    }
}

module.exports = auth;
