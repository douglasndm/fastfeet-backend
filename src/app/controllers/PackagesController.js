import * as Yup from 'yup';
import { isBefore, isAfter, parseISO, setHours, setMinutes } from 'date-fns';
import Package from '../models/Package';

class PackagesController {
    async index(req, res) {
        const { deliveryman_id } = req.params;

        if (deliveryman_id) {
            const packages = await Package.findAll({
                where: { deliveryman_id },
            });

            const { delivered } = req.query;

            if (delivered) {
                const deliveredPackages = packages.map(function(p) {
                    return p.end_date !== null ? p : null;
                });

                return res.json(deliveredPackages);
            }

            return res.json(packages);
        }

        const packages = await Package.findAll();

        return res.json(packages);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            recipient_id: Yup.number().required(),
            deliveryman_id: Yup.number().required(),
            signature_id: Yup.number(),
            product: Yup.string(),
            canceled_at: Yup.date(),
            start_date: Yup.date(),
            end_date: Yup.date(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validations fails' });
        }

        const newPackage = await Package.create(req.body);

        return res.json(newPackage);
    }

    async update(req, res) {
        const { package_id } = req.query;

        if (!package_id) {
            return res.status(400).json({ error: 'Package ID is required' });
        }

        const schmea = Yup.object().shape({
            recipient_id: Yup.number(),
            deliveryman_id: Yup.number(),
            signature_id: Yup.number(),
            product: Yup.string(),
            canceled_at: Yup.date(),
            start_date: Yup.date(),
            end_date: Yup.date(),
        });

        if (!(await schmea.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const end_time = parseISO(req.body.end_date);

        if (
            isBefore(end_time, setHours(end_time, 8)) ||
            isAfter(end_time, setHours(setMinutes(end_time, 0), 18))
        ) {
            return res.send(
                'Packages can only be delivered between 8AM to 6PM'
            );
        }

        const the_package = await Package.findByPk(package_id);

        if (!the_package) {
            return res.status(400).json({ error: "Package didn't find" });
        }

        const updatedPackeage = await Package.update(req.body, {
            where: { id: package_id },
        });

        return res.json(updatedPackeage);
    }

    async delete(req, res) {
        const { package_id } = req.query;

        if (!package_id) {
            return res.status(400).json({ error: 'Package ID is required' });
        }

        const the_package = await Package.findByPk(package_id);

        if (!the_package) {
            return res.status(400).json({ error: "Package didn't find" });
        }

        await Package.destroy(the_package);

        return res.json({ success: true });
    }
}

export default new PackagesController();
