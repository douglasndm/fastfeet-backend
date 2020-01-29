import User from '../models/User';

class UserController {
    async index(req, res) {
        return res.send('ok');
    }
}

export default new UserController();
