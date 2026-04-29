import { useEffect, useState } from "react";
import { getMyVisaStatus, uploadVisaDocument } from "../../api/visaApi";
import DocumentItem from "../../components/profile/DocumentItem";

export default function VisaStatusPage() {
  const [data, setData] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisaStatus();
  }, []);

  const fetchVisaStatus = async () => {
    try {
      const res = await getMyVisaStatus();
      setData(res);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentDocument = () => {
    if (!data?.visaStatus) return null;

    if (data.currentStep === "opt_receipt") {
      return data.visaStatus.optReceipt;
    }

    if (data.currentStep === "opt_ead") {
      return data.visaStatus.optEad;
    }

    if (data.currentStep === "i_983") {
      return data.visaStatus.i983;
    }

    if (data.currentStep === "i_20") {
      return data.visaStatus.i20;
    }

    return null;
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    try {
      await uploadVisaDocument(data.currentStep, file);
      alert("Uploaded successfully");
      setFile(null);
      fetchVisaStatus();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  // If the user is not F1 OPT or onboarding is not approved yet
  if (!data.showVisaStatus) {
    return <p>{data.message}</p>;
  }

  return (
    <div>
      <h1>Visa Status</h1>

      {/* Current status message */}
      <p>{data.message}</p>

      {/* HR feedback */}
      {data.feedback && <p style={{ color: "red" }}>Feedback: {data.feedback}</p>}

      {/* Current document step */}
      <h3>Current Step: {data.currentDocumentName}</h3>

      <DocumentItem title={data.currentDocumentName} document={getCurrentDocument()} />

      {/* Upload file for the current step */}
      {data.currentStep !== "completed" && (
        <div>
          <input type="file" onChange={(event) => setFile(event.target.files[0])} />
          <button type="button" onClick={handleUpload}>
            Upload
          </button>
        </div>
      )}
    </div>
  );
}