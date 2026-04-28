/*
    Onboarding Application Record
    This model stores the employee onboarding form.
    HR reviews the whole application in Hiring Management.

    Status:
    pending  -> waiting for HR review
    approved -> employee can access home / personal information
    rejected -> employee can edit and resubmit

*/

import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema (
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },

        firstName: {
            type: String,
            required: true,
        },

        lastName: {
            type: String,
            required: true,
        },

        middleName: {
            type: String,
            default: "",
        },

        preferredName: {
            type: String,
            default: "",
        },

        profilePicture: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Document",
            default: null,
        },

        address: {
            building: {
                type: String,
                default: "",
            },
            street: {
                type: String,
                required: true,
            },
            city: {
                type: String,
                required: true,
            },
            state: {
                type: String,
                required: true,
            },
            zip: {
                type: String,
                required: true,
            },
        },
        
        cellPhone: {
            type: String,
            required: true,
        },

        workPhone: {
            type: String,
            default: "",
        },

        email: {
            type: String,
            required: true,
        },

        ssn: {
            type: String,
            required: true,
        },

        dateOfBirth: {
            type: Date,
            required: true,
        },

        gender: {
            type: String,
            required: true,
            enum: ["male", "female", "i_do_not_wish_to_answer"],
        },
        
        isPermanentResidentOrCitizen: {
            type: Boolean,
            required: true,
        },

        residentType: {
            type: String,
            enum: ["green_card", "citizen", ""],
            default: "",
        },

        workAuthorization: {
            visaTitle: {
                type: String,
                enum: ["h1b", "l2", "f1_cpt_opt", "h4", "other", ""],
                default: "",
            },
            otherTitle: {
                type: String,
                default: "",
            },
            startDate: {
                type: Date,
                default: null,
            },
            endDate: {
                type: Date,
                default: null,
            },
            optReceipt: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Document",
                default: null,
            },
        },

        driverLicense: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Document",
            default: null,
        },
        
        reference: {
            firstName: {
                type: String,
                default: "",
            },
            lastName: {
                type: String,
                default: "",
            },
            middleName: {
                type: String,
                default: "",
            },
            phone: {
                type: String,
                default: "",
            },
            email: {
                type: String,
                default: "",
            },
            relationship: {
                type: String,
                default: "",
            },
        },
        

        emergencyContacts: [
            {
                firstName: {
                    type: String,
                    required: true,
                },
                lastName: {
                    type: String,
                    required: true,
                },
                middleName: {
                    type: String,
                    default: "",
                },
                phone: {
                    type: String,
                    default: "",
                },
                email: {
                    type: String,
                    default: "",
                },
                relationship: {
                    type: String,
                    required: true,
                },
            },
        ],

        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },

        feedback: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const OnboardingApplication = mongoose.model("OnboardingApplication", applicationSchema);

export default OnboardingApplication;

