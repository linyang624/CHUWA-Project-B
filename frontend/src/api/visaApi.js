const API_BASE_URL = "http://localhost:5001/api";

export async function getMyVisaStatus() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/visa/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to get visa status");
  }

  return data;
}

export async function uploadVisaDocument(documentType, file) {
  const token = localStorage.getItem("token");
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/visa/upload/${documentType}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to upload visa document");
  }

  return data;
}