import * as Yup from 'yup';
import { Op } from 'sequelize';
import { isBefore, isAfter, parseISO, setHours, setMinutes } from 'date-fns';
import Package from '../models/Package';
import Deliveryman from '../models/Deliverer';
import Mail from '../../lib/Mail';
import Recipient from '../models/Recipient';

class PackagesController {
    async index(req, res) {
        const { deliveryman_id } = req.params;
        const { q: query } = req.query;

        // Operador ternario, caso exista a variavel query vai buscar no banco os correspodentes, do contrário retorna tudo
        let packages = {};

        if (query)
            packages = await Package.findAll({
                where: {
                    product: {
                        [Op.like]: `%${query}%`,
                    },
                },
            });
        else packages = await Package.findAll();

        if (deliveryman_id) {
            const packagesFromADeliveryman = packages.filter(
                p => p.deliveryman_id === deliveryman_id
            );

            const { delivered } = req.query;

            if (delivered) {
                const deliveredPackages = packagesFromADeliveryman.filter(p =>
                    p.end_date !== null ? p : null
                );

                return res.json(deliveredPackages);
            }

            return res.json(packagesFromADeliveryman);
        }

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

        const deliveryman = await Deliveryman.findByPk(req.body.deliveryman_id);
        if (!deliveryman)
            return res.status(400).json({ error: "Deliveryman didn't find" });

        const recipient = await Recipient.findByPk(req.body.recipient_id);
        if (!recipient)
            return res.status(400).json({ error: "Recipient didn't found" });

        const newPackage = await Package.create(req.body);

        await Mail.sendMail({
            to: `${deliveryman.name} <${deliveryman.email}>`,
            subject: 'Nova encomenda',
            text: `Olá, você tem uma nova encomenda cadastrada e já está disponível para entrega${
                newPackage.product ? `: ${newPackage.product}` : ''
            }`,
        });

        return res.json(newPackage);
    }

    async update(req, res) {
        const { id } = req.params;
        const { deliveryman_id } = req.query;

        if (!id) {
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
                        'Should can not delivery more than 5 packages per day',
                });
            }

            req.body.start_date = parseISO(req.body.start_date);
        }

        if (
            isBefore(end_time, setHours(end_time, 8)) ||
            isAfter(end_time, setHours(setMinutes(end_time, 0), 18))
        ) {
            return res
                .status(400)
                .send('Packages can only be delivered between 8AM to 6PM');
        }

        const the_package = await Package.findByPk(id);

        if (!the_package) {
            return res.status(400).json({ error: "Package didn't find" });
        }

        const updatedPackeage = await the_package.update(req.body);

        return res.json(updatedPackeage);
    }

    async delete(req, res) {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'Package ID is required' });
        }

        const the_package = await Package.findByPk(id);

        if (!the_package) {
            return res.status(400).json({ error: "Package didn't find" });
        }

        await the_package.destroy(the_package);

        return res.json({ message: 'Package deleted' });
    }
}

export default new PackagesController();
