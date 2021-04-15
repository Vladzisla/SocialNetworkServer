const usersService = require('../services/users.serviceDB')

class UsersController{
    constructor() {
        this.get = this.get.bind(this)
    }
    service = usersService;
    getAll = async (req, res) => {
        res
            .status(200)
            .send(await this.service.getAll())
    }
    get = async (req, res) => {
        res
            .status(200)
            .send(await this.service.get(req.params.id))
    }
    create = async (req, res) => {
        res
            .status(200)
            .send(await this.service.create(req.body))
    }
    login = async (req, res) => {
        res
            .status(200)
            .send(await this.service.login(req.body.login, req.body.password))
    }
    update = async (req, res) => {
        res
            .status(200)
            .send(await this.service.update(req.params.id, {...req.body, file: req.file}))
    }
    delete = async (req, res) => {
        res
            .status(200)
            .send(await this.service.delete(req.params.id))
    }
}

module.exports = new UsersController();
