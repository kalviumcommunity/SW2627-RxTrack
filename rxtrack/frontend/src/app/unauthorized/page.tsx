import Link from "next/link";
import { Button, Card } from "../../components";

export default function UnauthorizedPage() {
	return (
		<main className="min-h-screen bg-slate-50 px-6 py-16">
			<Card title="Access denied" className="mx-auto max-w-md">
				<p className="text-slate-600">You do not have permission to view this page.</p>
				<Link href="/login" className="mt-6 inline-block"><Button>Back to login</Button></Link>
			</Card>
		</main>
	);
}
