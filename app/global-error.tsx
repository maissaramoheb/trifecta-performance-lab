"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="ar" dir="rtl">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "24px",
          color: "#f2efe8",
          background: "#090b0c",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <main style={{ width: "min(560px, 100%)", border: "1px solid #3d392f", borderRadius: 18, padding: 28 }}>
          <p style={{ margin: "0 0 10px", color: "#d7a958", letterSpacing: ".08em" }}>TRIFECTA PERFORMANCE LAB</p>
          <h1 style={{ margin: "0 0 12px", fontSize: "clamp(1.6rem, 5vw, 2.4rem)" }}>تعذر تحميل واجهة التطبيق</h1>
          <p style={{ margin: "0 0 24px", color: "#b7b9b5", lineHeight: 1.8 }}>
            حصل خطأ مؤقت أثناء تحميل الملفات. حاول مرة أخرى، ولن يتم حذف تقدمك المحفوظ.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              minHeight: 46,
              border: "1px solid #d7a958",
              borderRadius: 10,
              padding: "0 20px",
              color: "#090b0c",
              background: "#d7a958",
              font: "inherit",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            إعادة المحاولة · Retry
          </button>
        </main>
      </body>
    </html>
  );
}
