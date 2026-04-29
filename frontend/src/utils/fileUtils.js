/*
  Check whether a document object exists.

  In our backend, uploaded files are usually stored as document objects.
  Example:
  {
    _id: "...",
    originalName: "OPT Receipt.pdf",
    mimeType: "application/pdf"
  }
*/
export const hasDocument = (document) => {
  return !!document && !!document._id;
};

/*
  Get document id safely.

  Sometimes the backend returns a populated document object:
  {
    _id: "...",
    originalName: "file.pdf"
  }

  Sometimes it may return only the document id string.
  This helper supports both cases.
*/
export const getDocumentId = (document) => {
  if (!document) {
    return "";
  }

  if (typeof document === "string") {
    return document;
  }

  return document._id || "";
};

/*
  Get readable file name.

  If document.originalName exists, use it.
  Otherwise show a default fallback name.
*/
export const getDocumentFileName = (document, fallbackName = "Document") => {
  if (!document) {
    return fallbackName;
  }

  return document.originalName || document.fileName || fallbackName;
};

/*
  Check whether this file is probably a PDF.
*/
export const isPdfFile = (document) => {
  if (!document) {
    return false;
  }

  return document.mimeType === "application/pdf";
};

/*
  Check whether this file is probably an image.
*/
export const isImageFile = (document) => {
  if (!document) {
    return false;
  }

  return ["image/jpeg", "image/jpg", "image/png"].includes(document.mimeType);
};

/*
  Format file size into readable text.

  Example:
  1024 -> "1.0 KB"
  1048576 -> "1.0 MB"

  Note:
  Our current Document model does not store file size,
  but this helper is useful if we add size later.
*/
export const formatFileSize = (sizeInBytes) => {
  if (!sizeInBytes && sizeInBytes !== 0) {
    return "N/A";
  }

  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`;
  }

  if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(1)} KB`;
  }

  return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
};