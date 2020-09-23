import { Schema } from 'mongoose';

export const networkSchema = new Schema({
    title: {
        type: String,
        index: { unique: true },
        required: true,
    },
    data: {
        type: [{ position: Number, bandwidth: Number }],
        required: true,
    },
});
