import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
    async index(req, res) {
        const recipients = await Recipient.findAll();

        return res.json(recipients);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            street: Yup.string().required(),
            number: Yup.string().required(),
            complement: Yup.string(),
            state: Yup.string().required(),
            city: Yup.string().required(),
            postalcode: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(401).json({ error: 'Validation fails' });
        }

        const recipient = await Recipient.create(req.body);

        return res.json(recipient);
    }

    async update(req, res) {
        const { id } = req.params;

        const schema = Yup.object().shape({
            name: Yup.string(),
            street: Yup.string(),
            number: Yup.string(),
            complement: Yup.string(),
            state: Yup.string(),
            city: Yup.string(),
            postalcode: Yup.string(),
        });

        if (!(await schema.isValid(req.body)))
            return res.status(401).json({ error: 'Validations fails' });

        const recipient = await Recipient.findByPk(id);

        if (!recipient) {
            return res.status(401).json({ error: "Recipient didn't find" });
        }

        const updatedRecipient = await recipient.update(req.body);

        return res.json(updatedRecipient);
    }

    async delete(req, res) {
        const { id } = req.params;

        const recipient = await Recipient.findByPk(id);

        if (!recipient) {
            return res.status(401).json({ error: "Recipient didn't find" });
        }

        await recipient.destroy(id);

        return res.json({ message: 'Success! The recipient was deleted' });
    }
}

export default new RecipientController();
