import OnboardingApplication from "../models/OnboardingApplication.js";
import RegistrationToken from "../models/RegistrationToken.js";
import Document from "../models/Document.js";
import { ValidationError } from "../utils/error.js";

// validation help function for reference & emergency
const validateApplicationInput = ({
  reference,
  emergencyContacts,
}) => {
  const hasReference =
    reference &&
    (
      reference.firstName ||
      reference.lastName ||
      reference.middleName ||
      reference.phone ||
      reference.email ||
      reference.relationship
    );

  if (hasReference) {
    if (!reference.firstName || !reference.lastName || !reference.relationship) {
      throw new ValidationError(
        "Reference first name, last name, and relationship are required if reference is provided"
      );
    }
  }

  if (!Array.isArray(emergencyContacts) || emergencyContacts.length < 1) {
    throw new ValidationError("At least one emergency contact is required");
  }

  for (const contact of emergencyContacts) {
    if (!contact.firstName || !contact.lastName || !contact.relationship) {
      throw new ValidationError(
        "Emergency contact first name, last name, and relationship are required"
      );
    }
  }
};

const parseJSONField = (value) => {
  if (!value) return undefined;
  if (typeof value === "object") return value;

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const createOrUpdateDocument = async (userId, documentType, file) => {
  if (!file) return null;

  const document = await Document.findOneAndUpdate(
    {
      user: userId,
      documentType,
    },
    {
      user: userId,
      documentType,
      originalName: file.originalname,
      fileName: file.filename,
      filePath: file.path,
      mimeType: file.mimetype,
      status: "pending",
      feedback: "",
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  );

  return document;
};

// GET /api/onboarding/me
export const getMyApplication = async (req, res, next) => {
  try {
    const app = await OnboardingApplication.findOne({
      user: req.user._id,
    })
      .populate("profilePicture")
      .populate("driverLicense")
      .populate("workAuthorization.optReceipt");

    // getMyApplication return a clear status: "not_submitted" / "pending / rejected / approved"
    if (!app) {
      return res.status(200).json({
        status: "not_submitted",
        application: null,
      });
    }

    res.status(200).json({
      status: app.status,
      application: app,
    });
  } catch (error) {
    next(error);
  }
};

// Shared submit/resubmit logic
const saveApplication = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      middleName,
      preferredName,
      cellPhone,
      workPhone,
      ssn,
      dateOfBirth,
      gender,
      isPermanentResidentOrCitizen,
      residentType,
    } = req.body;

    const address = parseJSONField(req.body.address);
    const workAuthorization = parseJSONField(req.body.workAuthorization) || {};
    const reference = parseJSONField(req.body.reference);
    const emergencyContacts = parseJSONField(req.body.emergencyContacts);

    //validate for reference & emergency
    validateApplicationInput({
      reference,
      emergencyContacts,
    });


    const profilePictureFile = req.files?.profilePicture?.[0];
    const driverLicenseFile = req.files?.driverLicense?.[0];
    const optReceiptFile = req.files?.optReceipt?.[0];

    let app = await OnboardingApplication.findOne({ user: req.user._id });

    const profilePictureDocument = await createOrUpdateDocument(
      req.user._id,
      "profile_picture",
      profilePictureFile
    );
    
    const optReceiptDocument = await createOrUpdateDocument(
      req.user._id,
      "opt_receipt",
      optReceiptFile
    );

    const driverLicenseDocument = await createOrUpdateDocument(
      req.user._id,
      "driver_license",
      driverLicenseFile
    );

    const applicationData = {
      user: req.user._id,
      firstName,
      lastName,
      middleName,
      preferredName,
      profilePicture: profilePictureDocument?._id || app?.profilePicture || null,
      address,
      cellPhone,
      workPhone,
      email: req.user.email,
      ssn,
      dateOfBirth,
      gender,
      isPermanentResidentOrCitizen:
        isPermanentResidentOrCitizen === true ||
        isPermanentResidentOrCitizen === "true",
      residentType,
      workAuthorization: {
        ...workAuthorization,
        optReceipt: optReceiptDocument?._id || app?.workAuthorization?.optReceipt || null,
      },
      driverLicense: driverLicenseDocument?._id || app?.driverLicense || null,
      reference,
      emergencyContacts,
      status: "pending",
      feedback: "",
    };

    if (!app) {
      app = await OnboardingApplication.create(applicationData);
    } else {
      Object.assign(app, applicationData);
      await app.save();
    }

    // After submit onboarding, update registration-token record
    await RegistrationToken.findOneAndUpdate(
      {
        email: req.user.email,
        used: true,
      },
      {
        onboardingSubmitted: true,
      },
      {
        sort: { createdAt: -1 },
      }
    );

    res.json(app);
  } catch (error) {
    next(error);
  }
};

// POST /api/onboarding/submit
export const submitApplication = saveApplication;

// PUT /api/onboarding/resubmit
export const resubmitApplication = saveApplication;