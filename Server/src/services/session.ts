//import mongoose from 'mongoose';

import { sessionSchema } from '../schemas/sessionSchema';

//const storedSessions = mongoose.model('session', sessionSchema);
const activeSessions = new Map();

export class Session {
    //this method needs to expand to containt structured sessionProps, one of which should be the active state & bitrate...
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public updateSession(sessionId: string, sessionProps: any): void {
        const existingSessionData = activeSessions.get(sessionId).sessionData;

        activeSessions.set(sessionId, {
            ...activeSessions.get(sessionId),
            sessionData: [...existingSessionData, { ...sessionProps }],
        });
    }

    public startSession(sessionId: string, assetName: string, deviceId: string, email: string): void {
        activeSessions.set(sessionId, { assetName: assetName, deviceId: deviceId, email: email, sessionData: [] });
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public getSession(sessionId: string) {
        return activeSessions.get(sessionId);
    }

    public getSessions(): Array<any> {
        const sessionKeys: Array<any> = [];
        for (const [key, { assetName, deviceId, email }] of activeSessions) {
            sessionKeys.push({ sessionId: key, assetName, deviceId, email });
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
