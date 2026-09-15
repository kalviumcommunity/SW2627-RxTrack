"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, Card } from "../../../../components";
import { prescriptionApi, type Prescription } from "../../../../lib/api";

export default function DoctorPrescriptionPage({ params }: { params: Promise<{ id: string }> }) {
	const [prescription, setPrescription] = useState<Prescription | null>(null);
	const [error, setError] = useState("");

	useEffect(() => {
		void params.then(({ id }) => prescriptionApi.get(id).then(setPrescription).catch(() => setError("Unable to load this prescription.")));
	}, [params]);

	return (
		<main className="min-h-screen bg-slate-50 px-6 py-10">
			<div className="mx-auto max-w-3xl">
				<Link href="/doctor/prescriptions"><Button variant="secondary">Back to prescriptions</Button></Link>
				{error && <p className="mt-6 text-red-600">{error}</p>}
				{prescription && <>
					<div className="mt-6 mb-8"><h1 className="text-3xl font-bold text-slate-900">Prescription Details</h1><p className="mt-2 text-slate-600">Created {new Date(prescription.createdAt).toLocaleDateString()}</p></div>
					<Card title="Patient and status"><div className="flex flex-wrap justify-between gap-3"><span className="text-lg text-slate-900">{prescription.patientName}</span><strong className="text-slate-700">{prescription.status}</strong></div></Card>
					<Card title="Medicines" className="mt-4"><div className="space-y-4">{prescription.medicines.map((item) => <div key={item.id} className="border-b border-slate-200 pb-4 last:border-0 last:pb-0"><h2 className="font-semibold text-slate-900">{item.medicine.name} {item.medicine.strength ?? ""}</h2><p className="text-sm text-slate-600">Quantity: {item.quantity}</p><p className="text-sm text-slate-600">Dosage: {item.dosage ?? "Not specified"}</p><p className="text-sm text-slate-600">Instructions: {item.instructions ?? "No instructions provided"}</p></div>)}</div></Card>
				</>}
			</div>
		</main>
	);
}
