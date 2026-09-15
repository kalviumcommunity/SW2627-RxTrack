import Link from "next/link";
import { Button, Card } from "../../components";

export default function PharmacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Pharmacy Dashboard</h1>
          <p className="mt-2 text-slate-600">Monitor fulfillment activity and process incoming prescriptions.</p>
        </div>

        <Card title="Welcome back">
          <div className="space-y-6">
            <p className="text-slate-600">
              Review the active queue and complete prescription fulfillment tasks for patients.
            </p>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Queue status</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">Ready</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Pending</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">Review</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Next action</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">Queue</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/pharmacy/queue">
                <Button>Open queue</Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}