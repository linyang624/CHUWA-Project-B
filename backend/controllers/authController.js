import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Generate a JWT token after successful login.
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "3h",
    });
};
// Login user with username and password.
// If credentials are correct, return user info and JWT token.
export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (user && (await user.matchPassword(password))) {
            res.json({
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
        } else {
        res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Return the currently logged-in user.
// req.user is added by protect middleware.
export const getMe = async (req, res) => {
    res.json(req.user);
};

// For JWT auth, logout is mostly handled on frontend by removing the token.
export const logout = async (req, res) => {
    res.json({ message: "Logged out" });
};