/*
  Build legal full name from first name, middle name, and last name.

  Example:
  firstName = "Alice"
  middleName = ""
  lastName = "Zhang"

  Result:
  "Alice Zhang"
*/
export const getLegalFullName = (person) => {
  if (!person) {
    return "N/A";
  }

  const nameParts = [
    person.firstName,
    person.middleName,
    person.lastName,
  ].filter(Boolean);

  return nameParts.length > 0 ? nameParts.join(" ") : "N/A";
};

/*
  Build display name.

  If preferredName exists, show it with legal name.

  Example:
  firstName = "yier"
  preferredName = "Alice"
  lastName = "Zhang"

  Result:
  "yier Zhang (Alice)"
*/
export const getDisplayName = (person) => {
  if (!person) {
    return "N/A";
  }

  const legalName = getLegalFullName(person);

  if (person.preferredName) {
    return `${legalName} (${person.preferredName})`;
  }

  return legalName;
};