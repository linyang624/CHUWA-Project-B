import User from "../models/User.js";
import RegistrationToken from "../models/RegistrationToken.js";

// GET /api/registration/verify-token/:token
export const verifyRegistrationToken = async (req, res) => {
    const { token } = req.params;

    const registrationToken = await RegistrationToken.findOne({ token });

    if (!registrationToken) {
        return res.status(404).json({ message: "Invalid registration token" });
    }

    if (registrationToken.used) {
        return res.status(400).json({ message: "Registration token already used" });
    }

    if (registrationToken.expiresAt < new Date()) {
        return res.status(400).json({ message: "Registration token expired" });
    }

    res.json({
        email: registrationToken.email,
        firstName: registrationToken.firstName,
        lastName: registrationToken.lastName,
        registrationLink: registrationToken.registrationLink,
    });
};

// POST /api/registration/register/:token
// export const registerWithToken = async (req, res) => {
//     const { token } = req.params;
//     const { username, password } = req.body;

//     const registrationToken = await RegistrationToken.findOne({ token });

//     if (!registrationToken) {
//         return res.status(404).json({ message: "Invalid registration token" });
//     }

//     if (registrationToken.used) {
//         return res.status(400).json({ message: "Registration token already used" });
//     }

//     if (registrationToken.expiresAt < new Date()) {
//         return res.status(400).json({ message: "Registration token expired" });
//     }

//     const existingUser = await User.findOne({
//         $or: [{ username }, { email: registrationToken.email }],
//     });

//     if (existingUser) {
//         return res.status(400).json({
//             message: "Username or email already exists",
//         });
//     }

//     const user = await User.create({
//         username,
//         password,
//         email: registrationToken.email,
//         role: "employee",
//     });

//     registrationToken.used = true;
//     await registrationToken.save();

//     res.status(201).json({
//         id: user._id,
//         username: user.username,
//         email: user.email,
//         role: user.role,
//         message: "Registration successful",
//     });
// };

// POST /api/registration/register/:token
export const registerWithToken = async (req, res) => {
    try {
        const { token } = req.params;
        const { username, password } = req.body;

        const registrationToken = await RegistrationToken.findOne({ token });

        if (!registrationToken) {
            return res.status(404).json({ message: "Invalid registration token" });
        }

        if (registrationToken.used) {
            return res.status(400).json({ message: "Registration token already used" });
        }

        if (registrationToken.expiresAt < new Date()) {
            return res.status(400).json({ message: "Registration token expired" });
        }

        const existingUser = await User.findOne({
            $or: [{ username }, { email: registrationToken.email }],
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Username or email already exists",
            });
        }

        const user = await User.create({
            username,
            password,
            email: registrationToken.email,
            role: "employee",
        });

        registrationToken.used = true;
        registrationToken.status = "submitted";
        await registrationToken.save();

        res.status(201).json({
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            message: "Registration successful",
        });
    } catch (error) {
        console.log("Register with token error:", error);

        res.status(500).json({
            message: error.message,
        });
    }
};