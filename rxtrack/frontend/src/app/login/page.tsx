"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input } from "../../components";
import { authApi } from "../../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("doctor@rxtrack.dev");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await authApi.login(email, password);
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      router.push(result.user.role === "PHARMACY" ? "/pharmacy" : "/doctor");
    } catch {
      setError("Login failed. Check the API connection and credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <Card title="Sign in to RxTrack" className="mx-auto max-w-md">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input id="email" label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <Input id="password" label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
        </form>
        <p className="mt-4 text-sm text-gray-600">Demo accounts use the password <strong>password</strong>.</p>
      </Card>
    </main>
  );
}