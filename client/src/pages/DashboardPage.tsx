import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

type User = { email: string; name: string; role: string };

export default function DashboardPage() {
  const [, navigate] = useLocation();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("food-ordering-token");
    if (!token) return navigate("/login");
    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error("Authentication required");
        setUser(payload.user);
      })
      .catch(() => {
        localStorage.removeItem("food-ordering-token");
        navigate("/login");
      });
  }, [navigate]);

  if (!user) return <p className="p-12 text-center text-gray-600">Loading authenticated dashboard…</p>;
  return (
    <section className="container mx-auto px-4 py-12" aria-label="Authenticated dashboard">
      <div className="rounded-2xl bg-secondary p-8 text-white shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">Authenticated session</p>
        <h1 className="mt-2 text-3xl font-bold">Operations Dashboard</h1>
        <p className="mt-3">Signed in as {user.name || user.email} · {user.role}</p>
        <Button className="mt-6" variant="secondary" onClick={() => {
          localStorage.removeItem("food-ordering-token");
          navigate("/login");
        }}>Sign Out</Button>
      </div>
    </section>
  );
}
