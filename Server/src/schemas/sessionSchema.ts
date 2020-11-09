import { Schema } from 'mongoose';

export const sessionSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    deviceName: {
        type: String,
    },
    playerName: {
        type: String,
        required: true,
    },
    deviceId: {
        type: String,
        required: true,
    },
    assetName: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    sessionData: {
        type: [{ bitrate: { bitrateKbps: Number }, position: Number }],
        required: true,
    },
});
