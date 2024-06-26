//import mongoose from 'mongoose';

import { sessionSchema } from '../schemas/sessionSchema';
import mongoose from 'mongoose';

const Sessions = mongoose.model('session', sessionSchema);
const activeSessions = new Map();

export class Session {
    //this method needs to expand to containt structured sessionProps, one of which should be the active state & bitrate...
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public updateSession(accountId: string, sessionProps: any): void {
        const existingSessionData = activeSessions.get(accountId).sessionData;
        activeSessions.set(accountId, {
            ...activeSessions.get(accountId),
            sessionData: [...existingSessionData, { ...sessionProps }],
        });
    }

    public startSession(accountId: string, assetName: string, deviceId: string, uid: string): void {
        activeSessions.set(accountId, {
            assetName: assetName,
            deviceId: deviceId,
            email: accountId,
            uid: uid,
            sessionData: [{ bitrate: { bitrateKbps: 0 }, position: 0 }],
        });
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public getSession(accountId: string) {
        return activeSessions.get(accountId);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public getSessions(): Array<any> {
        const sessionKeys: Array<any> = [];
        for (const [key, { assetName, deviceId, email }] of activeSessions) {
            sessionKeys.push({ accountId: key, assetName, deviceId, email });
        }
        return sessionKeys;
    }

    public async endSession(accountId: string, shouldSave = false): Promise<string | boolean> {
        if (shouldSave) {
            try {
                await Sessions.create({ ...activeSessions.get(accountId), date: Date() });
            } catch (err) {
                return err;
            }
        }
        return activeSessions.delete(accountId);
    }

    public async getSavedSessions(): Promise<Array<any>> {
        try {
            return await Sessions.find();
        } catch (err) {
            return err;
        }
    }
}

export const session = new Session();
