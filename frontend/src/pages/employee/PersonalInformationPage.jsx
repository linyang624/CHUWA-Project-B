import { useEffect, useState } from "react";
import { getMyProfile, updateProfileSection } from "../../api/profileApi";
import DocumentItem from "../../components/profile/DocumentItem";

export default function PersonalInformationPage() {
  const [profile, setProfile] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [draft, setDraft] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getMyProfile();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      }
    };

    loadProfile();
  }, []);

  const startEdit = (section, initialData) => {
    setEditingSection(section);
    setDraft(initialData);
  };

  const cancelEdit = () => {
    const confirmCancel = window.confirm("Discard all changes?");
    if (confirmCancel) {
      setEditingSection(null);
      setDraft({});
    }
  };

  const saveSection = async (section) => {
    try {
      const updated = await updateProfileSection(section, draft);
      setProfile(updated);
      setEditingSection(null);
      setDraft({});
    } catch (err) {
      alert(err.message);
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!profile) return <p>Loading profile...</p>;

  return (
    <div>
      <h1>Personal Information</h1>

      <section>
        <h2>Name</h2>
        {editingSection === "name" ? (
          <>
            <label>First Name</label>
            <input
              value={draft.firstName || ""}
              onChange={(e) => setDraft({ ...draft, firstName: e.target.value })}
            />

            <label>Last Name</label>
            <input
              value={draft.lastName || ""}
              onChange={(e) => setDraft({ ...draft, lastName: e.target.value })}
            />

            <label>Middle Name</label>
            <input
              value={draft.middleName || ""}
              onChange={(e) => setDraft({ ...draft, middleName: e.target.value })}
            />

            <label>Preferred Name</label>
            <input
              value={draft.preferredName || ""}
              onChange={(e) => setDraft({ ...draft, preferredName: e.target.value })}
            />

            <label>Email</label>
            <input value={profile.email || ""} disabled readOnly />

            <label>Gender</label>
            <select
              value={draft.gender || ""}
              onChange={(e) => setDraft({ ...draft, gender: e.target.value })}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="i_do_not_wish_to_answer">I do not wish to answer</option>
            </select>

            <button onClick={() => saveSection("name")}>Save</button>
            <button onClick={cancelEdit}>Cancel</button>
          </>
        ) : (
          <>
            <p>
              {profile.firstName} {profile.middleName} {profile.lastName}
            </p>
            <p>Preferred Name: {profile.preferredName || "N/A"}</p>
            <p>Email: {profile.email}</p>
            <p>Gender: {formatGender(profile.gender)}</p>
            <button
              onClick={() =>
                startEdit("name", {
                  firstName: profile.firstName,
                  lastName: profile.lastName,
                  middleName: profile.middleName,
                  preferredName: profile.preferredName,
                  gender: profile.gender,
                })
              }
            >
              Edit
            </button>
          </>
        )}
      </section>

      <section>
        <h2>Address</h2>
        {editingSection === "address" ? (
          <>
            <input
              value={draft.address?.street || ""}
              onChange={(e) =>
                setDraft({
                  address: { ...draft.address, street: e.target.value },
                })
              }
            />
            <input
              value={draft.address?.building || ""}
              onChange={(e) =>
                setDraft({
                  address: { ...draft.address, building: e.target.value },
                })
              }
            />
            <input
              value={draft.address?.city || ""}
              onChange={(e) =>
                setDraft({
                  address: { ...draft.address, city: e.target.value },
                })
              }
            />
            <input
              value={draft.address?.state || ""}
              onChange={(e) =>
                setDraft({
                  address: { ...draft.address, state: e.target.value },
                })
              }
            />
            <input
              value={draft.address?.zip || ""}
              onChange={(e) =>
                setDraft({
                  address: { ...draft.address, zip: e.target.value },
                })
              }
            />
            <button onClick={() => saveSection("address")}>Save</button>
            <button onClick={cancelEdit}>Cancel</button>
          </>
        ) : (
          <>
            <p>
              {profile.address?.street},{" "}{profile.address?.building},{" "}
              {profile.address?.city}, {profile.address?.state}{" "}
              {profile.address?.zip}
            </p>
            <button
              onClick={() =>
                startEdit("address", {
                  address: profile.address,
                })
              }
            >
              Edit
            </button>
          </>
        )}
      </section>

      <section>
        <h2>Contact Info</h2>
        {editingSection === "contact" ? (
          <>
            <input
              value={draft.cellPhone || ""}
              onChange={(e) =>
                setDraft({ ...draft, cellPhone: e.target.value })
              }
            />
            <input
              value={draft.workPhone || ""}
              onChange={(e) =>
                setDraft({ ...draft, workPhone: e.target.value })
              }
            />
            <button onClick={() => saveSection("contact")}>Save</button>
            <button onClick={cancelEdit}>Cancel</button>
          </>
        ) : (
          <>
            <p>Cell Phone: {profile.cellPhone}</p>
            <p>Work Phone: {profile.workPhone || "N/A"}</p>
            <button
              onClick={() =>
                startEdit("contact", {
                  cellPhone: profile.cellPhone,
                  workPhone: profile.workPhone,
                })
              }
            >
              Edit
            </button>
          </>
        )}
      </section>

      <section>
        <h2>Employment</h2>
        {editingSection === "employment" ? (
          <>
            <input
              placeholder="Visa Title"
              value={draft.workAuthorization?.visaTitle || ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  workAuthorization: {
                    ...draft.workAuthorization,
                    visaTitle: e.target.value,
                  },
                })
              }
            />

            <input
              type="date"
              value={draft.workAuthorization?.startDate?.slice(0, 10) || ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  workAuthorization: {
                    ...draft.workAuthorization,
                    startDate: e.target.value,
                  },
                })
              }
            />

            <input
              type="date"
              value={draft.workAuthorization?.endDate?.slice(0, 10) || ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  workAuthorization: {
                    ...draft.workAuthorization,
                    endDate: e.target.value,
                  },
                })
              }
            />

            <button onClick={() => saveSection("employment")}>Save</button>
            <button onClick={cancelEdit}>Cancel</button>
          </>
        ) : (
          <>
            <p>Visa Title: {formatVisaTitle(profile.workAuthorization?.visaTitle)}</p>
            <p>
              Start Date:{" "}
              {profile.workAuthorization?.startDate
                ? profile.workAuthorization.startDate.slice(0, 10)
                : "N/A"}
            </p>
            <p>
              End Date:{" "}
              {profile.workAuthorization?.endDate
                ? profile.workAuthorization.endDate.slice(0, 10)
                : "N/A"}
            </p>

            <button
              onClick={() =>
                startEdit("employment", {
                  workAuthorization: profile.workAuthorization || {},
                })
              }
            >
              Edit
            </button>
          </>
        )}
      </section>

      <section>
        <h2>Emergency Contact</h2>
        {editingSection === "emergency" ? (
          <>
            <input
              placeholder="First Name"
              value={draft.emergencyContacts?.[0]?.firstName || ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  emergencyContacts: [
                    {
                      ...(draft.emergencyContacts?.[0] || {}),
                      firstName: e.target.value,
                    },
                  ],
                })
              }
            />

            <input
              placeholder="Last Name"
              value={draft.emergencyContacts?.[0]?.lastName || ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  emergencyContacts: [
                    {
                      ...(draft.emergencyContacts?.[0] || {}),
                      lastName: e.target.value,
                    },
                  ],
                })
              }
            />

            <input
              placeholder="Phone"
              value={draft.emergencyContacts?.[0]?.phone || ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  emergencyContacts: [
                    {
                      ...(draft.emergencyContacts?.[0] || {}),
                      phone: e.target.value,
                    },
                  ],
                })
              }
            />

            <input
              placeholder="Email"
              value={draft.emergencyContacts?.[0]?.email || ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  emergencyContacts: [
                    {
                      ...(draft.emergencyContacts?.[0] || {}),
                      email: e.target.value,
                    },
                  ],
                })
              }
            />

            <input
              placeholder="Relationship"
              value={draft.emergencyContacts?.[0]?.relationship || ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  emergencyContacts: [
                    {
                      ...(draft.emergencyContacts?.[0] || {}),
                      relationship: e.target.value,
                    },
                  ],
                })
              }
            />

            <button onClick={() => saveSection("emergency")}>Save</button>
            <button onClick={cancelEdit}>Cancel</button>
          </>
        ) : (
          <>
            <p>
              {profile.emergencyContacts?.[0]?.firstName || "N/A"}{" "}
              {profile.emergencyContacts?.[0]?.lastName || ""}
            </p>
            <p>Phone: {profile.emergencyContacts?.[0]?.phone || "N/A"}</p>
            <p>Email: {profile.emergencyContacts?.[0]?.email || "N/A"}</p>
            <p>
              Relationship:{" "}
              {profile.emergencyContacts?.[0]?.relationship || "N/A"}
            </p>

            <button
              onClick={() =>
                startEdit("emergency", {
                  emergencyContacts: profile.emergencyContacts || [{}],
                })
              }
            >
              Edit
            </button>
          </>
        )}
      </section>
      <section>
        <h2>Uploaded Documents</h2>
        <DocumentItem title="Profile Picture" document={profile.profilePicture} />
        <DocumentItem title="Driver License" document={profile.driverLicense} />

        {profile.isPermanentResidentOrCitizen ? (
          <p>No work authorization document required for Citizen / Green Card.</p>
        ) : (
          <DocumentItem
            title={
              profile.workAuthorization?.visaTitle === "f1_cpt_opt"
                ? "OPT Receipt"
                : "Work Authorization Document"
            }
            document={profile.workAuthorization?.optReceipt}
          />
        )}
      </section>
    </div>
  );
}


function formatGender(gender) {
  const map = {
    male: "Male",
    female: "Female",
    i_do_not_wish_to_answer: "I do not wish to answer",
  };

  return map[gender] || "N/A";
}

function formatVisaTitle(title) {
  const map = {
    h1b: "H1-B",
    l2: "L2",
    f1_cpt_opt: "F1 CPT/OPT",
    h4: "H4",
    other: "Other",
  };

  return map[title] || "N/A";
}