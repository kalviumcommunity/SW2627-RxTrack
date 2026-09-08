import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  FulfillmentStatus,
  PrismaClient,
  PrescriptionStatus,
  UserRole,
} from "@prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  await prisma.fulfillment.deleteMany();
  await prisma.prescriptionMedicine.deleteMany();
  await prisma.prescription.deleteMany();
  await prisma.pharmacy.deleteMany();
  await prisma.medicine.deleteMany();
  await prisma.user.deleteMany();

  const doctor = await prisma.user.create({
    data: {
      name: "Dr. Maya Patel",
      email: "doctor@rxtrack.dev",
      passwordHash: "$2b$10$57n7L9TXrv9O6S3cf/LgFu03U3LczEsn7iTZOrZb4UoHZTPhCPPaC",
      role: UserRole.DOCTOR,
    },
  });

  const pharmacyUser = await prisma.user.create({
    data: {
      name: "Pharmacy Admin",
      email: "pharmacy@rxtrack.dev",
      passwordHash: "$2b$10$57n7L9TXrv9O6S3cf/LgFu03U3LczEsn7iTZOrZb4UoHZTPhCPPaC",
      role: UserRole.PHARMACY,
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: "Platform Admin",
      email: "admin@rxtrack.dev",
      passwordHash: "$2b$10$57n7L9TXrv9O6S3cf/LgFu03U3LczEsn7iTZOrZb4UoHZTPhCPPaC",
      role: UserRole.ADMIN,
    },
  });

  const pharmacy = await prisma.pharmacy.create({
    data: {
      name: "Green Valley Pharmacy",
      address: "123 Wellness Avenue, Suite 200",
      phone: "555-0101",
      email: "hello@greenvalleypharmacy.dev",
      userId: pharmacyUser.id,
    },
  });

  const medicines = await Promise.all([
    prisma.medicine.create({
      data: {
        name: "Amoxicillin",
        genericName: "Amoxicillin",
        strength: "500mg",
        form: "Capsule",
        stockQuantity: 120,
      },
    }),
    prisma.medicine.create({
      data: {
        name: "Lisinopril",
        genericName: "Lisinopril",
        strength: "10mg",
        form: "Tablet",
        stockQuantity: 90,
      },
    }),
    prisma.medicine.create({
      data: {
        name: "Ibuprofen",
        genericName: "Ibuprofen",
        strength: "200mg",
        form: "Tablet",
        stockQuantity: 150,
      },
    }),
    prisma.medicine.create({
      data: {
        name: "Metformin",
        genericName: "Metformin",
        strength: "500mg",
        form: "Tablet",
        stockQuantity: 100,
      },
    }),
  ]);

  const prescriptionOne = await prisma.prescription.create({
    data: {
      patientName: "Sample Patient A",
      doctorId: doctor.id,
      status: PrescriptionStatus.PENDING,
      medicines: {
        create: [
          {
            medicineId: medicines[0].id,
            quantity: 30,
            dosage: "500mg",
            instructions: "Take one capsule every 12 hours for 5 days.",
          },
          {
            medicineId: medicines[2].id,
            quantity: 20,
            dosage: "200mg",
            instructions: "Take as needed for pain or fever.",
          },
        ],
      },
    },
  });

  const prescriptionTwo = await prisma.prescription.create({
    data: {
      patientName: "Sample Patient B",
      doctorId: doctor.id,
      status: PrescriptionStatus.READY,
      medicines: {
        create: [
          {
            medicineId: medicines[1].id,
            quantity: 30,
            dosage: "10mg",
            instructions: "Take one tablet each morning.",
          },
          {
            medicineId: medicines[3].id,
            quantity: 60,
            dosage: "500mg",
            instructions: "Take one tablet twice daily with food.",
          },
        ],
      },
    },
  });

  await prisma.fulfillment.create({
    data: {
      prescriptionId: prescriptionOne.id,
      pharmacyId: pharmacy.id,
      status: FulfillmentStatus.QUEUED,
      notes: "Waiting for pharmacist review.",
    },
  });

  await prisma.fulfillment.create({
    data: {
      prescriptionId: prescriptionTwo.id,
      pharmacyId: pharmacy.id,
      status: FulfillmentStatus.READY,
      notes: "Prescription is ready for pickup.",
    },
  });

  console.log({
    doctor: doctor.email,
    pharmacyUser: pharmacyUser.email,
    admin: admin.email,
    pharmacy: pharmacy.name,
    medicines: medicines.length,
    prescriptions: 2,
  });
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
