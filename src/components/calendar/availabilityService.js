// availabilityService.js

export const fetchAvailabilitiesForDate = async (date) => {
  // Simulate API call delay with a Promise timeout
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Example availabilities for the selected date
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

  return availabilities;
};
