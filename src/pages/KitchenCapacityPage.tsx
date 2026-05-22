import { useState } from "react";

export default function KitchenCapacityPage() {
  const [payload, setPayload] = useState('{"open_orders":34,"avg_prep_minutes":12,"active_cooks":5,"delivery_backlog":9,"rush_window_minutes":45}');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const run = async () => {
    setError("");
    try {
      const res = await fetch("/api/kitchen-capacity/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(JSON.parse(payload || "{}")),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Kitchen Capacity</h1>
        <button className="px-4 py-2 rounded bg-primary text-primary-foreground" onClick={run}>Score Capacity</button>
      </div>
      <textarea className="w-full min-h-48 rounded border p-3 font-mono text-sm" value={payload} onChange={(e) => setPayload(e.target.value)} />
      {error && <div className="mt-4 rounded border border-red-300 bg-red-50 p-3 text-red-700">{error}</div>}
      {result && <pre className="mt-4 overflow-auto rounded border bg-muted p-4 text-sm">{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
