"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input } from "../../../../components";
import { medicineApi, prescriptionApi, type Medicine } from "../../../../lib/api";

export default function UploadPrescriptionPage() {
	const router = useRouter();
	const [medicines, setMedicines] = useState<Medicine[]>([]);
	const [patientName, setPatientName] = useState("");
	const [medicineId, setMedicineId] = useState("");
	const [error, setError] = useState("");

	useEffect(() => { medicineApi.list().then(setMedicines).catch(() => setError("Unable to load medicines.")); }, []);

	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault(); setError("");
		try { await prescriptionApi.upload({ patientName, medicines: [{ medicineId, quantity: 1 }] }); router.push("/doctor"); }
		catch { setError("Unable to upload prescription."); }
	}

	return <main className="min-h-screen bg-slate-50 px-6 py-10"><Card title="Upload Prescription" className="mx-auto max-w-xl"><form className="space-y-4" onSubmit={submit}><Input id="patient" label="Patient name" value={patientName} onChange={(event) => setPatientName(event.target.value)} required /><label className="flex flex-col gap-1 text-sm font-medium text-gray-700" htmlFor="medicine">Medicine<select id="medicine" className="rounded-md border border-gray-300 px-3 py-2" value={medicineId} onChange={(event) => setMedicineId(event.target.value)} required><option value="">Select a medicine</option>{medicines.map((medicine) => <option key={medicine.id} value={medicine.id}>{medicine.name} {medicine.strength ?? ""}</option>)}</select></label>{error && <p className="text-sm text-red-600">{error}</p>}<Button type="submit">Upload prescription</Button></form></Card></main>;
}
