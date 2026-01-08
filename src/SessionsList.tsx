import { useEffect, useMemo, useState } from "react";

type SessionRow = { sessionId: string };

function parseSessionId(sessionId: string) {
  // Expected: Jam-YYYYMMDD-HHMMSSmmm (or similar)
  const parts = sessionId.split("-");
  const yyyymmdd = parts[1] ?? "";
  const hhmmssMaybe = parts[2] ?? "";

  const yyyy = yyyymmdd.slice(0, 4);
  const mm = yyyymmdd.slice(4, 6);
  const dd = yyyymmdd.slice(6, 8);

  const hh = hhmmssMaybe.slice(0, 2);
  const mi = hhmmssMaybe.slice(2, 4);
  const ss = hhmmssMaybe.slice(4, 6);

  const hasDate = yyyy.length === 4 && mm.length === 2 && dd.length === 2;
  const hasTime = hh.length === 2 && mi.length === 2 && ss.length === 2;

  return {
    dateLabel: hasDate ? `${yyyy}-${mm}-${dd}` : null,
    timeLabel: hasTime ? `${hh}:${mi}:${ss}` : null,
  };
}

export default function SessionsList() {
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_SESSIONS_API_URL as string | undefined;

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        if (!apiUrl) throw new Error("Missing VITE_SESSIONS_API_URL");
        setLoading(true);
        setError(null);

        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);

        const data = await res.json();
        const list: SessionRow[] = Array.isArray(data?.sessions) ? data.sessions : [];

        if (!cancelled) setSessions(list);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [apiUrl]);

  const rows = useMemo(() => {
    return sessions.map((s) => ({ ...s, ...parseSessionId(s.sessionId) }));
  }, [sessions]);

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Sessions</div>

      {loading && <div style={{ opacity: 0.85 }}>Loading…</div>}

      {error && (
        <div>
          <div style={{ fontWeight: 700 }}>Could not load sessions</div>
          <div style={{ opacity: 0.8, marginTop: 4 }}>{error}</div>
        </div>
      )}

      {!loading && !error && rows.length === 0 && <div style={{ opacity: 0.85 }}>No sessions yet.</div>}

      {!loading && !error && rows.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {rows.map((s) => (
            <div
              key={s.sessionId}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                padding: "10px 12px",
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.04)",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <code style={{ color: "#E6E7EA", fontSize: 13 }}>{s.sessionId}</code>
                {(s.dateLabel || s.timeLabel) && (
                  <div style={{ fontSize: 12, opacity: 0.75 }}>
                    {s.dateLabel ?? "—"} {s.timeLabel ? `• ${s.timeLabel}` : ""}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <a
                  href={`/session/${encodeURIComponent(s.sessionId)}`}
                  style={{
                    border: "1px solid rgba(255,255,255,0.14)",
                    background: "transparent",
                    color: "#E6E7EA",
                    padding: "6px 10px",
                    textDecoration: "none",
                  }}
                >
                  Open
                </a>

                <button
                  disabled
                  style={{
                    opacity: 0.55,
                    border: "1px solid rgba(255,255,255,0.14)",
                    background: "transparent",
                    color: "#E6E7EA",
                    padding: "6px 10px",
                    cursor: "not-allowed",
                  }}
                >
                  Play
                </button>

                <button
                  disabled
                  style={{
                    opacity: 0.55,
                    border: "1px solid rgba(255,255,255,0.14)",
                    background: "transparent",
                    color: "#E6E7EA",
                    padding: "6px 10px",
                    cursor: "not-allowed",
                  }}
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}