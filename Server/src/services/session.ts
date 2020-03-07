import mongoose from 'mongoose';

import { sessionSchema } from '../schemas/sessionSchema';

const storedSessions = mongoose.model('session', sessionSchema);
const activeSessions = new Map();

export class Session {
    public updateSession(sessionId: string, sessionProps: any): void {
        //this method needs to expand to containt structured sessionProps, one of which should be the active state & bitrate...
        activeSessions.set(sessionId, [...activeSessions.get(sessionId), sessionProps]);
    }

    public startSession(sessionId: string): void {
        console.log(activeSessions);
        activeSessions.set(sessionId, []);
    }

    public getSession(sessionId: string) {
        return activeSessions.get(sessionId);
    }

    public getSessions() {
        let sessionKeys = [];
        for (let [key] of activeSessions) {
            sessionKeys.push(key);
        }
        return sessionKeys;
    }

    public async endSession(sessionId: string, shouldSave = false): Promise<string | boolean> {
        if (shouldSave) {
            try {
                await storedSessions.create(sessionId, activeSessions.get(sessionId));
            } catch (err) {
                return err;
            }
        }

        return activeSessions.delete(sessionId);
    }
}

export const session = new Session();
