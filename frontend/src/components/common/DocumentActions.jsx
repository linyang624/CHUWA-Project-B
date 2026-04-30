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
        className="badge rounded-pill"
        style={{
          background: "#f3f4f6",
          color: "#6b7280",
          fontSize: "12px",
          fontWeight: "700",
          padding: "7px 10px",
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
    <ButtonGroup size="sm">
      {showPreview && (
        <Button
          type="button"
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
          type="button"
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