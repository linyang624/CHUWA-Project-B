const API_BASE_URL = "http://localhost:5001/api";

export async function getMyProfile() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/profile/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to get profile");
  }

  return data;
}

export async function updateProfileSection(section, payload) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/profile/me/section/${section}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update profile section");
  }

  return data;
}

export async function updateProfilePicture(file) {
  const token = localStorage.getItem("token");
  const formData = new FormData();

  formData.append("profilePicture", file);

  const response = await fetch(`${API_BASE_URL}/profile/me/profile-picture`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update profile picture");
  }

  return data;
}