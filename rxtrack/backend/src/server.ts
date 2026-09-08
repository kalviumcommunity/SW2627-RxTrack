import "dotenv/config";
import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
	FulfillmentStatus,
	PrismaClient,
	PrescriptionStatus,
	UserRole,
} from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
const port = Number(process.env.PORT ?? 4000);
const jwtSecret = process.env.JWT_SECRET ?? "rxtrack-local-development-secret";

type AuthenticatedRequest = Request & {
	user?: { id: string; role: UserRole };
};

function signToken(user: { id: string; role: UserRole }) {
	return jwt.sign({ sub: user.id, role: user.role }, jwtSecret, { expiresIn: "1d" });
}

function auth(request: AuthenticatedRequest, response: Response, next: NextFunction) {
	const header = request.headers.authorization;
	if (!header?.startsWith("Bearer ")) {
		return response.status(401).json({ error: "Authentication required" });
	}

	try {
		const payload = jwt.verify(header.slice(7), jwtSecret) as { sub: string; role: UserRole };
		request.user = { id: payload.sub, role: payload.role };
		return next();
	} catch {
		return response.status(401).json({ error: "Invalid or expired token" });
	}
}

function requireRole(...roles: UserRole[]) {
	return (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
		if (!request.user || !roles.includes(request.user.role)) {
			return response.status(403).json({ error: "Insufficient permissions" });
		}
		return next();
	};
}

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") ?? true }));
app.use(express.json());

app.get("/health", (_request, response) => response.json({ status: "ok" }));

app.post("/api/auth/register", async (request, response, next) => {
	try {
		const { name, email, password, role = UserRole.DOCTOR } = request.body;
		if (!name || !email || !password || !Object.values(UserRole).includes(role)) {
			return response.status(400).json({ error: "Name, email, password, and valid role are required" });
		}
		const passwordHash = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({ data: { name, email, passwordHash, role } });
		return response.status(201).json({ token: signToken(user), user: { id: user.id, name: user.name, email: user.email, role: user.role } });
	} catch (error) {
		return next(error);
	}
});

app.post("/api/auth/login", async (request, response, next) => {
	try {
		const { email, password } = request.body;
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user || !(await bcrypt.compare(password ?? "", user.passwordHash))) {
			return response.status(401).json({ error: "Invalid email or password" });
		}
		return response.json({ token: signToken(user), user: { id: user.id, name: user.name, email: user.email, role: user.role } });
	} catch (error) {
		return next(error);
	}
});

app.get("/api/prescriptions", auth, async (request: AuthenticatedRequest, response, next) => {
	try {
		const prescriptions = await prisma.prescription.findMany({
			where: request.user?.role === UserRole.DOCTOR ? { doctorId: request.user.id } : undefined,
			include: { medicines: { include: { medicine: true } }, fulfillments: { include: { pharmacy: true } } },
			orderBy: { createdAt: "desc" },
		});
		return response.json(prescriptions);
	} catch (error) {
		return next(error);
	}
});

app.get("/api/medicines", auth, async (_request: AuthenticatedRequest, response, next) => {
	try {
		const medicines = await prisma.medicine.findMany({ orderBy: { name: "asc" } });
		return response.json(medicines);
	} catch (error) {
		return next(error);
	}
});

app.post("/api/prescriptions/upload", auth, requireRole(UserRole.DOCTOR), async (request: AuthenticatedRequest, response, next) => {
	try {
		const { patientName, imageUrl, medicines = [] } = request.body;
		if (!patientName || !Array.isArray(medicines) || medicines.length === 0) {
			return response.status(400).json({ error: "Patient name and at least one medicine are required" });
		}
		const prescription = await prisma.prescription.create({
			data: {
				patientName,
				imageUrl,
				doctorId: request.user!.id,
				medicines: { create: medicines.map((item: { medicineId: string; quantity?: number; dosage?: string; instructions?: string }) => ({ medicineId: item.medicineId, quantity: item.quantity ?? 1, dosage: item.dosage, instructions: item.instructions })) },
			},
			include: { medicines: { include: { medicine: true } } },
		});
		return response.status(201).json(prescription);
	} catch (error) {
		return next(error);
	}
});

app.get("/api/prescriptions/pharmacy-queue", auth, requireRole(UserRole.PHARMACY, UserRole.ADMIN), async (request: AuthenticatedRequest, response, next) => {
	try {
		const pharmacy = request.user?.role === UserRole.PHARMACY
			? await prisma.pharmacy.findUnique({ where: { userId: request.user.id } })
			: null;
		const queue = await prisma.fulfillment.findMany({
			where: pharmacy ? { pharmacyId: pharmacy.id } : undefined,
			include: { prescription: { include: { doctor: true, medicines: { include: { medicine: true } } } }, pharmacy: true },
			orderBy: { createdAt: "asc" },
		});
		return response.json(queue);
	} catch (error) {
		return next(error);
	}
});

app.post("/api/fulfillments/mark-filled", auth, requireRole(UserRole.PHARMACY, UserRole.ADMIN), async (request: AuthenticatedRequest, response, next) => {
	try {
		const { fulfillmentId } = request.body;
		const fulfillment = await prisma.fulfillment.findUnique({ where: { id: fulfillmentId } });
		if (!fulfillment || fulfillment.status === FulfillmentStatus.COMPLETED) {
			return response.status(409).json({ error: "Fulfillment is missing or already completed" });
		}
		const updated = await prisma.$transaction(async (transaction) => {
			const result = await transaction.fulfillment.updateMany({ where: { id: fulfillmentId, status: { not: FulfillmentStatus.COMPLETED } }, data: { status: FulfillmentStatus.COMPLETED, pickedUpAt: new Date() } });
			if (result.count !== 1) throw new Error("Fulfillment was already completed");
			await transaction.prescription.update({ where: { id: fulfillment.prescriptionId }, data: { status: PrescriptionStatus.DISPENSED } });
			return transaction.fulfillment.findUnique({ where: { id: fulfillmentId } });
		});
		return response.json(updated);
	} catch (error) {
		return next(error);
	}
});

app.get("/api/analytics/fill-rate", auth, requireRole(UserRole.DOCTOR, UserRole.ADMIN), async (_request, response, next) => {
	try {
		const [total, filled] = await Promise.all([
			prisma.prescription.count(),
			prisma.prescription.count({ where: { status: PrescriptionStatus.DISPENSED } }),
		]);
		return response.json({ total, filled, fillRate: total === 0 ? 0 : Math.round((filled / total) * 100) });
	} catch (error) {
		return next(error);
	}
});

app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
	console.error(error);
	return response.status(500).json({ error: "Internal server error" });
});

const server = app.listen(port, () => console.log(`RxTrack API listening on port ${port}`));

process.on("SIGTERM", async () => {
	server.close();
	await prisma.$disconnect();
});
