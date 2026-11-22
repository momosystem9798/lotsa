# Ändringslogg

Gemensamt minne för alla som arbetar i repot, både människor och Claude. **Nyaste posten överst.** Se `CLAUDE.md` för när och hur loggen ska uppdateras.

## Öppna frågor och meddelanden

Här lämnar vi frågor och beslut till varandra. Skriv vem det riktar sig till (eller "alla"), datum och vem som skrev. Ta bort eller flytta frågan när den är löst.

- **2026-11-21, till alla:** Den andra Claude-sessionen (gren `claude/festive-hawking-4e5e5s`) har läst `CLAUDE.md` och den här loggen och följer arbetssättet: läser loggen vid sessionsstart, skriver en post överst vid varje ändring, uppdaterar README vid behov och committar loggen i samma commit som ändringen. Grenen bygger vidare på `claude/peaceful-goodall-f9k1u5` (snabbspolad till commit 8fba7ae).
- **2026-11-21, till alla:** Grenen `claude/peaceful-goodall-f9k1u5` med fristående läge och GitHub Pages är inte sammanslagen till `main` än, och ingen pull request finns. GitHub Pages måste också slås på: Settings → Pages → Source: GitHub Actions.
- **2026-11-21, till alla:** AI-anropen i fristående läge är bara testade mot ett simulerat API. Den som först testar med en riktig nyckel på GitHub Pages: skriv här om det fungerade.
- **2026-11-21, till alla:** I fristående läge delas ingen data mellan datorer. Om kollegor ska se samma manualer och tips behövs en gemensam backend. Det är inte beslutat hur.

## Mall för en ny post

```
## ÅÅÅÅ-MM-DD – Kort rubrik
**Gren:** namn · **Av:** person och/eller Claude-session
**Vad:** vad som ändrats, med filnamn.
**Varför:** bakgrund eller önskemål.
**Testat:** vilka tester som körts och resultatet. Säg ärligt vad som inte är testat.
**Kvar att göra / att veta:** öppna punkter, risker, beslut som behövs.
```

---

## 2026-11-22 – Ny, fördjupad research: fullständig plan för lokal Lotsa
**Gren:** `claude/festive-hawking-4e5e5s` · **Av:** Claude-session på uppdrag av kollegan
**Vad:** Ny mapp `research_notes/Lotsa lokal AI fullständig plan/` med sju researchspår (modeller och hårdvara, RAG/PDF/kvalitet, paketering och utrullning, MDR och tillverkarmanualer inkl. upphovsrätt, AI-förordningen/CRA/produktansvar, dataskydd och regionkrav, marknad och upphandling). Görs om med öppnat nätverk eftersom den förra researchen hade många blockerade källor. Rapport: `reports/Lotsa lokal AI fullständig plan.md` (ersätter i praktiken `reports/Lokal AI app för sjukhus.md`). Slutsats: det går, om modellen hålls i 2–4B-klassen med högst cirka 2 000 tokens underlag, citaten kontrolleras av kod, ändamålet hålls snävt (då sannolikt inte MDR, men CRA och nya produktansvarslagen gäller) och appen levereras som signerad MSI som regionens IT uppdaterar. Plan i fyra faser med tre go/no-go-beslut fram till CRA-kravet 11 dec 2027.
**Varför:** Kollegan vill ha en hel plan framåt: om och hur det går, svårigheter och motåtgärder.
**Testat:** Bara dokumentation. Anteckningarna är inte granskade av människa.
**Kvar att göra / att veta:** Juridiken måste stämmas av med rådgivare. Riksdagens beslut om nya produktansvarslagen (planerat 25 nov 2026) är inte kontrollerat. Ingen mätning av modellhastighet på riktiga sjukhusdatorer finns, det är rapportens första tekniska steg. Webbverktyget i underagenterna nådde inte alltid EUR-Lex, riksdagen.se och Läkemedelsverket, men `curl` gör det.

## 2026-11-22 – Research: Lotsa som lokal skrivbordsapp för sjukhus
**Gren:** `claude/festive-hawking-4e5e5s` · **Av:** Claude-session på uppdrag av kollegan
**Vad:** Ny mapp `research_notes/Lokal AI app för sjukhus/` med researchanteckningar inför att sälja Lotsa till sjukhus som en offline-app med inbyggd lokal AI. Underlaget täcker lokala modeller, teknikstack, MDR och AI-förordningen, dataskydd och cybersäkerhet samt upphandling. Sammanställd rapport: `reports/Lokal AI app för sjukhus.md`. Huvudrekommendation: Tauri 2 + llama.cpp (Qwen3.5-4B), hybridsökning i SQLite, citat som hämtas av koden, KB-Whisper för diktering, och ett snävt avsett ändamål för att hålla Lotsa utanför MDR. CRA och nya produktansvarslagen gäller ändå.
**Varför:** Kollegan vill veta hur en helt lokal version skulle fungera, vilka lagar som gäller och hur den bör byggas.
**Testat:** Bara dokumentation, ingen kod har ändrats. Anteckningarna är inte faktagranskade av människa. Flera källor (Hugging Face, EuroEval) var blockerade av nätverket.
**Kvar att göra / att veta:** Inget beslut om att bygga en lokal version är fattat. De juridiska slutsatserna måste stämmas av med en regulatorisk rådgivare innan säljmaterial tas fram. Rapporten listar vad som bör göras först.

## 2026-11-21 – Andra Claude-sessionen ansluter till arbetssättet
**Gren:** `claude/festive-hawking-4e5e5s` · **Av:** Claude-session på uppdrag av kollegan
**Vad:** Snabbspolade grenen till `claude/peaceful-goodall-f9k1u5` (8fba7ae) så att `CLAUDE.md` och loggen finns här. La till ett meddelande under "Öppna frågor och meddelanden" om att arbetssättet följs.
**Varför:** Bekräfta för den andra Claude att loggen fungerar som kanal mellan oss.
**Testat:** Bara dokumentation, ingen kod har ändrats. Inga tester körda.
**Kvar att göra / att veta:** Båda grenarna innehåller nu samma ändringar. När `claude/peaceful-goodall-f9k1u5` slås ihop med `main` kan den här grenen följa efter utan konflikter, så länge ingen annan har ändrat loggen under tiden.

## 2026-11-21 – Den här loggen och CLAUDE.md
**Gren:** `claude/peaceful-goodall-f9k1u5` · **Av:** Claude-session på uppdrag av repots ägare
**Vad:** Lade till `CLAUDE.md`, som Claude Code läser automatiskt, och den här filen. `CLAUDE.md` säger att varje Claude ska läsa loggen när sessionen börjar och uppdatera den, och vid behov README, vid varje ändring.
**Varför:** Ägaren och en kollega arbetar i repot med var sin Claude. Filerna gör att de kan se varandras ändringar och lämna meddelanden till varandra.
**Testat:** Bara dokumentation, ingen kod har ändrats.
**Kvar att göra / att veta:** –

## 2026-11-21 – Fristående läge och publicering på GitHub Pages
**Gren:** `claude/peaceful-goodall-f9k1u5` (commit f20d6c7) · **Av:** Claude-session på uppdrag av repots ägare
**Vad:**
- Ny fil `src/js/00-standalone.js`. Saknas `window.claude` ersätts artefaktens funktioner av:
  - IndexedDB för lagring
  - Anthropic API från webbläsaren (`@anthropic-ai/sdk@1.6.0` från jsDelivr, modellen `claude-opus-5-5`, `effort` low eller high, `fallbacks: "default"`)
  - Web Speech API för diktering
  - vanlig nedladdning i webbläsaren
- Användaren lägger in en egen API-nyckel via en banner eller under Inställningar. Koden finns i `src/js/10-app.js` och `src/js/07-admin.js`. Nyckeln sparas i `localStorage`.
- Nya felmeddelanden för nyckel, krediter och nätverk i `src/js/04-ai.js`.
- QR-koderna pekar på sidans egen adress i fristående läge (`src/js/01-util.js`).
- `.github/workflows/pages.yml` bygger och publicerar `dist/` på GitHub Pages vid push till `main`.
- `test/run.mjs` hittar sina filer relativt testmappen. Playwright och Chrome kan pekas ut med `PLAYWRIGHT` och `CHROME`. Nytt test: `fristaende`.

**Varför:** Appen ska kunna öppnas på en kollegas dator via GitHub, utan att vara bunden till en viss persons Claude.
**Testat:** Alla 18 Playwright-tester gick igenom, även `fristaende` som går mot ett simulerat Anthropic API. Inte testat mot det riktiga API:et.
**Kvar att göra / att veta:** Se "Öppna frågor och meddelanden" ovan. Data delas inte mellan datorer i fristående läge.

## Före 2026-11-21 – Prototyp
**Gren:** `main` (commit b824553 "Lotsa prototyp")
**Vad:** Första versionen, som körs som Claude-artefakt. Se README för struktur.
