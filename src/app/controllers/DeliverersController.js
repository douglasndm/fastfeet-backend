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

        const { id, name, email } = await Deliverer.create(req.body);

        return res.json({ id, name, email });
    }

    async update(req, res) {
        const { id } = req.params;

        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            avatar_id: Yup.number(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validations fails' });
        }

        const updatedDeliverer = await Deliverer.update(req.body, {
            where: id,
        });

        return res.json({ updatedDeliverer });
    }

    async delete(req, res) {
        const { id } = req.params;

        const deliverer = await Deliverer.findByPk(id);

        if (!deliverer) {
            return res.status(400).json({ error: "Deliverer didn't found " });
        }

        await Deliverer.destroy({ where: { id } });

        return res.json({ success: true });
    }
}

export default new DeliverersController();
