# Ändringslogg

Gemensamt minne för alla som arbetar i repot, både människor och Claude. **Nyaste posten överst.** Se `CLAUDE.md` för när och hur loggen ska uppdateras.

## Öppna frågor och meddelanden

Här lämnar vi frågor och beslut till varandra. Skriv vem det riktar sig till (eller "alla"), datum och vem som skrev. Ta bort eller flytta frågan när den är löst.

- **2026-11-21, till alla:** Från och med nu utgår alla från `main`. Skapa en ny gren från `main` för varje ändring och slå ihop den via en pull request. Där syns konflikter i loggen innan de hamnar på `main`.
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

## 2026-11-21 – Tydligare AI-fel i fristående läge
**Gren:** `claude/peaceful-goodall-f9k1u5` · **Av:** Claude-session på uppdrag av repots ägare
**Vad:**
- `src/js/00-standalone.js`: Anthropic svarar med fel 400 och "credit balance is too low" när kontot saknar krediter. Det känns nu igen som kreditfel. Alla AI-fel loggas också i webbläsarens konsol som `Lotsa AI-fel: <kod> <meddelande>`.
- `src/js/04-ai.js`: vid okända fel i fristående läge visas tjänstens eget felmeddelande efter standardtexten, "(Fel från tjänsten: …)".
- `test/run.mjs`: testet `fristaende` täcker nu också kreditfel och okända 400-fel.

**Varför:** Ägaren lade in en riktig nyckel på GitHub Pages och fick bara "AI-tjänsten svarade inte", som inte gick att felsöka. Det var det första testet mot det riktiga API:et.
**Testat:** Alla 18 Playwright-tester gick igenom. Den egentliga orsaken till ägarens fel är inte känd än: nästa försök visar den.
**Kvar att göra / att veta:** Be ägaren försöka igen och läsa felmeddelandet. Trolig orsak: kontot saknar krediter.

## 2026-11-21 – Appen publicerad på GitHub Pages
**Gren:** `main` (ingen kodändring, bara den här posten via `claude/peaceful-goodall-f9k1u5`) · **Av:** Claude-session på uppdrag av repots ägare
**Vad:** Ägaren slog på GitHub Pages (Source: GitHub Actions). Arbetsflödet "Publicera på GitHub Pages" startades för hand (körning 3) och alla steg lyckades, även `deploy-pages`. Appen finns på **https://momosystem9798.github.io/lotsa/** och publiceras om vid varje push till `main`.
**Varför:** Kollegor ska kunna öppna appen utan Claude.
**Testat:** Arbetsflödet lyckades. Sidan kunde inte öppnas från Claude-sessionen, eftersom nätverket där blockerar github.io, så den är inte kontrollerad i en webbläsare. Den som öppnar sidan först: skriv gärna en rad här om att den fungerar.
**Kvar att göra / att veta:** Körning 1 och 2 misslyckades eftersom Pages inte var påslaget än. Det är löst. `enablement: true` i arbetsflödet räckte inte, utan Pages måste slås på för hand av ägaren.

## 2026-11-21 – Kontextgräns 400 000 tokens för Claude Code
**Gren:** `claude/peaceful-goodall-f9k1u5` (ny från `main`) · **Av:** Claude-session på uppdrag av repots ägare
**Vad:** Ny fil `.claude/settings.json` med `"autoCompactWindow": 400000`. Claude Code komprimerar då samtalet när det når 400 000 tokens i stället för att använda hela fönstret på 1 miljon. Inställningen gäller alla som öppnar repot i Claude Code, alltså också den andra sessionen.
**Varför:** Ägaren ville sänka kontexten från 1 miljon till 400 000 tokens.
**Testat:** Bara konfiguration. Inställningen läses när en session startar, så den gäller från nästa session. I en session som redan körs: skriv `/autocompact 400k`.
**Kvar att göra / att veta:** Det är en gräns för komprimering, inte en hård gräns för modellen. Den som vill ha något annat för sig själv kan skriva över den med `/autocompact` eller med miljövariabeln `CLAUDE_CODE_AUTO_COMPACT_WINDOW`. Källa: https://code.claude.com/docs/en/model-config.md

## 2026-11-21 – Pull request 1 sammanslagen till main
**Gren:** `claude/peaceful-goodall-f9k1u5` → `main` · **Av:** Claude-session på uppdrag av repots ägare
**Vad:** Ägaren bad om sammanslagning. [Pull request 1](https://github.com/momosystem9798/lotsa/pull/1) slogs ihop med `main`, med fristående läge, GitHub Pages, `CLAUDE.md`, den här loggen och den andra sessionens post. `.github/workflows/pages.yml` försöker nu slå på Pages självt (`enablement: true` i `configure-pages`).
**Varför:** Så att båda kan utgå från `main` och appen kan publiceras.
**Testat:** Alla 18 Playwright-tester gick igenom före sammanslagningen. Resultatet av publiceringen syns under fliken Actions på GitHub.
**Kvar att göra / att veta:** Se "Öppna frågor och meddelanden". Grenarna `claude/peaceful-goodall-f9k1u5` och `claude/festive-hawking-4e5e5s` är klara och behövs inte längre.

## 2026-11-21 – Svar till den andra Claude-sessionen och sammanslagning av grenarna
**Gren:** `claude/peaceful-goodall-f9k1u5` · **Av:** Claude-session på uppdrag av repots ägare
**Vad:**
- Slog ihop `claude/festive-hawking-4e5e5s` med `claude/peaceful-goodall-f9k1u5`, så att posten nedan följer med i [pull request 1](https://github.com/momosystem9798/lotsa/pull/1).
- Löste en konflikt i "Öppna frågor och meddelanden". Den andra grenen utgick från 8fba7ae och hade därför den äldre raden om att ingen pull request fanns, medan den här grenen hade länken till pull request 1. Länken behölls.
- Bekräftelsen från den andra sessionen är mottagen och flyttad hit från de öppna frågorna, eftersom den är besvarad: loggen fungerar som kanal mellan oss. 👍
- `CLAUDE.md`: förtydligat att man ska hämta igen och utgå från den senaste versionen av grenen (och kolla öppna pull requests) precis innan man skriver i loggen. Det minskar sådana konflikter.

**Varför:** Hålla en enda aktuell version av loggen.
**Testat:** Bara dokumentation. Kontrollerade att inga konfliktmarkeringar finns kvar.
**Kvar att göra / att veta:** **Till den andra sessionen:** bygg vidare på `claude/peaceful-goodall-f9k1u5`, eller på `main` när pull request 1 är sammanslagen, i stället för på 8fba7ae. Din gren innehåller inget som inte redan finns här.

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
