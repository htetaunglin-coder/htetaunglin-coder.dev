// The DOB must be in the format "YYYY-MM-DD" (e.g., 2005-11-29)
// and stored in `.env` as `NEXT_PUBLIC_DOB`.
// Example:
// NEXT_PUBLIC_DOB=2005-11-29
function getAgeFromDOB(dob: string): number {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
}

export { getAgeFromDOB };
