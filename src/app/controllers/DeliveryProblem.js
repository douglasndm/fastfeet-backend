import * as Yup from 'yup';
import Deliveryman from '../models/Deliverer';
import DeliveryProblem from '../models/DeliveryProblem';
import Package from '../models/Package';
import Mail from '../../lib/Mail';

class Delivery_Problem {
    async index(req, res) {
        const { delivery_id } = req.params;

        if (delivery_id) {
            const the_package = await DeliveryProblem.findAll({
                where: { delivery_id },
                attributes: ['id', 'delivery_id', 'description'],
                include: [
                    {
                        model: Package,
                        as: 'package',
                        attributes: [
                            'id',
                            'recipient_id',
                            'deliveryman_id',
                            'product',
                            'canceled_at',
                            'start_date',
                            'end_date',
                        ],
                    },
                ],
            });

            return res.json(the_package);
        }

        const deliveryProblem = await DeliveryProblem.findAll();

        return res.status(200).json(deliveryProblem);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            delivery_id: Yup.number().required(),
            description: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body)))
            return res.status(401).json({ error: 'Validations fails' });

        const deliveryProblem = await DeliveryProblem.create(req.body);

        return res.status(200).json(deliveryProblem);
    }

    async delete(req, res) {
        const { delivery_id } = req.params;

        const schema = Yup.object().shape({
            description: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body)))
            return res.status(401).json({ error: 'Validations Fails' });

        const problem = await DeliveryProblem.create({
            ...req.body,
            delivery_id,
        });

        const the_package = await Package.findByPk(delivery_id);

        const result = await the_package.update({
            canceled_at: Date.now(),
        });

        const deliveryman = await Deliveryman.findByPk(
            the_package.deliveryman_id
        );

        await Mail.sendMail({
            to: `${deliveryman.name} <${deliveryman.email}>`,
            subject: 'Entrega cancelada',
            text: `A entrega do produto: ${the_package.product} foi cancelada devido ao problema: ${problem.description}`,
        });

        return res.status(200).json({
            problem,
            result,
        });
    }
}

export default new Delivery_Problem();
