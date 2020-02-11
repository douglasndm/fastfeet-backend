import * as Yup from 'yup';
import Deliverer from '../models/Deliverer';

class DeliverersController {
    async index(req, res) {
        const deliverers = await Deliverer.findAll();

        return res.json(deliverers);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string()
                .email()
                .required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validations fields fails' });
        }
    }
}

export default new DeliverersController();
