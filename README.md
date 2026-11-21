# Lotsa

AI-stöd som hjälper vårdpersonal att använda och felsöka medicinteknisk utrustning, med tillverkarens bruksanvisning som enda källa.

Det här är prototypen (MVP-skissen) som i dag körs som en Claude-artefakt. Allt är vanlig HTML, CSS och JavaScript utan ramverk.

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

## Beroende av Claude-artefakten

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

`test/run.mjs` pekar på en lokal Chrome-sökväg som kan behöva ändras.
