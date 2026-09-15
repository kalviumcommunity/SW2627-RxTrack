import Link from "next/link";
import { Button, Card } from "../components";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <Card title="Welcome to RxTrack" className="mx-auto max-w-xl text-center">
        <p className="text-slate-600">Track prescriptions from clinical review through pharmacy fulfillment.</p>
        <Link href="/login" className="mt-6 inline-block"><Button>Log in</Button></Link>
      </Card>
    </main>
  );
}