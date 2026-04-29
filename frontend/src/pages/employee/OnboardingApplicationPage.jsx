import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { updateOnboardingStatus } from "../../features/auth/authSlice";
import {
  submitOnboardingApplication,
  getMyApplication,
} from "../../api/onboardingApi";

export default function OnboardingApplicationPage() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [application, setApplication] = useState(null);

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

  const isPR = watch("isPermanentResidentOrCitizen");
  const visaTitle = watch("visaTitle");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await getMyApplication();
        const app = res.application || res;

        if (!app) {
          dispatch(updateOnboardingStatus("never_submitted"));
          setApplication(null);
        } else {
          dispatch(updateOnboardingStatus(res.status || app.status));
          setApplication(app);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchStatus();
  }, [dispatch]);

  if (!user) return null;

  const onboardingStatus = user.onboardingStatus || "never_submitted";

  if (onboardingStatus === "approved") {
    return <Navigate to="/personal-info" replace />;
  }

  if (onboardingStatus === "pending") {
    return (
      <div>
        <h1>Onboarding Status</h1>

        <div
          style={{
            border: "1px solid grey",
            padding: "12px",
            marginBottom: "16px",
            color: "grey",
          }}
        >
          Pending: Please wait for HR to review your application.
        </div>
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

          <div
            style={{
              border: "1px solid red",
              padding: "12px",
              marginBottom: "16px",
              color: "red",
            }}
          >
            <strong>HR Feedback:</strong>
            <p>
              {application?.feedback ||
                "Your application was rejected. Please update and resubmit."}
            </p>
          </div>
        </>
      ) : (
        <>
          <h1>Onboarding Application</h1>
          <p>Please fill out your onboarding application.</p>
        </>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Name</h2>

        <div>
          <label> First Name * </label>
          <input
            placeholder="First Name"
            {...register("firstName", { required: "First name is required" })}
          />
          {errors.firstName && <p>{errors.firstName.message}</p>}
        </div>

        <div>
          <label> Last Name * </label>
          <input
            placeholder="Last Name"
            {...register("lastName", { required: "Last name is required" })}
          />
          {errors.lastName && <p>{errors.lastName.message}</p>}
        </div>

        <div>
          <label> Middle Name </label>
          <input placeholder="Middle Name" {...register("middleName")} />
        </div>

        <div>
          <label> Preferred Name </label>
          <input placeholder="Preferred Name" {...register("preferredName")} />
        </div>

        <div>
          <label> Profile Picture </label>
          <input type="file" accept="image/*" {...register("profilePicture")} />
        </div>

        <h2>Address</h2>

        <div>
          <label> Street * </label>
          <input
            placeholder="Street"
            {...register("street", { required: "Street is required" })}
          />
        </div>
        
        <div>
          <label> Building / Apt </label>
          <input placeholder="Building / Apt" {...register("building")} />
        </div>

        <div>
          <label> City * </label>
          <input
            placeholder="City"
            {...register("city", { required: "City is required" })}
          />
        </div>

        <div>
          <label> State * </label>
          <input
            placeholder="State"
            {...register("state", { required: "State is required" })}
          />
        </div>

        <div>
          <label> Zip * </label>
          <input
            placeholder="Zip"
            {...register("zip", { required: "Zip is required" })}
          />
        </div>

        <h2>Contact</h2>

        <div>
          <label> Cell Phone Number * </label>
          <input
            placeholder="Cell Phone"
            {...register("cellPhone", { required: "Cell phone is required" })}
          />
        </div>

        <div>
          <label> Work Phone Number </label>
          <input placeholder="Work Phone" {...register("workPhone")} />
        </div>

        <div>
          <label> Email </label>
          <input value={user.email || ""} disabled readOnly />
        </div>

        <h2>Personal Information</h2>

        <div>
          <label> SSN * </label>
          <input
            placeholder="SSN"
            {...register("ssn", { required: "SSN is required" })}
          />
        </div>

        <div>
          <label> Date of Birth * </label>
          <input
            type="date"
            {...register("dateOfBirth", {
              required: "Date of birth is required",
            })}
          />
        </div>

        <div>
          <label> Gender * </label>
          <select {...register("gender", { required: "Gender is required" })}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="i_do_not_wish_to_answer">
              I do not wish to answer
            </option>
          </select>
        </div>

        <h2>Work Authorization</h2>

        <div>
          <label> Are you a permanent resident or citizen of the U.S.? * </label>
          <select
            {...register("isPermanentResidentOrCitizen", {
              required: "This field is required",
            })}
          >
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        {isPR === "yes" && (
          <div>
            <label> Status Type </label>
            <select {...register("residentType")}>
              <option value="">Select Type</option>
              <option value="green_card">Green Card</option>
              <option value="citizen">Citizen</option>
            </select>
          </div>
        )}

        {isPR === "no" && (
          <>
            <div>
              <label> Work Authorization Type </label>
              <select {...register("visaTitle")}>
                <option value="">Select Work Authorization</option>
                <option value="h1b">H1-B</option>
                <option value="l2">L2</option>
                <option value="f1_cpt_opt">F1 CPT/OPT</option>
                <option value="h4">H4</option>
                <option value="other">Other</option>
              </select>
            </div>

            {visaTitle === "other" && (
              <div>
                <label> Other Visa Title </label>
                <input
                  placeholder="Other Visa Title"
                  {...register("otherTitle")}
                />
              </div>
            )}

            <div>
              <label> Start Date </label>
              <input type="date" {...register("startDate")} />
            </div>

            <div>
              <label> End Date </label>
              <input type="date" {...register("endDate")} />
            </div>

            {visaTitle && (
              <div>
                <label>
                  {visaTitle === "f1_cpt_opt"
                    ? " OPT Receipt "
                    : " Work Authorization Document "}
                </label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  {...register("optReceipt")}
                />
              </div>
            )}
          </>
        )}

        <div>
          <label> Driver License </label>
          <input
            type="file"
            accept=".pdf,image/*"
            {...register("driverLicense")}
          />
        </div>

        <h2>Reference</h2>

        <div>
          <label> Reference First Name * </label>
          <input
            placeholder="Reference First Name"
            {...register("referenceFirstName", { required: "Required" })}
          />
        </div>

        <div>
          <label> Reference Last Name * </label>
          <input
            placeholder="Reference Last Name"
            {...register("referenceLastName", { required: "Required" })}
          />
        </div>

        <div>
          <label> Reference Middle Name </label>
          <input
            placeholder="Reference Middle Name"
            {...register("referenceMiddleName")}
          />
        </div>

        <div>
          <label> Reference Phone </label>
          <input placeholder="Reference Phone" {...register("referencePhone")} />
        </div>

        <div>
          <label> Reference Email </label>
          <input placeholder="Reference Email" {...register("referenceEmail")} />
        </div>

        <div>
          <label> Reference Relationship * </label>
          <input
            placeholder="Relationship"
            {...register("referenceRelationship", { required: "Required" })}
          />
        </div>

        <h2>Emergency Contact</h2>

        <div>
          <label> Emergency First Name * </label>
          <input
            placeholder="Emergency First Name"
            {...register("emergencyFirstName", { required: "Required" })}
          />
        </div>

        <div>
          <label> Emergency Last Name * </label>
          <input
            placeholder="Emergency Last Name"
            {...register("emergencyLastName", { required: "Required" })}
          />
        </div>

        <div>
          <label> Emergency Middle Name </label>
          <input
            placeholder="Emergency Middle Name"
            {...register("emergencyMiddleName")}
          />
        </div>

        <div>
          <label> Emergency Phone </label>
          <input
            placeholder="Emergency Phone"
            {...register("emergencyPhone")}
          />
        </div>

        <div>
          <label> Emergency Email </label>
          <input
            placeholder="Emergency Email"
            {...register("emergencyEmail")}
          />
        </div>

        <div>
          <label> Emergency Relationship * </label>
          <input
            placeholder="Relationship"
            {...register("emergencyRelationship", { required: "Required" })}
          />
        </div>

        <button type="submit">Submit Application</button>
      </form>
    </div>
  );
}