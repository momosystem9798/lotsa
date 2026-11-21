# Lotsa

AI-stöd som hjälper vårdpersonal att använda och felsöka medicinteknisk utrustning, med tillverkarens bruksanvisning som enda källa.

Det här är prototypen (MVP-skissen). Allt är vanlig HTML, CSS och JavaScript utan ramverk. Samma fil går att köra på två sätt:

- **Som Claude-artefakt.** Lagring, AI och nedladdning kommer från artefakten.
- **Fristående**, till exempel på GitHub Pages eller som en lokal fil. Då sköter appen allt själv, se nedan.

## Öppna appen på GitHub Pages

En arbetsflödesfil (`.github/workflows/pages.yml`) bygger och publicerar appen vid varje push till `main`. Gör så här första gången:

1. Slå ihop ändringarna till `main`.
2. Gå till repots **Settings → Pages** och välj **Source: GitHub Actions**.
3. När arbetsflödet har körts (fliken **Actions**) finns appen på `https://<användare>.github.io/lotsa/`.

GitHub Pages är gratis för publika repon. För ett privat repo krävs ett betalt GitHub-konto, och sidan blir ändå publik på webben. Det går också bra att ladda ner `dist/index.html` och öppna filen direkt i webbläsaren.

## Fristående läge

Om `window.claude` saknas startar `src/js/00-standalone.js` och ersätter artefaktens funktioner:

| Funktion | I artefakten | Fristående |
| --- | --- | --- |
| Lagring | Artefaktens delade databas | IndexedDB i den egna webbläsaren. **Varje dator har sin egen data**, och manualer, tips och loggar delas inte mellan kollegor. |
| AI-svar | Claude via artefakten | Anthropic API direkt från webbläsaren (`@anthropic-ai/sdk` från jsDelivr), modellen `claude-opus-5-5`. Varje användare lägger in en egen API-nyckel i appen. Nyckeln sparas i webbläsarens `localStorage`. |
| Röstinmatning | Artefaktens diktering | Webbläsarens taligenkänning där den finns (Chrome, Edge, Safari) |
| Nedladdning | Artefaktens nedladdning | Vanlig nedladdning i webbläsaren |

Utan nyckel fungerar allt utom AI-svaren: bibliotek, larmkoder, snabbkort, källvisare och sökning i manualerna.

Om API-nyckeln:

- Skapa nyckeln i [Claude Console](https://console.anthropic.com/). Sätt gärna en låg kostnadsgräns på den.
- Nyckeln skickas bara till `api.anthropic.com`. Den finns ändå i klartext i webbläsaren, så lägg inte in den på delade datorer.
- Snabba svar körs med `effort: low` och noggranna svar och snabbkort med `effort: high`. Om en säkerhetsspärr avböjer en fråga provas den automatiskt på en annan modell (`fallbacks: "default"`).

För skarp drift med delad data och utan nycklar hos användarna behövs en egen backend, se nästa avsnitt.

## Samarbete

Flera personer arbetar i repot med var sin Claude. Läs `ANDRINGSLOGG.md` för de senaste ändringarna och öppna frågor, och `CLAUDE.md` för arbetssättet. Loggen uppdateras vid varje ändring.

## Bygga

Kräver Node 18 eller senare.

```
node build.mjs
```

Det bygger en enda fil, `dist/index.html`, av allt i `src/`.

## Struktur

| Fil | Innehåll |
| --- | --- |
| `src/index.html` | Sidans skal, ikoner och logotyp |
| `src/styles.css` | All stil, ljust och mörkt tema och nattläge |
| `src/demo.js` | Påhittad exempeldata: 6 enheter, 5 manualer, tips, statistik |
| `src/js/00-standalone.js` | Fristående läge: lagring, AI, diktering och nedladdning utan Claude |
| `src/js/01-util.js` | Hjälpfunktioner, säker HTML-mall, dialoger |
| `src/js/02-store.js` | Lagring (artefaktens databas eller minne), exempeldata, loggar |
| `src/js/03-text.js` | Textsökning (BM25), citatkontroll, larmkoder, personnummerspärr |
| `src/js/04-ai.js` | Alla AI-anrop: frågor, larm, snabbkort, OCR, röstinmatning |
| `src/js/05-ui.js` | Chatt, källvisare, larmkort, felanmälan |
| `src/js/06-staff.js` | Vyer för personal: hem, bibliotek, enhet, larm, nattläge |
| `src/js/07-admin.js` | Vyer för ansvariga: översikt, granska, manualer, logg, inställningar |
| `src/js/08-files.js` | PDF-uppladdning, OCR, QR-koder, PDF-utskrifter |
| `src/js/09-about-tour.js` | Om tjänsten och rundturen |
| `src/js/10-app.js` | Navigering och start |

## Inför en skarp tjänst

Appen använder artefaktens inbyggda funktioner via `window.claude.use(...)`:

- `db` – lagring av manualer, tips, loggar
- `sample` – AI-svaren
- `dictation` – röstinmatning
- `downloads` – nedladdning av PDF och CSV
- `user` – vem som tittar

Inför en riktig tjänst behöver de bytas mot egen backend: inloggning, databas (gärna i EU), egen AI-koppling och fillagring. Den mesta logiken i `03-text.js` och gränssnittet kan återanvändas.

## Tester

Webbläsartester med Playwright mot en simulerad Claude-miljö finns i `test/`:

```
cd test
npm install
node run.mjs
```

Testerna hittar sina filer själva. Peka ut Playwright med `PLAYWRIGHT=/sökväg/till/playwright/index.mjs` om det inte är installerat i `test/`, och Chrome med `CHROME=/sökväg/till/chrome` om du vill använda en annan webbläsare än Playwrights. Testet `fristaende` kör appen utan Claude-miljö mot ett simulerat Anthropic API.
