import { Router } from 'express';
import mongoose from 'mongoose';
import { networkSchema } from '../schemas/networkSchema';

const router = Router();
const Network = mongoose.model('network', networkSchema);

router.get('/profiles', async (req, res) => {
    try {
        const resp = await Network.find();
        res.send([
            {
                id: 0,
                title: 'Default 1',
                data: [
                    { position: 0, bandwidth: 4000 },
                    { position: 60, bandwidth: 4000 },
                    { position: 60, bandwidth: 3000 },
                    { position: 120, bandwidth: 3000 },
                ],
            },
            {
                id: 1,
                title: 'Default 2',
                data: [
                    { position: 0, bandwidth: 4000 },
                    { position: 60, bandwidth: 4000 },
                    { position: 60, bandwidth: 3000 },
                    { position: 120, bandwidth: 3000 },
                    { position: 120, bandwidth: 4000 },
                    { position: 180, bandwidth: 4000 },
                    { position: 180, bandwidth: 2000 },
                    { position: 200, bandwidth: 2000 },
                ],
            },
            ...resp,
        ]);
    } catch (err) {
        res.status(400).json({ error: `Error getting network profiles - ${err}` });
    }
});

router.post('/create-profile', async (req, res) => {
    {
        try {
            const resp = await Network.create(req.body);
            res.status(200).json(resp);
        } catch (err) {
            res.status(400).json({ error: `Error trying to save your network profile - ${err}` });
        }
    }
});

export const networkRouter = router;
