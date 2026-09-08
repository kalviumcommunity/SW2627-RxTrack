"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Card } from "../../components";
import { prescriptionApi, type Prescription } from "../../lib/api";

export default function DoctorPage() {
	const router = useRouter();
	const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
	const [error, setError] = useState("");

	useEffect(() => {
		prescriptionApi.list().then(setPrescriptions).catch(() => setError("Unable to load prescriptions."));
	}, []);

	function logout() {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		router.push("/login");
	}

	return (
		<main className="min-h-screen bg-slate-50 px-6 py-10">
			<div className="mx-auto max-w-4xl">
				<div className="mb-8 flex flex-wrap items-center justify-between gap-4">
					<div><h1 className="text-3xl font-bold text-slate-900">Doctor Dashboard</h1><p className="text-slate-600">Track prescription fulfillment.</p></div>
					<div className="flex gap-2"><Link href="/doctor/prescriptions/upload"><Button>Upload prescription</Button></Link><Button variant="secondary" onClick={logout}>Log out</Button></div>
				</div>
				{error && <p className="mb-4 text-red-600">{error}</p>}
				<div className="grid gap-4 md:grid-cols-2">
					{prescriptions.map((prescription) => <Card key={prescription.id} title={prescription.patientName}><div className="flex justify-between"><span>{prescription.medicines.length} medicine(s)</span><strong>{prescription.status}</strong></div></Card>)}
					{!error && prescriptions.length === 0 && <Card><p>No prescriptions found. Upload the first one.</p></Card>}
				</div>
			</div>
		</main>
	);
}
