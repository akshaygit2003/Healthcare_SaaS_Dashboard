export type Patient = {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  condition: string;
  dob: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  assignedDoctor: string;
  phone: string;
};

type DummyUser = {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  phone: string;
  birthDate: string;
  company?: {
    department?: string;
  };
};

const mapRiskLevelByAge = (age: number): Patient['riskLevel'] => {
  if (age >= 60) {
    return 'High';
  }

  if (age >= 40) {
    return 'Medium';
  }

  return 'Low';
};

const mapGender = (gender: string): Patient['gender'] => {
  if (gender === 'male') {
    return 'Male';
  }

  if (gender === 'female') {
    return 'Female';
  }

  return 'Other';
};

export const mapDummyUserToPatient = (user: DummyUser): Patient => ({
  id: `P-${1000 + user.id}`,
  name: `${user.firstName} ${user.lastName}`,
  age: user.age,
  gender: mapGender(user.gender),
  condition: user.company?.department || 'General Medicine',
  dob: user.birthDate,
  riskLevel: mapRiskLevelByAge(user.age),
  assignedDoctor: `Dr. ${user.lastName}`,
  phone: user.phone
});
