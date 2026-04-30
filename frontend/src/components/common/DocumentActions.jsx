import { Button, ButtonGroup } from "react-bootstrap";

import {
  previewDocumentApi,
  downloadDocumentApi,
} from "../../api/documentApi";

import {
  getDocumentFileName,
  getDocumentId,
  hasDocument,
} from "../../utils/fileUtils";

/*
  Reusable document action buttons.

  It supports:
  - preview document in browser
  - download document

  HR examples:
  - review uploaded OPT EAD
  - preview driver license
  - download approved visa documents

  Employee examples:
  - preview/download submitted documents
  - preview/download personal documents

  Responsive:
  - buttons are small
  - parent components can place this inside responsive tables or cards
*/
export default function DocumentActions({
  document,
  showPreview = true,
  showDownload = true,
}) {
  if (!hasDocument(document)) {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "30px",
          padding: "4px 10px",
          borderRadius: "999px",
          background: "#f3f4f6",
          color: "#6b7280",
          fontSize: "12px",
          fontWeight: "700",
          fontFamily:
            "Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        N/A
      </span>
    );
  }

  const documentId = getDocumentId(document);
  const fileName = getDocumentFileName(document);

  const handlePreview = async () => {
    await previewDocumentApi(documentId);
  };

  const handleDownload = async () => {
    await downloadDocumentApi(documentId, fileName);
  };

  return (
    <ButtonGroup
      size="sm"
      style={{
        borderRadius: "999px",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(15, 23, 42, 0.06)",
        fontFamily:
          "Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {showPreview && (
        <Button
          variant="outline-primary"
          onClick={handlePreview}
          style={{
            borderColor: "#c7d2fe",
            color: "#4f46e5",
            background: "#ffffff",
            fontSize: "12px",
            fontWeight: "700",
            padding: "6px 12px",
          }}
        >
          Preview
        </Button>
      )}

      {showDownload && (
        <Button
          variant="outline-secondary"
          onClick={handleDownload}
          style={{
            borderColor: "#d8dee8",
            color: "#374151",
            background: "#ffffff",
            fontSize: "12px",
            fontWeight: "700",
            padding: "6px 12px",
          }}
        >
          Download
        </Button>
      )}
    </ButtonGroup>
  );
}