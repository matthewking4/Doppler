//import mongoose from 'mongoose';

import { sessionSchema } from '../schemas/sessionSchema';

//const storedSessions = mongoose.model('session', sessionSchema);
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
            sessionData: [],
        });
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public getSession(accountId: string) {
        return activeSessions.get(accountId);
    }

    public getSessions(): Array<any> {
        const sessionKeys: Array<any> = [];
        for (const [key, { assetName, deviceId, email }] of activeSessions) {
            sessionKeys.push({ accountId: key, assetName, deviceId, email });
        }
        return sessionKeys;
    }

    // public async endSession(sessionId: string, shouldSave = false): Promise<string | boolean> {
    //     if (shouldSave) {
    //         try {
    //             await storedSessions.create(sessionId, activeSessions.get(sessionId));
    //         } catch (err) {
    //             return err;
    //         }
    //     }

    //     return activeSessions.delete(sessionId);
    // }
}

export const session = new Session();
