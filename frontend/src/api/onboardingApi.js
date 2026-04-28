const API_BASE_URL = "http://localhost:5001/api";

export async function getMyApplication() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/onboarding/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to get onboarding application");
  }

  return data;
}

export async function submitOnboardingApplication(formData) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/onboarding/submit`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to submit onboarding application");
  }

  return data;
}