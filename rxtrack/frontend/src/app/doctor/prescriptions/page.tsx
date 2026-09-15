"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, Card } from "../../../components";
import { prescriptionApi, type Prescription } from "../../../lib/api";

export default function DoctorPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    prescriptionApi
      .list()
      .then(setPrescriptions)
      .catch(() => setError("Unable to load prescriptions."));
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Prescription List</h1>
            <p className="text-slate-600">Review and manage the prescriptions assigned to your patients.</p>
          </div>
          <Link href="/doctor/prescriptions/upload">
            <Button>Upload prescription</Button>
          </Link>
        </div>

        {error && <p className="mb-4 text-red-600">{error}</p>}

        {prescriptions.length === 0 && !error ? (
          <Card>
            <p>No prescriptions found.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {prescriptions.map((prescription) => (
              <Link key={prescription.id} href={`/doctor/prescriptions/${prescription.id}`} className="block">
                <Card className="transition hover:shadow-lg">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Patient</p>
                      <h2 className="text-xl font-semibold text-slate-900">{prescription.patientName}</h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
                        {prescription.status}
                      </span>
                      <span>{new Date(prescription.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
