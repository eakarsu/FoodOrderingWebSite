import { FormEvent, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const fillDemoCredentials = async () => {
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/api/auth/demo-credentials", { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || "Demo credentials are unavailable");
      setEmail(payload.email);
      setPassword(payload.password)
      window.setTimeout(() => { const __f = document.querySelector('form'); if (__f) __f.requestSubmit(); }, 60);;
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Demo credentials are unavailable");
    } finally {
      setBusy(false);
    }
  };

  const signIn = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || "Sign in failed");
      localStorage.setItem("food-ordering-token", payload.token);
      navigate("/dashboard");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Sign in failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12">
      <div className="w-full rounded-2xl border bg-white p-8 shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">Orderly Bite Operations</p>
        <h1 className="mt-2 text-3xl font-bold text-secondary">Sign In</h1>
        <p className="mt-2 text-sm text-gray-600">Access the authenticated restaurant operations dashboard.</p>
        {error && <div role="alert" className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        <form className="mt-6 space-y-4" onSubmit={signIn}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </div>
          <Button type="button" variant="outline" className="w-full" onClick={fillDemoCredentials} disabled={busy}>
            Auto Fill Demo Credentials
          </Button>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Please wait..." : "Sign In"}
          </Button>
        </form>
      </div>
    </section>
  );
}
