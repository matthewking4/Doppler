import { Schema } from 'mongoose';

export const sessionSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    sessionData: {
        type: [{ bitrate: { bitrateKbps: Number }, position: Number }],
        required: true,
    },
});
