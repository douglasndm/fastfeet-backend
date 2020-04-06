import * as Yup from 'yup';
import { Op } from 'sequelize';
import Deliverer from '../models/Deliverer';
import File from '../models/File';

class DeliverersController {
    async index(req, res) {
        const { q: query } = req.query;

        if (query) {
            const deliveries = await Deliverer.findAll({
                where: {
                    name: {
                        [Op.iLike]: `%${query}%`,
                    },
                },
            });

            return res.json(deliveries);
        }

        const deliverers = await Deliverer.findAll({
            include: [
                {
                    model: File,
                    attributes: ['id', 'url', 'path'],
                },
            ],
            attributes: ['id', 'name', 'email', 'avatar_id'],
        });

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

        const deliverer = await Deliverer.findByPk(id);

        if (!deliverer)
            return res.status(401).json({ error: "Deliverer didn't find" });

        const updatedDeliverer = await deliverer.update(req.body);

        return res.json({ updatedDeliverer });
    }

    async delete(req, res) {
        const { id } = req.params;

        const deliverer = await Deliverer.findByPk(id);

        if (!deliverer) {
            return res.status(400).json({ error: "Deliverer didn't found " });
        }

        await Deliverer.destroy({ where: { id } });

        return res.json({ message: 'Deliverer was deleted' });
    }
}

export default new DeliverersController();
