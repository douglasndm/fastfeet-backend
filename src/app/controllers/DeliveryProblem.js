import DeliveryProblem from '../models/DeliveryProblem';
import Package from '../models/Package';

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
}

export default new Delivery_Problem();
