import * as Yup from 'yup';
import User from '../models/User';

class UserController {
    async index(req, res) {
        const users = await User.findAll();

        return res.json(users);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string()
                .email()
                .required(),
            password: Yup.string()
                .required()
                .min(6),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const { email } = req.body;

        const checkIfUserExist = await User.findOne({
            where: { email: req.body.email },
        });

        if (checkIfUserExist) {
            return res.status(400).json({ error: 'Email is already in use' });
        }

        const { id, name } = User.create(req.body);

        return res.json({
            status: 'ok',
            user: {
                id,
                name,
                email,
            },
        });
    }
}

export default new UserController();
