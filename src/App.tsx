import { Authenticator } from "@aws-amplify/ui-react";

export default function App() {
  return (
    <Authenticator hideSignUp>
      {({ signOut, user }) => (
        <div
          style={{
            minHeight: "100vh",
            background: "#070A14",
            color: "#E6E7EA",
            padding: 32,
            fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          }}
        >
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
                {user?.signInDetails?.loginId}
              </span>
              <button
                onClick={signOut}
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

          <main style={{ marginTop: 24 }}>
            <div style={{ border: "1px solid #23263A", padding: 16, maxWidth: 760 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Logged in ✅</div>
              <div style={{ opacity: 0.8 }}>
                Next we’ll add: sessions list, notes/tags, and the multitrack “web DAW”.
              </div>
            </div>
          </main>
        </div>
      )}
    </Authenticator>
  );
}
