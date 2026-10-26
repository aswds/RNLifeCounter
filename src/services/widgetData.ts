const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MS_PER_YEAR = 365.25 * MS_PER_DAY;

export type LifeWidgetPayload = {
  birthDate: string;
};

export type LifeWidgetDetails = LifeWidgetPayload & {
  daysLived: number;
  daysUntilBirthday: number;
  yearsDisplay: string;
};

/** Produces the data contract consumed by both native widgets. */
export function getLifeWidgetDetails(
  birthDate: string,
  now: Date = new Date(),
): LifeWidgetDetails {
  const birthday = new Date(birthDate);
  const elapsed = Math.max(0, now.getTime() - birthday.getTime());
  let nextBirthday = birthdayInYear(birthday, now.getFullYear());

  if (nextBirthday < startOfDay(now)) {
    nextBirthday = birthdayInYear(birthday, now.getFullYear() + 1);
  }

  return {
    birthDate,
    daysLived: Math.floor(elapsed / MS_PER_DAY),
    daysUntilBirthday: Math.max(
      0,
      calendarDayIndex(nextBirthday) - calendarDayIndex(now),
    ),
    yearsDisplay: (elapsed / MS_PER_YEAR).toFixed(4),
  };
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function calendarDayIndex(date: Date): number {
  return (
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / MS_PER_DAY
  );
}

function birthdayInYear(birthday: Date, year: number): Date {
  const month = birthday.getMonth();
  const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
  // People born on 29 February celebrate on 28 February in non-leap years.
  return new Date(year, month, Math.min(birthday.getDate(), lastDayOfMonth));
}
