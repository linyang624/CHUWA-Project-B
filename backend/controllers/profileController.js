import OnboardingApplication from "../models/OnboardingApplication.js";

// GET /api/profile/me
export const getMyProfile = async (req, res, next) => {
  try {
    const profile = await OnboardingApplication.findOne({
      user: req.user._id,
      status: "approved",
    });

    if (!profile) {
      return res.status(404).json({
        message: "Approved profile not found",
      });
    }

    res.json(profile);
  } catch (error) {
    next(error);
  }
};

// PUT /api/profile/me/section/:section
export const updateProfileSection = async (req, res, next) => {
  try {
    const { section } = req.params;

    const profile = await OnboardingApplication.findOne({
      user: req.user._id,
      status: "approved",
    });

    if (!profile) {
      return res.status(404).json({
        message: "Approved profile not found",
      });
    }

    if (section === "name") {
      profile.firstName = req.body.firstName ?? profile.firstName;
      profile.lastName = req.body.lastName ?? profile.lastName;
      profile.middleName = req.body.middleName ?? profile.middleName;
      profile.preferredName = req.body.preferredName ?? profile.preferredName;
      profile.gender = req.body.gender ?? profile.gender;
    }

    if (section === "address") {
      profile.address = {
        ...profile.address,
        ...req.body.address,
      };
    }

    if (section === "contact") {
      profile.cellPhone = req.body.cellPhone ?? profile.cellPhone;
      profile.workPhone = req.body.workPhone ?? profile.workPhone;
    }

    if (section === "employment") {
      profile.workAuthorization = {
        ...profile.workAuthorization,
        ...req.body.workAuthorization,
      };
    }

    if (section === "emergency") {
      profile.emergencyContacts = req.body.emergencyContacts;
    }

    await profile.save();
    res.json(profile);
  } catch (error) {
    next(error);
  }
};