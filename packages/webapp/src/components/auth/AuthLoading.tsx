// Shown by route guards while auth state is being hydrated from the session
// cookie on first load, so a valid tab doesn't flash a redirect to /login
// before hydration resolves.
export default function AuthLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 28,
          height: 28,
          border: "3px solid rgba(0,0,0,0.15)",
          borderTopColor: "rgba(0,0,0,0.55)",
          borderRadius: "50%",
          animation: "graph-italia-auth-spin 0.8s linear infinite",
        }}
      />
      <style>{"@keyframes graph-italia-auth-spin{to{transform:rotate(360deg)}}"}</style>
    </div>
  );
}
