const dummyEmployees = {
  uid1: { employeeName: "Taylor", phone: "555-5555", shift: "Monday" },
  uid2: { employeeName: "Casey", phone: "123-456-7890", shift: "Friday" },
};

export const fetchEmployees = () => Promise.resolve(dummyEmployees);
