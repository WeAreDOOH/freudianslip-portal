import { Authenticator } from "@aws-amplify/ui-react";
import { Component, type ReactNode } from "react";
import SessionsList from "./SessionsList";
import { BrowserRouter, Routes, Route, Navigate, useParams, Link } from "react-router-dom";

const SHELL_PAD = 24;
// Set to a big number to feel “full width”, but still stops ultra-wide monitors looking silly.
// If you truly want uncapped width: set MAX_W = undefined and remove maxWidth below.
const MAX_W = 1400;

const shellStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: MAX_W,
  margin: "0 auto",
  paddingLeft: SHELL_PAD,
  paddingRight: SHELL_PAD,
  boxSizing: "border-box",
};

const panelStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #23263A",
  padding: 16,
  boxSizing: "border-box",
};

function Home() {
  return (
    <div style={panelStyle}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Logged in ✅</div>

      <SessionsList />

      <div style={{ opacity: 0.8, marginTop: 12 }}>
        Next we’ll add: session detail page, notes/tags, and the multitrack “web DAW”.
      </div>
    </div>
  );
}

function SessionPage() {
  const { sessionId } = useParams();

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>Session Detail</div>
          <div style={{ opacity: 0.7, fontSize: 13 }}>This will become the DAW view</div>
        </div>

        <Link
          to="/"
          style={{
            border: "1px solid rgba(255,255,255,0.14)",
            background: "transparent",
            color: "#E6E7EA",
            padding: "8px 12px",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          ← Back to sessions
        </Link>
      </div>

      <div style={panelStyle}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Session ID</div>
        <code style={{ color: "#E6E7EA" }}>{sessionId ?? ""}</code>

        <div style={{ marginTop: 14, opacity: 0.85 }}>Next: waveform, tracks, stems, markers, notes.</div>
      </div>

      <div style={panelStyle}>
        <div style={{ opacity: 0.8 }}>Placeholder: DAW timeline area (coming soon)</div>
        <div style={{ marginTop: 10, height: 260, border: "1px dashed rgba(255,255,255,0.18)" }} />
      </div>
    </div>
  );
}

function Portal({ user, signOut }: { user: any; signOut?: () => void }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#070A14",
        color: "#E6E7EA",
        paddingTop: 32,
        paddingBottom: 32,
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        boxSizing: "border-box",
      }}
    >
      {import.meta.env.DEV && (
        <div
          style={{
            position: "fixed",
            top: 12,
            left: 12,
            zIndex: 9999,
            background: "#fff",
            color: "#000",
            padding: "6px 10px",
            border: "2px solid #000",
            fontSize: 12,
          }}
        >
          LOCAL DEV: App.tsx rendering
        </div>
      )}

      <div style={shellStyle}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #23263A",
            paddingBottom: 16,
          }}
        >
          <div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>Freudian Slip</div>
            <div style={{ opacity: 0.7, fontSize: 13 }}>Sessions Portal</div>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ opacity: 0.75, fontSize: 13 }}>
              {user?.signInDetails?.loginId ?? user?.username ?? ""}
            </span>

            <button
              onClick={() => signOut?.()}
              style={{
                border: "1px solid #23263A",
                background: "transparent",
                color: "#E6E7EA",
                padding: "8px 12px",
                cursor: "pointer",
              }}
            >
              Sign out
            </button>
          </div>
        </header>
      </div>

      <main style={{ marginTop: 24 }}>
        <div style={shellStyle}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/session/:sessionId" element={<SessionPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

class ErrorBoundary extends Component<{ children: ReactNode }, { error: unknown }> {
  state = { error: null as unknown };

  static getDerivedStateFromError(error: unknown) {
    return { error };
  }

  componentDidCatch(error: unknown) {
    console.error("App crashed:", error);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: "100vh", padding: 24, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif" }}>
          <h2 style={{ marginTop: 0 }}>App error</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {String((this.state.error as any)?.stack ?? this.state.error)}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Authenticator hideSignUp>
          {({ signOut, user }) => <Portal user={user} signOut={signOut} />}
        </Authenticator>
      </BrowserRouter>
    </ErrorBoundary>
  );
}