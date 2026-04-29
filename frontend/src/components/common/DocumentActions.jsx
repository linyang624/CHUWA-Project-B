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
    return <span>N/A</span>;
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
        <Button variant="outline-primary" onClick={handlePreview}>
          Preview
        </Button>
      )}

      {showDownload && (
        <Button variant="outline-secondary" onClick={handleDownload}>
          Download
        </Button>
      )}
    </ButtonGroup>
  );
}