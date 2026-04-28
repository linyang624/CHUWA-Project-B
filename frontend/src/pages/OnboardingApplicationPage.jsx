import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { updateOnboardingStatus } from "../features/auth/authSlice";
import { submitOnboardingApplication } from "../api/onboardingApi";
import { getMyApplication } from "../api/onboardingApi";


import { useEffect } from "react";

export default function OnboardingApplicationPage() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: user?.email || "",
    },
  });

  if (!user) return null;

  const onboardingStatus = user.onboardingStatus || "never_submitted";
  const isPR = watch("isPermanentResidentOrCitizen");
  const visaTitle = watch("visaTitle");
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await getMyApplication();

        if (!res) {
          dispatch(updateOnboardingStatus("never_submitted"));
        } else {
          dispatch(updateOnboardingStatus(res.status));
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchStatus();
  }, [dispatch]);

  if (onboardingStatus === "approved") {
    return <Navigate to="/personal-info" replace />;
  }

  if (onboardingStatus === "pending") {
    return (
      <div>
        <h1>Onboarding Status</h1>
        <p>Please wait for HR to review your application.</p>
      </div>
    );
  }

  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("middleName", data.middleName || "");
    formData.append("preferredName", data.preferredName || "");
    formData.append("cellPhone", data.cellPhone);
    formData.append("workPhone", data.workPhone || "");
    formData.append("ssn", data.ssn);
    formData.append("dateOfBirth", data.dateOfBirth);
    formData.append("gender", data.gender);
    formData.append(
      "isPermanentResidentOrCitizen",
      data.isPermanentResidentOrCitizen === "yes"
    );
    formData.append("residentType", data.residentType || "");

    formData.append(
      "address",
      JSON.stringify({
        building: data.building || "",
        street: data.street,
        city: data.city,
        state: data.state,
        zip: data.zip,
      })
    );

    formData.append(
      "workAuthorization",
      JSON.stringify({
        visaTitle: data.visaTitle || "",
        otherTitle: data.otherTitle || "",
        startDate: data.startDate || null,
        endDate: data.endDate || null,
      })
    );

    formData.append(
      "reference",
      JSON.stringify({
        firstName: data.referenceFirstName,
        lastName: data.referenceLastName,
        middleName: data.referenceMiddleName || "",
        phone: data.referencePhone || "",
        email: data.referenceEmail || "",
        relationship: data.referenceRelationship,
      })
    );

    formData.append(
      "emergencyContacts",
      JSON.stringify([
        {
          firstName: data.emergencyFirstName,
          lastName: data.emergencyLastName,
          middleName: data.emergencyMiddleName || "",
          phone: data.emergencyPhone || "",
          email: data.emergencyEmail || "",
          relationship: data.emergencyRelationship,
        },
      ])
    );

    if (data.profilePicture?.[0]) {
      formData.append("profilePicture", data.profilePicture[0]);
    }

    if (data.driverLicense?.[0]) {
      formData.append("driverLicense", data.driverLicense[0]);
    }

    if (data.optReceipt?.[0]) {
      formData.append("optReceipt", data.optReceipt[0]);
    }

    try {
      await submitOnboardingApplication(formData);
      dispatch(updateOnboardingStatus("pending"));
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      {onboardingStatus === "rejected" ? (
        <>
          <h1>Application Rejected</h1>
          <p style={{ color: "red" }}>
            Your application was rejected. Please update and resubmit.
          </p>
        </>
      ) : (
        <>
          <h1>Onboarding Application</h1>
          <p>Please fill out your onboarding application.</p>
        </>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Name</h2>

        <input
          placeholder="First Name"
          {...register("firstName", { required: "First name is required" })}
        />
        {errors.firstName && <p>{errors.firstName.message}</p>}

        <input
          placeholder="Last Name"
          {...register("lastName", { required: "Last name is required" })}
        />
        {errors.lastName && <p>{errors.lastName.message}</p>}

        <input placeholder="Middle Name" {...register("middleName")} />
        <input placeholder="Preferred Name" {...register("preferredName")} />

        <label>Profile Picture</label>
        <input type="file" accept="image/*" {...register("profilePicture")} />

        <h2>Address</h2>

        <input placeholder="Building / Apt" {...register("building")} />
        <input
          placeholder="Street"
          {...register("street", { required: "Street is required" })}
        />
        <input
          placeholder="City"
          {...register("city", { required: "City is required" })}
        />
        <input
          placeholder="State"
          {...register("state", { required: "State is required" })}
        />
        <input
          placeholder="Zip"
          {...register("zip", { required: "Zip is required" })}
        />

        <h2>Contact</h2>

        <input
          placeholder="Cell Phone"
          {...register("cellPhone", { required: "Cell phone is required" })}
        />
        <input placeholder="Work Phone" {...register("workPhone")} />

        {/* <input
          placeholder="Email"
          value={user.email}
          disabled
          {...register("email")}
        /> */}
        <input placeholder="Email" disabled value={user.email || ""} readOnly />

        <h2>Personal Information</h2>

        <input
          placeholder="SSN"
          {...register("ssn", { required: "SSN is required" })}
        />

        <input
          type="date"
          {...register("dateOfBirth", {
            required: "Date of birth is required",
          })}
        />

        <select {...register("gender", { required: "Gender is required" })}>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="i_do_not_wish_to_answer">
            I do not wish to answer
          </option>
        </select>

        <h2>Work Authorization</h2>

        <select
          {...register("isPermanentResidentOrCitizen", {
            required: "This field is required",
          })}
        >
          <option value="">Permanent resident or citizen?</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>

        {isPR === "yes" && (
          <select {...register("residentType")}>
            <option value="">Select Type</option>
            <option value="green_card">Green Card</option>
            <option value="citizen">Citizen</option>
          </select>
        )}

        {isPR === "no" && (
          <>
            <select {...register("visaTitle")}>
              <option value="">Select Work Authorization</option>
              <option value="h1b">H1-B</option>
              <option value="l2">L2</option>
              <option value="f1_cpt_opt">F1 CPT/OPT</option>
              <option value="h4">H4</option>
              <option value="other">Other</option>
            </select>

            {visaTitle === "other" && (
              <input placeholder="Other Visa Title" {...register("otherTitle")} />
            )}

            <label>Start Date</label>
            <input type="date" {...register("startDate")} />

            <label>End Date</label>
            <input type="date" {...register("endDate")} />

            {visaTitle === "f1_cpt_opt" && (
              <>
                <label>OPT Receipt</label>
                <input type="file" accept=".pdf,image/*" {...register("optReceipt")} />
              </>
            )}
          </>
        )}

        <label>Driver License</label>
        <input type="file" accept=".pdf,image/*" {...register("driverLicense")} />

        <h2>Reference</h2>

        <input
          placeholder="Reference First Name"
          {...register("referenceFirstName", { required: "Required" })}
        />
        <input
          placeholder="Reference Last Name"
          {...register("referenceLastName", { required: "Required" })}
        />
        <input placeholder="Reference Middle Name" {...register("referenceMiddleName")} />
        <input placeholder="Reference Phone" {...register("referencePhone")} />
        <input placeholder="Reference Email" {...register("referenceEmail")} />
        <input
          placeholder="Relationship"
          {...register("referenceRelationship", { required: "Required" })}
        />

        <h2>Emergency Contact</h2>

        <input
          placeholder="Emergency First Name"
          {...register("emergencyFirstName", { required: "Required" })}
        />
        <input
          placeholder="Emergency Last Name"
          {...register("emergencyLastName", { required: "Required" })}
        />
        <input placeholder="Emergency Middle Name" {...register("emergencyMiddleName")} />
        <input placeholder="Emergency Phone" {...register("emergencyPhone")} />
        <input placeholder="Emergency Email" {...register("emergencyEmail")} />
        <input
          placeholder="Relationship"
          {...register("emergencyRelationship", { required: "Required" })}
        />

        <button type="submit">Submit Application</button>
      </form>
    </div>
  );
}