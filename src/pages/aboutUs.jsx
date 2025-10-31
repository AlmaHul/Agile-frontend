import React from "react";

const colors = {
  bg: "#fffaf3",
  accent1: "#FFB347",
  accent2: "#FFCC70",
  text: "#0f172a",
  white: "#ffffff",
};

const styles = {
  page: {
    background: colors.bg,
    minHeight: "100vh",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
    color: colors.text,
    padding: "40px 20px 100px",
    overflowX: "hidden",
  },
  hero: {
    textAlign: "center",
    padding: "60px 25px",
    background: `linear-gradient(135deg, ${colors.accent1}, ${colors.accent2})`,
    borderRadius: 24,
    margin: "20px auto 60px",
    maxWidth: 900,
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    animation: "fadeIn 1s ease-in-out",
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 800,
    marginBottom: 16,
  },
  heroText: {
    fontSize: 18,
    lineHeight: 1.7,
    maxWidth: 720,
    margin: "0 auto",
  },
  sectionWrap: {
    display: "flex",
    flexDirection: "column",
    gap: 35,
    maxWidth: 900,
    margin: "0 auto",
  },
  card: {
    background: `linear-gradient(135deg, ${colors.accent1}, ${colors.accent2})`,
    borderRadius: 22,
    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
    padding: 3,
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
  },
  cardInner: {
    background: colors.white,
    borderRadius: 20,
    padding: "28px 32px",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 1.8,
    margin: 0,
  },
  teamNote: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    fontWeight: 600,
    color: colors.text,
    background: `linear-gradient(90deg, ${colors.accent1}, ${colors.accent2})`,
    borderRadius: 14,
    padding: "14px 18px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  footer: {
    textAlign: "center",
    fontSize: 14,
    opacity: 0.85,
    marginTop: 80,
  },
};

export default function AboutUs() {
  return (
    <main style={styles.page}>
      <header style={styles.hero}>
        <h1 style={styles.heroTitle}>Om oss</h1>
        <p style={styles.heroText}>
          Jöra skapades som ett skolprojekt inom utbildningen <em>AI‑utvecklare på Jensen Education
          Stockholm</em>. Vårt mål var att bygga en plattform som gör vardagen lite roligare – genom att
          förvandla mål och utmaningar till något motiverande och socialt.
        </p>
      </header>

      <div style={styles.sectionWrap}>
        <div style={styles.card}>
          <div style={styles.cardInner}>
            <h2 style={styles.sectionTitle}>Vårt syfte</h2>
            <p style={styles.paragraph}>
              Jöra är en plattform för alla som vill kombinera produktivitet med motivation. Här kan du skapa,
              delta i och slutföra utmaningar, få poäng och följa dina framsteg på ett roligt och visuellt sätt.
              Idén är enkel: att göra vardagens mål lika engagerande som ett spel.
            </p>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardInner}>
            <h2 style={styles.sectionTitle}>Vårt arbetssätt</h2>
            <p style={styles.paragraph}>
              Vi har arbetat agilt enligt <strong>Scrum‑metoden</strong>, med sprintar, stand‑ups och retrospektiv.
              Under projektets gång använde vi verktyg som GitHub Projects, Figma och Render för att samarbeta
              effektivt och hålla hela utvecklingsprocessen transparent. Vi turades även om att vara
              <em> Scrum Master </em> och <em> Product Owner </em> för att förstå hela flödet från planering till leverans.
            </p>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardInner}>
            <h2 style={styles.sectionTitle}>Vår process</h2>
            <p style={styles.paragraph}>
              Genom <strong>Javelin Board‑metoden</strong> testade vi tidigt våra hypoteser om användarbeteende och
              justerade appens funktioner baserat på feedback. Det gjorde att vi kunde fokusera på det som gav
              störst värde – enkel design, tydlig poänglogik, en stabil backend och säker inloggning med JWT.
            </p>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardInner}>
            <h2 style={styles.sectionTitle}>Framtiden</h2>
            <p style={styles.paragraph}>
              Vi vill vidareutveckla Jöra genom att lägga till vänlistor, gemensamma utmaningar, avatarer kopplade
              till prestationer och en statistiksida över användarens historik. Ambitionen är att göra Jöra till en
              komplett plattform för både personlig utveckling och gemenskap.
            </p>
          </div>
        </div>
      </div>

      <div style={styles.teamNote}>
        Projektet har utvecklats av <strong>Albin</strong>, <strong>Akbar</strong>, <strong>Alma</strong> och <strong>David</strong>.
      </div>

      <footer style={styles.footer}>© 2025 Jöra Team — Stockholm</footer>
    </main>
  );
}
