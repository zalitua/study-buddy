// availabilityService.js

// This function simulates fetching availability data for a specific date.
export const fetchAvailabilitiesForDate = async (date) => {
  // Simulate a delay to mimic a real API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Simulated availability data
  const availabilities = [
    {
      id: '1',
      name: 'Alice Johnson',
      time: '9:00 AM - 11:00 AM',
    },
    {
      id: '2',
      name: 'Bob Smith',
      time: '11:30 AM - 1:30 PM',
    },
    {
      id: '3',
      name: 'Charlie Brown',
      time: '2:00 PM - 4:00 PM',
    },
  ];

  // You can filter the availabilities based on the date if necessary
  // For now, we're returning the same data regardless of the date
  return availabilities;
};
