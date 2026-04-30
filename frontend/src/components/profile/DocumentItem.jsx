import { Button, ButtonGroup } from "react-bootstrap";

export default function DocumentItem({ title, document }) {
  const openFile = async (type) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5001/api/documents/${document._id}/${type}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      alert("Failed to open document");
      return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    if (type === "preview") {
      window.open(url, "_blank");
    } else {
      const link = window.document.createElement("a");
      link.href = url;
      link.download = document.originalName;
      link.click();
    }
  };

  if (!document) {
    return (
      <div
        className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 p-3"
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          fontFamily:
            "Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <div>
          <div
            style={{
              color: "#374151",
              fontSize: "14px",
              fontWeight: "800",
            }}
          >
            {title}
          </div>

          <div
            style={{
              color: "#9ca3af",
              fontSize: "13px",
              fontWeight: "600",
              marginTop: "2px",
            }}
          >
            N/A
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 p-3"
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        boxShadow: "0 6px 16px rgba(15, 23, 42, 0.04)",
        fontFamily:
          "Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            color: "#374151",
            fontSize: "14px",
            fontWeight: "800",
          }}
        >
          {title}
        </div>

        <div
          className="text-truncate"
          style={{
            color: "#6b7280",
            fontSize: "13px",
            fontWeight: "600",
            marginTop: "2px",
            maxWidth: "320px",
          }}
        >
          {document.originalName}
        </div>
      </div>

      <ButtonGroup
        size="sm"
        style={{
          borderRadius: "999px",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(15, 23, 42, 0.06)",
          flexShrink: 0,
        }}
      >
        <Button
          type="button"
          variant="outline-primary"
          onClick={() => openFile("preview")}
          style={{
            borderColor: "#c7d2fe",
            color: "#4f46e5",
            background: "#ffffff",
            fontSize: "12px",
            fontWeight: "800",
            padding: "6px 12px",
          }}
        >
          Preview
        </Button>

        <Button
          type="button"
          variant="outline-secondary"
          onClick={() => openFile("download")}
          style={{
            borderColor: "#d8dee8",
            color: "#374151",
            background: "#ffffff",
            fontSize: "12px",
            fontWeight: "800",
            padding: "6px 12px",
          }}
        >
          Download
        </Button>
      </ButtonGroup>
    </div>
  );
}