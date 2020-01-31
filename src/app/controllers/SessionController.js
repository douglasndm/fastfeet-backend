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
        ('');
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: "User didn't find" });
        }

        if (!(await user.checkPassword(password))) {
            return res.status(401).json({ error: "Password don't match" });
        }

        const { id, name } = user;

        return res.json({
            user: {
                id,
                name,
                email,
            },
            token: jwt.sign(
                { id, name },
                'AAAAAAAAAAAAAAAAAAAKLKLASDKÇASLDK123123',
                { expiresIn: '30d' }
            ),
        });
    }
}

export default new SessionController();
