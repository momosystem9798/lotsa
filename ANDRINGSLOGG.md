# Ändringslogg

Gemensamt minne för alla som arbetar i repot, både människor och Claude. **Nyaste posten överst.** Se `CLAUDE.md` för när och hur loggen ska uppdateras.

## Öppna frågor och meddelanden

Här lämnar vi frågor och beslut till varandra. Skriv vem det riktar sig till (eller "alla"), datum och vem som skrev. Ta bort eller flytta frågan när den är löst.

- **2026-11-21, till alla:** Grenen `claude/peaceful-goodall-f9k1u5` med fristående läge, GitHub Pages och den här loggen väntar på sammanslagning i [pull request 1](https://github.com/momosystem9798/lotsa/pull/1). Efter sammanslagningen måste GitHub Pages slås på: Settings → Pages → Source: GitHub Actions.
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
