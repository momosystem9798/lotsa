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

## 2026-11-23 – Version 3: allt personalen ser är manualens egen text, aldrig AI-text
**Gren:** `claude/festive-hawking-4e5e5s` · **Av:** Claude-session på uppdrag av kollegan, i samarbete med Codex (OpenAI) som granskare
**Vad:**
- *Ett flöde för molnet och lokalt (`src/js/04-ai.js`):*
  - `askManuals` går alltid till `askExcerpt` (tidigare `askLocal`). Modellen väljer bara rad-id:n, och Lotsa visar manualens stycken ordagrant.
  - Molnet har egna gränser (`CLOUD_FULL` 60 000 och `CLOUD_BUDGET` 24 000 tecken), skickar manualen och frågan i två block och tar fram sökord för engelska manualer.
  - Radvalet ligger i `selectLines` och används av både frågorna och snabbkorten.
  - `RULES`, `buildContext`, `excerptText`, `normalizeAnswer` och `unsupportedLines` är borttagna.
- *Svarsvyn (`src/js/05-ui.js`, `src/styles.css`):*
  - Utdraget visas som ett dokumentcitat med källrad: enhet, manual, version, sida och avsnitt.
  - Borttaget: AI-märken, "Noggrannare svar", stegvisning av AI-text, det AI-bedömda MT-kortet och det förinspelade exempelsvaret.
  - Hittas inget svar visas bara den fasta raden "Inget utdrag i manualen besvarar frågan" ("i de sökta avsnitten" vid förurval), sökträffar och MT-kontakt.
  - Utdrag från OCR-sidor märks. Kopian och flaggningen bär källreferenserna.
- *Patientfrågor:* `isClinicalQuestion` (`CLINICAL_RE`) stoppar tydliga frågor om en viss patient före larmuppslag, sökträffar och AI, med ett fast besked. Mönstret är snävt, och modellen kan fortfarande avvisa det som slinker igenom.
- *Snabbkort (`src/js/04-ai.js`, `06-staff.js`, `08-files.js`, `02-store.js`):*
  - `generateCard` gör tre radval (uppstart, rengöring, larm) med `selectLines`. Kortet består av manualens rader ordagrant (`cardLines`, `cardBlock`), larmen av manualens hela larmstycke (`cardAlarm`), och "Viktigt" av manualens varningar (`cardWarnings`).
  - Exempelkorten i `src/demo.js` hade egna formuleringar. De görs om till manualens rader när appen startar (`verbatimCard` i `hydrateDemo`), utan AI.
  - Sparade kort utan `verbatim` (från version 2) visas inte, kan inte godkännas, skrivas ut, visas i nattläget eller steg för steg. De måste skapas om.
  - Utkast döljs för personal. Nattläget visar kortets varningar tillsammans med stegen.
  - PDF:en skriver om ≤ ≥ ≠ ≈ → och vägrar skriva ut text med andra tecken utanför Latin-1 (`pdfLossy`), så att manualens text inte ändras tyst.
- *Larmkortet (`src/js/05-ui.js`, `alarmText` och `numberedSteps` i `04-ai.js`):* visar manualens larmstycke ordagrant med sida. Registret ger bara kod, rubrik, prioritet, sida och MT-flagga. Steg för steg och felanmälan använder manualens numrerade steg. Registrets egna formuleringar (`betyder`, `orsak`, `atgard`) visas inte längre.
- *Inget utdrag:* sökträffarna ligger hopfällda under "Sök själv i manualen". Kopieringsknappen finns bara för besvarade frågor.
- *Larmtolkning (`src/js/03-text.js`):* `alarmCodeRe` gör att en kort kod bara träffar sin egen rad (E-23 träffar inte E-23A eller E-23-1). `CODE_LINE` känner igen en kod ensam på raden, hårt bindestreck och rader som "Alarm 12", så att ett larmstycke slutar vid nästa larm. `codeRegex` tar hårt bindestreck och tankstreck. AI-tolkade registerposter visar aldrig sin egen rubrik (larmtabell, larmkort, sökförslag, stegvisning).
- *Autoifyllning vid uppladdning (`autofillMeta`):* namn, tillverkare, modell och version används bara om de står exakt så på en av de skickade sidorna, och datumet bara om det står som ÅÅÅÅ-MM-DD i texten. Annars lämnas fältet tomt.
- *OCR:* snabbkortets block, larm och varningar märks OCR i kortet, nattläget, stegvisningen och PDF:en.
- *Texter:* Om-sidan och rundturen (`src/js/09-about-tour.js`, som använder `excerptFromQuote`) samt admin-etiketterna (`src/js/07-admin.js`).
- *Tester (`test/run.mjs`, `test/mock.js`):*
  - Mocken svarar med rad-id:n.
  - `chatt-svar-kalla`, `moln-strikt`, `fristaende`, `utan-claude`, `lokal`, `lokal-strikt`, `uppladdning` och `ovrigt` är omskrivna efter det nya flödet.
  - Ny skärmbild 39: inget utdrag.
  - Nya tester och kontroller: `snabbkort-aldre-format`, att varje rad på ett nytt kort står ordagrant i den uppladdade manualen, att exempelkortet och larmkortet är ordagranna.
- README: nytt avsnitt "Hur svaren tas fram". Begränsningarna är uppdaterade.

**Varför:** Kollegan vill inte ha AI-text ("AI-slop"). Svaret ska vara manualens text som i den ursprungliga idén, AI:n får aldrig hitta på något, och står det inte i manualen ska AI:n inte svara. Codex hjälpte till att planera och granskade.
**Testat:** Hela sviten (`node run.mjs`) går igenom. Patientspärren är provad mot 4 patientfrågor och 8 vanliga frågor (inga falska spärrar). Den riktiga lokala modellen och det riktiga molnet är inte omkörda med de nya snabbkortsfrågorna, bara mot mocken.
**Codex granskning:** tio ronder, alla underkända med nya fynd som sedan åtgärdats:
- Rond 1–3: fynd i chattflödet.
- Rond 4: godkända snabbkort visade AI-skriven text.
- Rond 5: larmkortet visade registrets omskrivningar, larmstycken kapades och PDF:en tappade tecken som ≤.
- Rond 6–10: autoifyllningen kunde spara AI-formulerade namn, larmstycken kunde hämtas för fel kod eller fortsätta in i nästa larm, OCR-märkningen saknades på kortet och PDF:en kunde klippas.

Två fynd är medvetet inte åtgärdade, och Codex fick veta varför. *Lokala tips* är skrivna av kollegor och godkända av en ansvarig, inte av AI. *Tjänstens felmeddelande i fristående läge* är kollegans felsökningsfunktion från `main` (#4) och visas inom parentes efter en fast rad.
**Kvar att göra / att veta:**
- Ett giltigt rad-id kan peka på fel avsnitt eller fel modellvariant. Texten är ändå manualens, och källraden visar var den kommer ifrån.
- OCR-sidor är maskinellt tolkade och kan avvika från originalet. De märks överallt men verifieras inte.
- Ett giltigt rad-id kan peka på ett irrelevant stycke. Det går inte att kontrollera mekaniskt. Texten är ändå manualens.
- Exempelkortens godkännande är påhittat, precis som resten av exempeldatan.
- Larmstycken avgränsas med heuristik (kodrader, rubriker). En manual med ett ovanligt kodformat kan ge ett för långt eller för kort larmstycke. Texten är ändå manualens, och "Läs i manualen" visar sidan.
- Nattläget kan logga en visning två gånger.

## 2026-11-22 – Version 2: strängare kontroll, lokal AI som väljer rader, och undersökning av lagkrav
**Gren:** `claude/festive-hawking-4e5e5s` · **Av:** Claude-session på uppdrag av kollegan, i samarbete med Codex (OpenAI) som granskare och delvis utvecklare
**Vad:**
- *Undersökning:* `research_notes/Lotsa förbättringar 2026-11-22.md` tar upp liknande produkter, lagar och standarder (MDR/MDCG 2019-11, Läkemedelsverkets AI-vägledning, AI-förordningen, NIS2, CRA, tillgänglighet, upphovsrätt till manualer) och förbättringsförslag. Codex och en Claude-agent letade buggar oberoende av varandra (25 + 13 fynd).
- *Molnet (A), `src/js/04-ai.js`, `05-ui.js`:*
  - `strictQuote`: ellipscitat godkänns bara om delarna står i ordning, högst 200 tecken isär och utan negation, villkor eller tal i det utelämnade (`ELLIPS_RISK`). Träffen måste ligga i den text som skickades (7 000 tecken), men gränserna kontrolleras mot hela sidan.
  - Som citat visas alltid manualens hela mening eller meningar (`sentStart`/`sentEnd`, `SENT_B`, `isAbbr`), så att ett "OBS:", "Never:" eller ett villkor efter en förkortning eller radbrytning inte kan tappas. Hittas ingen meningsgräns inom 1 500 tecken underkänns citatet. `strictSpan` (`03-text.js`) underkänner citat som klipper ett tal ("1" ur "1 200 ml/h").
  - `unsupportedLines`: varje påstående måste ha ett kontrollerat citat. `claimConflicts`: raden får inte säga emot citatet (negation per mening och sats, tal med tecken, kod och enhet: `numsOf`, `UNITS`, `unitKey`, `REF_RE`).
  - Inget strömmat AI-svar. Ogiltig JSON ger reservläget. "Hittade inget svar i de sökta avsnitten" när urvalet är ofullständigt. AI-märkning under källorna. Kopian bär varningarna.
- *Larm:* AI-tolkade larm sparas eller visas inte längre (`alarmsOf`, `alarmEvidence`). `matchAlarm` väljer exakt kod före nollnormalisering (E7/E-07). `runAlarm` har löpnummer mot sena svar.
- *Lokal AI (B):*
  - ID-flöde: modellen väljer rad-id:n (`[S12]`), och skärmen visar manualens stycken med raderna markerade.
  - Hela manualen skickas i samma ordning för prompt-cache, med `warmLocal` som förvärmning. `localLimits` utgår från `n_ctx`, och vid kontextfel görs ett nytt försök.
  - Varningar markeras och hämtas ur hela avsnittet. Okända id:n ger reservläge.
  - `local/start.mjs` har standardkontext 8192.
- *Gemensamt:*
  - Sökträffar visas medan AI:n arbetar. Avbryt fungerar direkt.
  - Svar minns vilken uppladdning av manualen de byggde på (`rev`). Snabbkort binds till uppladdningen (`cardStale`) och kan inte godkännas på en ny manual.
  - Nattläget visar bara godkända kort.
  - Personnummer maskeras i uppladdad text (`maskPNR`).
  - Fler PNR-format, fokusfälla i dialoger, CSV-formelskydd och plural- och textfixar (Codex patch A4–A6).
- *Tester (`test/run.mjs`, `test/mock.js`):* nya eller omskrivna `moln-strikt`, `larm-utan-ai`, `lokal`, `lokal-strikt`, `lokal-kontext`, `lokal-avbruten`, `uppladdning-pnr`, `a456-enhet` med flera. Nya skärmbilder 39–42.
- README: avsnitten "Hur svaren kontrolleras" och "Kända begränsningar i prototypen" är nya, och avsnittet om lokal AI är omskrivet.
**Varför:** Kollegan bad Claude och Codex att tillsammans förbättra idén, leta buggar, kontrollera lagkrav och bygga en bättre version att jämföra med. Granskningarna visade att ett äkta citat kunde "styrka" ett svar som sa motsatsen, att AI-tolkade larmposter kunde skriva över granskade, och att nattläget visade ogranskade kort.
**Testat:**
- Hela sviten (`node run.mjs`) går igenom.
- Riktig modell (Qwen3.5-4B Q4_K_M, 4 vCPU), `local/eval.mjs`, körd på en mellanversion. Senare ändringar är testade med testsvitens server-mock men inte med den riktiga modellen: 27/30 godkända (tidigare 25/30), citat 26/26, median 17,9 s (tidigare 36,3 s), längsta 67,3 s (första frågan utan förvärmning). Resultatet finns i `local/resultat/eval-v2-*`, där "v2" står i datorfältet.
- Codex granskade i 15 omgångar. B (lokal AI) godkändes för prototyp i omgång 3 och A (molnets kontroller) i omgång 15. Omgång 4–14 hittade nya sätt att lura talkontrollen och citatgränserna (enheter, koder, hänvisningar, kapade tal, ellipser, förkortningar, flyttad negation). Varje fynd fick ett test. Codex slutomdöme: kvarvarande heuristiska missar är godtagbara för en prototyp med påhittade manualer som inte används kliniskt, eftersom README beskriver dem och källvisaren visar hela sidan.
- Egna kontrollskript: 13 svenska parafraser ger inga falska varningar, och de avsiktliga felen fångas.
- Hela sviten kördes om efter varje omgång och går igenom.
**Kvar att göra / att veta:** Se "Kända begränsningar i prototypen" i README. Viktigast: utdrag kan vara ofullständiga, modellen avgör avvisning av patientfrågor, och OCR-bilder skickas före maskering. Inget är testat med riktiga sjukhusmanualer eller på sjukhusdatorer.

## 2026-11-22 – Startskript för Windows
**Gren:** `claude/festive-hawking-4e5e5s` · **Av:** Claude-session på uppdrag av kollegan
**Vad:**
- Ny fil `local/starta-windows.ps1`. Första gången hämtar den den senaste Windows-versionen av llama.cpp för CPU (`*bin-win-cpu-x64.zip`) från GitHub och Qwen3.5-4B Q4_K_M från Hugging Face till `C:\lotsa-ai`. Nedladdningen görs med `curl.exe` och kan fortsätta om den avbryts. Sedan kör skriptet `node build.mjs` och `local/start.mjs --open`.
- `local/start.mjs` har en ny flagga `--open` som öppnar webbläsaren när modellen är laddad.
- README är uppdaterad.
**Varför:** Kollegan ville inte ladda ner och packa upp filerna för hand.
**Testat:** `node --check local/start.mjs` går igenom. PowerShell-skriptet är inte testat: containern har ingen PowerShell. Kollegan kör det först på sin dator. Modellens adress svarade 200 (2 740 937 888 byte).
**Rättat efter kollegans första körning:** `releases/latest` gav llama.cpp v1.0.0, som bara innehåller källkod. Programfilerna ligger i de dagliga versionerna `bNNNN`, som är märkta som förhandsversioner. Skriptet letar nu bland de 20 senaste versionerna efter `llama-*-bin-win-cpu-x64.zip` (till exempel `llama-b12631-bin-win-cpu-x64.zip`).
**Kvar att göra / att veta:** Om filen ändå inte hittas säger skriptet till och förklarar hur man hämtar den för hand.

## 2026-11-22 – Testerna fungerar på Windows
**Gren:** `claude/festive-hawking-4e5e5s` · **Av:** Claude-session på uppdrag av kollegan
**Vad:**
- `test/run.mjs` buntar Anthropic-SDK:n med esbuilds JavaScript-gränssnitt i stället för `execFileSync(node_modules/.bin/esbuild)`. På Windows heter filen `esbuild.cmd`, så det gamla anropet gav `ENOENT`.
- README beskriver hur Playwright installeras på en egen dator.
**Varför:** Kollegan körde `node run.mjs lokal` i PowerShell och fick felet `spawnSync ... esbuild ENOENT`.
**Testat:** Hela sviten går igenom i Linux-containern, med den buntade SDK:n byggd på nytt. Ingen körning är gjord på Windows än: kollegan kör om.
**Kvar att göra / att veta:** `playwright` finns inte i `test/package.json`, eftersom containern har en egen förinstallerad version.

## 2026-11-22 – Lokal AI: första arbetsdagen (nätverksgräns, rena utdrag, strikt citatkontroll)
**Gren:** `claude/festive-hawking-4e5e5s` · **Av:** Claude-session och Codex på uppdrag av kollegan
**Vad:** Punkterna 1–3 i beslutet i `local/granskning-2026-11-22.md` är genomförda.
1. Nätverksgräns, `src/js/00-standalone.js` och `10-app.js`:
   - Lokalt läge (`local.intended`) gäller när sidan serveras från loopback, eller när `lotsa:localAi` är `http://127.0.0.1` eller `http://[::1]`. Andra adresser ignoreras.
   - I lokalt läge används aldrig molnklienten, inte ens med en sparad nyckel och en server som inte svarar. Då ges felet `local_offline`.
   - Taligenkänningen är avstängd i lokalt läge.
   - Båda lokala anropen har `redirect: 'error'`.
   - `applyKey` använder `STANDALONE.activeSample()`.
2. Rena utdragsflöden, `src/js/04-ai.js` och `05-ui.js`:
   - `codeEvidence`, uppgraderingen saknas→besvarad och strömningen är borttagna.
   - `askLocal` visar bara manualens egen text: hela utdraget, med citatet markerat (`excerptTpl`).
   - saknas och avvisad ger fasta texter. Modellens svar, `mt_orsak` och `kontakta_mt` visas inte.
   - Motsägelser, ogiltig eller avbruten JSON och belägg som inte stämmer ger reservläget.
   - `localSample.json` kräver `finish_reason: 'stop'` och strikt `JSON.parse`. Felkoden `local_error` har en fast text.
   - Larm: ingen AI-tolkning i lokalt läge. `alarmsOf()` döljer AI-tolkade larmposter som inte är granskade (uppslag, register, chips, nattläge).
   - "Steg för steg" och delvis-rutan döljs för utdragssvar.
3. Strikt citatkontroll, `strictSpan` i `src/js/03-text.js`:
   - Citatet måste vara ett sammanhängande spann med ordgräns i båda ändar.
   - Bara blanksteg, citattecken och bindestreck jämnas ut. Skiftläge, siffror, decimaler, minustecken och skiljetecken måste stämma exakt.
   - Citatet måste ligga inom det valda utdraget. Ordgränserna kontrolleras mot hela sidan.
   - `chunksOf` sparar utdragens start och slut på sidan och kapar bara vid radbrytning eller blanksteg.
   - Prompten säger nu att skiftläget ska kopieras exakt.

Nya tester i `test/run.mjs`:
- `lokal-strikt`: MR-negationen, decimalen, saknas med belägg, avvisad och ett korrekt citat.
- `lokal-avbruten`: fyra fall av avbruten eller omgiven JSON.
- `lokal-enhet`: mA/MA, minustecken, sluttecken och kapning mitt i 1,5.
- `lokal-nere`: sparad nyckel med en server som inte svarar, och en extern adress.
- `lokal` har en markör som kontrollerar att modellens fritext aldrig hamnar i sidan.

README beskriver lokalt läge och hur det testas.
**Varför:** Beslutet efter Codex granskning. Den lokala AI:n fick inte användas i en pilot innan detta var åtgärdat.
**Testat:**
- Hela Playwright-sviten går igenom.
- Codex granskade diffen fyra gånger (read-only), se `local/granskning-2026-11-22.md`. Codex godkände till slut punkterna 1–3 utan kvarvarande blockerande fel.
- En kort körning med den riktiga modellen, Qwen3.5-4B Q4_K_M på 4 vCPU: 7 av 7 frågor rätt (f01, f03, f05, f13, f14, f17, v05). Alla citat klarade den strikta kontrollen, och den kliniska frågan avböjdes. Svarstiden var 31–107 s. Se `local/resultat/eval-dag1-urval-Qwen3.5-4B-Q4_K_M.md`. Ingen hel körning av alla 30 frågor är gjord.
**Kvar att göra / att veta:**
- Med strikt kontroll och fast skiftläge kan fler svar hamna i reservläget än förut. Den frysta baslinjen 25/30 gäller det gamla flödet.
- I lokalt läge anropar `generateCard`, metadataläsningen och `expandQuery` fortfarande modellen. Snabbkort blir utkast som måste granskas.
- Modellen skriver fortfarande fältet `svar`, som kostar tid men inte visas.
- Fas 1 återstår: ID-flöde, en klinisk regelspärr före modellen och larmvägen, ett separat skrivbordsbygge och paketerade bibliotek.
- Den gamla varningen gäller fortfarande för en pilot: inte förrän fas 1 och en ny utvärdering är klara.

## 2026-11-22 – Codex granskade den lokala AI:n: två allvarliga fel och ett gemensamt beslut
**Gren:** `claude/festive-hawking-4e5e5s` · **Av:** Claude-session och Codex på uppdrag av kollegan
**Vad:** Ny fil `local/granskning-2026-11-22.md` med Codex granskning, diskussionen och beslutet. Ingen kod är ändrad än.
**Varför:** Kollegan bad om en oberoende granskning.
**Testat:** Claude bekräftade med egna körningar att `verifyQuote` godkänner "15 meter" mot "1,5 meter" och att `codeEvidence` kan ge ett svar som säger motsatsen till manualen ("får inte" → "får") ett godkänt citat, eftersom "inte" och "får" är stoppord i `terms()`.
**Kvar att göra / att veta:** **Till alla: den lokala AI:n i `src/js/04-ai.js` får inte användas i en pilot förrän punkterna 1–3 i beslutet är åtgärdade.** (Åtgärdat, se posten "Lokal AI: första arbetsdagen".) Prioritet: stäng molnåterfall och extern serveradress i lokalt läge, ta bort `codeEvidence` och visning av strömmad modelltext, och inför strikt spannkontroll med regressionstest.

## 2026-11-22 – Lokal AI: rättad status och belägg som koden hittar
**Gren:** `claude/festive-hawking-4e5e5s` · **Av:** Claude-session på uppdrag av kollegan
**Vad:**
- Första utvärderingen med Qwen3.5-4B (`local/resultat/eval-molnserver-4vcpu-Qwen3.5-4B-Q4_K_M.md`, före rättningen): 25/30. Alla 3 kliniska frågor avböjdes, alla 5 obesvarbara fick "står inte i manualen", 20/20 citat var ordagranna. Fyra fel var rätt svar med fel status ("saknas") och tomma belägg, ofta på nej-svar som "får inte användas i MR-miljö".
- `src/js/04-ai.js`: tydligare regel om när "saknas" får användas. Ny `codeEvidence()`: om modellen svarar men inte ger belägg letar koden upp den mening i underlaget som bäst täcker svaret och använder den som citat (minst halva överlappet, annars visas svaret som okontrollerat). Ett svar som inte börjar med "Det står inte i manualen" får inte status "saknas". `askLocal` returnerar också vilka sidor som skickades (`underlag`), och `local/eval.mjs` skriver ut dem.
- `local/testset/fragor-v0.json`: vidgade nyckelord för v03 och v04, där svaren var rätt men använde andra ord ("ta bort från användning", "mjuk kläde"). Det är en ändring av testmängden, inte av appen.
**Varför:** Fas 0: förbättra träffsäkerheten med en liten modell.
**Testat:** Testet `lokal` går igenom. De fem felfrågorna kördes om: tre blev rätt av kodändringen, två av de vidgade nyckelorden. En ny hel körning pågår.
**Kvar att göra / att veta:** "mjuk kläde" visar att översättningen från engelska är klumpig med 4B-modellen. Svarstiden är fortfarande 25–115 s på den här datorn.

## 2026-11-22 – Fas 0: prototyp med lokal AI (llama.cpp)
**Gren:** `claude/festive-hawking-4e5e5s` · **Av:** Claude-session på uppdrag av kollegan
**Vad:**
- `src/js/00-standalone.js`: nytt lokalt AI-läge. Om appen serveras från 127.0.0.1 av llama-server (eller `localStorage["lotsa:localAi"]` pekar på en sådan) går alla AI-anrop till `/v1/chat/completions` där, med strömning, JSON-schema, låg temperatur och tänkläget avstängt. Bilder stöds inte (ingen OCR lokalt än).
- `src/js/04-ai.js`: `askLocal()` med "extrahera först": manualerna delas i stycken (`chunksOf`), de bästa styckena väljs med BM25 upp till `LOCAL_BUDGET` = 6000 tecken, och schemat tvingar modellen att först skriva belägg (`utdrag`-id + ordagrant citat) och sedan svaret. Beläggen görs om till vanliga källor och kontrolleras med `verifyQuote` som förut. Nya felkoder `local_offline` och `local_loading`. Med `?eval=1` exponeras `window.__lotsaEval` för utvärderingsskriptet.
- `src/js/07-admin.js`, `10-app.js`, `08-files.js`: ingen nyckelbanner i lokalt läge, Inställningar visar lokal modell, OCR-knappen döljs lokalt.
- Ny mapp `local/`: `start.mjs` (startar llama-server som också serverar `dist/`), `bench.mjs` (hastighetsmätning), `eval.mjs` (kör testmängden via appens frågeflöde), `testset/fragor-v0.json` (30 frågor om exempelmanualerna: 21 besvarbara, 6 obesvarbara, 3 kliniska som ska avböjas), `resultat/`.
- `test/run.mjs`: nytt test `lokal` mot en simulerad llama-server.
**Varför:** Fas 0 i `reports/Lotsa lokal AI fullständig plan.md`: visa att tekniken håller på vanlig hårdvara.
**Testat:** Alla 19 Playwright-tester gick igenom. Riktig körning med llama.cpp (byggd från källkod) och Qwen3.5-4B Q4_K_M på en molnserver med 4 vCPU och 16 GB: se `local/resultat/bench-molnserver-4vcpu-Qwen3.5-4B-Q4_K_M.md`. Inläsning 62–85 tokens/s, generering bara 5–7 tokens/s, alltså 45–130 s per svar. Utvärderingen av testmängden pågår och läggs till i en senare commit.
**Kvar att göra / att veta:** Genereringen är flaskhalsen på svag hårdvara. Nästa steg: kortare svar, Qwen3.5-2B och Gemma-4-E4B, och mätning på riktiga sjukhusdatorer. Appen hämtar fortfarande pdf.js, jsPDF och QR-bibliotek från CDN, som måste paketeras in för riktig offline-drift. Ingen Tauri-paketering än (fas 1).

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
