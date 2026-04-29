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
    return <p>{title}: N / A</p>;
  }

  return (
    <div>
      <p>
        {title}: {document.originalName}
      </p>

      <button type="button" onClick={() => openFile("preview")}>
        Preview
      </button>

      <button type="button" onClick={() => openFile("download")}>
        Download
      </button>
    </div>
  );
}