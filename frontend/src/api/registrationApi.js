const API_BASE_URL = "http://localhost:5001/api";

export async function verifyRegistrationToken(token) {
  const response = await fetch(
    `${API_BASE_URL}/registration/verify-token/${token}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Invalid registration token");
  }

  return data;
}

export async function registerWithToken(token, payload) {
  const response = await fetch(`${API_BASE_URL}/registration/register/${token}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
}