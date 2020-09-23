import { Router } from 'express';

import { session } from '../services/session';

const router = Router();

router.post('/id=:accountId', (req, res) => {
    const { accountId } = req.params;
    const { asset_name, device_id, uid } = req.body;
    session.startSession(accountId, asset_name, device_id, uid);
    return res.send();
});

router.delete('/id=:accountId/save=:shouldSave', async (req, res) => {
    const { accountId, shouldSave } = req.params;

    await session.endSession(accountId, Boolean(shouldSave));
    return res.send();
});

router.get('/results', async (req, res) => {
    const result = await session.getSavedSessions();
    return res.send(result);
});

router.post('/id=:accountId/update', (req, res) => {
    const { accountId } = req.params;
    const { sessionProps } = req.body;
    session.updateSession(accountId, sessionProps);
    return res.send();
});

router.get('/active', (req, res) => {
    return res.send(session.getSessions());
});

router.get('/:accountId', (req, res) => {
    const { accountId } = req.params;

    return res.send(session.getSession(accountId));
});

export const sessionRouter = router;
