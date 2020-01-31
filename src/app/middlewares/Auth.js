import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
    const authToken = req.headers.authorization;

    if (!authToken) {
        return res
            .status(401)
            .json({ error: "You don't have authorization to be here" });
    }

    const [, token] = authToken.split(' ');

    try {
        const decoded = await promisify(jwt.verify)(token, authConfig.secret);

        req.userId = decoded.id;

        return next();
    } catch (ex) {
        return res.status(401).json({ error: 'Token is invalid' });
    }
};
