import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/User';

class SessionController {
    async store(req, res) {
        const schema = Yup.object().shape({
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

        const { email, password } = req.body;

        const userExists = await User.findOne({ where: { email } });

        if (!userExists) {
            return res.status(400).json({ error: "User didn't find" });
        }
    }
}

export default new SessionController();
