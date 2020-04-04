import * as Yup from 'yup';
import { parseISO, setHours, isBefore, isAfter, setMinutes } from 'date-fns';

import Package from '../models/Package';

class DeliverymanPackage {
    async update(req, res) {
        const { deliveryman_id, package_id } = req.params;

        if (!package_id) {
            return res.status(400).json({ error: 'Package ID is required' });
        }

        const schmea = Yup.object().shape({
            signature_id: Yup.number(),
            start_date: Yup.date(),
            end_date: Yup.date(),
        });

        if (!(await schmea.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const { signature_id } = req.body;

        if (req.body.start_date) {
            const start_date = parseISO(req.body.start_date);

            const packagesList = await Package.findAll({
                where: {
                    deliveryman_id,
                    start_date,
                },
            });

            if (packagesList > 4) {
                return res.status(400).json({
                    error:
                        'You should not delivery more than 5 packages per day',
                });
            }

            req.body.start_date = start_date;
        }

        if (req.body.end_date) {
            req.body.end_date = parseISO(req.body.end_date);
        }

        if (
            isBefore(req.body.end_date, setHours(req.body.end_date, 8)) ||
            isAfter(
                req.body.end_date,
                setHours(setMinutes(req.body.end_date, 0), 18)
            )
        ) {
            return res
                .status(400)
                .send('Packages can only be delivered between 8AM to 6PM');
        }

        const the_package = await Package.findByPk(package_id);

        if (!the_package) {
            return res.status(400).json({ error: "Package didn't find" });
        }

        const updatedPackeage = await the_package.update(req.body);

        return res.json(updatedPackeage);
    }
}

export default new DeliverymanPackage();
