import OnboardingApplication from "../models/OnboardingApplication.js";
import Document from "../models/Document.js";

const findApprovedProfile = (userId) => {
  return OnboardingApplication.findOne({
    user: userId,
    status: "approved",
  })
    .populate("profilePicture")
    .populate("driverLicense")
    .populate("workAuthorization.optReceipt");
};

// GET /api/profile/me
export const getMyProfile = async (req, res, next) => {
  try {
    const profile = await findApprovedProfile(req.user._id);

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

    const updatedProfile = await findApprovedProfile(req.user._id);
    res.json(updatedProfile);
  } catch (error) {
    next(error);
  }
};

// PUT /api/profile/me/profile-picture
export const updateProfilePicture = async (req, res, next) => {
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

    if (!req.file) {
      return res.status(400).json({
        message: "Profile picture file is required",
      });
    }

    /*
      Update or create the user's profile picture document.

      We use documentType = "profile_picture" so it matches
      the onboarding upload logic and the Document model.
    */
    const profilePictureDocument = await Document.findOneAndUpdate(
      {
        user: req.user._id,
        documentType: "profile_picture",
      },
      {
        user: req.user._id,
        documentType: "profile_picture",
        originalName: req.file.originalname,
        fileName: req.file.filename,
        filePath: req.file.path,
        mimeType: req.file.mimetype,
        status: "approved",
        feedback: "",
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    profile.profilePicture = profilePictureDocument._id;
    await profile.save();

    const updatedProfile = await findApprovedProfile(req.user._id);
    res.json(updatedProfile);
  } catch (error) {
    next(error);
  }
};