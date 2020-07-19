import { Router } from 'express';

import { session } from '../services/session';

const router = Router();

router.post('/id=:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const { asset_name, device_id, email } = req.headers;

    session.startSession(sessionId, asset_name as string, device_id as string, email as string);
    return res.send();
});

// router.delete('/id=:sessionId/save=:shouldSave', async (req, res) => {
//     const { sessionId, shouldSave } = req.params;

//     await session.endSession(sessionId, Boolean(shouldSave));
//     return res.send();
// });

router.post('/id=:sessionId/update', (req, res) => {
    const { sessionId } = req.params;
    const sessionProps = {
        playerState: 'Playing',
        position: '0',
        bitrate: 4200,
    };

    session.updateSession(sessionId, sessionProps);

    return res.send();
});

router.get('/active', (req, res) => {
    return res.send(session.getSessions());
});

router.get('/:sessionId', (req, res) => {
    const { sessionId } = req.params;

    return res.send(session.getSession(sessionId));
});

export const sessionRouter = router;
