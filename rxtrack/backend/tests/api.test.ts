import test from "node:test";
import assert from "node:assert/strict";
import { registerSchema, loginSchema } from "../src/validators/auth.validator";
import { createPrescriptionSchema, prescriptionIdParamSchema } from "../src/validators/prescription.validator";
import { markFilledSchema } from "../src/validators/fulfillment.validator";
import { authService } from "../src/services/auth.service";
import { medicineService } from "../src/services/medicine.service";
import { analyticsService } from "../src/services/analytics.service";
import { fulfillmentService } from "../src/services/fulfillment.service";

test("Auth Validators", async (t) => {
  await t.test("registerSchema accepts valid input", () => {
    const valid = registerSchema.safeParse({
      name: "Dr. Jane Doe",
      email: "jane@test.dev",
      password: "password123",
      role: "DOCTOR",
    });
    assert.equal(valid.success, true);
  });

  await t.test("registerSchema rejects short password", () => {
    const invalid = registerSchema.safeParse({
      name: "Dr. Jane Doe",
      email: "jane@test.dev",
      password: "short",
      role: "DOCTOR",
    });
    assert.equal(invalid.success, false);
  });

  await t.test("loginSchema rejects invalid email format", () => {
    const invalid = loginSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });
    assert.equal(invalid.success, false);
  });
});

test("Prescription Validators", async (t) => {
  const dummyUUID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
  const dummyUUID2 = "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22";

  await t.test("createPrescriptionSchema validates correct payload", () => {
    const res = createPrescriptionSchema.safeParse({
      patientName: "John Smith",
      medicines: [
        {
          medicineId: dummyUUID,
          quantity: 2,
          dosage: "500mg",
          instructions: "Twice daily",
        },
      ],
    });
    assert.equal(res.success, true);
  });

  await t.test("createPrescriptionSchema rejects duplicate medicine IDs", () => {
    const res = createPrescriptionSchema.safeParse({
      patientName: "John Smith",
      medicines: [
        { medicineId: dummyUUID, quantity: 1 },
        { medicineId: dummyUUID, quantity: 2 },
      ],
    });
    assert.equal(res.success, false);
  });

  await t.test("prescriptionIdParamSchema requires valid UUID", () => {
    assert.equal(prescriptionIdParamSchema.safeParse({ id: "invalid-id" }).success, false);
    assert.equal(prescriptionIdParamSchema.safeParse({ id: dummyUUID }).success, true);
  });
});

test("Fulfillment Validators", async (t) => {
  await t.test("markFilledSchema validates valid UUID", () => {
    const dummyUUID = "c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33";
    const res = markFilledSchema.safeParse({ prescriptionId: dummyUUID, notes: "All good" });
    assert.equal(res.success, true);
  });
});

test("Database Service Integration", async (t) => {
  await t.test("authService.login authenticates seeded doctor", async () => {
    const result = await authService.login({
      email: "doctor@rxtrack.dev",
      password: "password123",
    });
    assert.ok(result.token, "Token should be present");
    assert.equal(result.user.email, "doctor@rxtrack.dev");
    assert.equal(result.user.role, "DOCTOR");
  });

  await t.test("authService.login rejects incorrect password", async () => {
    await assert.rejects(
      async () => {
        await authService.login({
          email: "doctor@rxtrack.dev",
          password: "wrongpassword",
        });
      },
      { message: "Invalid email or password" }
    );
  });

  await t.test("medicineService.list returns active medicines", async () => {
    const medicines = await medicineService.list();
    assert.ok(Array.isArray(medicines));
    assert.ok(medicines.length >= 4);
    assert.ok(medicines.some((m) => m.name === "Amoxicillin"));
  });

  await t.test("analyticsService.getFillRate returns valid metrics", async () => {
    const stats = await analyticsService.getFillRate();
    assert.equal(typeof stats.totalPrescriptions, "number");
    assert.equal(typeof stats.filled, "number");
    assert.equal(typeof stats.fillRate, "number");
  });

  await t.test("fulfillmentService.getPharmacyQueue returns paginated queue", async () => {
    const queue = await fulfillmentService.getPharmacyQueue({ page: 1, limit: 10 });
    assert.ok(Array.isArray(queue.items));
    assert.ok(queue.pagination.total >= 0);
  });
});
