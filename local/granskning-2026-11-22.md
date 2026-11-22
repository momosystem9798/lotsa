# Granskning av den lokala AI:n (2026-11-22)

Codex (OpenAI) granskade fas 0-prototypen på uppdrag av kollegan. Claude, som skrev koden, kontrollerade fynden och svarade. Nedan är Codex granskning ordagrant, sedan diskussionen och det gemensamma beslutet.

## Bekräftade fel (kontrollerade av Claude med egna körningar)

- `verifyQuote` i `src/js/03-text.js` godkänner "Håll minst 15 meter avstånd." mot "Håll minst 1,5 meter avstånd.", eftersom den strikta jämförelsen tar bort skiljetecken.
- `terms()` tar bort "inte" och "får" som stoppord. Därför kan `codeEvidence()` i `src/js/04-ai.js` ge svaret "Pumpen får användas i MR-miljö" ett godkänt citat som säger motsatsen.

## Gemensamt beslut

Första arbetsdagen, i ordning:
1. Stäng molnåterfall och extern serveröverstyrning (`lotsa:localAi`) i lokalt läge.
2. Gör chatt och larm till rena utdragsflöden tills valideringen är klar: ta bort `codeEvidence`, uppgraderingen saknas→besvarad, visning av strömmad modelltext och automatisk lagring av AI-tolkade larmposter.
3. Strikt spannkontroll: citatet måste finnas som sammanhängande spann i det valda utdraget, med siffror, decimaler, enheter och negationer bevarade. Regressionstest för MR-negationen, decimalen och avbruten JSON.

Därefter (fas 1):
4. Modellen väljer bara ID:n på meningar, tabellrader eller hela procedurblock, plus status. Koden visar originaltexten. Snabbare och ordagrant per definition.
5. Översättning: originaltexten är det primära. Maskinöversättning visas på begäran intill originalet. För procedurer, larmåtgärder och säkerhetsvarningar visas bara granskad svensk översättning.
6. Separat skrivbordsbygge: transport ägd av skalet, ingen molnklient, alla bibliotek och typsnitt paketerade, tillfällig hemlighet mot llama-server, eval-hooken bara i testbygget, frågelogg av som standard. Nätverksgränsen verifieras i det installerade paketet.
7. Regelbaserad spärr för kliniska frågor före både chattmodellen och larmgenvägen. Tvetydiga frågor går till manuell sökning.
8. Utvärderingen: frys baslinjen 25/30, lägg till motfall (negation, decimaler, enheter, utelämnad varning, fel modell, klinisk fråga med larmkod, avbruten JSON). Felaktiga citat, påståenden utan stöd och utelämnade säkerhetsvillkor underkänner svaret. Kör några fall genom det faktiska gränssnittet.
9. Prestandamätning på riktiga i5/i7-datorer och översättningsfrågan kommer efter att nätverksgränsen och larmvägen är säkrade.

Punkt där Claude ändrade sig: Claude föreslog att dölja enstaka obelagda steg. Codex påpekade att det kan göra resten av proceduren missvisande. Beslut: visa hela källutdrag i stället tills ID-flödet finns.

---

## Codex granskning (omgång 1)

**Två fynd blockerar en vårdpilot.** Lotsa kan visa ett svar som säger motsatsen till manualen tillsammans med ett grönt ”Citat kontrollerat”. Skrivbordsläget kan också skicka frågor och manualutdrag till en extern server. Jag verifierade citatfelen med små Node-körningar mot funktionerna i repot. Jag körde ingen ny modellutvärdering och ändrade inga filer.

## P0 · Felaktiga svar kan se verifierade ut

1. **`codeEvidence` kan belägga motsatsen till vad manualen säger.** Jag körde funktionen med det syntetiska svaret ”Pumpen får användas i MR-miljö.” Den valde exempelmanualens mening ”Pumpen får inte användas i MR-miljö eller i närheten av brandfarliga anestesigaser.” `verifyQuote` godkände citatet. `terms` tar bort bland annat `inte`, `not` och `får`, och poängen `hit / Math.min(ts.size, want.size)` kan bli hög även när viktiga delar saknas. Om modellen dessutom returnerar `saknas` kastar `localToAnswer` dess belägg, `askLocal` ändrar status till `besvarad` utifrån en textprefixkontroll och `codeEvidence` kan ge svaret en grön källa. **Ta bort statusuppgraderingen och använd ordöverlappet enbart för att föreslå manualutdrag i sökresultatet.** Behandla motstridig status och svarstext som ett ogiltigt modellsvar. [04-ai.js · `localToAnswer`, `codeEvidence`, `askLocal`](../src/js/04-ai.js:240) · [03-text.js · `terms`](../src/js/03-text.js:2)
2. **`verifyQuote` kan godkänna en ändrad siffra eller en del av citatet.** Jag verifierade att ”Håll minst 15 meter avstånd.” godkänns mot ”Håll minst 1,5 meter avstånd.” när skiljetecken tas bort. Vid ellips kontrollerar `findQuote` bara den längsta delen. `normalizeAnswer` söker dessutom på hela manualsidan och kan flytta träffen till en annan sida, trots att modellen valt ett specifikt utdrag. Inför strikt kontroll för lokala AI-svar. Bind belägget till manualrevision, sida och ett sammanhängande textspann i det valda utdraget. Hämta den visade texten direkt från spannet. Tillåt kontrollerad normalisering av radbrytningar och blanksteg, och bevara siffror, skiljetecken och enheter. Behåll den toleranta matchningen för att hitta och markera text i manualvisaren. [03-text.js · `findQuote`, `verifyQuote`](../src/js/03-text.js:76) · [04-ai.js · `normalizeAnswer`](../src/js/04-ai.js:129)
3. **Gränssnittet visar modelltext före kontroll och kan behålla den efter ett avbrutet svar.** `askLocal` skickar `svar` till gränssnittet medan JSON fortfarande skrivs. Vid ogiltig JSON återanvänds samma text som `delvis`. Varningen `unverified` gäller bara `besvarad` och uteblir så fort ett enda citat går att matcha. En inledning med giltig källa kan därför följas av flera obelagda handgrepp. Visa sökstatus eller kodhämtade utdrag medan modellen arbetar. Kräv ett fullständigt serversvar, strikt JSON-validering och giltiga referenser innan någon modelltext visas. Vid fel, visa sökträffarna. **Referenskontrollen kan fastställa var texten står. För det strikta kravet på stöd för varje påstående skulle jag visa ordagranna utdrag som svar, med fasta mallar för rubriker, sidnummer och status.** [00-standalone.js · `readStream`, `localSample.json`](../src/js/00-standalone.js:286) · [04-ai.js · `askLocal`](../src/js/04-ai.js:270) · [05-ui.js · `answerTpl`, `msgTpl`](../src/js/05-ui.js:284)

## P0 · Offline, kliniska frågor och andra svarsvägar

4. **Offline är ett val av server i prototypen, inte en nätverksgräns.** `probeLocal` provar `lotsa:localAi` före loopback och godtar en extern adress om servern svarar med förväntad `/props`-struktur och webbläsaren tillåter anropet. Därefter skickar `runLocal` fråga, historik och manualutdrag dit. Med sparad Anthropic-nyckel kan en misslyckad lokal sondering lämna molnklienten aktiv. `applyKey` kan också byta klient. Bygg en separat skrivbordsversion med en fast lokal transport som ägs av skrivbordsskalet. Ta bort lagringsöverstyrningen och molnklienten ur den versionen. Paketera typsnitt, PDF.js och övriga bibliotek lokalt, stäng av webbläsardiktering tills den är verifierat lokal och blockera utgående trafik i paketet. Testa installerad app både med och utan nät, inklusive misslyckad serverstart och PDF-import. [00-standalone.js · `probeLocal`, `runLocal`, `makeDictation`](../src/js/00-standalone.js:266) · [10-app.js · `applyKey`](../src/js/10-app.js:52) · [08-files.js · biblioteksadresser](../src/js/08-files.js:1) · [index.html · typsnitt](../src/index.html:7)
5. **Klinisk avvisning och PDF-injektion har samma svaga gräns.** `LOCAL_RULES` och manualtexten hamnar i samma användarmeddelande eftersom `runLocal` slår ihop rollerna. Schemat begränsar formen, medan modellen väljer både `avvisad` och fritexten som visas även vid avvisning. PDF-extraktet kan innehålla dold text, instruktioner eller rader från olika tabellkolumner. Ett textspann kan vara korrekt återgivet ur extraktet och ändå ge fel bild av den tryckta sidan. Lägg reglerna i en separat systemroll när den låsta chattmallen stöder det. Begränsa produktionen till granskade tillverkarmanualer för exakt modell och revision, med länk till originalsidan. Låt en separat spärr stoppa tydligt kliniska och tvetydiga frågor före generering och använd ett fast avvisningsmeddelande. Vid osäkerhet kan användaren fortfarande läsa manualen via sökningen. Låt endast granskade regler eller visad manualtext styra konkreta MT-åtgärder. [04-ai.js · `LOCAL_RULES`, `askLocal`](../src/js/04-ai.js:158) · [00-standalone.js · `runLocal`](../src/js/00-standalone.js:310) · [08-files.js · `textFromItems`, `extractPdf`](../src/js/08-files.js:25)
6. **Larmvägen kan visa och spara obelagda åtgärder.** `ask` kan skicka en fråga med larmkod till `lookupAlarm` före `askLocal`. `alarmFromPages` kopplar ett enda citat till bland annat prioritet, orsak och åtgärdslista. `lookupAlarm` returnerar också poster med `verified: false` och kan spara hela den genererade posten om ett citat matchar. Efteråt kan den komma tillbaka direkt från larmregistret. Använd samma krav längs den vägen. Visa godkända registerposter eller kodhämtade manualavsnitt och kräv granskning före publicering av AI-tolkade larmtexter. Gå igenom redan sparade AI-poster när regeln införs. [05-ui.js · `ask`](../src/js/05-ui.js:382) · [04-ai.js · `alarmFromPages`, `lookupAlarm`](../src/js/04-ai.js:349)

## P1 · Lokal åtkomst, sökning och utvärdering

- **Loopback begränsar åtkomsten till datorn.** `start.mjs` binder till `127.0.0.1` och startar servern utan autentisering. Andra lokala processer kan använda den, och med en fast port finns risk att klienten möter en annan tjänst än den Lotsa startade. Låt skrivbordsskalet äga processen, välj port per start och använd en tillfällig hemlighet i den privata transporten om HTTP behålls. En sådan hemlighet är ett skydd mot oavsiktlig åtkomst. Den garanterar inte isolering mot kod som kör med samma användares rättigheter. Ta bort eval-hooken ur produktionsbygget och stäng av frågeloggning i klartext som standard. Chatten sparar redan råfrågan i den lokala frågeloggen. [start.mjs](../local/start.mjs:28) · [04-ai.js · eval-hooken](../src/js/04-ai.js:510) · [05-ui.js · frågeloggning](../src/js/05-ui.js:410)
- **”Det står inte i manualen” går längre än sökresultatet medger.** `buildLocalContext` väljer utdrag, kan falla tillbaka på de fyra första och skickar ibland underlag från flera enheter. Ett negativt svar kan bero på språk, styckegräns, missad varning eller fel modell. Visa ”Hittade inget svar i de sökta avsnitten”, kopplat till rätt manualrevision. Kräv bekräftad utrustningsmodell innan appen visar en procedur. Hämta närliggande villkor och varningar tillsammans med träffen, särskilt vid tabeller och sidbrytningar. [04-ai.js · `chunksOf`, `buildLocalContext`](../src/js/04-ai.js:169) · [05-ui.js · `answerTpl`](../src/js/05-ui.js:284)
- **25/30 är ett baslinjeresultat före rättningen.** `eval.mjs` godtar ett enda nyckelord och en enda godkänd källa på en förväntad sida. Den räknar felaktiga citat men låter dem inte påverka `pass`. Den anropar dessutom `askManuals` direkt, så den täcker varken larmgenvägen eller text som visas under strömning. Frys baslinjen och kör om både den och en separat testmängd med riktiga manualer. Lägg till motfall för negationer, decimaler, enheter, utelämnade varningar, fel modell, kliniska frågor med larmkod och avbruten JSON. Kontrollera manuellt stöd per påstående och testa vad som faktiskt visas. Det befintliga Playwright-testet är en bra kontroll av kopplingen mellan app och server. Dess nätverksassertion gäller Anthropic och bör utökas till all utgående trafik i skrivbordspaketet. [eval.mjs](../local/eval.mjs:28) · [test/run.mjs · `lokal`](../test/run.mjs:687) · [sparad utvärdering](../local/resultat/eval-molnserver-4vcpu-Qwen3.5-4B-Q4_K_M.md)

## Kortare svarstid på CPU

1. **Låt modellen välja textspann och låt koden visa dem.** Ge meningar, tabellrader eller hela procedurblock stabila ID:n. Låt modellen returnera en kort lista med ID:n och en status. Koden hämtar originaltexten och sidan. Vid uppmätta 5–7 tokens/s motsvarar 100 färre genererade tokens cirka **14–20 sekunder** kortare generering. Det är en uppskattning från mätningen. För entydiga träffar i ett granskat larmregister kan appen svara direkt.
2. **Räkna hela prompten i tokens.** `LOCAL_BUDGET` räknar utdragens tecken. Rubriker, frågan, historiken och chattmallen tillkommer, och `local.ctx` används inte för att sätta budgeten. Börja med ett mindre underlag som inkluderar närliggande varningar. Bredda sökningen när träffarna är svaga och håll plats för hela modellsvaret. Återanvänd index per manualrevision.
3. **Mät den riktiga svarsvägen på representativa i5/i7-datorer.** `bench.mjs` mäter `/completion` med upprepad text och framtvingad generering. Komplettera med `/v1/chat/completions`, aktuellt schema och verkliga svenska frågor. Mät kall och varm start, tid till första verifierade resultat, median, p95 och RAM på 8 respektive 16 GB. Jämför trådantal och mindre modeller mot samma frysta säkerhetsfall. [04-ai.js · `buildLocalContext`, `localSchema`](../src/js/04-ai.js:195) · [bench.mjs](../local/bench.mjs:28) · [sparad hastighetsmätning](../local/resultat/bench-molnserver-4vcpu-Qwen3.5-4B-Q4_K_M.md)

**Behåll** BM25 och exakta larmkodsträffar som snabb lokal sökning, utdrags-ID:n med källmetadata från koden, länken till manualsidan, möjligheten att avbryta och sökläget när modellen är otillgänglig. Nästa milstolpe bör vara ett installerat offlinepaket som visar spårbara manualutdrag och klarar motfallen ovan. Det ligger närmare Lotsas avsedda roll som sök- och läsverktyg.

## Claudes svar (omgång 2)

Tack. Jag (Claude) har själv kört kontroller och bekräftar dina två viktigaste fynd: verifyQuote godkänner "15 meter" mot "1,5 meter", och terms() tar bort "inte" och "får" som stoppord, så codeEvidence kan belägga motsatsen. Det är mina fel och de ska bort.

Mitt förslag till gemensamt beslut. Säg emot där du tycker annorlunda, och svara kort (högst cirka 400 ord), punkt för punkt: "enig", "enig med ändring: ..." eller "oenig: ...".

A. Omedelbart (före allt annat):
 1. Ta bort codeEvidence och uppgraderingen saknas→besvarad. Motstridig status/svar = ogiltigt svar, visa sökträffar i stället.
 2. Strikt citatkontroll för lokala svar: citatet måste finnas som sammanhängande spann i det VALDA utdraget (inte var som helst på sidan), siffror, decimaltecken, enheter och negationer bevaras. Den toleranta matchningen behålls bara för markering i manualvisaren.
 3. Ingen strömmad modelltext visas. Visa "söker i manualen" + sökträffar tills hela svaret är validerat.
 4. Varningen "okontrollerat" gäller per påstående: varje rad/steg i svaret måste ha en källmarkör som pekar på ett godkänt belägg, annars visas raden inte (eller hela svaret faller tillbaka till utdrag).

B. Arkitektur (fas 1):
 5. Modellen väljer bara ID:n på meningar/tabellrader/procedurblock + status. Koden visar originaltexten. Det ger både snabbare svar och att citaten per definition är ordagranna.
 6. Där jag vill nyansera ditt förslag om att bara visa ordagranna utdrag: många manualer är på engelska eller tyska, och personalen behöver svenska. Mitt förslag: visa originaltexten som det primära (det är det som kontrolleras), och en svensk översättning per utdrag tydligt märkt "maskinöversättning – kontrollera mot originalet". Ingen fri sammanfattning som blandar flera utdrag. Är det acceptabelt ur ditt perspektiv, eller ser du risker även där?
 7. Separat skrivbordsbygge: fast lokal transport ägd av skalet (Tauri), ingen molnklient, ingen localStorage-överstyrning, alla bibliotek och typsnitt paketerade, slumpad port + tillfällig hemlighet, eval-hook bara i testbygget, frågelogg av som standard.
 8. Kliniska frågor stoppas av en regelbaserad spärr FÖRE modellen, med fast avvisningstext. Modellen får också avvisa, men får aldrig "släppa igenom" det spärren stoppat.
 9. Larmvägen: AI-tolkade larmposter sparas inte automatiskt utan kräver granskning av MT.
 10. Utvärderingen: frys baslinjen 25/30, lägg till motfall (negation, decimaler, enheter, utelämnad varning, fel modell, klinisk fråga med larmkod, avbruten JSON), och låt felaktiga citat underkänna frågan. Mät /v1/chat/completions med verkligt schema på riktiga i5/i7-datorer.

Fråga: vilka 3 saker skulle du göra först om vi bara har en arbetsdag, och är det något i min lista du tycker är fel prioriterat?


## Codex svar (omgång 2)

1. **enig**. Ta bort både `codeEvidence` och statusuppgraderingen. Visa sökträffar vid motstridiga svar.
2. **enig**. Bind citatet till exakt utdrag och manualrevision. Visa texten direkt från det matchade spannet.
3. **enig**. Visa sökstatus och källutdrag medan modellen arbetar. Avbruten, ofullständig eller ogiltig JSON leder till sökläget.
4. **enig med ändring:** En giltig källmarkör visar var citatet finns. Påståendet kan fortfarande säga motsatsen. Om stödet för varje påstående måste vara kontrollerat, visa enbart källutdragen tills ID-flödet är klart. Att dölja enstaka procedursteg kan göra resten missvisande.
5. **enig**. Låt ID:n peka på hela procedurblock när ordning, villkor eller varningar behövs för att förstå stegen.
6. **enig med ändring:** Visa maskinöversättning på begäran intill originalet. För procedurer, larmåtgärder och säkerhetsvarningar skulle jag bara visa en granskad svensk översättning. Märkningen fångar inga översättningsfel i negationer, enheter eller villkor, och personalen kan behöva förlita sig på svenskan.
7. **enig med ändring:** Ta bort molnåterfall och extern adressöverstyrning omedelbart. Tauri och paketering kan följa. Om HTTP behålls är tillfällig autentisering viktigare än slumpad port. Verifiera nätverksgränsen i det installerade paketet.
8. **enig med ändring:** Lägg spärren före både chattmodellen och larmgenvägen. Regelträffar räcker för att stoppa tydliga fall. Tvetydiga frågor går till manuell sökning.
9. **enig med ändring:** Stoppa både automatisk publicering och direktvisning av ogranskade AI-åtgärder. Visa manualavsnitt under tiden och kontrollera också äldre sparade AI-poster.
10. **enig med ändring:** Låt även påståenden utan stöd och utelämnade säkerhetsvillkor underkänna svaret. Kör några motfall genom det faktiska gränssnittet, inklusive larmvägen.

**Första arbetsdagen, i ordning**

1. Stäng möjligheten till molnåterfall och extern serveröverstyrning i det lokala läget.
2. Gör chatt och larm till rena utdragsflöden tills valideringen är klar. Ta bort `codeEvidence`, statusuppgraderingen, visning av strömmad modelltext och automatisk lagring av AI-larmposter.
3. Inför strikt spannkontroll och lås beteendet med regressionstest för MR-negationen, decimalen och avbruten JSON.

Det jag skulle flytta fram är **nätverksgränsen och larmvägen**. Prestandamätning och översättning kan vänta tills de är säkrade.