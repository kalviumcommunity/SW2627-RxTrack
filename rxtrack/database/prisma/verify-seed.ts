import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  const [users, pharmacies, medicines, prescriptions, fulfillments] =
    await Promise.all([
      prisma.user.count(),
      prisma.pharmacy.count(),
      prisma.medicine.count(),
      prisma.prescription.count(),
      prisma.fulfillment.count(),
    ]);

  const doctor = await prisma.user.findUnique({
    where: { email: "doctor@rxtrack.dev" },
  });
  const pharmacyUser = await prisma.user.findUnique({
    where: { email: "pharmacy@rxtrack.dev" },
  });
  const admin = await prisma.user.findUnique({
    where: { email: "admin@rxtrack.dev" },
  });

  if (
    users !== 3 ||
    pharmacies !== 1 ||
    medicines !== 4 ||
    prescriptions !== 2 ||
    fulfillments !== 2 ||
    doctor?.role !== UserRole.DOCTOR ||
    pharmacyUser?.role !== UserRole.PHARMACY ||
    admin?.role !== UserRole.ADMIN
  ) {
    throw new Error(
      `Unexpected seed data: users=${users}, pharmacies=${pharmacies}, medicines=${medicines}, prescriptions=${prescriptions}, fulfillments=${fulfillments}`
    );
  }

  console.log(
    `Seed verification passed: ${users} users, ${pharmacies} pharmacy, ${medicines} medicines, ${prescriptions} prescriptions, ${fulfillments} fulfillments.`
  );
}

main()
  .catch((error) => {
    console.error("Seed verification failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });