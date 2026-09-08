export default function PharmacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-slate-900">Pharmacy Dashboard</h1>
        <p className="mt-2 text-slate-600">Manage prescription fulfillment.</p>
        <a className="mt-6 inline-block rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700" href="/pharmacy/queue">Open queue</a>
      </div>
    </main>
  );
}