const API_BASE_URL = "http://localhost:5001/api";

/*
  Get token from localStorage.

  HR document preview/download also needs Authorization token,
  because backend document routes are protected.
*/
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

/*
  Fetch a document file from backend and return it as a blob.

  A blob means binary file data.
  It can represent PDF, PNG, JPG, etc.

  We use this helper for both preview and download.
*/
const fetchDocumentBlob = async (documentId, action) => {
  const response = await fetch(
    `${API_BASE_URL}/documents/${documentId}/${action}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    let errorMessage = "Failed to load document";

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (error) {
      console.error("Failed to parse document error response:", error);
    }

    throw new Error(errorMessage);
  }

  const blob = await response.blob();

  return blob;
};

/*
  Preview document in browser.

  Backend:
  GET /api/documents/:documentId/preview

  Flow:
  1. Fetch the file as blob
  2. Create a temporary browser URL
  3. Open that URL in a new tab
*/
export const previewDocumentApi = async (documentId) => {
  const blob = await fetchDocumentBlob(documentId, "preview");

  const fileUrl = window.URL.createObjectURL(blob);

  window.open(fileUrl, "_blank", "noopener,noreferrer");
};

/*
  Download document.

  Backend:
  GET /api/documents/:documentId/download

  Flow:
  1. Fetch the file as blob
  2. Create a temporary browser URL
  3. Create a hidden <a> tag
  4. Trigger click to download
  5. Clean up the temporary URL
*/
export const downloadDocumentApi = async (documentId, fileName = "document") => {
  const blob = await fetchDocumentBlob(documentId, "download");

  const fileUrl = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = fileUrl;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(fileUrl);
};