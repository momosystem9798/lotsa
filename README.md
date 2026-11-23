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

## Hur svaren tas fram

AI:n skriver aldrig någon egen text till personalen, varken i molnet eller lokalt. Svaret är alltid tillverkarens egen text ur bruksanvisningen.

- Manualen delas i stycken och rader, och varje rad får ett id (`[S12]`). Modellen svarar bara med status och vilka id:n som besvarar frågan (`askExcerpt` i `src/js/04-ai.js`). Lotsa visar sedan styckena ordagrant, med de valda raderna markerade och varningarna i samma avsnitt intill.
- Varje utdrag har en källrad med enhet, manual, version, sida och avsnitt. Ett tryck öppnar sidan i källvisaren.
- **Står svaret inte i manualen** visar Lotsa ingen AI-text, bara den fasta raden "Inget utdrag i manualen besvarar frågan", de närmaste sökträffarna och kontakt till MT. En fråga om en viss patient (dosering, inställningar) får en fast rad som hänvisar till ordination och lokala rutiner.
- Ett okänt id, fler än åtta id:n, ogiltig JSON eller ett tekniskt fel ger sökning utan AI, med manualens bäst matchande sidor.
- Ryms en enhets manual skickas hela manualen (molnet upp till 60 000 tecken, lokalt efter serverns kontext). Annars skickas de stycken som matchar frågan bäst.
- Svaret minns vilken uppladdning av manualen det byggde på. Har manualen bytts ut visas en varning och utdraget markeras inte i källvisaren.
- Personnummer spärras i frågor och formulär och tas bort ur uppladdad manualtext (`maskPNR`) innan texten skickas eller sparas.
- Snabbkort byggs på samma sätt: AI:n väljer rader för uppstart, rengöring och larm (`generateCard` med `selectLines`), och kortet visar manualens rader ordagrant. Larm visas som manualens hela larmstycke (`alarmBlock`), och "Viktigt" är manualens egna varningar. Kort är utkast tills en ansvarig har kontrollerat urvalet. Kort från en tidigare version med egna formuleringar (utan `verbatim`) visas inte och måste skapas om. Exempelkorten görs om till manualens rader när appen startar (`verbatimCard`).

### Kända begränsningar i prototypen

Appen är en prototyp och får inte användas kliniskt eller med patientuppgifter. Det här är känt och inte löst:

- **Utdragen kan vara ofullständiga eller fel avsnitt.** Modellen väljer rader och kan välja fel stycke, fel modellvariant eller missa ett steg. Texten är alltid manualens, men urvalet garanterar inte att hela proceduren eller alla varningar kommer med.
- **"Inget utdrag" betyder inte att manualen saknar svaret.** Modellen kan missa, och när manualen är stor får modellen bara ett förurval. Därför visas sökträffarna alltid.
- **Patientfrågor:** tydliga frågor om en viss patient ("min patient", "säng 4", "ska patienten ha") stoppas av ett mönster (`CLINICAL_RE`) innan något annat körs, och frågetexten sparas inte i loggen. Andra patientfrågor avgör modellen, och då kan sökträffar ha visats medan den arbetade. En fråga om en viss patient kan i sällsynta fall få handlingsinriktade utdrag.
- **Osynlig text i PDF:er** (till exempel ett dolt textlager) läses in som manualtext och kan visas i utdrag, fast den inte syns på originalsidan. Källvisaren visar den inlästa texten, inte bilden av sidan.
- **OCR-sidor** är tolkade maskinellt. De märks "OCR" i utdrag, sökträffar, varningar, larmuppslag och kopior, men texten kan ändå avvika från originalsidan.
- **Skannade sidor** skickas som bilder till AI:n för OCR (molnet) innan personnummer kan maskeras.
- **Varningar** kan kapas när de fortsätter på nästa sida eller när ett långt stycke delas.
- **Snabbkortens urval** kan sakna ett steg eller ta med en rad från fel avsnitt. Granskaren ska jämföra kortet med manualen innan det godkänns. Ett kort har högst 10 steg per avsnitt och 4 larm.
- **Snabbkort:** manualen läses på nytt före sparning och godkännande, men läsning och skrivning sker inte i ett steg. En manual som byts ut exakt mellan dem upptäcks inte förrän kortet visas, och då spärras det som inaktuellt.
- **Avbrutna frågor** kan ändå loggas som reservsvar i frågeloggen.
- **Larmuppslag:** byter man enhet i väljaren eller ändrar koden utan att söka på nytt står det gamla resultatet kvar. Enhetens namn står i kortet.
- **Lokal AI:** förvärmningen kan fördröja en fråga om samma manual (högst 3 minuter). Teckenbudgeten är en uppskattning, så servern kan ändå avvisa prompten. Då görs ett nytt försök med mindre urval och därefter visas sökning utan AI.
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
- Svaren är rena utdrag, som i molnet (ID-flödet i `src/js/04-ai.js`, se "Hur svaren tas fram"). Manualen delas i rader och meningar med id (`[S12]`), och modellen svarar bara `{status, rader}` där raderna är en uppräkning av giltiga id:n (högst 8). Skärmen visar tillverkarens stycken med de valda raderna markerade. Modellen skriver aldrig egen text.
- Ryms enhetens manual i serverns kontext (`localLimits()`: 12 000 tecken, mindre om `n_ctx` är litet) skickas hela manualen i samma ordning varje gång med frågan sist. Då återanvänder llama-server inläsningen mellan frågorna, och `warmLocal()` läser in manualen i förväg när enheten öppnas. Annars skickas de bäst matchande styckena. Avvisar servern prompten för att den är för lång görs ett nytt försök med ett mindre urval.
- Varningar (OBS, VARNING ... och texten efter en fristående "VARNING" fram till nästa tomrad) markeras röda i de visade styckena. Varningar i samma avsnitt i resten av manualen och i stycket före listas under utdragen, även om de inte skickades till modellen. Igenkänningen bygger på textmönster och kan missa en varning, till exempel när den fortsätter på nästa sida eller saknar ett varningsord.
- Ett okänt id, `besvarad` utan rader, `saknas`/`avvisad` med rader eller avbruten JSON ger sökning utan AI med sökträffar. Sökträffarna visas redan medan modellen arbetar.
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
