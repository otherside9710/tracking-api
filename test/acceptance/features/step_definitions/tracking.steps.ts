import { Before, Given, When, Then } from '@cucumber/cucumber';
import { FastifyInstance, FastifyReply } from 'fastify';
import { buildApp } from '../../../../src/app';
import { expect } from 'chai';

interface CheckpointResponse {
  id: string;
  unitId: string;
  trackingId: string;
  status: string;
  location: string;
  description: string;
  createdAt: string;
}

interface TrackingResponse {
  id: string;
  trackingId: string;
  currentStatus: string;
  checkpoints: CheckpointResponse[];
}

interface TokenResponse {
  access_token: string;
}

interface UnitResponse {
  id: string;
  trackingId: string;
  currentStatus: string;
}

let app: FastifyInstance;
let token: string;
let response: { statusCode: number; payload: string };

Before(async () => {
  app = await buildApp();
});

Given('I am authenticated in the system', async function () {
  const authResponse = await app.inject({
    method: 'POST',
    url: '/api/v1/token',
    payload: {
      username: 'prueba@coordinadora.com',
      password: 'BFASDASer@dvhd3ysJ@r81',
    },
  });

  const result = JSON.parse(authResponse.payload);
  token = result.access_token;
  expect(token).to.be.a('string');
});

Given('I have a valid token', function () {
  expect(token).to.be.a('string');
});

Given(
  'there is a unit with ID {string} and tracking {string}',
  async function (unitId: string, trackingId: string) {
    // Unit already exists in memory repository
    const response = await app.inject({
      method: 'GET',
      url: `/api/v1/tracking/${trackingId}`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).to.equal(200);
  },
);

Given('there is a unit with registered checkpoints', async function () {
  // Asumimos que la unidad TRK001 ya existe con checkpoints
  const response = await app.inject({
    method: 'GET',
    url: '/api/v1/tracking/TRK001',
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  expect(response.statusCode).to.equal(200);
  const result = JSON.parse(response.payload);
  expect(result.checkpoints).to.be.an('array');
  expect(result.checkpoints.length).to.be.greaterThan(0);
});

When(
  'I query the tracking history with ID {string}',
  async function (trackingId: string) {
    response = await app.inject({
      method: 'GET',
      url: `/api/v1/tracking/${trackingId}`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  },
);

Then('I should receive a list of checkpoints ordered by date', function () {
  expect(response.statusCode).to.equal(200);
  const result = JSON.parse(response.payload);
  expect(result.checkpoints).to.be.an('array');

  // Verificar que los checkpoints estén ordenados por fecha
  const checkpoints = result.checkpoints;
  for (let i = 1; i < checkpoints.length; i++) {
    const prevDate = new Date(checkpoints[i - 1].createdAt);
    const currDate = new Date(checkpoints[i].createdAt);
    expect(prevDate.getTime()).to.be.lessThanOrEqual(currDate.getTime());
  }
});

Then('it should include the current unit status', function () {
  const result = JSON.parse(response.payload);
  expect(result).to.have.property('currentStatus');
  expect(result.currentStatus).to.be.a('string');
});

Given('there are multiple units in different states', async function () {
  // Primero, creamos un checkpoint para una nueva unidad
  const createCheckpointResponse = await app.inject({
    method: 'POST',
    url: '/api/v1/checkpoints',
    headers: {
      authorization: `Bearer ${token}`,
    },
    payload: {
      unitId: 'UNIT002',
      trackingId: 'TRK002',
      status: 'CREATED',
      location: 'Test Location',
      description: 'Initial checkpoint',
    },
  });

  expect(createCheckpointResponse.statusCode).to.be.oneOf(
    [201, 409],
    'Should create checkpoint or already exist',
  );

  // Creamos otro checkpoint para tener múltiples estados
  const secondCheckpointResponse = await app.inject({
    method: 'POST',
    url: '/api/v1/checkpoints',
    headers: {
      authorization: `Bearer ${token}`,
    },
    payload: {
      unitId: 'UNIT001',
      trackingId: 'TRK001',
      status: 'IN_TRANSIT',
      location: 'Another Location',
      description: 'Transit checkpoint',
    },
  });

  expect(secondCheckpointResponse.statusCode).to.be.oneOf(
    [201, 409],
    'Should create second checkpoint or already exist',
  );

  // Luego verificamos que podemos obtener las unidades
  const response = await app.inject({
    method: 'GET',
    url: '/api/v1/shipments',
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  expect(response.statusCode).to.equal(200);
  const units = JSON.parse(response.payload);
  expect(units).to.be.an('array');
  expect(units.length).to.be.at.least(1, 'Should have at least one unit');

  // Verificar que hay al menos una unidad con estado
  const states = new Set(units.map((unit) => unit.currentStatus));
  expect(states.size).to.be.at.least(1, 'Should have at least one status');
});

When('I query units with status {string}', async function (status: string) {
  response = await app.inject({
    method: 'GET',
    url: `/api/v1/shipments?status=${status}`,
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
});

Then(
  'I should receive only units in {string} status',
  function (status: string) {
    expect(response.statusCode).to.equal(200);
    const units = JSON.parse(response.payload);
    expect(units).to.be.an('array');
    // Verificar que todas las unidades tienen el estado correcto
    expect(units.every((unit) => unit.currentStatus === status)).to.be.true;
  },
);

When(
  'I register a new checkpoint with the following data:',
  async function (dataTable) {
    const checkpoint = dataTable.hashes()[0];

    response = await app.inject({
      method: 'POST',
      url: '/api/v1/checkpoints',
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: checkpoint,
    });
  },
);

Then('the checkpoint should be registered successfully', function () {
  expect(response.statusCode).to.equal(201);
  const result = JSON.parse(response.payload);
  expect(result).to.have.property('id');
});

Then(
  'the unit status should be updated to {string}',
  async function (status: string) {
    const unitResponse = await app.inject({
      method: 'GET',
      url: '/api/v1/shipments?status=' + status,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(unitResponse.statusCode).to.equal(200);
    const units = JSON.parse(unitResponse.payload);
    expect(units).to.be.an('array');
    expect(units.some((unit) => unit.currentStatus === status)).to.be.true;
  },
);
