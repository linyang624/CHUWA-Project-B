/* 
    Generate Registration Link
    Record sending information
    3hr expiration
    !used 
    ** This is Registration link record
*/

import mongoose from 'mongoose';

const registrationTokenSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },

        firstName: {
            type: String,
            required: true,
        },

        lastName: {
            type: String,
            required: true,
        },

        token: {
            type: String,
            required: true,
            unique: true,
        },

        registrationLink: {
            type: String,
            required: true,
        },

        expiresAt: {
            type: Date,
            required: true,
        },

        used: {
            type: Boolean,
            default: false,
        },

        onboardingSubmitted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const RegistrationToken = mongoose.model('RegistrationToken', registrationTokenSchema);

export default RegistrationToken;