import { createRentalSchema } from '../validators/rental.validator.js';

const VALID_PAYLOAD = {
  client: {
    firstName: 'Alice',
    lastName: 'Smith',
    phone: '+212600000000',
    email: 'alice@example.com',
  },
  carId: '507f1f77bcf86cd799439011',
  startDate: '2024-06-01',
  endDate: '2024-06-05',
  dailyRate: 200,
  totalPrice: 1200,
  rentalDuration: 4,
};

function validate(data) {
  return createRentalSchema.validate(data, { abortEarly: false });
}

describe('createRentalSchema', () => {
  // ---------------------------------------------------------------------------
  // Valid payloads
  // ---------------------------------------------------------------------------
  it('passes with a complete valid payload', () => {
    const { error } = validate(VALID_PAYLOAD);
    expect(error).toBeUndefined();
  });

  it('passes with optional fields omitted', () => {
    const { client, carId, startDate, endDate, dailyRate, rentalDuration } = VALID_PAYLOAD;
    const { error } = validate({ client, carId, startDate, endDate, dailyRate, rentalDuration });
    expect(error).toBeUndefined();
  });

  it('passes with optional fields empty strings where allowed', () => {
    const { error } = validate({
      ...VALID_PAYLOAD,
      client: { ...VALID_PAYLOAD.client, phone: '', email: '' },
      departureLocation: '',
      returnLocation: '',
    });
    expect(error).toBeUndefined();
  });

  // ---------------------------------------------------------------------------
  // Required field failures
  // ---------------------------------------------------------------------------
  // client is not marked .required() at the top level — it is optional
  it('passes when client object is omitted entirely', () => {
    const { client: _c, ...rest } = VALID_PAYLOAD;
    const { error } = validate(rest);
    expect(error).toBeUndefined();
  });

  it('fails when client.firstName is missing', () => {
    const { error } = validate({
      ...VALID_PAYLOAD,
      client: { lastName: 'Smith' },
    });
    expect(error).toBeDefined();
    expect(error.details.some(d => d.message.includes('first name') || d.path.includes('firstName'))).toBe(true);
  });

  it('fails when client.lastName is missing', () => {
    const { error } = validate({
      ...VALID_PAYLOAD,
      client: { firstName: 'Alice' },
    });
    expect(error).toBeDefined();
  });

  it('fails when carId is missing', () => {
    const { carId: _c, ...rest } = VALID_PAYLOAD;
    const { error } = validate(rest);
    expect(error).toBeDefined();
  });

  it('fails when startDate is missing', () => {
    const { startDate: _s, ...rest } = VALID_PAYLOAD;
    const { error } = validate(rest);
    expect(error).toBeDefined();
  });

  it('fails when endDate is missing', () => {
    const { endDate: _e, ...rest } = VALID_PAYLOAD;
    const { error } = validate(rest);
    expect(error).toBeDefined();
  });

  it('fails when dailyRate is missing', () => {
    const { dailyRate: _d, ...rest } = VALID_PAYLOAD;
    const { error } = validate(rest);
    expect(error).toBeDefined();
  });

  it('fails when rentalDuration is missing', () => {
    const { rentalDuration: _r, ...rest } = VALID_PAYLOAD;
    const { error } = validate(rest);
    expect(error).toBeDefined();
  });

  // ---------------------------------------------------------------------------
  // Value constraints
  // ---------------------------------------------------------------------------
  it('fails when dailyRate is 0', () => {
    const { error } = validate({ ...VALID_PAYLOAD, dailyRate: 0 });
    expect(error).toBeDefined();
  });

  it('fails when dailyRate is negative', () => {
    const { error } = validate({ ...VALID_PAYLOAD, dailyRate: -50 });
    expect(error).toBeDefined();
  });

  it('fails when rentalDuration is 0', () => {
    const { error } = validate({ ...VALID_PAYLOAD, rentalDuration: 0 });
    expect(error).toBeDefined();
  });

  it('fails when rentalDuration is a decimal', () => {
    const { error } = validate({ ...VALID_PAYLOAD, rentalDuration: 1.5 });
    expect(error).toBeDefined();
  });

  it('fails when totalPrice is negative', () => {
    const { error } = validate({ ...VALID_PAYLOAD, totalPrice: -100 });
    expect(error).toBeDefined();
  });

  it('fails when startDate is not a valid date', () => {
    const { error } = validate({ ...VALID_PAYLOAD, startDate: 'not-a-date' });
    expect(error).toBeDefined();
  });

  it('fails when client.email is not a valid email', () => {
    const { error } = validate({
      ...VALID_PAYLOAD,
      client: { ...VALID_PAYLOAD.client, email: 'not-an-email' },
    });
    expect(error).toBeDefined();
  });
});
