# Lotsa

AI-stöd som hjälper vårdpersonal att använda och felsöka medicinteknisk utrustning, med tillverkarens bruksanvisning som enda källa.

Det här är prototypen (MVP-skissen). Allt är vanlig HTML, CSS och JavaScript utan ramverk. Samma fil går att köra på två sätt:

- **Som Claude-artefakt.** Lagring, AI och nedladdning kommer från artefakten.
- **Fristående**, till exempel på GitHub Pages eller som en lokal fil. Då sköter appen allt själv, se nedan.

Skriv aldrig patientuppgifter i Lotsa. Text som ser ut att innehålla ett personnummer spärras innan den sparas eller skickas till AI. Du kan söka efter en larmkod med eller utan inledande nollor i kodens taldel, till exempel `E7` för `E-07`, när koden finns i larmregistret eller manualen.

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

## Hur svaren kontrolleras (molnet)

- AI:ns svar visas först när hela svaret har kommit och kontrollerats. Ogiltig JSON ger reservläget med sökträffar.
- Varje citat måste stå ordagrant i den text som skickades (`strictQuote` i `src/js/04-ai.js`, som bygger på `strictSpan` i `src/js/03-text.js`). Siffror, decimaler, minustecken, enheter och skiftläge måste stämma. Ett citat får inte klippa ett tal ("1" ur "1 200 ml/h"). Ett citat med "…" godkänns bara om delarna står i ordning, högst 200 tecken isär, och det utelämnade inte innehåller en negation, ett villkor eller ett tal. Som citat visar Lotsa sedan manualens hela meningar där träffen står, även det utelämnade. En punkt räknas som meningsgräns bara när nästa ord börjar med versal eller siffra, och en tom rad alltid. Ett "Varning:" före, ett villkor på nästa rad och text efter en förkortning som "sek." kommer därför med. Förkortningar som "ca.", "t.ex." och andra korta ord med gemener avslutar inte meningen. Ligger meningsgränsen mer än 1 500 tecken från träffen underkänns citatet hellre än att det klipps.
- Varje påstående i svaret måste ha en källmarkör till ett kontrollerat citat (`unsupportedLines`). Raden får inte säga emot citatet: negationen och talen måste stämma (`claimConflicts`). Annars visas "Svaret är inte styrkt med citat" eller "Svaret stämmer inte med citatet", och ingen steg-för-steg-visning.
- Svaret minns vilken uppladdning av manualen det byggde på. Har manualen bytts ut visas en varning och citatet markeras inte i källvisaren.
- Personnummer spärras i frågor och formulär och tas bort ur uppladdad manualtext (`maskPNR`) innan texten skickas eller sparas.
- Kontrollerna är heuristiska. De fångar fel citat, ändrade tal, tecken och enheter samt borttappade negationer, men de förstår inte innebörden. Den som läser svaret ska alltid läsa citatet.

### Kända begränsningar i prototypen

Appen är en prototyp och får inte användas kliniskt eller med patientuppgifter. Det här är känt och inte löst:

- **Utdragen kan vara ofullständiga.** Lokalt väljer modellen rader, och molnet sammanfattar. Ingen av dem garanterar att hela proceduren eller alla varningar kommer med.
- **Avvisning av patientfrågor görs av modellen.** En fråga om en viss patient kan i sällsynta fall få handlingsinriktade utdrag i stället för att avvisas.
- **Skannade sidor** skickas som bilder till AI:n för OCR (molnet) innan personnummer kan maskeras.
- **Varningar** kan kapas när de fortsätter på nästa sida eller när ett långt stycke delas.
- **Molnets kontroll** av negationer, tal och enheter är heuristisk och känner bara igen vanliga måttenheter. Den missar till exempel ombytta värden ("inlopp 20, utlopp 10" mot det omvända), min mot max, över mot under, steg- och sidnummer som skiljer sig, och engelsk tusentalsnotation ("1,200"). Negationen jämförs sats för sats, men bara när svarssatsen delar minst två ord med en sats i citatet, så omformulerade satser ("sladden" för "nätkabeln") kan slinka igenom. Ett förbud i en egen mening före eller efter citatet ingår inte i citatet. Öppna källan, där hela sidan visas. Läs alltid citatet i manualen.
- **Snabbkort:** manualen läses på nytt före sparning och godkännande, men läsning och skrivning sker inte i ett steg. En manual som byts ut exakt mellan dem upptäcks inte förrän kortet visas, och då spärras det som inaktuellt.
- **Avbrutna frågor** kan ändå loggas som reservsvar i frågeloggen.
- **Larmuppslag:** byter man enhet i väljaren eller ändrar koden utan att söka på nytt står det gamla resultatet kvar. Enhetens namn står i kortet.
- **Lokal AI:** förvärmningen kan fördröja en fråga om samma manual (högst 3 minuter). Teckenbudgeten är en uppskattning, så servern kan ändå avvisa prompten. Då görs ett nytt försök med mindre urval och därefter visas reservläget.
- **Väntetider lokalt:** på en dator med 4 kärnor tar en fråga ungefär 15–25 sekunder när manualen redan är inläst, och första frågan upp till en minut.

## Lokal AI (prototyp för skrivbordsversionen)

Appen kan använda en språkmodell som körs på den egna datorn via [llama.cpp](https://github.com/ggml-org/llama.cpp). Då lämnar inga frågor datorn.

1. Bygg eller hämta `llama-server` från llama.cpp och ladda ner en modell i GGUF-format, till exempel `Qwen3.5-4B-Q4_K_M.gguf` (Apache 2.0).
2. Bygg appen: `node build.mjs`
3. Starta: `node local/start.mjs --model sökväg/modell.gguf --llama sökväg/llama-server`
4. Öppna `http://127.0.0.1:8080/`. Inställningar visar "Lokal AI på den här datorn".

På Windows gör skriptet `local/starta-windows.ps1` allt detta. Första gången hämtar det llama.cpp och modellen (2,7 GB) till `C:\lotsa-ai`, sedan bygger det appen, startar och öppnar webbläsaren. Kör det från mappen `lotsa`:

```
powershell -ExecutionPolicy Bypass -File local\starta-windows.ps1
```

`node local/start.mjs ... --open` öppnar webbläsaren när modellen är laddad, på alla system.

Mätning och utvärdering (servern måste vara igång):

- `node local/bench.mjs` mäter inläsning och generering vid 512, 2 048 och 4 096 tokens.
- `node local/eval.mjs` kör `local/testset/fragor-v0.json` genom appens frågeflöde. Kräver Playwright (sätt `PLAYWRIGHT` till dess `index.mjs` om den inte finns i `test/node_modules`).

Resultaten hamnar i `local/resultat/`. I lokalt läge finns ingen OCR av skannade sidor än.

Så fungerar lokalt läge (prototyp, inte för pilot än):

- Lokalt läge gäller när sidan serveras från den egna datorn (127.0.0.1, localhost eller [::1]), eller när `localStorage["lotsa:localAi"]` är `http://127.0.0.1:<port>` eller `http://[::1]:<port>`. Andra adresser ignoreras.
- I lokalt läge används aldrig Anthropic API, inte ens om en nyckel är sparad och den lokala servern inte svarar. Webbläsarens taligenkänning är också avstängd, eftersom den skickar ljudet till en tjänst på nätet.
- Svaren är rena utdrag (ID-flödet i `src/js/04-ai.js`). Manualen delas i rader och meningar med id (`[S12]`), och modellen svarar bara `{status, rader}` där raderna är en uppräkning av giltiga id:n (högst 8). Skärmen visar tillverkarens stycken med de valda raderna markerade, märkta "Urval gjort av AI". Modellen skriver aldrig egen text.
- Ryms enhetens manual i serverns kontext (`localLimits()`: 12 000 tecken, mindre om `n_ctx` är litet) skickas hela manualen i samma ordning varje gång med frågan sist. Då återanvänder llama-server inläsningen mellan frågorna, och `warmLocal()` läser in manualen i förväg när enheten öppnas. Annars skickas de bäst matchande styckena. Avvisar servern prompten för att den är för lång görs ett nytt försök med ett mindre urval.
- Varningar (OBS, VARNING ... och texten efter en fristående "VARNING" fram till nästa tomrad) markeras röda i de visade styckena. Varningar i samma avsnitt i resten av manualen och i stycket före listas under utdragen, även om de inte skickades till modellen. Igenkänningen bygger på textmönster och kan missa en varning, till exempel när den fortsätter på nästa sida eller saknar ett varningsord.
- Ett okänt id, `besvarad` utan rader, `saknas`/`avvisad` med rader eller avbruten JSON ger reservläget med sökträffar. Sökträffarna visas redan medan modellen arbetar.
- Larmkoder tolkas inte av AI:n. Granskade registerposter och manualens sidor med koden visas ordagrant.
- `local/start.mjs` startar llama-server med 8 192 tokens kontext som standard (`--ctx`).

Testa lokalt läge utan modell: `cd test && node run.mjs lokal`. Det kör testerna `lokal`, `lokal-strikt`, `lokal-kontext`, `lokal-avbruten`, `lokal-enhet` och `lokal-nere` mot en simulerad llama-server.

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

På en egen dator (Windows, Mac eller Linux) där Playwright inte finns installerat: kör först `npm install playwright` och `npx playwright install chromium` i `test/`.

Testerna hittar sina filer själva. Peka ut Playwright med `PLAYWRIGHT=/sökväg/till/playwright/index.mjs` om det inte är installerat i `test/`, och Chrome med `CHROME=/sökväg/till/chrome` om du vill använda en annan webbläsare än Playwrights. Testet `fristaende` kör appen utan Claude-miljö mot ett simulerat Anthropic API.
