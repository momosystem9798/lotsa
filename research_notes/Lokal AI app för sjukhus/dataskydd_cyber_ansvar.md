# Rättsliga krav utöver MDR och AI-förordningen: dataskydd, cybersäkerhet, ansvar, tillgänglighet m.m. för "Lotsa" (offline-app till regioner), läge november 2026

Om källorna: lagen.nu, data.riksdagen.se, eur-lex.europa.eu och springlex.eu gick inte att nå från den här sessionen (nätverksspärr). Påståenden om lagtext bygger därför på sökträffarnas utdrag från de primära källorna och på advokatbyråers och myndigheters sammanfattningar. Punkter märkta **[ej verifierad i sessionen]** bygger på välkänd lagtext som inte kunde hämtas och citeras ordagrant. Kontrollera dem innan de används i avtal eller marknadsföring. Allt nedan gäller under förutsättningen att Lotsa *inte* är en medicinteknisk produkt enligt MDR (den frågan utreds separat). Blir den det ändras CRA-bedömningen, se avsnitt 4.

## 1. GDPR och svensk dataskyddsrätt: behandlas personuppgifter, och vem ansvarar?

### Takeaway
Ja. Användarnamn och frågeloggar är personuppgifter om personalen, och patientuppgifter som av misstag skrivs in i en fråga blir uppgifter om hälsa (känsliga personuppgifter). Regionen är personuppgiftsansvarig. Leverantören blir **inte** personuppgiftsbiträde så länge appen körs helt lokalt och leverantören aldrig kommer åt data. Leverantören blir biträde så fort den får åtkomst, t.ex. vid support, fjärrhjälp eller felsökning med loggfiler. Då krävs ett biträdesavtal enligt art. 28.

### Cited Findings
- IMY:s rapport om ansvarsroller vid finjustering av AI-applikationer: en leverantör får normalt ingen roll enligt GDPR bara genom att sälja, hyra ut, leverera eller installera hårdvara. Om leverantören flyttar kundens databaser, användarkonton eller loggar till en ny servermiljö kan den däremot behandla personuppgifter för kundens räkning och då vara personuppgiftsbiträde. — [IMY, Ansvarsroller enligt GDPR vid finjustering av AI-applikationer](https://www.imy.se/globalassets/dokument/rapporter/ansvarsroller-enligt-gdpr-vid-finjustering-av-ai-applikationer.pdf)
- Region Skånes stöd för biträdesavtal: en leverantör som får tillgång till personuppgifter vid support, utveckling och underhåll är biträde, och då behöver ett personuppgiftsbiträdesavtal tecknas. — [Region Skåne, PUB-avtal information och stöd](https://vardgivare.skane.se/siteassets/2.-patientadministration/journalhantering-och-registrering/informationssakerhet/personuppgiftsbitradesavtal---fillistning/pub-avtal_information_och_stod.pdf)
- IMY:s frågeformulär för molntjänster frågar om det finns ett avtal enligt art. 28.3 när leverantören är biträde. Formuläret visar vad offentliga kunder brukar efterfråga. — [IMY, frågeformulär molntjänster](https://www.imy.se/globalassets/dokument/ovrigt/frageformular-molntjanster.pdf)
- GDPR art. 4.1 (personuppgift), art. 9 (uppgifter om hälsa), art. 25 (inbyggt dataskydd), art. 28 (biträde), art. 30 (register), art. 32 (säkerhet) och art. 35 (konsekvensbedömning, DPIA) **[ej verifierad i sessionen]** — [GDPR, EUR-Lex 2016/679](https://eur-lex.europa.eu/eli/reg/2016/679/oj)

### Inferences
- **Regionen (personuppgiftsansvarig):** ska ha rättslig grund för loggning av personalens frågor (sannolikt allmänt intresse eller myndighetsutövning, eller arbetsgivarens berättigade behov, som dock inte kan användas av myndigheter i myndighetsutövningen), informera personalen, föra registerförteckning och bedöma om en DPIA krävs. En DPIA är sannolikt motiverad. Skälen är att det är ny teknik (AI), att det finns risk att hälsouppgifter matas in och att loggarna kan användas för att följa upp anställda. Regioner gör i praktiken DPIA för nya AI-verktyg.
- **Leverantören (Lotsa AB):** är inte biträde så länge den saknar åtkomst. Det bör dokumenteras i avtalet: "leverantören behandlar inga personuppgifter för kundens räkning". Leverantören bör ändå tillhandahålla underlag för regionens DPIA (dataflöden, var loggar lagras, lagringstider, raderingsfunktion) och bygga in dataskydd (art. 25):
  - loggning ska kunna stängas av eller vara pseudonymiserad, med konfigurerbar gallring
  - varning eller filter för personnummer i frågefältet
  - ingen telemetri
  - lokal kryptering av loggar.
- **När blir leverantören biträde?** När supporten innebär att regionen skickar loggfiler, att leverantören fjärrstyr skrivbordet eller att den får databasdumpar. Ett färdigt biträdesavtal bör därför finnas som option, och supportrutiner som undviker åtkomst (regionen exporterar själv anonymiserade felrapporter) minskar behovet.
- Att appen säger "skriv inte patientuppgifter" är en organisatorisk åtgärd. Den tar inte bort risken, så DPIA:n måste ändå hantera scenariot.

### Gaps
- Inget IMY-ställningstagande hittades som uttryckligen gäller lokalt installerad programvara där leverantören saknar åtkomst. Slutsatsen är en analogi från IMY:s AI-rapport och Region Skånes stöd.
- Ingen IMY-vägledning om DPIA-listan (förteckning enligt art. 35.4) hämtades. IMY:s lista över behandlingar som kräver DPIA bör kontrolleras på imy.se.

## 2. Patientdatalagen (2008:355) och HSLF-FS 2016:40: när blir Lotsa en del av vårdens informationssystem?

### Takeaway
Lotsa är avsett att behandla bruksanvisningar och inte patientuppgifter, och är då inte ett journalsystem och omfattas inte av PDL:s krav på behörighetsstyrning och logguppföljning. Skrivs patientuppgifter in i frågor och sparas i loggar kan dock regionen hamna i en situation där PDL:s säkerhetskrav, och sekretess enligt OSL 25 kap., gäller loggarna. Bästa skyddet är att designa bort lagring av fritext, eller ge den kort gallring och åtkomstskydd.

### Cited Findings
- Vårdgivaren ska tilldela varje användare individuell behörighet för åtkomst till personuppgifter, och beslutet ska föregås av en behovs- och riskanalys (4 kap. 2 § PDL och 4 kap. 2 § HSLF-FS 2016:40). — [IMY, beslut Södersjukhuset](https://www.imy.se/globalassets/dokument/beslut/2017-06-20-beslut-sodersjukhuset.pdf); [Region Skåne, patientuppgifter](https://vardgivare.skane.se/siteassets/3.-kompetens-och-utveckling/vfu/etjanstekort---fillistning/patientuppgifter.pdf)
- Reglerna om kontroll av åtkomst till patientuppgifter finns i 4 kap. 9 § HSLF-FS 2016:40. IMY kopplar dem till 4 kap. 3 § PDL om systematisk och återkommande kontroll av åtkomst. IMY har kritiserat loggar som inte visar vilka åtgärder som vidtagits med en patients uppgifter. — [IMY, Vårdgivares skydd för patientuppgifter](https://www.imy.se/en/verksamhet/data-protection/data-protection-within-different-areas/vard/vardgivares-skydd-for-patientuppgifter/); [IMY, beslut Sahlgrenska DI-2019-3840](https://www.imy.se/globalassets/dokument/beslut/beslut-tillsyn-sahlgrenska-universitetssjukhuset-di-2019-3840.pdf)
- Uppföljning av behörigheter regleras i 4 kap. 2 b § HSLF-FS (enligt Socialstyrelsens ändringsföreskrift 2025). Genom HSLF-FS 2025:57 upphävdes 4 kap. 6 §. — [Socialstyrelsen 2025-10-9825](https://www.socialstyrelsen.se/contentassets/b9a1be491b0244339c63b2ae41609dab/2025-10-9825.pdf); [Socialstyrelsen 2025-10-9830](https://www.socialstyrelsen.se/contentassets/387350f793154a38821222a4952732e6/2025-10-9830.pdf)
- Konsoliderad HSLF-FS 2016:40 (för kontroll av aktuell lydelse) — [Socialstyrelsen, HSLF-FS 2016:40 konsoliderad](https://socialstyrelsen.se/kunskapsstod-och-regler/regler-och-riktlinjer/foreskrifter-och-allmanna-rad/konsoliderade-foreskrifter/201640-om-journalforing-och-behandling-av-personuppgifter-i-halso--och-sjukvarden/)

### Inferences
- PDL gäller "vårdgivares behandling av personuppgifter i hälso- och sjukvården". Om Lotsa systematiskt användes för att hantera uppgifter om enskilda patienter skulle det vara ett system som omfattas, med krav på individuell behörighet, åtkomstloggar och logguppföljning. Avsedd användning är att fråga om utrustning, så appen bör utformas så att den inte blir ett sådant system.
- Konkreta designåtgärder för leverantören:
  - användarinloggning knuten till regionens katalogtjänst (AD), om användarnamn ändå loggas
  - frågelogg avstängd som standard, eller med kort gallringstid
  - loggar läsbara endast av utsedd förvaltare
  - export för regionens egen granskning.
- PDL ställer inte krav direkt på leverantören. Regionen ställer kraven i upphandlingen, så leverantören bör kunna visa hur de kan uppfyllas.

### Gaps
- Ordagrann lydelse av 4 kap. 2, 3 och 9 §§ HSLF-FS och PDL kunde inte hämtas (lagen.nu och riksdagen.se var spärrade).
- Det hittades ingen vägledning om AI-assistenter utan patientdata i förhållande till PDL.

## 3. Offentlighets- och sekretesslagen: är frågeloggar allmänna handlingar? 10 kap. 2 a § OSL vid support

### Takeaway
Frågeloggar som sparas i regionens dator är sannolikt **allmänna handlingar** när de är tekniskt färdiga att ta emot poster. Det följer av praxis om automatiskt skapade loggar. Det betyder att de ska kunna lämnas ut efter sekretessprövning. Innehåller de patientuppgifter gäller hälso- och sjukvårdssekretess (25 kap. 1 § OSL). Regionen behöver då kunna söka i loggarna, sekretesspröva dem och gallra dem enligt sin informationshanteringsplan. 10 kap. 2 a § OSL (sedan 1 juli 2023) gör det möjligt att lämna sekretessbelagda uppgifter till en leverantör för *teknisk bearbetning eller lagring*. Det är relevant endast om leverantören vid support tar emot loggar eller databaser.

### Cited Findings
- JO har bedömt att en e-postlogg är en allmän handling (2 kap. 10 § andra stycket 1 TF). — [JO, Offentlighet och sekretess 2025](https://www.jo.se/app/uploads/2026/02/offentlighet-och-sekretess-2025.pdf)
- I RÅ 1998:44 behandlades en lista som e-postprogramvaran skapade automatiskt som allmän handling. Listan ansågs upprättad när den var tekniskt färdig att ta emot poster. I RÅ 1999:18 ansågs en cookie som bara lagrades i myndighetens egen dator inte vara allmän handling. — [RÅ 1998:44 (lagen.nu)](https://lagen.nu/dom/ra/1998:44); [RÅ 1999:18 (lagen.nu)](https://lagen.nu/dom/ra/1999:18)
- Att en handling är allmän betyder inte att den är offentlig. Den kan ändå omfattas av sekretess. — [JO, Offentlighet och sekretess 2025](https://www.jo.se/app/uploads/2026/02/offentlighet-och-sekretess-2025.pdf)
- 10 kap. 2 a § OSL "Teknisk bearbetning och teknisk lagring" infördes genom SFS 2023:335 och trädde i kraft den 1 juli 2023 (prop. 2022/23:97). Sekretess hindrar inte att uppgifter lämnas till en enskild för teknisk bearbetning eller lagring, men det får inte innebära ett otillåtet röjande. Enligt propositionen bör en krypterad uppgift som mottagaren inte kan ta del av inte anses röjd. — [SFS 2023:335](https://www.svenskforfattningssamling.se/sites/default/files/sfs/2023-06/SFS2023-335.pdf); [Prop. 2022/23:97](https://data.riksdagen.se/dokument/HA0397.html); [Lagrådsremiss: Sekretessgenombrott vid teknisk bearbetning eller lagring](https://regeringen.se/contentassets/946818572f3b4b488ccc3180eef5fb19/sekretessgenombrott-vid-teknisk-bearbetning-eller-lagring-av-uppgifter.pdf)

### Inferences
- **För regionen:**
  - loggarna ska ingå i informationshanteringsplanen, med gallringsbeslut och sökbarhet för utlämnande
  - regionen ska kunna sekretesspröva innehållet (25 kap. OSL för patientuppgifter).
- **För leverantören:** bygg export (CSV) och raderingsfunktion, så att regionen kan lämna ut, sekretesspröva och gallra.
- **Vid fjärrsupport eller överlämnade loggar:** 10 kap. 2 a § kan ge stöd för att regionen lämnar ut sekretessbelagd information för teknisk bearbetning. Regionen gör då en intresseavvägning, och leverantören behöver tystnadspliktsåtaganden i avtalet. Är leverantören ett privat bolag utan egen lagstadgad tystnadsplikt krävs avtalsreglerad sekretess. Det finns också en egen lagstiftning om tystnadsplikt vid utkontraktering av teknisk bearbetning (prop. 2016/17:198) **[ej verifierad i sessionen]**. Enklast är att undvika att leverantören någonsin tar emot loggar.
- Säljargument: att Lotsa är helt lokalt utan leverantörsåtkomst gör att frågor om utlämnande enligt OSL (10 kap. 2 a §) och tredjelandsöverföring inte uppstår alls.

### Gaps
- Det hittades ingen dom eller JO-beslut om AI-chattloggar specifikt.
- Exakt lydelse av 10 kap. 2 a § andra stycket (intresseavvägningen) kunde inte hämtas.

## 4. Cybersäkerhet: cybersäkerhetslagen (NIS2), säkerhetsskyddslagen och Cyber Resilience Act

### Takeaway
- **Cybersäkerhetslagen (2025:1506)** gäller sedan den 15 januari 2026. Den gäller **regionerna**, inte Lotsa AB direkt. Regionerna måste hantera säkerhet i leverantörskedjan och kommer därför att ställa säkerhetskrav på leverantören i avtal.
- **Säkerhetsskyddslagen** blir aktuell bara om regionens verksamhet där Lotsa används är säkerhetskänslig och leverantören kan få tillgång till säkerhetsklassificerade uppgifter. Det är osannolikt för ett offline-verktyg utan leverantörsåtkomst.
- **CRA (EU 2024/2847)** gäller sannolikt för Lotsa som kommersiell fristående programvara, om Lotsa inte är en MDR-produkt. Rapporteringsskyldigheten gäller redan sedan den 11 september 2026, och övriga krav samt CE-märkning gäller från den 11 december 2027.

### Cited Findings: cybersäkerhetslagen
- Cybersäkerhetslagen (2025:1506) och cybersäkerhetsförordningen (2025:1507) trädde i kraft den 15 januari 2026 och ersätter lagen (2018:1174) om informationssäkerhet för samhällsviktiga och digitala tjänster. — [Regeringen, pressmeddelande jan 2026](https://regeringen.se/pressmeddelanden/2026/01/nu-skarps-kraven-pa-svensk-cybersakerhet/); [Länsstyrelsen Uppsala, 2026-01-15](https://www.lansstyrelsen.se/uppsala/om-oss/nyheter-och-press/nyheter---uppsala/2026-01-15-skarpta-krav-pa-verksamhetsutovare-nar-ny-cybersakerhetslag-borjar-galla.html); [SFS 2025:1506](https://svenskforfattningssamling.se/sites/default/files/sfs/2025-12/SFS2025-1506.pdf)
- Kommuner och regioner omfattas. Sanktionsavgifter riktas enligt sekundärkälla i huvudsak mot privata aktörer. Länsstyrelser utses till tillsynsmyndighet för kommuner och regioner, t.ex. Länsstyrelsen i Östergötlands län för Jönköping, Kalmar och Östergötland. — [Cybersäkerhetsförordning 2025:1507 (riksdagen.se)](https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/cybersakerhetsforordning-20251507_sfs-2025-1507/); [Securityworldmarket (sekundär)](https://www.securityworldmarket.com/se/Om-Sakerhetsteknik/Regelverk-och-Compliance/Vad-ar-cybersakerhetslagen)
- Ansvaret omfattar leverantörers säkerhet. Lagen definierar incidenter i leverantörskedjan, alltså händelser hos leverantör eller underleverantör. — [Securityworldmarket (sekundär)](https://www.securityworldmarket.com/se/Om-Sakerhetsteknik/Regelverk-och-Compliance/Vad-ar-cybersakerhetslagen)
- Registrering hos tillsynsmyndigheten ska enligt sekundärkälla ske senast den 30 september 2026. — [tech-insider.org (sekundär, osäker)](https://tech-insider.org/sv/?p=143)
- MCF (tidigare MSB) har tagit fram föreskrifter om säkerhetsåtgärder och utbildning (konsekvensutredning MCF 2026-04554, MCFFS 2026:11). — [MCF, konsekvensutredning föreskrifter säkerhetsåtgärder och utbildning](https://www.mcf.se/contentassets/2f9334a18345476ebbd422be1f9d1218/mcf-2026-04554-konsekvensutredning-foreskrifter-sakerhetsatgarder-och-utbildning.pdf); [MCF, konsekvensutredning MCFFS 2026:11](https://www.mcf.se/contentassets/454a6128837946fe9e4d735e56964b84/konsekvensutredning-mcffs-2026-11.pdf)
- NIS2-direktivet art. 21.2 d kräver säkerhet i leverantörskedjan, och hälso- och sjukvårdsleverantörer är "väsentliga/höga kritikalitets"-sektorer i bilaga I **[ej verifierad i sessionen]** — [NIS2, EUR-Lex 2022/2555](https://eur-lex.europa.eu/eli/dir/2022/2555/oj)

### Cited Findings: säkerhetsskyddslagen (2018:585)
- Enligt 4 kap. 1 § ska en verksamhetsutövare som planerar en upphandling, ett avtal eller ett samarbete teckna ett säkerhetsskyddsavtal med motparten, om motparten kan få tillgång till säkerhetsklassificerade uppgifter i klassen konfidentiell eller högre, eller till annan säkerhetskänslig verksamhet av motsvarande betydelse. — [Justitieutskottets betänkande (riksdagen)](https://data.riksdagen.se/dokument/HD01JuU36.html); [Upphandlingsmyndigheten, webbstöd säkerhetsskyddad upphandling](https://www.upphandlingsmyndigheten.se/globalassets/dokument/upphandling/dokumentversion-webbstod-sakerhetsskyddad-upphandling.pdf)
- En säkerhetsskyddad upphandling innebär inte alltid ett separat säkerhetsskyddsavtal. Myndigheten kan i stället ställa krav på säkerhetsskyddsåtgärder. — [Polisen, säkerhetsskyddad upphandling](https://polisen.se/aktuellt/upphandlingar/sakerhetsskyddad-upphandling/)
- Genom en lagändring 2026 (SFS 2026:764) införs en anmälningsplikt i 4 kap. 1 a § för genomförda säkerhetsskyddade upphandlingar och avtal. Den ska fullgöras från den 1 januari 2027. — [SFS 2026:764](https://xn--svenskfrfattningssamling-roc.se/sites/default/files/sfs/2026-05/SFS2026-764.pdf)

### Cited Findings: Cyber Resilience Act (EU) 2024/2847
- Rapporteringsskyldigheterna (art. 14) gäller från den 11 september 2026: aktivt utnyttjade sårbarheter och allvarliga incidenter ska rapporteras. De gäller även produkter som släppts ut före det datumet. Huvudskyldigheterna gäller från den 11 december 2027. — [Europeiska kommissionen, 2026-09-11](https://commission.europa.eu/news-and-media/news/safer-and-more-secure-digital-products-2026-09-11_pt); [Kommissionen, CRA reporting](https://digital-strategy.ec.europa.eu/en/policies/cra-reporting); [Travers Smith](https://www.traverssmith.com/knowledge/knowledge-container/the-eu-cyber-resilience-acts-vulnerability-and-incident-reporting-requirements-are-now-live/)
- Fristående programvara som släpps ut på marknaden omfattas, och cybersäkerhet blir ett villkor för marknadstillträde. — [Greenberg Traurig, CRA and software](https://www.gtlaw.com/ar/insights/2026/9/eu-cyber-resilience-act-cra-and-software-new-cybersecurity-obligations-and-ce-marking)
- Supportperioden är generellt minst fem år, eller kortare om produktens förväntade användningstid är kortare. — [BSI, CRA](https://www.bsi.bund.de/dok/cra-en); [Greenberg Traurig](https://www.gtlaw.com/ar/insights/2026/9/eu-cyber-resilience-act-cra-and-software-new-cybersecurity-obligations-and-ce-marking)
- En SBOM krävs och ska hållas aktuell under supportperioden. Format anges inte, men SPDX och CycloneDX är de facto-standard. — [Mend, CRA compliance guide (sekundär)](https://www.mend.io/blog/eu-cyber-resilience-act-compliance-guide/)
- CE-märkningen ska omfatta CRA:s krav. — [Greenberg Traurig](https://www.gtlaw.com/ar/insights/2026/9/eu-cyber-resilience-act-cra-and-software-new-cybersecurity-obligations-and-ce-marking)
- Medicintekniska produkter och IVD undantas genom art. 2.2 a och b (MDR 2017/745 och IVDR 2017/746). En generell dator eller programvara som används i vården är inte undantagen bara för att den används där. — [Mondaq, Exclusions under the CRA](https://www.mondaq.com/security/1674432/exclusions-and-transitional-scope-under-the-eu-cyber-resilience-act); [CMS, Does the CRA apply to your product?](https://cms.law/en/int/legal-updates/does-the-eu-cyber-resilience-act-apply-to-your-product-scope-definitions-and-the-product-classification-system-explained)
- Ett förslag till ändring av MDR och IVDR skulle föra in CRA-liknande rapportering av sårbarheter och incidenter i MDR. — [Osborne Clarke](https://www.osborneclarke.com/insights/revised-eu-medtech-regulations-proposal-sharpens-software-and-cybersecurity-rules-digital)
- Kommissionen har publicerat vägledning om CRA:s tillämpningsområde (C/2026/6013 enligt EUR-Lex-träff, augusti/september 2026). — [EUR-Lex C/2026/6013](https://eur-lex.europa.eu/eli/C/2026/6013); [Orrick, New Guidance](https://www.orrick.com/en/Insights/2026/09/EU-Cyber-Resilience-Act-New-Guidance-Clarifies-Scope-Reporting)
- **[ej verifierad i sessionen]** Enligt CRA:s text gäller följande. Kontrollera mot EUR-Lex:
  - Rapportering till CSIRT/ENISA ska ske med tidig varning inom 24 timmar, anmälan inom 72 timmar och slutrapport inom 14 dagar (sårbarhet) respektive en månad (incident).
  - Produkter i "default"-kategorin, alltså de som inte står i bilaga III eller IV, får bedömas genom egenkontroll (modul A). Lotsa bör hamna i den kategorin.
  - Sanktionsavgifterna är upp till 15 miljoner euro eller 2,5 procent av den globala omsättningen för brott mot de väsentliga kraven.
  - [CRA, EUR-Lex 2024/2847](https://eur-lex.europa.eu/eli/reg/2024/2847/oj)

### Inferences
- **Cybersäkerhetslagen, regionen:** regionen är verksamhetsutövare och ska bland annat hantera risker i leverantörskedjan. Lotsa AB omfattas inte själv (litet bolag, inte i någon NIS2-sektor som "tillverkare av mjukvara" i allmänhet). Bolaget får i praktiken avtalskrav om
  - sårbarhetshantering och säkerhetsuppdateringar
  - incidentrapportering till regionen inom kort tid
  - signerade installationspaket och SBOM
  - säkerhetsdokumentation (hårdningsguide).
- Att appen är offline minskar attackytan men tar inte bort kraven. Uppdateringar och modellfiler distribueras ändå, och kedjan måste vara integritetsskyddad (signaturer, hash).
- **Säkerhetsskyddslagen:** för ett offline-verktyg med manualer och utan leverantörsåtkomst är ett säkerhetsskyddsavtal sannolikt inte aktuellt. Det kan bli det om en region bedömer att viss vård (t.ex. katastrofmedicinsk beredskap) är säkerhetskänslig och leverantören får åtkomst på plats eller på distans. Regionens säkerhetsskyddsanalys avgör.
- **CRA, Lotsa AB som tillverkare** (om Lotsa inte är en MDR-produkt):
  1. Ha redan nu en process för att rapportera aktivt utnyttjade sårbarheter och allvarliga incidenter via ENISA:s plattform (gäller sedan 2026-09-11).
  2. Senast 2027-12-11:
     - cybersäkerhetsriskbedömning
     - uppfylla de väsentliga kraven i bilaga I (säker standardkonfiguration, säkerhetsuppdateringar, åtkomstskydd, dataminimering, loggning)
     - SBOM
     - publicerad sårbarhetspolicy (CVD) och kontaktpunkt
     - supportperiod på minst 5 år
     - teknisk dokumentation
     - EU-försäkran om överensstämmelse och CE-märkning
     - användarinformation.
  3. Lokal AI-modell och öppen källkod i produkten: tillverkaren ansvarar för due diligence av tredjepartskomponenter.
- Om Lotsa i stället kvalificerar som MDR-produkt undantas Lotsa från CRA enligt art. 2.2 a, men MDR:s krav på cybersäkerhet (bilaga I, MDCG 2019-16) gäller då i stället.

### Gaps
- Ordagrann lydelse av cybersäkerhetslagens bestämmelser om säkerhetsåtgärder, leverantörskedja, incidentrapportering och registreringsdatum kunde inte hämtas. Registreringsdatumet 30 september 2026 kommer från en osäker sekundärkälla.
- MCF:s slutliga föreskrifter (MCFFS 2026:x) kunde inte läsas. Endast konsekvensutredningarna hittades.
- CRA:s artikeltext (art. 2, 13, 14, 32, 64, 71, bilagorna III och IV) kunde inte hämtas från EUR-Lex. Siffrorna under "[ej verifierad]" måste kontrolleras.

## 5. Produktansvar: nya produktansvarsdirektivet (2024/2853) och den svenska produktansvarslagen

### Takeaway
Det nya direktivet gör uttryckligen programvara, inklusive AI-system och fristående appar, till "produkt" med strikt ansvar för person- och sakskador och för förlust eller förstörelse av data som inte används för yrkesändamål. Sverige har lagt fram prop. 2026/27:12 "En ny produktansvarslag" med föreslaget ikraftträdande den **9 december 2026**. Civilutskottet tillstyrkte den den 19 november 2026, men riksdagens slutliga beslut var inte bekräftat vid sökningen. AI-ansvarsdirektivet (AILD) drogs formellt tillbaka 2025.

### Cited Findings
- Prop. 2026/27:12 "En ny produktansvarslag" lades fram den 15 oktober 2026 och genomför direktiv (EU) 2024/2853. — [Regeringen, prop. 2026/27:12](https://www.regeringen.se/rattsliga-dokument/proposition/2026/10/prop.-20262712); [prop. PDF](https://www.regeringen.se/contentassets/971ec0eabafd48fd8d841f9d3a0a6eb9/2627001200webb.pdf)
- Lagrådsremissen (augusti 2026) föreslog ikraftträdande den 9 december 2026 och att ansvaret utvidgas till fristående programvara. — [Lagrådsremiss En ny produktansvarslag](https://regeringen.se/contentassets/19fbea12d9f84881a8386013b1c315de/en-ny-produktansvarslag.pdf)
- Civilutskottets betänkande 2026/27:CU4 (19 november 2026) föreslår att riksdagen antar propositionen, med en redaktionell ändring. — [Riksdagen, CU4](https://data.riksdagen.se/fil/74FED4F6-5164-4E8C-BBAE-446846A6D7F8)
- Underlaget är SOU 2025:103. Direktivet är fullharmoniserande, så det nationella utrymmet att avvika är begränsat. — [SOU 2025:103](https://www.riksdagen.se/sv/dokument-och-lagar/dokument/statens-offentliga-utredningar/en-ny-produktansvarslag_hdb3103/html/); [Teknikföretagen, remissvar](https://regeringen.se/contentassets/e79b53bc3bff4dec96ef8fa7c3500d9c/teknikforetagen.pdf)
- All programvara omfattas, inklusive applikationer och AI-system. Tillverkaren ansvarar också för brister som uppstår genom uppdateringar under dennes kontroll. — [EUR-Lex sammanfattning, Defective products liability](https://eur-lex.europa.eu/SV/legal-content/summary/defective-products-liability.html)
- AI-ansvarsdirektivet listades för tillbakadragande i arbetsprogrammet den 11 februari 2025 och drogs formellt tillbaka enligt kommissionen i juli 2025. — [Euronews 2025-07-31](https://www.euronews.com/2025/07/31/eu-commission-confirms-ditching-of-ai-liability-and-patents-proposals); [Bird & Bird](https://cm.twobirds.com/en/insights/2025/proposed-eu-ai-liability-rules-withdrawn); [IAPP](https://iapp.org/news/a/european-commission-withdraws-ai-liability-directive-from-consideration)
- **[ej verifierad i sessionen]** Enligt direktivet gäller följande:
  - Ansvaret gäller produkter som släpps ut efter den 9 december 2026.
  - Ansvaret kan inte begränsas eller uteslutas genom avtal i förhållande till den skadelidande (art. 15).
  - Bristande säkerhetsuppdateringar kan göra produkten defekt.
  - Ersättning för dataförlust gäller data som inte används för yrkesändamål.
  - [Direktiv 2024/2853, EUR-Lex](https://eur-lex.europa.eu/eli/dir/2024/2853/oj)

### Inferences
- **För Lotsa AB:** med strikt produktansvar för programvara som släpps ut efter ikraftträdandet följer att ett felaktigt AI-svar, t.ex. fel inställning på en infusionspump som leder till patientskada, i teorin kan grunda krav från den skadelidande, alltså patienten, mot tillverkaren. Hur "defekt" bedöms beror på vilken säkerhet man kan förvänta sig, och där väger appens varningar, citatkontroll och avsedda användning tungt. Ansvaret gentemot skadelidande kan inte avtalas bort, men ansvarsfördelning och regress mellan region och leverantör kan regleras i avtal.
- **Ansvarsbegränsning i offentliga avtal:** regionernas standardvillkor (t.ex. SKR/Adda-ramavtal) innehåller ofta ansvarstak, men rätten att begränsa är förhandlingsbar och undantar normalt grov vårdslöshet och dataskyddsbrott. Ingen källa hämtades om detta, se gaps.
- Lotsa AB bör teckna en produktansvarsförsäkring som täcker programvara, och dokumentera säkerhetsuppdateringar (koppling till CRA).

### Gaps
- Riksdagens slutliga beslut om prop. 2026/27:12 och SFS-nummer för den nya lagen bekräftades inte.
- Inga källor hämtades om ansvarsbegränsningar i regioners standardavtal (Adda, Kammarkollegiet), patientskadelagen eller regress. Det behöver separat sökning.

## 6. Tillgänglighet: DOS-lagen (2018:1937), tillgänglighetslagen (2023:254, EAA) och LOU

### Takeaway
- **DOS-lagen (2018:1937)** ställer krav på den offentliga aktörens digitala service med EN 301 549 som standard. Den är främst inriktad på webbplatser och mobilappar, och det är oklart om ett internt skrivbordsprogram omfattas. Ansvaret ligger på regionen, inte leverantören.
- **Lag (2023:254)**, som genomför EAA, gäller i huvudsak *konsument*produkter och -tjänster, bland annat datorhårdvara med operativsystem, e-handel och e-böcker. B2B-programvara för sjukhuspersonal omfattas sannolikt inte.
- **I upphandling** ska tillgänglighet beaktas enligt LOU, och regioner hänvisar ofta till EN 301 549. Leverantören bör därför kunna redovisa överensstämmelse.

### Cited Findings
- Lag (2018:1937) genomför webbtillgänglighetsdirektivet. EN 301 549 är standarden för överensstämmelse och DIGG är tillsynsmyndighet. Lagen gäller digital service som tillhandahålls av en offentlig aktör, och förordningen innehåller undantag. — [DIGG/EU Accessible centre, Act 2018:1937](https://accessible-eu-centre.ec.europa.eu/content-corner/digital-library/act-20181937-accessibility-digital-public-services-lag-20181937-om-tillganglighet-till-digital_en); [Förordning 2018:1938 (riksdagen)](https://www.riksdagen.se/sv/dokument-lagar/dokument/_sfs-2018-1938); [SFS 2018:1937](https://svenskforfattningssamling.se/sites/default/files/sfs/2018-11/SFS2018-1937.pdf)
- Lag (2023:254) om vissa produkters och tjänsters tillgänglighet genomför direktiv (EU) 2019/882 och gäller från den 28 juni 2025. 3 § listar produkter och börjar med datorhårdvara för allmänna ändamål (med operativsystem). Tjänsterna i 4 § gäller tjänster som tillhandahålls konsumenter. PTS meddelar föreskrifter om produkter. — [SFS 2023:254](https://svenskforfattningssamling.se/sites/default/files/sfs/2023-05/SFS2023-254.pdf); [Prop. Genomförande av tillgänglighetsdirektivet](https://www.riksdagen.se/sv/dokument-och-lagar/dokument/proposition/genomforande-av-tillganglighetsdirektivet_ha0342/html/); [PTS föreskrifter](https://pts.se/contentassets/1537cfeb7c0940b2aebe438ef16f81b7/pts-foreskrifter-om-vissa-produkters-tillganglighet.pdf)
- **[ej verifierad i sessionen]** LOU (2016:1145) 9 kap. 2 §: tekniska specifikationer ska när det är möjligt bestämmas med hänsyn till tillgänglighet för personer med funktionsnedsättning, när det som anskaffas ska användas av fysiska personer. — [LOU, riksdagen.se](https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-20161145-om-offentlig-upphandling_sfs-2016-1145/)

### Inferences
- Lotsa är B2B-programvara för yrkesanvändare och omfattas sannolikt inte av lag 2023:254. Det är också osäkert om DOS-lagen omfattar programmet: den är inriktad på webbplatser och mobila applikationer, och intranät kan omfattas, men ett installerat skrivbordsprogram är oklart. Det bör kontrolleras mot 2–3 §§ och undantagen i förordningen.
- Praktiskt räcker det ändå att uppfylla WCAG 2.1 AA / EN 301 549 (kap. 9 och 11). Gränssnittet är HTML, så det är relativt enkelt. Leverantören bör ta fram en tillgänglighetsredogörelse eller VPAT/EN 301 549-redovisning som bilaga till anbud.

### Gaps
- 2–3 §§ i DOS-lagen och undantagslistan i förordning 2018:1938 kunde inte läsas i sin helhet.
- Ingen DIGG-vägledning om skrivbordsprogram och intranät hittades.

## 7. Licensefterlevnad: öppen källkod och modellicenser i en såld produkt

### Takeaway
Licenserna för AI-modeller med öppna vikter skiljer sig mycket åt och måste kontrolleras per checkpoint.
- **Llama:** egen licens med villkor, bland annat begränsningar för EU vid multimodala versioner.
- **Gemma:** Google-villkor med policy för förbjuden användning som måste föras vidare till användarna. Nyare versioner uppges ha Apache 2.0.
- **Qwen:** varierar mellan releaser, vissa är icke-kommersiella.
- **Mistral:** blandning av Apache 2.0 och icke-kommersiella eller omsättningsbegränsade licenser.

Apache 2.0 eller MIT är säkrast för en såld produkt. Copyleft (GPL/AGPL) i medlänkade komponenter, t.ex. PDF-bibliotek, kan kräva att källkoden lämnas ut.

### Cited Findings
- Llama Community License tillåter kommersiell användning men har en gräns på 700 miljoner månatliga användare. Enligt en guide undantas EU för Llama 4, och villkoren följer med till finjusterade derivat. — [promptquorum, Local LLM commercial license guide (sekundär)](https://www.promptquorum.com/local-llms/local-llm-commercial-license-guide-business); [wz-it.com (sekundär)](https://wz-it.com/en/knowledge/ki/open-llm-licenses-commercial-use/)
- Gemma 1–3 har egna villkor med policy för förbjuden användning som ska föras vidare nedströms. Gemma 4 uppges ha släppts under Apache 2.0 i april 2026 (motstridiga sekundärkällor). — [dev.to, Gemma 4 review (sekundär)](https://dev.to/techsifted/google-gemma-4-review-2026-apache-20-license-benchmarks-commercial-use-3iea); [braindetox, Open-weight licenses (sekundär)](https://braindetox.kr/en/posts/open_weight_model_license_guide.html)
- Qwen-licenser varierar per repo och release, och vissa checkpoints med "Qwen Research License" förbjuder kommersiell användning. Vissa Mistral-modeller har Apache 2.0, andra Mistral Non-Production License eller modifierad MIT med omsättningsgräns. — [softwareseni, Licence terms compared (sekundär)](https://www.softwareseni.com/llama-mistral-deepseek-and-qwen-licence-terms-compared-for-commercial-use/); [wz-it.com (sekundär)](https://wz-it.com/en/knowledge/ki/open-llm-licenses-commercial-use/)

### Inferences
- **Checklista för Lotsa AB:**
  1. För en licensförteckning (behövs ändå som SBOM enligt CRA) över alla bibliotek, runtime (t.ex. llama.cpp med MIT), modellvikter och tokenizer.
  2. Välj modell med Apache 2.0 eller MIT om möjligt.
  3. Följ notice- och attributionskrav (NOTICE-fil i installationen).
  4. Undvik AGPL och GPL i distribuerad binär, eller följ dem.
  5. För vidare acceptable use-policyer till kunden i licensavtalet om modellen kräver det.
  6. Kontrollera PDF-renderare (t.ex. pdf.js med Apache 2.0, MuPDF med AGPL).
- Kundens manualer är tillverkarens upphovsrättsligt skyddade verk. Regionen laddar upp dem för intern användning. Lotsa AB bör inte distribuera manualer i produkten utan licens från tillverkarna, och demodata ska vara påhittad (vilket repot redan föreskriver).

### Gaps
- Inga primära licenstexter hämtades. Alla uppgifter ovan kommer från sekundära bloggar och måste kontrolleras mot licensfilen för den valda modellen.

## 8. Arbetsrätt och arbetsmiljö: MBL och AI på arbetsplatsen

### Takeaway
När en region inför ett nytt AI-verktyg i vården är det sannolikt en "viktigare förändring" som kräver förhandling enligt **11 § MBL** innan beslut, eller samverkan enligt regionens lokala samverkansavtal. Om frågeloggar med användarnamn kan användas för att följa upp anställda förstärker det behovet. Det är regionens skyldighet, men den påverkar leverantörens tidplan för införandet.

### Cited Findings
- Vid viktigare förändringar av verksamheten ska arbetsgivaren på eget initiativ förhandla innan beslut fattas (11 § MBL). Facket kan begära central förhandling enligt 14 § MBL inom sju dagar. — [Östhammars kommun, genomgång MBL](https://ines.osthammar.se/globalassets/dokument/information/lon-hr-information/chefsportalen/lagar-avtal-och-styrdokument/genomgang_mbl.pdf); [MBL (lagen.nu)](https://lagen.nu/1976:580)
- Lokala samverkansavtal i regioner kan ersätta förhandling enligt 11, 12, 19 och 38 §§ MBL med samråd i samverkansgrupp. — [Lokalt samverkansavtal NU-sjukvården (lawinsider)](https://lawinsider.com/sv/contracts/38kbfaaw1TV)
- Vision vill att arbetsgivare tar fram riktlinjer för hur AI-verktyg får användas, med hänsyn till integritet, etik och säkerhet. — [Vision, arbetsrätt grund](https://vision.se/globalassets/documents/utbildning/utbildningsmaterial/vision-och-arbetsratten---grund/vision-och-arbetsratten-grund-digitalt-upplagg.pdf)
- Läkartidningen: AI måste minska arbetsbördan, inte öka den (fackligt perspektiv). — [Läkartidningen](https://lakartidningen.se/nyheter/ai-maste-minska-arbetsbordan-inte-oka-den/)

### Inferences
- Leverantören kan underlätta genom att leverera material för riskbedömning enligt arbetsmiljöregler (AFS om organisatorisk och social arbetsmiljö) och en tydlig beskrivning av vad som loggas om användarna, eftersom det påverkar MBL-samverkan och den integritetsrättsliga bedömningen.
- Användarloggar som kan användas för kontroll av anställda bör vara avstängda som standard, så att MBL- och integritetsfrågorna blir mindre laddade.

### Gaps
- Ingen AD-dom eller SKR-vägledning hittades om förhandlingsskyldighet vid införande av AI-verktyg i regioner.
- Arbetsmiljöverkets föreskrifter om digital arbetsmiljö och AI söktes inte.
- SKR:s vägledning om AI och om utkontraktering och moln hämtades inte (tidsbegränsning).
