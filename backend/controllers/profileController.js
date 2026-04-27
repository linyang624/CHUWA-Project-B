import User from "../models/User.js";

// GET /api/profile/me
export const getProfile = async (req, res) => {
    res.json(req.user);
};

// PUT /api/profile/me
export const updateProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    user.email = req.body.email || user.email;

    await user.save();

    res.json(user);
};