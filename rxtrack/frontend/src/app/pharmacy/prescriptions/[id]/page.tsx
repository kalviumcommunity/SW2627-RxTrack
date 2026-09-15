"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, Card } from "../../../../components";
import { pharmacyApi, prescriptionApi, type Prescription } from "../../../../lib/api";

export default function PharmacyPrescriptionPage({ params }: { params: Promise<{ id: string }> }) {
	const [prescription, setPrescription] = useState<Prescription | null>(null);
	const [error, setError] = useState("");
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		void params.then(({ id }) => prescriptionApi.get(id).then(setPrescription).catch(() => setError("Unable to load this prescription.")));
	}, [params]);

	async function markFilled() {
		const fulfillment = prescription?.fulfillments?.find((item) => item.status !== "COMPLETED");
		if (!fulfillment) return;
		setSaving(true); setError("");
		try { await pharmacyApi.markFilled(fulfillment.id); setPrescription((current) => current ? { ...current, status: "DISPENSED", fulfillments: current.fulfillments?.map((item) => item.id === fulfillment.id ? { ...item, status: "COMPLETED" } : item) } : current); }
		catch { setError("This prescription could not be marked as filled."); }
		finally { setSaving(false); }
	}

	const fulfillment = prescription?.fulfillments?.[0];
	const canMarkFilled = Boolean(fulfillment && fulfillment.status !== "COMPLETED" && prescription?.status !== "DISPENSED");

	return (
		<main className="min-h-screen bg-slate-50 px-6 py-10">
			<div className="mx-auto max-w-3xl">
				<Link href="/pharmacy/queue"><Button variant="secondary">Back to queue</Button></Link>
				{error && <p className="mt-6 text-red-600">{error}</p>}
				{prescription && <>
					<div className="mt-6 mb-8"><h1 className="text-3xl font-bold text-slate-900">Prescription Details</h1><p className="mt-2 text-slate-600">Created {new Date(prescription.createdAt).toLocaleDateString()}</p></div>
					<Card title="Patient and fulfillment"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-lg text-slate-900">{prescription.patientName}</p><p className="text-sm text-slate-600">Prescription: {prescription.status}</p><p className="text-sm text-slate-600">Fulfillment: {fulfillment?.status ?? "Unavailable"}</p></div>{canMarkFilled && <Button onClick={markFilled} disabled={saving}>{saving ? "Saving..." : "Mark as Filled"}</Button>}</div></Card>
					<Card title="Medicines" className="mt-4"><div className="space-y-4">{prescription.medicines.map((item) => <div key={item.id} className="border-b border-slate-200 pb-4 last:border-0 last:pb-0"><h2 className="font-semibold text-slate-900">{item.medicine.name} {item.medicine.strength ?? ""}</h2><p className="text-sm text-slate-600">Quantity: {item.quantity}</p><p className="text-sm text-slate-600">Dosage: {item.dosage ?? "Not specified"}</p><p className="text-sm text-slate-600">Instructions: {item.instructions ?? "No instructions provided"}</p></div>)}</div></Card>
				</>}
			</div>
		</main>
	);
}
