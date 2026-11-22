# Affärssidan för Lotsa: upphandling, marknad, konkurrens, pris, finansiering och bolagets förutsättningar (Sverige, november 2026)

Metod: WebFetch kunde inte nå någon värd (DNS-fel i sessionen), så primärkällorna hämtades i stället med curl och textextraktion. TED genomsöktes via dess öppna API (api.ted.europa.eu/v3/notices/search), och sökresultaten för varje meddelande nedan kommer därifrån. e-Avrop, Visma Opic/Tendsign och Mercell lästes inte, eftersom de kräver inloggning eller har dynamiska sökgränssnitt. "Slutsats" betyder egen tolkning som inte står i källan.

---

## 1. Upphandling: LOU, direktupphandling, innovationsförfaranden, ramavtal och ny lag 2026

### Sammanfattning
Från den 1 januari 2026 får regioner och kommuner direktupphandla programvara under **700 000 kr** (exkl. moms) enligt LOU. Köp från 100 000 kr ska dokumenteras, och många regioners interna riktlinjer har lägre gränser. Det betyder att en betald pilot eller en första licens för en klinik eller MT-avdelning kan köpas utan annonserad upphandling. Ett regiontäckande avtal hamnar däremot över gränsen och kräver annonserad upphandling, eller ett avrop via ramavtal där Lotsa behöver vara underleverantör till en ramavtalsleverantör.

### Källbelagda fynd
**Belopp och regler**
- Gäller från 2026-01-01 enligt LOU, exkl. moms: tröskelvärdet för varor och tjänster är 1 589 140 kr för statliga myndigheter och 2 451 816 kr för övriga upphandlande myndigheter, dit regioner och kommuner hör. **Direktupphandlingsgränsen är 700 000 kr** för varor, tjänster och byggentreprenader. För sociala och andra särskilda tjänster är gränsen 8 513 250 kr. Enligt LUF och LUFS är gränsen 1 200 000 kr. — [Upphandlingsmyndigheten, Tröskelvärden och direktupphandlingsgränser](https://www.upphandlingsmyndigheten.se/regler-och-lagstiftning/troskelvarden-och-direktupphandlingsgranser/)
- Värdet beräknas enligt samma regler som för tröskelvärdet, och en upphandling får inte delas upp för att kringgå reglerna. Upphandlande organisationer ska anta riktlinjer för direktupphandling och dokumentera skälen för köp som uppgår till minst 100 000 kr (19 a kap. 11 och 15 §§ LOU). Organisationernas egna riktlinjer kan ha "beloppsgränser som kan vara betydligt lägre än direktupphandlingsgränsen". Det finns inga formkrav på annonsering eller tidsfrister, och förhandling är tillåten. — [Upphandlingsmyndigheten, Direktupphandling](https://www.upphandlingsmyndigheten.se/inkopsprocessen/forbered-upphandling/valja-upphandlingsforfarande/direktupphandling/)

**Lagändringar 2026 och framåt**
- Prop. 2025/26:177 innehåller lagändringar om leverantörskontroll, bland annat i 15 kap. "Egen försäkran och utredning om leverantörer". Lagen träder i kraft den **1 juli 2026**. — [Riksdagen, prop. 2025/26:177](https://data.riksdagen.se/dokument/HD03177.html); lagrådsremissen hette "Förenklad leverantörskontroll vid upphandling" (12 februari 2026) — [regeringen.se, lagrådsremiss](https://regeringen.se/contentassets/e918405462634dd296bc5c641d618046/forenklad-leverantorskontroll-vid-upphandling.pdf)
- Den 9 september 2026 presenterade EU-kommissionen ett förslag till **förordning om offentliga kontrakt och koncessioner**. Den ska ersätta direktiven 2014/23, 2014/24 och 2014/25, med syftet att göra reglerna enklare, mer flexibla och mer enhetliga och att införa ett nytt digitalt ekosystem för upphandling. Regeringens faktapromemoria är 2026/27:FPM3. — [regeringen.se, faktapromemoria 2026/27:FPM3](https://www.regeringen.se/faktapromemoria/2026/10/202627fpm3/)
- I oktober 2025 lanserade regeringen en "reform för offentliga affärer" och förstärkte Upphandlingsmyndigheten. — [regeringen.se, pressmeddelande](https://regeringen.se/pressmeddelanden/2025/10/regeringen-lanserar-reform-for-offentliga-affarer/)
- **Från den 1 januari 2027** tar Upphandlingsmyndigheten över upphandling och förvaltning av de statliga samordnade ramavtalen. Befintliga ramavtal fortsätter att gälla och finns kvar på avropa.se. — [Upphandlingsmyndigheten, startsida "Ramavtalen flyttar in"](https://www.upphandlingsmyndigheten.se/)
- Upphandlingsmyndigheten var kritisk till EU:s förslag European Innovation Act (nyhet 21 oktober 2026). — [Upphandlingsmyndigheten, startsida nyheter](https://www.upphandlingsmyndigheten.se/)

**Adda (SKR:s inköpscentral för kommuner och regioner)**
- Ramavtalet **Programvaror och molntjänster 2023** har sex leverantörer: Advania Sverige AB, Atea Sverige AB, Chas Visual Management AB, Crayon AB, Dustin AB och Insight Technology Solutions AB. Det omfattar programvara inom sju programvaruområden samt molntjänster och tillhörande tjänster. — [Adda, avropsvägledning v1.0](https://www.adda.se/globalassets/2.-upphandling-ramavtal/3.-it-digitalisering/programvaror/programvaror-och-molntjanster-2023/avropsvagledning-v.1.0.pdf) (leverantörslistan kommer från sökutdrag; PDF:en gick inte att hämta med curl). Tilldelningen är registrerad som 2024-11-11 hos EU:s publikationsbyrå. — [op.europa.eu](https://op.europa.eu/et/web/public-procurement/procurement-details/-/procurement/a99c0c92-30e5-4c06-aa0c-b1444aeef031)
- Adda:s allmänna kontraktsvillkor (bilaga 03, version 2, 2024-06-12) för förnyad konkurrensutsättning:
  - Leverantörens ansvar för person- eller sakskada begränsas till **10 000 000 kr per skada och år**, och ansvaret för annan ren förmögenhetsskada till **2 000 000 kr per skada och år**.
  - Begränsningarna gäller inte vid grov vårdslöshet eller uppsåt.
  - Leverantören ska **under hela kontraktstiden ha försäkringar** som täcker detta ansvar.
  - Vite är 2 procent av priset för den felaktiga delen, minst 5 000 kr.
  - Dataskyddsskador regleras enligt personuppgiftsbiträdesavtalet och GDPR.
  - [Adda, bilaga 03 allmänna kontraktsvillkor](https://www.adda.se/globalassets/2.-upphandling-ramavtal/3.-it-digitalisering/programvaror/programvaror-och-molntjanster-2023/bilaga-03-allmanna-kontraktsvillkor.pdf)
- Adda har också separata volymavtal med enskilda leverantörer, till exempel Cleura (2023) och Google Cloud/Workspace (2024-12-17). Kunden tecknar då egna underavtal och Adda är inte part. — [Adda, volymavtal Cleura](https://www.adda.se/contentassets/82ebbaa0289749bc950ece20418ef928/volymavtal-mellan-cleura-och-adda.pdf); [Adda, Google-volymavtal](https://www.adda.se/globalassets/2.-upphandling-ramavtal/3.-it-digitalisering/programvaror/volymavtal-for-programvaror-och-molntjanster-google/adda-google-cloud-volume-agreement.pdf)
- Statliga ramavtal på avropa.se inom programvaror är bland annat "Programvarulösningar och licenser" och "Licenser och licenstjänster 2022". Insight är leverantör på det senare. — [avropa.se, tilldelningsbeslut programvarulösningar och licenser](https://www.avropa.se/globalassets/tilldelningsbeslut/tilldelningsbeslut-programvarulosningar-och-licenser.pdf); [Insight, ramavtalssida](https://se.insight.com/sv_SE/what-we-do/public-sector/framework/programvaror-licenser-och-licenstjanster-2022.html)

**Innovationsupphandling och verkliga annonser (TED-sökning)**
- TED har bara **7 svenska meddelanden** sedan 2023 som nämner "innovationspartnerskap" eller "förkommersiell upphandling". Inget av dem gäller vård eller medicinteknik; exemplen är Akademiska Hus (betong), FMV CMIP Pilot PCP (2026, 20 MSEK) och Kungsbacka kommuns RFI om virtuell kompetensutveckling (2024, 2,5 MSEK). — [TED 57709-2024](https://ted.europa.eu/sv/notice/57709-2024/html); [TED 297831-2026](https://ted.europa.eu/sv/notice/297831-2026/html)
- Annonser om AI hos svenska köpare 2024–2026 (sökorden "generativ AI", "AI-assistent", "språkmodell", "chattbot", "Copilot"):
  - Region Stockholm, Serviceförvaltningen: "Specifik upphandling UX-konsulter till regionens AI-assistenter", tilldelad Ernst & Young, 680 000 kr (juli 2026). — [TED 526686-2026](https://ted.europa.eu/sv/notice/526686-2026/html)
  - Sjöfartsverket: RFI "Generativ AI tjänst/verktyg", uppskattat 7 MSEK (september 2025). — [TED 628704-2025](https://ted.europa.eu/sv/notice/628704-2025/html)
  - Vinnova: "AI-analysverktyg", 5 MSEK (mars 2025). — [TED 205665-2025](https://ted.europa.eu/sv/notice/205665-2025/html)
- Ingen TED-annons sedan 2020 matchade "medicintekniskt förvaltningssystem", "MT-system" eller "underhållssystem" tillsammans med medicinteknik. MT-system upphandlas sannolikt sällan, under tröskelvärdet eller med andra termer. — TED API-sökning, ingen träff (slutsats om orsaken)
- Ett jämförbart storleksexempel inom kompetens och utbildning: Region Skånes upphandling av lärplattform tilldelades **TicTac Learn AB, 17 MSEK** (2024). — [TED 107114-2024](https://ted.europa.eu/sv/notice/107114-2024/html)
- Utrustningsupphandlingar inom MT är ofta stora. Region Örebro län hade till exempel angiografiutrustning för 81 MSEK och en operationsrobot för 30 MSEK (2024). Utbildning och bruksanvisningar ingår normalt i sådana upphandlingar som leverantörens åtagande. — [TED 79239-2024](https://ted.europa.eu/sv/notice/79239-2024/html); [TED 92317-2024](https://ted.europa.eu/sv/notice/92317-2024/html) (att utbildning ingår är en slutsats och är inte verifierat i just dessa underlag)

### Slutsatser (egna)
- **Väg 1, direktupphandling**: en betald pilot på 50 000–300 000 kr per MT-avdelning eller klinik ryms under 700 000 kr. Säljaren bör räkna med kravet på dokumentation från 100 000 kr och regionens egna riktlinjer, som ofta kräver flera offerter vid lägre belopp. Erbjud ett färdigt dokumentationsunderlag: behov, pris, skäl till val och jämförelse med alternativ.
- **Väg 2, underleverantör via Adda-ramavtalet**: med en av de sex leverantörerna (Atea, Advania, Dustin, Crayon, Insight, Chas) som återförsäljare kan regioner och kommuner avropa Lotsa genom förnyad konkurrensutsättning. Då gäller Adda:s villkor, inklusive ansvarstaken 10/2 MSEK och kravet på försäkring. Hur en ny programvara läggs till i en ramavtalsleverantörs sortiment framgick inte och behöver kontrolleras med leverantören och avropsvägledningen.
- **Väg 3, egen annonserad upphandling eller innovationspartnerskap**: innovationspartnerskap används nästan inte i svensk vård enligt TED. Räkna inte med det som huvudväg, men det kan föreslås för ett större regionprojekt.
- Upphandlingsmyndighetens övertagande av de statliga ramavtalen 2027 och EU:s nya upphandlingsförordning påverkar inte kommunernas och regionernas Adda-avtal på kort sikt. Den nya förordningen är bara ett förslag och väntas tidigast om flera år.

### Luckor
- Annonser på e-Avrop, Opic/Tendsign och Mercell lästes inte (inloggning eller dynamiska sökgränssnitt). Regionala annonser under tröskelvärdet är därför inte kartlagda.
- Regionala ramavtal för programvara, till exempel Region Stockholms eller VGR:s egna, och avtalsperiod och förlängning för Adda Programvaror och molntjänster 2023 är inte verifierade.
- DIS (dynamiskt inköpssystem) för programvara hos regionerna söktes inte.
- Vad prop. 2025/26:177 i detalj ändrar för ESPD och egen försäkran lästes inte utöver rubrikerna.
- Någon svensk proposition om en helt ny upphandlingslag för 2026 hittades inte. De ändringar som hittades är delreformer.

---

## 2. Marknadsstorlek och problemet: MT-avdelningar, antal produkter och användarfel

### Sammanfattning
Problemet finns dokumenterat i publicerade Lex Maria-ärenden. Felinställda infusionspumpar och brister i kunskapen om pumpar återkommer, och sjukhusen svarar typiskt med "utbildning" som åtgärd. Rapporteringen till Läkemedelsverket är låg och tillsynen svag. Nationell statistik över antal MT-anställda, antal produkter per sjukhus och antal användarfel hittades inte.

### Källbelagda fynd
**MT-organisationer och tillsyn**
- Sverige har 21 regioner och 290 kommuner. — [SKR, Om SKR](https://skr.se/skr/omskr/omskr.415.html) (sidan hämtades men siffrorna syntes inte i utdraget; antalen är allmänt kända och bör kontrolleras på skr.se)
- På Karolinska Universitetssjukhuset har "MT Utveckling och förvaltning" ungefär 30 medarbetare i fyra förvaltningar, en projektgrupp, ett kvalitetsteam och en utvecklingsgrupp. De driver utrustningens livscykel från anskaffning till drift och underhåll och samordnar anmälningar till Läkemedelsverket och IVO om negativa händelser och tillbud med medicintekniska produkter. — [Karolinska, MT utveckling och förvaltning](https://www.karolinska.se/om-oss/organisation/administrativa-verksamheter/stab-teknik/mt-utveckling-och-forvaltning/)
- Medicinsk teknik vid Blekingesjukhuset har 20 anställda. — [1177, Medicinteknisk avdelning Karlskrona](https://www.1177.se/hitta-vard/kontaktkort/Medicinteknisk-avdelning-Karlskrona/) (från sökutdrag)
- Riksrevisionen (RiR 2024:23) bedömde att statens tillsyn över medicintekniska produkter varit begränsad i förhållande till marknadens storlek, och att IVO:s tillsyn över användningen i vården inte är tillräckligt effektiv. — [Riksdagen, RiR 2024:23](https://data.riksdagen.se/dokument/HCB523.html); [regeringens skrivelse 2024/25:149](https://data.riksdagen.se/dokument/HC03149.html)
- Vårdgivare ska rapportera olyckor och tillbud till tillverkaren med kopia till Läkemedelsverket. — [Läkemedelsverket, Reporting](https://lakemedelsverket.se/en/medical-devices/surveillance-vigilance/reporting)
- Underrapportering: Läkemedelsverket fick bara 24 anmälningar från vården om journalsystemet Cosmic mellan januari 2025 och 6 maj 2026, vilket myndighetens enhetschef kallade anmärkningsvärt. — [Läkartidningen](https://lakartidningen.se/nyheter/bara-24-anmalningar-till-lmv-om-cosmic-bekymmersamt/)
- Läkemedelsverkets tillsyn av medicintekniska produkter 2025 (enligt Swedish Medtech): 158 tillsynsärenden, 68 säkerhetskontrollärenden och 21 inspektioner. — [Swedish Medtech, PDF](https://www.swedishmedtech.se/upl/files/256625.pdf) (från sökutdrag)

**Lex Maria-ärenden på Karolinska om infusionspumpar**
- 2019, K2019-2877: förinställningen för hastighet, maxdos och tidsbegränsning på en läkemedelspump ändrades inte, och ett barn riskerade sex gånger högre dos med tio gånger högre hastighet. Åtgärd: "Åtgärdsprogram kring utbildning av läkemedelspumpar är framtagen och skall ingå i introduktionsprogram." — [Karolinska Lex Maria K2019-2877](https://www.karolinska.se/om-oss/kvalitet-och-tillganglighet/avvikelser-och-lex-maria/alla-lex-maria-arenden/2019/07/lex-maria-k2019-2877/)
- 2022: parenteral nutrition gick på en timme i stället för 16. Åtgärderna gällde att säkra kompetensen i att hantera och programmera infusionspumpar. — [Karolinska Lex Maria K2022-11658](https://www.karolinska.se/om-oss/kvalitet-och-tillganglighet/avvikelser-och-lex-maria/alla-lex-maria-arenden/2023/01/k2022-11658/)
- 2024: en pediatrisk epidural ställdes på 100 ml/h i stället för 10 ml/h, och pumpens inställningar tillät för hög hastighet. — [Karolinska Lex Maria K2024-6659](https://www.karolinska.se/om-oss/kvalitet-och-tillganglighet/avvikelser-och-lex-maria/alla-lex-maria-arenden/2024/09/k2024-6659/)
- 2022: två pumpar förväxlades, så att sockerlösning gick in i en epiduralkateter. — [Karolinska Lex Maria K2022-6459](https://www.karolinska.se/om-oss/kvalitet-och-tillganglighet/avvikelser-och-lex-maria/alla-lex-maria-arenden/2022/08/k2022-6459/)
- 2026: sprutbyte nattetid ledde till fel läkemedel. Åtgärderna var rutiner, utbildning och teamträning. — [Karolinska Lex Maria K2026-1632](https://www.karolinska.se/om-oss/kvalitet-och-tillganglighet/avvikelser-och-lex-maria/alla-lex-maria-arenden/2026/03/k2026-1632/)

**Kompetensbrist internationellt (indikator)**
- I USA utbildas omkring 400 biomedicinska tekniker per år medan omkring 5 000 går i pension, enligt startupen Leera. — [F4 Fund, Leera](https://f4.fund/startups/withleera) (källan har ett eget intresse; behandla siffran som en indikator)

### Slutsatser (egna)
- Lex Maria-ärendena visar ett mönster: fel vid inställning eller programmering och åtgärden "utbildning". Det motiverar en tillgänglig bruksanvisning vid utrustningen. Lotsa förhindrar inte felen tekniskt men sänker tröskeln till rätt instruktion. Produktpåståenden bör formuleras försiktigt, eftersom programvara som påverkar behandlingsbeslut kan hamna nära MDR:s definition av medicinteknisk programvara. Den kvalificeringen ligger utanför denna rapport.
- Ett ungefärligt adresserbart antal köparenheter: 21 regioner, var och en med en eller flera MT-enheter (Karolinska omkring 30 personer bara i förvaltningsdelen, Blekinge 20), plus privata vårdgivare och kommunal hemsjukvård. Det motsvarar sannolikt några tiotal MT-organisationer i Sverige. Antalet är en grov uppskattning och är inte verifierat.

### Luckor
- Inga uppgifter hittades om totalt antal MT-ingenjörer och tekniker i Sverige (till exempel från Svensk Förening för Medicinsk Teknik och Fysik; mt-sfmtf.se gick inte att nå) eller om antal medicintekniska produkter per sjukhus.
- Läkemedelsverkets årliga antal tillbudsrapporter och hur stor andel som är användningsfel hittades inte. Årsredovisningen 2025 lästes inte.
- Ingen IVO-sammanställning över Lex Maria-ärenden med koppling till medicinteknik hittades.
- Personalomsättning bland sjuksköterskor och tid för utbildning per produkt är inte sökta.

---

## 3. Konkurrenter och alternativ

### Sammanfattning
Ingen svensk eller nordisk produkt som erbjuder offline-AI över kundens egna bruksanvisningar med kontrollerade citat hittades. Lotsa konkurrerar i stället med fyra kategorier: MT-systemens dokumentarkiv (till exempel Medusa), tillverkarnas eIFU-portaler (som EU nu tillåter för alla professionella produkter), lärplattformar och regionernas generella AI-assistenter. Internationellt finns AI-assistenter för biomedicinska tekniker, men de är molnbaserade och riktar sig till service, inte till vårdpersonal.

### Källbelagda fynd
**MT-system**
- Medusa från SOFTPRO Medical Solutions är ett webbaserat verktyg för medicintekniska avdelningar och andra serviceavdelningar, utvecklat sedan 1999 och använt på över 180 sjukhus, främst i Skandinavien och Storbritannien. — [Clinical Services Journal](https://www.clinicalservicesjournal.com/story/9684/medical-engineering-efficient-work-solutions)

**Tillverkarnas eIFU-portaler**
- Kommissionens genomförandeförordning (EU) 2025/1234 utvidgar förordning 2021/2226 om elektroniska bruksanvisningar till alla medicintekniska produkter och tillbehör enligt MDR som är avsedda för professionella användare. Tillverkaren ska ange eIFU-adressen i UDI-databasen, och en papperskopia ska lämnas kostnadsfritt på begäran. Förordningen trädde i kraft den 16 juli 2025. — [EU-kommissionen, nyhet 2025-06-25](https://health.ec.europa.eu/latest-updates/commission-simplifies-instructions-use-medical-devices-further-digitalise-healthcare-systems-2025-06-25_en); [EUR-Lex 2025/1234](https://eur-lex.europa.eu/eli/reg_impl/2025/1234); [QbD Group](https://www.qbdgroup.com/en/regulatory-updates/expanded-eifu-eligibility-under-eu-regulation-2025-1234)

**Lärplattformar**
- Region Skåne upphandlade en lärplattform från TicTac Learn AB för 17 MSEK (2024). — [TED 107114-2024](https://ted.europa.eu/sv/notice/107114-2024/html)

**Generell AI i regioner**
- Region Stockholm har "regionens AI-assistenter" och upphandlade UX-konsulter för dem 2026. — [TED 526686-2026](https://ted.europa.eu/sv/notice/526686-2026/html)
- Karolinska utsåg en Chief AI Officer i januari 2026. — [Karolinska nyhet](https://www.karolinska.se/forskning-och-utbildning/fouui-nyheter/2026/01/joel-preger-har-fatt-uppdraget-som-chief-ai-officer/)
- Region Stockholms politiska plattform för 2026–2030 säger att regionen ska vara ledande i användningen av digitala verktyg och AI. — [via.tt.se](https://via.tt.se/files/3237311/4609378/451866/sv) (från sökutdrag)
- NHS England inför Microsoft 365 Copilot för 505 000 anställda. Avtalet är värt omkring 120 miljoner pund och utrullningen ska vara klar i oktober 2026. En pilot i 90 organisationer uppskattade en besparing på 43 minuter per person och dag. — [Microsoft Source, 2026-06-08](https://news.microsoft.com/source/2026/06/08/nhs-england-accelerates-ai-adoption-with-microsoft-365-copilot-to-improve-service-delivery-reduce-costs-and-create-more-time-for-care/); [HTN](https://htn.co.uk/2026/06/08/national-roll-out-of-microsoft-copilot-announced-for-500000-nhs-staff/)

**Internationella AI-assistenter för medicinteknisk service**
- TRIMEDX lanserade en "technician agent" i plattformen TRIMEDX-AIQ, byggd på 25 års servicehistorik, 3 miljoner arbetsordrar per år och data från över 6 miljoner produkter (USA, 2026). — [24x7 Magazine](https://24x7mag.com/medical-equipment/software/ai/trimedx-launches-new-agentic-ai-capabilities-support-medical-equipment-repair/); [Quality Digest](https://www.qualitydigest.com/inside/improvement-tools-news/trimedx-introduces-agentic-ai-capabilities-part-trimedx-aiq-061526)
- Leera är en röststyrd AI-copilot för biomedicinska tekniker (USA). — [F4 Fund](https://f4.fund/startups/withleera)
- Mavenoid säljer AI-support till tillverkare av medicintekniska produkter (Mavenoid har svenskt ursprung, vilket är en slutsats som inte verifierats här). — [Mavenoid, medical devices](https://mavenoid.com/en/medical-devices)
- INGENZI är ett akademiskt projekt med en RAG-chattbot över manualer för låginkomstmiljöer. — [arXiv 2601.16967](https://arxiv.org/abs/2601.16967)
- Det finns också generiska RAG-verktyg som CustomGPT med en "medical device product knowledge assistant". — [CustomGPT](https://customgpt.ai/medical-device-internal-product-knowledge-ai-assistant/)

### Slutsatser (egna): vad som skiljer Lotsa
1. **Offline eller lokalt**: ingen data lämnar datorn, vilket undviker frågor om tredjelandsöverföring och molngranskning. Det är ett starkt argument i IT-säkerhetsgranskningen.
2. **Kontrollerade citat** direkt mot bruksanvisningens text: en generell Copilot ger inte samma spårbarhet och svarar utanför manualen.
3. **Tillverkaroberoende**: eIFU-portalerna är en portal per tillverkare, medan Lotsa samlar avdelningens hela utrustningspark. eIFU-förordningen gör det samtidigt lättare för kunden att hämta PDF:erna lagligt.
4. **Riktar sig till vårdpersonal, inte bara tekniker**: TRIMEDX och Leera riktar sig till biomedicinska tekniker.
5. Risken är att Region Stockholms AI-assistenter eller Copilot med SharePoint-dokument uppfattas som "gratis och tillräckligt". Motåtgärden är att visa skillnaden i citatkontroll och offline-drift, och att kunna integreras som ett komplement.

### Luckor
- Infor EAM och Efecte i svenska MT-avdelningar är inte verifierade, och vilka regioner som använder Medusa framgick inte.
- Regionernas Microsoft 365 Copilot-satsningar (antal licenser, beslut) hittades inte för Sverige. Bara NHS-data hittades.
- Kompetensportalen och andra MT-specifika e-lärandeleverantörer i Sverige söktes inte.
- Tillverkarnas egna appar (till exempel B. Braun, Baxter, BD, Philips) och deras villkor för vidareanvändning av bruksanvisningar söktes inte. Upphovsrätt och licensvillkor för PDF:erna är en öppen juridisk fråga.

---

## 4. Prismodeller och prisnivåer

### Sammanfattning
Inga publicerade prislistor för svensk vårdprogramvara inom MT eller kunskapsstöd hittades. De enda konkreta referenspunkterna är kontraktsvärden i TED och prisgränserna i LOU.

### Källbelagda fynd
**Kontraktsvärden som referens**
- Lärplattform för en hel region (Region Skåne): 17 MSEK totalt för hela avtalsperioden. — [TED 107114-2024](https://ted.europa.eu/sv/notice/107114-2024/html)
- UX-konsulter för Region Stockholms AI-assistenter: 680 000 kr. — [TED 526686-2026](https://ted.europa.eu/sv/notice/526686-2026/html)
- Sjöfartsverkets RFI om ett generativt AI-verktyg: uppskattat 7 MSEK. — [TED 628704-2025](https://ted.europa.eu/sv/notice/628704-2025/html)
- NHS Copilot: omkring 120 miljoner pund för 505 000 anställda. Det motsvarar ungefär 240 pund per person för hela avtalet; avtalstiden framgår inte av utdraget, så beloppet per år är okänt. — [HTN](https://htn.co.uk/2026/06/08/national-roll-out-of-microsoft-copilot-announced-for-500000-nhs-staff/) (beräkningen är egen)

**Prisgränser som styr modellen**
- Under 700 000 kr kan köpet göras som direktupphandling, och från 100 000 kr finns dokumentationskrav. — [Upphandlingsmyndigheten](https://www.upphandlingsmyndigheten.se/regler-och-lagstiftning/troskelvarden-och-direktupphandlingsgranser/)
- Vid avtal över flera år räknas det totala värdet för hela avtalstiden inklusive förlängningar mot gränsen. — [Upphandlingsmyndigheten, beräkning av värdet](https://www.upphandlingsmyndigheten.se/inkopsprocessen/forbered-upphandling/valja-upphandlingsforfarande/direktupphandling/) (beräkningsreglerna nämns på sidan; regeln om att avtalstiden räknas är allmän LOU-praxis och detaljerna lästes inte)

### Slutsatser (egna)
- Licensiera **per enhet eller avdelning** (MT-avdelning, klinik eller vårdavdelning) per år, till exempel per installation och antal bruksanvisningar. Undvik pris per användare, eftersom personal roterar och delar datorer. Ett regionpris kan erbjudas när antalet installationer blir stort.
- En tvåårig pilot eller ett avdelningsavtal bör hållas så att totalvärdet inklusive optioner ligger under 700 000 kr. Ett regionavtal kräver upphandling eller avrop via ramavtal.
- Prisargument: kostnaden för en undvikbar allvarlig vårdskada och för utbildningstid jämfört med licenskostnaden. Konkreta kostnader för vårdskador är inte sökta.

### Luckor
- Faktiska listpriser för Medusa och andra MT-system, för e-lärande per användare och för Copilot-licenser i svenska regioner hittades inte.
- Pilotupplägg (betalda eller gratis) och referenskundsavtal i svensk vård är inte kartlagda.

---

## 5. Vägar in: finansiering, testbäddar och innovationsstöd

### Sammanfattning
Den mest konkreta finansiering som går att söka nu är **Vinnovas Innovativa startups 2026**: högst 500 000 kr, upp till 100 procent finansiering, och sista ansökningsdag den **12 januari 2027**. Medtech4Health (etapp 4 till och med 2028) har återkommande kompetenscheckar för småföretag. VGR:s Innovationsplattform tar emot förfrågningar från företag om att testa med vården.

### Källbelagda fynd
**Vinnova**
- Innovativa startups 2026:
  - Upp till 500 000 kr, med finansiering av upp till 100 procent av projektkostnaderna.
  - Bolaget ska vara ett svenskt aktiebolag, högst 10 år gammalt, med högst 10 anställda och en omsättning eller balansomslutning på högst 10 MSEK. Det får inte ha delat ut vinst under senaste räkenskapsåret och får inte vara börsnoterat.
  - Projektet ska ha passerat idéstadiet.
  - Utlysningen stänger 12 januari 2027 kl. 14. Öppningen sköts upp till 12 oktober 2026.
  - [Vinnova, Innovative startups 2026](https://www.vinnova.se/en/calls-for-proposals/innovative-startups/innovative-startups-2026)
- Över 1 100 startups har fått stöd via Innovativa startups sedan 2016. — [Vinnova, 50 miljoner till innovativa startups](https://www.vinnova.se/en/news/2025/10/50-million-to-innovative-startups/)
- Test & demo för små och medelstora företag 2026 (diarienummer 2026-01601) finansierar test och verifiering i realistiska test- och demomiljöer före marknadsintroduktion (funktion, prestanda, säkerhet, användbarhet). Den stängde 8 september 2026, och sidan visar datum för 2027, vilket tyder på en ny omgång. — [Vinnova, Test & demo 2026](https://www.vinnova.se/en/calls-for-proposals/utlysning-2026-01600/test--demo-for-small-and-mediumsized-2026-01601)
- Utlysningen Health and life sciences 2026-01508 ger upp till 2 MSEK per projekt och 18–24 månaders projekttid. — [Vinnova 2026-01508](https://www.vinnova.se/en/calls-for-proposals/2026-01505-en/2026-01508-en) (från sökutdrag, inte verifierat)
- Vinnova och SPRIND gjorde en utlysning om hälsodata med matchmaking (september 2026). — [Vinnova nyhet](https://www.vinnova.se/en/news/2026/09/from-health-data-to-innovation--new-opportunity-for-swedish-actors/)
- Det finns en svensk-indisk utlysning om AI för vård. — [Vinnova](https://www.vinnova.se/en/calls-for-proposals/swedish-indian-cooperation/)

**Medtech4Health**
- Etapp 4 pågår juli 2025 till december 2028 och fokuserar på implementering, internationalisering och nyttiggörande. Vinnovas finansiering är 13,5 MSEK. — [Vinnova, Medtech4Health fas 4](https://www.vinnova.se/en/p/medtech4health-phase-4)
- Kompetenshöjning i småföretag, våren 2026: högst 200 000 kr, och upp till 50 procent av kostnaden för en extern expert finansieras. Den stängde 10 mars 2026, och sidan visar fler datum 2026 och 2027, vilket tyder på återkommande omgångar. — [Vinnova, Medtech4Health Competence Enhancement](https://www.vinnova.se/en/calls-for-proposals/medtech4health-competence-enhancement-in-sme/medtech4health-competence-enhancement-2025-04877)
- Det finns ett Medtech4Health Innovation Award på 100 000 kr, och Medtech4Health och Swelife har haft en gemensam utlysning om samverkansprojekt. — [Mynewsdesk Medtech4Health](https://www.mynewsdesk.com/se/medtech4health)

**Regionala innovationsstöd och testbäddar**
- VGR Innovationsplattformen är regionens stödfunktion för innovation i vården. Den får varje år förfrågningar från life science-företag som vill komma i kontakt med vården, bland annat om användbarhetstester av medicinteknik. Den förvaltar också VGR:s Innovationsfond, och den rekommenderar att den sökande kontaktar plattformen eller Koncerninköp innan ansökan. — [VGR Innovationsplattformen, om oss](https://www.vgregion.se/en/ov/innovationplatform/about-us/); [årssammanställning 2024](https://www.vgregion.se/contentassets/3776282b66b44dd19ce06a6cf42fb2de/arssammanstallning-innovationsplattformen_2024.pdf); [utlysningstext Innovationsfonden](https://hh.vgregion.se/contentassets/e46f7570c91147a19330239a0089379a/utlysningstext-2023-ver1-2022-05-20.pdf)
- Region Stockholms Innovationsfond fördelades i två perioder 2026. — [Region Stockholm, fördelning period 1](https://www.regionstockholm.se/48e928/siteassets/forskning-och-innovation/fordelning-av-innovationsfonden-2026-period-1.pdf); [period 2](https://www.regionstockholm.se/499498/siteassets/forskning-och-innovation/fordelning-av-innovationsfonden-2026-period-2.pdf) (innehållet lästes inte; fonden riktar sig troligen till regionens egna medarbetare, vilket är en slutsats)
- Karolinska har en egen AI-organisation med en Chief AI Officer. — [Karolinska](https://www.karolinska.se/forskning-och-utbildning/fouui-nyheter/2026/01/joel-preger-har-fatt-uppdraget-som-chief-ai-officer/)

### Slutsatser (egna)
- **Ordning**:
  1. Sök Innovativa startups (senast 12 januari 2027) för validering och en första pilot.
  2. Skaffa en klinisk partner via Innovationsplattformen i VGR eller en MT-avdelning som "behovsägare".
  3. Sök Test & demo 2027 för att verifiera produkten på sjukhus.
  4. Använd Medtech4Health-checken för regulatorisk kompetens (MDR-kvalificering) eller IT-säkerhet.
- En MT-avdelning som medutvecklare, till exempel inom ramen för Karolinskas MT utveckling och förvaltning, som har en egen utvecklingsgrupp med KI och KTH, ger trovärdighet och en referenskund.

### Luckor
- Almi (lån och verifieringsmedel), EIC Accelerator, TEF-Health, AI Sweden och Swelife (programmets status 2026) är inte verifierade i denna omgång.
- Sahlgrenska Science Park, Region Skånes och Region Stockholms innovationsenheter och testbäddar för startups är inte kartlagda.

---

## 6. Vad bolaget behöver: försäkring, informationssäkerhet, avtal och administration

### Sammanfattning
Adda:s allmänna villkor sätter golvet för vad ett litet bolag måste klara: försäkring som täcker skadeansvar upp till **10 MSEK för person- eller sakskada och 2 MSEK för ren förmögenhetsskada** per skada och år, vite på 2 procent av priset för den felaktiga delen, och ett personuppgiftsbiträdesavtal om bolaget hanterar personuppgifter. Krav på ISO 27001, escrow och SLA är inte verifierade i denna omgång.

### Källbelagda fynd
- Adda Programvaror och molntjänster 2023, bilaga 03: ansvar vid vårdslöshet, skadeslöshet mot tredje man, ansvarstaken 10 MSEK och 2 MSEK per skada och år, inget tak vid grov vårdslöshet eller uppsåt, krav på försäkring under hela kontraktstiden och vite på 2 procent. Myndigheten får dessutom vissa vederlagsfria, i tiden obegränsade rättigheter (exklusiva respektive icke-exklusiva) till delar av leveransen, troligen till kunddata och särskilt framtaget material; det exakta omfånget lästes inte. — [Adda, bilaga 03](https://www.adda.se/globalassets/2.-upphandling-ramavtal/3.-it-digitalisering/programvaror/programvaror-och-molntjanster-2023/bilaga-03-allmanna-kontraktsvillkor.pdf)
- Leverantörskontrollen och den egna försäkran (ESPD) ändras från 1 juli 2026 (15 kap. "Egen försäkran och utredning om leverantörer"). — [Riksdagen, prop. 2025/26:177](https://data.riksdagen.se/dokument/HD03177.html)
- Regionerna tittar på användbarhet och GDPR när de bedömer piloter. VGR:s förstudie om kontaktfri mätning av vitalparametrar fann att alla fyra företagen uppgav att de uppfyllde GDPR, men inget hade testat tekniken i praktiken, och det sågs som ett hinder för pilotprojekt. — [VGR årssammanställning Innovationsplattformen 2024](https://www.vgregion.se/contentassets/3776282b66b44dd19ce06a6cf42fb2de/arssammanstallning-innovationsplattformen_2024.pdf) (från sökutdrag)

### Slutsatser (egna, ej verifierade i källor)
- **Försäkring**: produktansvars- och allmän ansvarsförsäkring plus IT- eller konsultansvar (förmögenhetsskada) med belopp som täcker 10 MSEK respektive 2 MSEK. Begär offert tidigt från försäkringsbolag med IT-produkter (till exempel Hiscox, Länsförsäkringar, If, Trygg-Hansa). Bolagsnamnen är exempel och inte verifierade.
- **Informationssäkerhet**: eftersom Lotsa körs offline och inte behandlar patientdata blir kraven lättare. Ett dokumenterat ledningssystem enligt ISO 27001 (utan certifiering i början), en säkerhetsbeskrivning, en SBOM, en signerad installer och svar på regionens säkerhetsenkät räcker sannolikt för en pilot. Certifiering kan bli ett krav i större upphandlingar.
- **F-skatt, moms, ESPD och skatteintyg** behövs för alla anbud. Se till att bolaget är registrerat för F-skatt och moms innan första fakturan.
- **Escrow eller källkodsdeposition** kan efterfrågas när ett litet bolag levererar verksamhetskritisk programvara. Erbjud det som option för att minska kundens risk med en tvåpersonsleverantör.
- **Support och SLA**: definiera svarstider på kontorstid och patch-rutin för en offline-installation (hur uppdateringar levereras).

### Luckor
- Krav på ISO 27001 och SLA i faktiska svenska anbudsunderlag för vårdprogramvara lästes inte.
- Kammarkollegiets allmänna villkor för statliga IT-ramavtal (2027 flyttar de till Upphandlingsmyndigheten) och regionernas egna standardvillkor lästes inte.
- Försäkringspremier för en liten svensk mjukvaruleverantör inom vård är inte sökta.

---

## 7. Svårigheter och motåtgärder

### Sammanfattning
De största hindren är långa säljcykler, att budgeten och upphandlingen sitter hos andra än användaren, IT-säkerhetsgranskning, konkurrens från "gratis" generell AI och tillverkarnas kontroll över bruksanvisningarna. De starkaste motåtgärderna är att hålla piloter under direktupphandlingsgränsen, att offline-designen förenklar säkerhetsgranskningen, och att samarbeta med MT-avdelningen som intern ägare.

### Källbelagda fynd
- Upphandlande organisationers egna riktlinjer kan ha gränser som är betydligt lägre än 700 000 kr. — [Upphandlingsmyndigheten](https://www.upphandlingsmyndigheten.se/inkopsprocessen/forbered-upphandling/valja-upphandlingsforfarande/direktupphandling/)
- VGR Innovationsplattformen rekommenderar kontakt med Koncerninköp innan ansökan, eftersom frågor ofta behöver utredas innan finansiering kan ges. Det tyder på att upphandlingen behöver kopplas in tidigt. — [VGR utlysningstext](https://hh.vgregion.se/contentassets/e46f7570c91147a19330239a0089379a/utlysningstext-2023-ver1-2022-05-20.pdf)
- Konkurrens från regionernas egna AI-satsningar: Region Stockholms AI-assistenter och Karolinskas Chief AI Officer. — [TED 526686-2026](https://ted.europa.eu/sv/notice/526686-2026/html); [Karolinska](https://www.karolinska.se/forskning-och-utbildning/fouui-nyheter/2026/01/joel-preger-har-fatt-uppdraget-som-chief-ai-officer/)
- Tillverkarna äger bruksanvisningarna. eIFU blir standard för professionella produkter, och papper ska lämnas kostnadsfritt på begäran. — [EU-kommissionen](https://health.ec.europa.eu/latest-updates/commission-simplifies-instructions-use-medical-devices-further-digitalise-healthcare-systems-2025-06-25_en)
- Underrapportering av tillbud gör att problemet är svårt att mäta. — [Läkartidningen](https://lakartidningen.se/nyheter/bara-24-anmalningar-till-lmv-om-cosmic-bekymmersamt/)

### Slutsatser (egna): svårigheter och motåtgärder
| Svårighet | Motåtgärd |
|---|---|
| Lång säljcykel (ofta 12–24 månader för regionavtal; siffran är inte verifierad) | Betald pilot under 700 000 kr och färdigt underlag för direktupphandlingsdokumentation; parallellt avtal med en Adda-återförsäljare |
| Budgeten sitter hos MT eller IT, nyttan hos vårdavdelningen | Sälj till MT-avdelningen som förvaltare av utrustningsparken; argumentera med att Lex Maria-åtgärder om "utbildning" kan stödjas |
| IT-säkerhetsgranskning | Offline, ingen patientdata, signerade paket, säkerhetsbeskrivning, ISMS enligt ISO 27001-struktur |
| "Vi har ju Copilot eller AI-assistenten" | Visa citatkontroll mot manualen, svar enbart ur bruksanvisningen och offline-drift; positionera Lotsa som komplement |
| Tillverkare motsätter sig AI-tolkning av deras bruksanvisningar, eller upphovsrätt | Kunden laddar själv upp PDF:erna och svaren citerar ordagrant med källa; bjud in tillverkare och distributörer som partner (eIFU-länkning) |
| Liten leverantör, risk för kontinuitet | Escrow, öppna dataformat, försäkring enligt Adda:s nivåer, referens från en universitetssjukhus-MT |
| Regulatorisk osäkerhet (MDR-kvalificering av programvaran) | Avgränsa avsett ändamål till dokumentsökning och information, inte beslutsstöd; använd en Medtech4Health-check för regulatorisk expertis |
| Budgetår (regionernas budgetar beslutas på hösten för nästa år) | Föreslå pilotstart i början av året eller finansiera via innovationsfond eller Vinnova (Innovativa startups sista dag 12 januari 2027) |

### Luckor
- Inga källor om faktisk längd på säljcykler eller om regionernas budgetprocess hämtades.
- Inga källor om tillverkares hållning till AI över deras bruksanvisningar hittades.
- Nordiska marknader (Norge, Danmark, Finland: upphandlingsgränser och inköpscentraler som SKI, Sykehusinnkjøp och Hansel) söktes inte.
