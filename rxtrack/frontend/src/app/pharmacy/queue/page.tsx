"use client";

import { useEffect, useState } from "react";
import { Button, Card } from "../../../components";
import { pharmacyApi, type Fulfillment } from "../../../lib/api";

export default function PharmacyQueuePage() {
	const [queue, setQueue] = useState<Fulfillment[]>([]);
	const [error, setError] = useState("");

	async function loadQueue() {
		try { setQueue(await pharmacyApi.queue()); } catch { setError("Unable to load the pharmacy queue."); }
	}

	useEffect(() => {
		void pharmacyApi.queue()
			.then(setQueue)
			.catch(() => setError("Unable to load the pharmacy queue."));
	}, []);

	async function markFilled(id: string) {
		try { await pharmacyApi.markFilled(id); await loadQueue(); } catch { setError("This fulfillment could not be marked as filled."); }
	}

	return (
		<main className="min-h-screen bg-slate-50 px-6 py-10">
			<div className="mx-auto max-w-4xl"><h1 className="text-3xl font-bold text-slate-900">Pharmacy Queue</h1><p className="mt-2 text-slate-600">Review and fulfill prescriptions.</p>
				{error && <p className="mt-4 text-red-600">{error}</p>}
				<div className="mt-8 space-y-4">{queue.map((item) => <Card key={item.id} title={item.prescription.patientName}><div className="flex flex-wrap items-center justify-between gap-3"><span>Status: {item.status}</span>{item.status !== "COMPLETED" && <Button onClick={() => markFilled(item.id)}>Mark as filled</Button>}</div></Card>)}{!error && queue.length === 0 && <Card><p>The queue is empty.</p></Card>}</div>
			</div>
		</main>
	);
}
