export const calculateTotalDonations = (donationArray) => {
    if (!Array.isArray(donationArray)) return 0;
    return donationArray.reduce((acc, amount) => acc + amount, 0);
  };