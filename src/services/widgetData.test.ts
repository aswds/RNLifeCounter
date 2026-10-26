import {getLifeWidgetDetails} from './widgetData';

describe('getLifeWidgetDetails', () => {
  it('calculates the displayed age and days lived from a birthday', () => {
    const details = getLifeWidgetDetails(
      '2000-01-01T12:00:00.000Z',
      new Date('2025-01-02T12:00:00.000Z'),
    );

    expect(details.yearsDisplay).toBe('25.0048');
    expect(details.daysLived).toBe(9133);
    expect(details.daysUntilBirthday).toBe(364);
  });

  it('treats a leap-day birthday as 28 February in a non-leap year', () => {
    const details = getLifeWidgetDetails(
      '2000-02-29T12:00:00.000Z',
      new Date('2025-02-28T12:00:00.000Z'),
    );

    expect(details.daysUntilBirthday).toBe(0);
  });
});
