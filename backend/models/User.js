/*
    Stores login account information.
    HR is also a user with role = "hr".
    Employees have role = "employee".
*/

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        password: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            enum: ["employee", "hr"],
            default: "employee",
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving to database
userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) {
            return;
        }
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } 
    catch (error) {
        next(error);
    }
});

// Compare entered password with hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;