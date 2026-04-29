/*
  Convert backend visa title value into readable frontend text.

  Example:
  "f1_cpt_opt" -> "F1(CPT/OPT)"
*/
export const formatVisaTitle = (visaTitle, otherTitle = "") => {
  if (visaTitle === "f1_cpt_opt") return "F1(CPT/OPT)";
  if (visaTitle === "h1b") return "H1-B";
  if (visaTitle === "l2") return "L2";
  if (visaTitle === "h4") return "H4";
  if (visaTitle === "green_card") return "Green Card";
  if (visaTitle === "citizen") return "Citizen";
  if (visaTitle === "other") return otherTitle || "Other";

  return "N/A";
};

/*
  Convert backend document type into readable text.

  Example:
  "opt_ead" -> "OPT EAD"
*/
export const formatVisaDocumentType = (documentType) => {
  if (documentType === "opt_receipt") return "OPT Receipt";
  if (documentType === "opt_ead") return "OPT EAD";
  if (documentType === "i_983") return "I-983";
  if (documentType === "i_20") return "I-20";

  return "N/A";
};

/*
  Convert backend currentStep into readable text.

  Example:
  "i_983" -> "I-983"
*/
export const formatVisaStep = (step) => {
  if (step === "completed") return "Completed";

  return formatVisaDocumentType(step);
};

/*
  Convert backend document status into readable frontend text.

  Example:
  "pending" -> "Pending"
*/
export const formatStatusText = (status) => {
  if (status === "pending") return "Pending";
  if (status === "approved") return "Approved";
  if (status === "rejected") return "Rejected";
  if (status === "active") return "Active";
  if (status === "expired") return "Expired";
  if (status === "used") return "Used";
  if (status === "completed") return "Completed";
  if (status === "submitted") return "Submitted"; 
  if (status === "not_submitted") return "Not Yet Submitted";
  return "N/A";
};

/*
  Get Bootstrap badge style based on status.

  This is used by StatusBadge component later.
*/
export const getStatusBadgeVariant = (status) => {
  if (status === "approved" || status === "completed" || status === "active") {
    return "success";
  }

  if (status === "pending") {
    return "warning";
  }

  if (status === "rejected" || status === "expired") {
    return "danger";
  }

  if (status === "submitted") {
    return "info";
  }

  if (status === "not_submitted") {
    return "secondary";
  }

  if (status === "used") {
    return "secondary";
  }

  return "secondary";
};

/*
  Get readable action label for HR visa table.

  Backend returns actionType:
  - review_document
  - send_notification
  - none
*/
export const getVisaActionLabel = (actionType) => {
  if (actionType === "review_document") {
    return "Review Document";
  }

  if (actionType === "send_notification") {
    return "Send Notification";
  }

  return "No Action";
};