import moment from 'moment';

export function calculateAge(birthdate) {
  // Create Date objects for the birthdate and current date
  const birthDate = new Date(birthdate);
  const currentDate = new Date();

  // Calculate the time difference in milliseconds
  const timeDifference = currentDate - birthDate;

  // Calculate the number of milliseconds in a year
  const millisecondsInYear = 1000 * 60 * 60 * 24 * 365.25;

  // Calculate the age in years with four decimal places
  const age = timeDifference / millisecondsInYear;
  // Format the age as a floating-point number with four decimal places
  const formattedAge = Number(age.toFixed(4));
  return parseFloat(formattedAge);
}
