import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

export default function OnboardingApplicationPage() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  if (!user) return null;

  const { onboardingStatus } = user;

  
  if (onboardingStatus === "approved") {
    // Redirect approved users to personal info page
    // navigate("/personal-info");
    // return null;
    return <Navigate to="/personal-info" replace />;
  }

  // never submitted, show form
  if (onboardingStatus === "never_submitted") {
    return (
      <div>
        <h1>Onboarding Application</h1>
        <p>Please fill out your onboarding application.</p>
      </div>
    );
  }

  // pending, show waiting message
  if (onboardingStatus === "pending") {
    return (
      <div>
        <h1>Onboarding Status</h1>
        <p>Please wait for HR to review your application.</p>
      </div>
    );
  }

  // rejected, show feedback + allow edit
  if (onboardingStatus === "rejected") {
    return (
      <div>
        <h1>Application Rejected</h1>
        <p style={{ color: "red" }}>
          Your application was rejected. Please update and resubmit.
        </p>
      </div>
    );
  }

  return null;
}