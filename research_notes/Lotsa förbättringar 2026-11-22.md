# Lotsa: inspiration, regeländringar och förbättringar (22 november 2026)

Underlag till produktplanen. Bygger vidare på `reports/Lotsa lokal AI fullständig plan.md` (nedan "planen") och upprepar inte det som står där. Del A gäller befintliga produkter och forskning, del B vad som har ändrats eller saknades i planens juridiska del, och del C är en rangordnad lista med förbättringar.

Märkning: **[källa]** = läst i primärkälla i dag, **[sekundär]** = bara sökutdrag, nyhet eller leverantörens egen text, **[slutsats]** = egen bedömning. Inget här är juridisk rådgivning.

Begränsningar: Webbplatserna för Nuvolo (eam.nuvolo.com), Läkemedelsverket (via WebFetch) och EUR-Lex (botspärr) gick inte att läsa direkt från den här miljön. Läkemedelsverkets PDF-vägledning och Riksdagens öppna data hämtades med curl. Dräger, Baxter och Getinge gav inga träffar om AI-assistenter för bruksanvisningar.

---

## Sammanfattning

1. **Ingen hittad produkt gör det Lotsa gör**: offline, tillverkaroberoende, riktad till vårdpersonal och med ordagrann citatkontroll mot kundens egna bruksanvisningar. Närmast kommer molnbaserade AI-assistenter för tekniker (TRIMEDX, Mavenoid, Neuron7, Bruviti), CMMS-system med manualer kopplade till arbetsordrar (Nuvolo/ServiceNow, Accruent, Medusa) och tillverkarnas dokumentportaler (Philips InCenter, B. Braun eIFU).
2. **ECRI rankar "misuse of AI chatbots" som årets största hälsoteknikrisk (2026)**. Deras exempel är en ren bruksanvisningsfråga: var neutralelektroden får placeras. En generell chattbot svarade fel. Det är det starkaste säljargumentet för Lotsa som finns, om det används utan påståenden om patientsäkerhet (se planens tabell "Undvik").
3. **Forskningen bekräftar att citat måste kontrolleras i kod.** VERICITE (BioNLP 2026) fann att bara 27–41 % av citaten i medicinsk RAG faktiskt stöddes på meningsnivå, och att bättre dokument inte hjälpte. Små verifieringsmodeller på 3B (Med-V1) når nära GPT-5-nivå på att bedöma om en källa stöder ett påstående.
4. **Produktansvar: datumfrågan är löst.** Propositionen 2026/27:12 och civilutskottets betänkande 2026/27:CU4 anger ikraftträdande **1 januari 2027** (9 december 2026 var lagrådsremissens datum). 1992 års lag gäller för produkter som släpps ut före ikraftträdandet. Kammarens beslut är planerat till **25 november 2026** och var inte fattat i dag.
5. **Läkemedelsverkets AI-vägledning version 2 (2 april 2026)** innehåller en checklista för vårdgivare och en mening som påverkar affärsmodellen: en vårdgivare som ger ett AI-system **egen märkning (namn och design)** får tillverkaransvar. White label till regioner ska därför undvikas.
6. **Cybersäkerhetsförordningen (2025:1507)**: IVO har tillsyn över vårdgivare, länsstyrelserna över regioner som offentlig förvaltning och Läkemedelsverket över tillverkare av medicintekniska produkter. Lotsa AB omfattas inte själv, men leverantörskraven kommer från två tillsynsled.
7. **Tillgänglighet**: DOS-lagen gäller fortfarande bara webbplatser och mobilappar, men **LOU 9 kap. 2 §** kräver att tekniska specifikationer tar hänsyn till tillgänglighet när det som köps ska användas av fysiska personer. Det gäller alltså även personalverktyg vid annonserad upphandling.
8. **Upphovsrätt**: B. Brauns eIFU-portal stänger ute alla robotar (`robots.txt: Disallow: /`) och villkoren förbjuder återgivning för kommersiellt bruk utan skriftligt tillstånd. Det stärker planens linje: bara kunden laddar upp, inget hämtas automatiskt, och tillverkarnas tillstånd ska sökas innan något delat bibliotek byggs.
9. **Läkemedelsverket publicerar säkerhetsmeddelanden (FSN) öppet och erbjuder prenumeration.** Det ger en enkel väg att hantera planens största praktiska risk, inaktuella manualer, utan att appen behöver vara online.

---

## A. Befintliga produkter och forskning

### A1. Tillverkarnas egna AI- och dokumenttjänster

| Produkt | Vad den gör | Vad Lotsa kan lära | Skillnad mot Lotsa |
|---|---|---|---|
| **Philips InCenter** ([Philips](https://www.usa.philips.com/healthcare/support/incenter)) och **Philips Resource center / eIFU** ([eifu.philips.com](https://eifu.philips.com)) | Dokumentportal för IFU, servicedokument, applikationsnoteringar och "Product Security Status". Åtkomst och nedladdning beror på serviceavtalet. Customer Services Portal har en funktion för "Notification Subscription" ([användarguide maj 2026](https://www.philips.com/c-dam/b2bhc/master/support/philips-customer-services-portal-user-guide.pdf)) **[sekundär]** | Visa dokumenttyp (IFU, teknisk beskrivning, säkerhetsstatus) som metadata. Låt MT notera var dokumentet hämtades och med vilket avtal | En portal per tillverkare, ingen fråga–svar, kräver inloggning och nät |
| **B. Braun eIFU** ([eifu.bbraun.com](https://eifu.bbraun.com)) och "Service Assistant" ([B. Braun](https://www.bbraun.com/en/about-us/company/stories/artificial-intelligence-proves-itself-in-medical-technology.html)) | eIFU-portal. Ett internt AI-projekt för service sedan 2023 **[sekundär]** | Portalens villkor visar vad tillverkare förväntar sig (se B6) | Tillverkarens egen produktfamilj, inte hela parken |
| **Siemens Healthineers** kundsupport ([integritetsmeddelande juni 2026](https://www.siemens-healthineers.com/en-my/privacy-notice-digital-and-business-activities)) | AI i kundsupport. Användaren informeras "at the beginning of the interaction" om att den talar med ett AI-system och hänvisar till art. 50 AI-förordningen **[källa via sökutdrag]** | Konkret mall för art. 50-text: säg det i början av varje session, inte bara i "Om" | Molntjänst |
| **GE HealthCare OnWatch Predict** ([TRIMEDX-blogg](https://www.trimedx.com/blog/how-ai-is-powering-smarter-medical-equipment-service)) | Prediktivt underhåll från maskindata, uppges minska oplanerade stopp med över 60 % **[sekundär]** | Inget att ta efter. Det är just den koppling till maskindata som planen förbjuder (regel 3.3) | Kopplad till utrustningen, MDR-nära |
| **Mavenoid** ([medical devices](https://mavenoid.com/en/medical-devices)), **Neuron7** ([medical devices](https://www.neuron7.ai/industries/medical-devices)), **Bruviti** ([blogg](https://bruviti.com/blogs/ai-solves-medical-device-support-challenges)) | AI-support som tillverkare köper för felsökning, installation och dokumentation. Mavenoid betonar "device data, not patient data" **[sekundär]** | Felsökningsträd (ja/nej-steg) som komplement till fritext. "Enhetsdata, inte patientdata" är en bra formulering | Säljs till tillverkare, inte till vården. Molnbaserat |

**[slutsats]** Inga av de stora tillverkarna (Philips, GE, Siemens, B. Braun, Dräger, Getinge, Baxter) har en publik AI-assistent för vårdpersonal som svarar ur bruksanvisningen. Det är både en lucka och en risk: om en tillverkare lanserar en, blir den bättre på den egna produkten men täcker aldrig hela avdelningens park. Lotsas försvar är tillverkaroberoendet och att appen fungerar offline.

### A2. CMMS/HTM-plattformar och tekniktjänster

| Produkt | Vad den gör | Lärdom | Skillnad |
|---|---|---|---|
| **Nuvolo / ServiceNow Clinical Device Management** ([Nuvolo](https://www.nuvolo.com/solutions/clinical), [ServiceNow CMMS-flöde](https://www.servicenow.com/docs/r/xanadu/healthcare-life-sciences/cmms-workflow-issue-scenario.html)) | Manualer, installationsguider och förslag på förebyggande underhåll kopplas automatiskt till arbetsordern. Now Assist sammanfattar arbetsordrar med generativ AI ([ServiceNow 2023](https://newsroom.servicenow.com/press-releases/details/2023/ServiceNow-launches-major-expansion-to-Now-Assist-generative-AI-portfolio-with-new-capabilities-to-transform-experiences-and-increase-productivity-11-16-2023-traffic/default.aspx)) **[sekundär]** | Knyt dokument till **inventarienummer/modell/UDI-DI**, inte bara till "enhet". Gör importen från MT-systemet till en kärnfunktion | Riktat till tekniker, molnbaserat, dyrt |
| **Accruent TMS** ([Accruent](https://www.accruent.com/industries/healthcare)) | CMMS för över 800 vårdorganisationer **[sekundär]**. AI-lager från tredje part (Facilio) via REST-API | Integration via export/import av filer räcker långt. Ett API kan vänta | Ingen fråga–svar mot manualer hittad |
| **Medusa (SOFTPRO)** ([Clinical Services Journal](https://www.clinicalservicesjournal.com/story/9684/medical-engineering-efficient-work-solutions), [Medusa Mobile](https://apps.apple.com/se/app/medusa-mobile/id1181817886)) | Det vanligaste MT-systemet i Skandinavien. Mobilappen täcker utrustning, ärenden, arbetsordrar och förebyggande underhåll. Dokumentstöd kräver v7.02.01 **[sekundär]** | **Importera Medusas utrustningslista** (CSV/Excel) så att MT slipper registrera enheter två gånger. Lotsa ska komplettera Medusa, inte konkurrera | Medusa saknar fråga–svar. Lotsa saknar inventarieregister och ska inte bygga ett |
| **TRIMEDX-AIQ technician agent** ([pressmeddelande](https://www.trimedx.com/resource/trimedx-introduces-new-agentic-ai-capabilities)) | Agent för tekniker byggd på 25 års servicehistorik. Intresse för en kundriktad version för enkel felsökning **[sekundär]** | Bekräftar efterfrågan på "första linjens felsökning" | Bygger på egen servicedata i USA, inte på kundens manualer |
| **ECRI** ([2026 hazards](https://home.ecri.org/blogs/ecri-news/misuse-of-ai-chatbots-tops-annual-list-of-health-technology-hazards), [AI-resurser](https://home.ecri.org/pages/ai-resources), [Problem Reporting Network](https://home.ecri.org/blogs/ecri-news/ecri-expands-problem-reporting-network-and-calls-for-more-data-on-ai-errors-in-patient-care/)) | Oberoende utvärderingar, larmbevakning och topplista över teknikrisker. 2026 års etta är felanvändning av AI-chattbotar. Exemplet: en chattbot sa felaktigt att neutralelektroden fick placeras över skulderbladet **[källa]**. ECRI ber vården rapportera AI-fel, även nära misstag | Använd ECRI:s exempel i säljmaterial och i testmängden ("röda" och "gula" frågor). Bygg en enkel rutin för att rapportera AI-fel (se C) | ECRI har ingen manualsökning. Listan om "insufficient planning for systems outages" talar för Lotsas offline-läge |

### A3. Svenska kunskapsstöd vid vårdpunkten

| Tjänst | Relevans | Lärdom | Skillnad |
|---|---|---|---|
| **Vårdhandboken / 1177 för vårdpersonal (Inera)** ([förstudie](https://www.inera.se/globalassets/inera/media/dokument/projekt/1177-och-nara-vard/forstudie-1177-for-vardpersonal---slutrapport.pdf), [verksamhetsinriktning 2026–2028](https://www.inera.se/globalassets/inera/media/dokument/om-inera/sa-styrs-inera/ineras-verksamhetsinriktning-2026-2028-med-budgetram.pdf)) | Inera standardiserar metadata Q2 2026–Q1 2027 för gemensam sökning över "validerade externa kunskapskällor", med AI och API som framtida användning **[sekundär]**. Kommunala riktlinjer hänvisar till Vårdhandboken för rengöring av utrustning | Vårdhandboken är den källa personalen redan litar på för rengöring och hygien. Lotsa bör kunna **länka ut** ("se även Vårdhandboken: Desinfektion") men aldrig blanda in texten i svaret | Vårdhandboken är generisk och leverantörsneutral. Lotsa är produktspecifik. Ineras sök kan på sikt bli en konkurrent eller en kanal |
| **Regionala riktlinjer för MTP** (t.ex. [Region Örebro län](https://vardgivare.regionorebrolan.se/globalassets/media/dokument/platina/riktlinjer/riktlinjer-for-hantering-av-medicintekniska-produkter---undersokningsutrustningbehandlingshjalpmedel.876989.pdf), [Region Halland, mall för bruksanvisning vid egentillverkning](https://vardgivare.regionhalland.se/app/uploads/2026/05/Bilaga-5a-Bruksanvisning-Egentillverkad-medicinteknisk-produkt-enligt-MDR.docx)) | Riktlinjerna kräver att personalen har tagit del av bruksanvisningen och att den finns tillgänglig. Ingen regional sökbar manualdatabas hittades **[sekundär]** | Säljargument: Lotsa hjälper verksamheten att uppfylla kravet att bruksanvisningen "finns tillgänglig". En kvittens "jag har läst avsnittet" kan stödja utbildningsdokumentation (men väcker MBL- och övervakningsfrågor, se C) | — |
| **Internetmedicin, Janusinfo** | Kliniska kunskapsstöd. Inget om AI-sök över bruksanvisningar hittades | Lotsa ska inte röra sig mot klinisk kunskap. Länka bara | — |
| **UpToDate Expert AI** ([valideringsramverk 21 maj 2026](https://www.wolterskluwer.com/en/news/validation-framework-evaluating-clinical-ai-point-of-care)) | Valideringsramverk med tre dimensioner (clinical intent, knowledge integrity, clinical impact). Läkarskrivna bedömningsmallar ("rubrics"), red teaming, expertgranskning och övervakning. Uppger 99,9 % "clinical alignment" över 15 000 kriterier **[sekundär, leverantörens siffra]** | **Kopiera strukturen, inte siffran.** Publicera en kort valideringsrapport per release: testmängd, kriterier skrivna av MT-ingenjörer, andel korrekta citat, andel "står inte i manualen" på obesvarbara frågor, 100 % vägran på röda frågor | Klinisk produkt med redaktion. Lotsa har ingen redaktion utan kundens egna manualer |
| **OpenEvidence** ([JAMA-studie okt 2026 om frågeloggar](https://consultorsalud.com/wp-content/uploads/2026/10/jama_patel_2026_oi_260127_1791842940.75115.pdf)) | Månatliga frågor per aktiv användare ökade från 18 till 39,5 mellan jan 2024 och jun 2026 **[sekundär]**. Uppges ha lämnat EU och Storbritannien i april 2026 **[sekundär, overifierat]** | Frågeloggar kan publiceras forskningsmässigt utan fritext. Lotsas loggar med enbart metadata (planen) ger liknande möjligheter | Klinisk, molnbaserad |

### A4. eIFU, UDI och EUDAMED

Planen har redan eIFU-förordningen 2021/2226 och ändringen 2025/1234. Nytt:
- **eIFU-adressen ska registreras i UDI-databasen** (MDR bilaga VI del B punkt 22, obligatorisk enligt art. 7.3 i 2021/2226 för den som ersätter papper med eIFU) ([Cuatrecasas](https://www.cuatrecasas.com/en/spain/life-sciences-healthcare/art/eu-electronic-ifu-rules)). UDI-modulen i EUDAMED är obligatorisk från 28 maj 2026 ([Kommissionen](https://health.ec.europa.eu/medical-devices-eudamed/udidevices-registration_en)). En leverantör anger **28 november 2026** som sista dag för produkter som släpptes ut före 28 maj 2026 ([Matrix eIFU](https://matrixone.health/blog/eudamed-and-eifu-how-to-register-your-url-before-the-may-2026-mandatory-deadline)) **[sekundär, overifierat]**. EUDAMED har ett publikt API med sökning på UDI-DI ([användarguide](https://webgate.ec.europa.eu/eudamed-play-help/en/files/Public%20API%20-%20user%20guide.pdf)).
- **[slutsats]** Lotsa bör lagra **Basic UDI-DI/UDI-DI** och **eIFU-adress** per dokument. Då kan MT, på en dator med nät, öppna rätt eIFU-sida direkt för att se om det finns en nyare revision. Appen själv behöver inte vara online.
- **Läkemedelsverket publicerar säkerhetsmeddelanden (FSN)** för medicintekniska produkter och erbjuder prenumeration ([publicerade FSN](https://www.lakemedelsverket.se/sv/medicinteknik/folj-upp-anvandning/rapportering-av-fsca-fsn/publicerade-sakerhetsmeddelanden-fsn/), [prenumeration](https://www.lakemedelsverket.se/sv/medicinteknik/folj-upp-anvandning/rapportering-av-fsca-fsn/prenumeration-av-publicerade-sakerhetsmeddelanden-fsn/)) **[källa: sidorna finns i webbplatsens sitemap]**. Exempel som gäller typisk avdelningsutrustning: Airvo 2/3 (Fisher & Paykel), anestesienheter från Datex-Ohmeda. **[slutsats]** MT kan med ett klick markera ett dokument "FSN finns, läs säkerhetsmeddelandet" och bifoga det. Lotsa visar då en tydlig banderoll över alla svar från den manualen. Det är en lågtekniskt lösning på planens största praktiska risk.
- **eIFU-tjänsteleverantörer** som Matrix eIFU (dokspot) driver portaler åt tillverkare ([villkor 2026-01-01](https://a.storyblok.com/f/339665/x/8839b0faaa/matrix-eifu-terms-of-service-and-sla-20260101.pdf)) **[sekundär]**. **[slutsats]** De är en tänkbar partner för en framtida licensierad funktion "hämta senaste revision", eftersom de redan har tillverkarnas uppdrag och versionshistorik.

### A5. Forskning om RAG, citat och manualer

| Arbete | Fynd | Vad Lotsa tar med sig |
|---|---|---|
| **VERICITE** ([BioNLP 2026](https://aclanthology.org/2026.bionlp-1.62/)) **[källa: abstract]** | Fyra LLM, 500 BioASQ-frågor. Bara 27–41 % av citaten stöds på meningsnivå vid k=3–5, och andelen sjunker när fler dokument hämtas. Med perfekta dokument blir svaren bättre men inte citaten. Kontroll med NLI-modell (DeBERTa-v3-large) | Bekräftar planens linje "extrahera, sedan svara" och kontroll i kod. **Hämta få avsnitt** (låg k). Lägg till en **NLI-kontroll** som andra steg efter den ordagranna kontrollen: stöder citatet verkligen påståendet i svaret? |
| **Med-V1** ([arXiv 2603.05308](https://arxiv.org/abs/2603.05308), [modeller](https://huggingface.co/nlm-dir/Med-V1-Q3B)) **[källa: abstract och modellkort]** | 3B-modeller för att avgöra om en källa stöder ett påstående (SUPPORT/NEI/CONTRADICT). Förbättring 27–71 % mot basmodellen, i nivå med GPT-5 enligt författarna | En liten verifierare är realistisk på CPU. **Licensvarning:** Med-V1-Q3B är märkt MIT men bygger på Qwen2.5-3B-Instruct som har licensen `qwen-research` (inte för kommersiellt bruk utan avtal). L3B bygger på Llama 3.2 (Llama-licens). Använd idén och träna egen verifierare på Qwen3.5 eller använd en NLI-modell med fri licens |
| **MedCite** ([arXiv 2506.06605](https://arxiv.org/abs/2506.06605)) | Ramverk för att generera och utvärdera citat i medicinsk QA. Flerstegsmetod (hämta, citera, hämta igen) ger bättre citatprecision. Automatisk utvärdering korrelerar med experter | Mät **citatprecision och citat-recall** separat i testrapporten |
| **SourceCheckup** ([arXiv 2402.02008](https://arxiv.org/abs/2402.02008)) | Även GPT-4 med RAG lämnar många påståenden utan stöd i den citerade källan | Referens i valideringsrapporten: varför en citatkontroll i kod behövs |
| **Agri-Query** ([arXiv 2508.18093](https://arxiv.org/abs/2508.18093)) **[källa: abstract]** | QA över en maskinmanual på engelska, franska och tyska, med obesvarbara frågor. Hybrid-RAG (nyckelord + semantik) slår långa kontextfönster. Qwen 2.5 7B nådde över 85 % med RAG | Mycket nära Lotsas problem: **svensk fråga mot engelsk manual**. Ramverket är öppet och kan återanvändas för Lotsas testmängd. Stöder planens val av FTS5 + bge-m3 |
| **INGENZI / Philips HDI 5000** ([arXiv 2601.16967](https://arxiv.org/abs/2601.16967)) | LLM-stöd för tekniker i låginkomstländer. 100 % precision på felkodstolkning, 80 % på föreslagna åtgärder. Forum för ovanliga fel | Felkoder går att få nästan perfekta med en **strukturerad larmtabell**, medan åtgärdsförslag är svårare. Lotsas larmregister är rätt väg. Forum motsvarar "Lokala tips" |
| **RAG över institutionella manualer inom nuklearmedicin** ([PMC12339626](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12339626/)) | RAG över 40 PDF-manualer från ett sjukhus, LLM-bedömning **[sekundär]** | Visar att sjukhus publicerar sådana utvärderingar. En pilotregion kan bli medförfattare till en svensk motsvarighet |
| **Best practices för medicinsk RAG** ([arXiv 2602.03368](https://arxiv.org/abs/2602.03368)) | Systematisk genomgång av komponenter och avvägning mellan prestanda och effektivitet | Checklista vid arkitekturval |

**[slutsats]** Det saknas ett publikt testset för frågor om bruksanvisningar till medicintekniska produkter. Om Lotsa AB publicerar en liten, licensfri testmängd (frågor plus sidhänvisningar, inte manualtext) blir bolaget referenspunkt och får ett trovärdighetsargument mot regionerna.

---

## B. Regler och standarder: vad som har ändrats eller saknades i planen

### B1. Produktansvar: ikraftträdandet är 1 januari 2027, inte 9 december 2026

- Prop. 2026/27:12 (15 oktober 2026) föreslår att den nya lagen träder i kraft **1 januari 2027**. Regeringen skriver att det är "den tidigast möjliga tidpunkten", trots att direktivet kräver 9 december 2026. Datumet 9 december 2026 finns bara i bilagorna (utredningens och lagrådsremissens förslag) ([prop. 2026/27:12, data.riksdagen.se](https://data.riksdagen.se/dokument/HE0312)) **[källa]**.
- Övergångsregel: "1992 års lag ska fortsätt vara tillämplig på produkter som har släppts ut på marknaden eller tagits i bruk före den nya lagens ikraftträdande" **[källa]**.
- Civilutskottet tillstyrkte i bet. **2026/27:CU4** (19 november 2026). Inga motioner. Beslut i kammaren planerat **25 november 2026** enligt Riksdagens öppna data ([CU4](https://data.riksdagen.se/dokument/HE01CU4)) **[källa]**. Ej fattat i dag.
- Betänkandet bekräftar: fristående programvara omfattas, ren förmögenhetsskada vid förlust eller förvanskning av data ersätts, och bevislättnader införs **[källa]**.
- **[slutsats]** Planens "motstridighet" om datumet är löst. Ett exemplar av Lotsa som levereras (släpps ut) före 1 januari 2027 omfattas av 1992 års lag. Varje ny version som släpps ut från 1 januari 2027 omfattas troligen av den nya lagen. Direktivet har ingen direkt effekt mellan privata parter, så glappet 9–31 december 2026 är främst en fråga för staten. **Förlust eller förvanskning av data** är nytt och relevant: om Lotsa förstör kundens index eller dokumentregister kan det bli en ersättningsgill skada. Det talar för säkerhetskopiering och export av MT:s registreringar (se C).

### B2. AI-förordningen

- Planen stämmer: omnibusen publicerades 24 juli 2026, högrisk enligt bilaga III gäller från 2 december 2027 och enligt bilaga I från 2 augusti 2028 ([Cuatrecasas](https://www.cuatrecasas.com/en/portugal/intellectual-property/art/digital-omnibus-ai-has-been-published), [Orrick](https://www.orrick.com/ja-JP/Insights/2026/07/EU-AI-Act-Update-Digital-Omnibus-Finalizes-8-Compliance-Changes)) **[sekundär]**. Förordningsnumret 2026/1744 kunde inte kontrolleras eftersom EUR-Lex inte gick att läsa härifrån.
- **Nytt jämfört med planen:** Kommissionen publicerade den slutliga **uppförandekoden för märkning av AI-genererat innehåll** 10 juni 2026 och de slutliga **riktlinjerna om art. 50** 20 juli 2026. Kommissionen och AI-styrelsen har bekräftat att koden räcker för att visa efterlevnad ([Kommissionen](https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content), [Faegre Drinker](https://www.faegredrinker.com/zh/insights/publications/2026/7/eu-ai-act-commission-confirms-transparency-code-of-practice-as-adequate-and-publishes-final-version-of-its-guidelines-on-transparency-obligations)) **[sekundär]**. Koden kräver enligt kommentatorer **minst två lager maskinläsbar märkning** för art. 50.2 ([Freshfields](https://www.freshfields.com/en/our-thinking/blogs/technology-quotient/eu-ai-act-unpacked-33-the-final-code-of-practice-on-transparency-of-ai-generate-102n4yx)) **[sekundär]**.
- **[slutsats]** Planens öppna fråga om RAG-svar är "syntetisk text" ska besvaras mot riktlinjerna från 20 juli 2026, som inte har lästs i primärtext. Praktiskt: märk AI-text i gränssnittet (synligt), lägg metadata i exporterade svar och utskrivna snabbkort (t.ex. en rad "AI-genererad sammanfattning, Lotsa x.y, granskad av ..." plus metadata i PDF), och märk ordagranna citat som **tillverkarens text** och inte som AI-text. Skillnaden mellan citat och AI-text är både en art. 50-fråga och en förtroendesignal.
- Läkemedelsverkets vägledning v2 (april 2026) anger fortfarande att högriskkraven för medicintekniska AI-system gäller "tidigast den 2 augusti 2027", alltså före omnibusen **[källa]**. Hänvisa inte till den uppgiften.

### B3. CRA

- ENISA:s **Single Reporting Platform** är i drift sedan 11 september 2026 och uppgraderades till version 1.2.1 den 20 oktober 2026. En anmälan når både nationell CSIRT och ENISA. Frivillig rapportering aktiveras efter 11 september ([ENISA SRP](https://www.enisa.europa.eu/topics/product-security/single-reporting-platform-srp), [ENISA FAQ](https://www.enisa.europa.eu/topics/product-security/single-reporting-platform-srp/frequently-asked-questions)) **[sekundär: sökutdrag av ENISA:s sidor]**. Plattformen blev klar sent: CSIRT fick åtkomst 4 september och dokumentationen kom 10 september ([CSA](https://labs.cloudsecurityalliance.org/wp-content/uploads/2026/09/CSA_research_note_cra_single_reporting_platform_20260916-csa-styled.pdf)) **[sekundär]**.
- **[slutsats]** Planens "ENISA-konto" i fas 0 betyder konkret: registrera Lotsa AB i SRP, öva en testanmälan och skriv en rutin på en sida för 24/72 timmar. Resten av planens CRA-avsnitt gäller oförändrat.

### B4. MDR och Läkemedelsverket

- **MDCG 2019-11 rev.1 (juni 2025) är fortfarande gällande.** Ingen rev.2 hittades. Kommissionens lista visar MDCG 2021-24 rev.1 (april 2026) som nyaste klassificeringsvägledning ([Kommissionen, MDCG-lista](https://health.ec.europa.eu/medical-devices-sector/new-regulations/guidance-mdcg-endorsed-documents-and-other-guidance_en)) **[sekundär]**. Ingen ändring jämfört med planen.
- **Läkemedelsverkets "Vägledning rörande användning av artificiell intelligens i svensk sjukvård", version 2, daterad 2 april 2026** ([PDF](https://www.lakemedelsverket.se/globalassets/dokument/medicinteknik/artificiell-intelligens-ai/vagledning-anvandning-av-artificiell-intelligens-i-svensk-sjukvard_ver_2.pdf), [webbsida](https://www.lakemedelsverket.se/sv/medicinteknik/anvanda/anvandning-av-ai-i-sjukvarden/)) **[källa]**. Planen nämnde att Läkemedelsverkets webbvägledning inte var läst. Det viktigaste:
  - "Om en vårdgivare väsentligt modifierar ett AI-system, använder det utanför tillverkarens avsedda ändamål eller förser systemet med **egen märkning (t ex namngivning och design)**, omfattas det av tillverkaransvar ..." **[källa]**. **[slutsats]** Erbjud inte white label eller regionens logga som huvudvarumärke. Lotsa AB ska stå som tillverkare/leverantör i appen. Regionens anpassningar begränsas till konfiguration (MT-jourens nummer, avdelningar).
  - Om generativ AI: modellerna kan "få användaren att överskatta systemets förmåga till analys, omdöme och faktamässig korrekthet" **[källa]**. Detta talar för gränssnitt som visar källan först och AI-texten sedan.
  - Lokal drift: köparen bör begära dokumentation om "vilka integritetsbevarande tekniker som använts vid produktutvecklingen, och vilket eventuellt personuppgiftsansvar som användaren övertar om modellen drivs i lokal IT-infrastruktur" **[källa]**. **[slutsats]** Dokumentationspaketet behöver ett avsnitt om modellens träningsdata (Qwen3.5:s modellkort) och om att inga personuppgifter används vid Lotsa AB:s eventuella finjustering.
  - **Checklista för vårdgivare** (bl.a. att avsett ändamål överensstämmer med användningen, att produkten är korrekt kvalificerad, att resurser finns för hela livscykeln, att användbarheten är utvärderad med slutanvändare, att ansvarsfördelningen är dokumenterad, att prestandan övervakas och att fel rapporteras till tillverkaren och Läkemedelsverket) **[källa]**. **[slutsats]** Lotsa AB bör leverera ett ifyllt svar på varje punkt i checklistan som en del av godkännandepaketet. Det är billigt och kunden kommer att använda just den listan.
  - Vägledningen tar också upp nödrutiner vid systemavbrott och avveckling **[källa]**, vilket Lotsas reservläge utan AI redan stöder.
- **Socialstyrelsen** publicerade i september 2026 en rapport om ansvarsfull AI i vården. Att ett verktyg är CE-märkt garanterar inte att det fungerar lokalt, och det ska valideras i det egna arbetsflödet och följas upp ([Socialstyrelsen](https://www.socialstyrelsen.se/publikationer/ansvarsfull-anvandning-av-ai-i-halso--och-sjukvarden--insikter-och-forslag-fran-en-forstudie-med-brostcancerscreening-som-exempel-2026-9-10396/)) **[sekundär]**. **[slutsats]** Erbjud ett "lokalt valideringskit": kunden kör Lotsas testverktyg på sina egna manualer och får en rapport.
- **IVO:** Ingen AI-specifik tillsynsvägledning hittades. Det nya är att IVO är tillsynsmyndighet för vårdgivare enligt cybersäkerhetsförordningen (se B5). Regeringen gav IVO ett uppdrag om kunskapsstöd tillsammans med Socialstyrelsen, som ska redovisas senast 31 mars 2027 ([regeringen](https://www.regeringen.se/pressmeddelanden/2026/01/regeringen-ger-ivo-uppdrag-om-samverkan-och-kortare-handlaggningstider/)) **[sekundär]**.

### B5. Cybersäkerhetslagen: vem har tillsyn

Cybersäkerhetsförordningen (2025:1507) fördelar tillsynen ([SFS 2025:1507](https://data.riksdagen.se/dokument/sfs-2025-1507.html)) **[källa]**:
- **IVO**: vårdgivare i hälso- och sjukvårdssektorn.
- **Läkemedelsverket**: hälso- och sjukvårdssektorn utom vårdgivare, samt tillverkning av medicintekniska produkter.
- **Länsstyrelserna** i Norrbottens, Skåne, Stockholms, Västra Götalands, Örebro och Östergötlands län: offentlig förvaltning, med geografisk fördelning av kommuner och regioner (10–15 §§).
- **PTS**: digitala leverantörer och förvaltning av IKT-tjänster mellan företag.

**[slutsats]** En region kan alltså möta krav både som vårdgivare (IVO) och som offentlig förvaltning (länsstyrelsen). Lotsa AB omfattas inte själv så länge bolaget inte är en "förvaltad tjänsteleverantör" (fjärrdrift åt kunden) av minst medelstor storlek. Det är ytterligare ett skäl att inte erbjuda fjärrförvaltning som standard. Leverantörskraven kommer via MCFFS 2026:11 och avtalet, som planen beskriver.

### B6. Patientdatalagen och HSLF-FS 2016:40

Inget nytt utöver planen och dess anteckningar (HSLF-FS 2025:57 ändrar främst hänvisningar). Slutsatsen står sig: utan sparad fritext och utan patientuppgifter blir Lotsa inte en del av vårdens informationssystem med krav på behörighetsstyrning och loggkontroll.

### B7. Tillgänglighet

- **DOS-lagen (2018:1937)** är ändrad senast genom SFS 2026:1625. 4 § (definitionen av offentlig aktör) upphör att gälla 1 januari 2027, sannolikt i samband med att PTS och Digg slås samman. Lagen gäller fortfarande digital service genom de tekniska lösningar som direktiv 2016/2102 anger, alltså **webbplatser och mobilappar**. Privata vårdgivare med offentlig finansiering jämställs med offentliga aktörer (4 § andra stycket 3 b) ([SFS 2018:1937](https://data.riksdagen.se/dokument/sfs-2018-1937.html)) **[källa]**. Planens slutsats att en skrivbordsapp sannolikt faller utanför står sig. Men **om Lotsa också levereras som webbversion på regionens intranät eller som mobilvy (QR-flödet), omfattas den sannolikt**, och regionen måste då ha en tillgänglighetsredogörelse **[slutsats]**.
- **Saknades i planen: LOU 9 kap. 2 §.** "När det som anskaffas ska användas av fysiska personer ska de tekniska specifikationerna bestämmas med beaktande av samtliga användares behov, däribland tillgängligheten för personer med funktionsnedsättning. Undantag får göras endast om det finns särskilda skäl." ([LOU 2016:1145](https://data.riksdagen.se/dokument/sfs-2016-1145.html)) **[källa]**. Detta gäller vid annonserad upphandling, inte formellt vid direktupphandling. Regionerna hänvisar därför till EN 301 549 (V4.1.1 bygger på WCAG 2.2 AA, se planen).
- Lagen (2023:254) om vissa produkters och tjänsters tillgänglighet (EAA) gäller konsumentprodukter och konsumenttjänster och omfattar sannolikt inte Lotsa **[slutsats]**.
- **[slutsats]** Lotsa AB bör ta fram en **tillgänglighetsrapport enligt EN 301 549** (ACR/VPAT-format) för skrivbordsappen. Det kostar lite när gränssnittet ändå är HTML och kan testas med axe-core och skärmläsare (NVDA, Windows Skärmläsaren).

### B8. Upphovsrätt till tillverkarnas manualer

Planen har den rättsliga analysen (URL 2, 15 a och 22 §§). Nytt i dag:
- **URL 15 a §** i gällande lydelse (ändrad t.o.m. SFS 2026:1120): exemplar för text- och datautvinning får framställas av den som har "lovlig tillgång", får inte behållas längre än nödvändigt, och undantaget gäller inte om upphovsmannen "på lämpligt sätt" har förbehållit sig rätten ([URL](https://data.riksdagen.se/dokument/sfs-1960-729.html)) **[källa]**.
- **B. Braun:** eIFU-portalens `robots.txt` innehåller `User-agent: *` och `Disallow: /`, alltså ett generellt stopp för automatisk hämtning **[källa, kontrollerat 22 nov 2026]**. Webbplatsens villkor: informationen är upphovsrättsskyddad och "the use and the reproduction of this information for commercial use is not permitted without the prior written approval of B. Braun". För kundportalen My B. Braun: erbjudandet ger ingen licens, "either expressed or implied", och information ska behandlas som konfidentiell ([B. Braun terms of use](https://www.bbraun.com/en/terms-of-use.html)) **[källa]**.
- Philips Resource center hänvisar till Philips allmänna villkor ([Philips terms of use](https://www.usa.philips.com/a-w/terms-of-use)). Villkoren lästes inte i sin helhet. Getinges och Drägers portaler kunde inte läsas.
- **[slutsats]**
  1. Ett generellt robotstopp och villkor mot kommersiell återgivning kan ses som ett förbehåll "på lämpligt sätt" enligt 15 a §. Det gör TDM-undantaget osäkert just för tillverkare som B. Braun.
  2. Sjukhusets egen användning (att läsa, söka och citera bruksanvisningen till utrustning man har köpt) är inte kommersiell återgivning och stöds av köpet och av MDR:s krav att bruksanvisningen ska finnas tillgänglig. Lotsa AB:s roll ska vara ett **verktyg som kunden använder på sina egna exemplar**. Lotsa AB tar aldrig emot, lagrar eller distribuerar manualerna.
  3. **Bygg ingen automatisk hämtning från eIFU-portaler** och inget delat bibliotek (planens fas 3) utan skriftligt tillstånd från varje tillverkare. Offlinearkitekturen är här en juridisk fördel.
  4. **AI-genererade snabbkort och översättningar** är bearbetningar (URL 2 §). De är mer riskabla än ordagranna korta citat. Märk dem som intern arbetshandling, och låt dem bara finnas hos kunden.
  5. Lägg till i kundavtalet att kunden garanterar sin rätt att ladda upp dokumenten (planen har redan detta). Lägg till i inköpsavtalens mall (som Lotsa AB kan erbjuda MT) en klausul där tillverkaren medger digital intern användning av bruksanvisningen, inklusive sökning och indexering.

---

## C. Rangordnade förbättringar för Lotsa

Rangordning efter nytta för förtroende, försäljning och efterlevnad i förhållande till insats. "Offline" anger om funktionen passar en skrivbordsapp med liten lokal modell.

| # | Förbättring | Varför | Insats | Offline/liten modell |
|---|---|---|---|---|
| 1 | **Citat först, AI-text sedan.** Svaret visar tillverkarens ordagranna utdrag (märkt "Tillverkarens text, sida X, revision Y") överst. AI:ns svenska sammanfattning eller arbetsöversättning visas under, märkt "AI-genererad". Inget AI-påstående visas utan ett godkänt citat | VERICITE visar att citat i RAG ofta inte stöder påståendet. Läkemedelsverket varnar för överskattad förmåga. Skilja citat från AI-text är också den enklaste art. 50-lösningen | Låg–medel (ändring i `04-ai.js` och `05-ui.js`) | Ja, minskar modellens arbete |
| 2 | **Andra kontrollsteg för citat: stöder citatet påståendet?** Efter den ordagranna kontrollen körs en liten NLI-/verifieringsmodell eller en strikt regelkontroll (siffror, enheter och ord som "inte" måste finnas i citatet). Svar som inte stöds blir "Se utdraget, AI-svaret kunde inte styrkas" | Fångar fallet där citatet finns men inte säger det svaret påstår. Med-V1 visar att 3B räcker. Licensfrågan måste lösas (Med-V1-Q3B bygger på `qwen-research`) | Medel (regelkontroll låg, egen verifieringsmodell hög) | Regelkontroll ja. Modell: ja om ≤1B eller samma Qwen3.5-4B med ett andra anrop, men kostar latens |
| 3 | **FSN- och revisionsbanderoll.** MT kan markera ett dokument med "Säkerhetsmeddelande finns" och bifoga FSN-PDF:en (från Läkemedelsverkets lista eller tillverkaren), eller "Ersatt av revision ...". Alla svar från dokumentet får då en röd banderoll med länk. Plus fält för Basic UDI-DI och eIFU-adress | Planens största praktiska risk är inaktuella manualer. Läkemedelsverket publicerar FSN öppet med prenumeration, så MT får redan informationen | Låg | Ja, MT gör kontrollen på en dator med nät |
| 4 | **Ifyllt svar på Läkemedelsverkets checklista + ECRI-exemplet i godkännandepaketet.** Ett dokument på 2–3 sidor som besvarar varje punkt i Läkemedelsverkets AI-checklista för vårdgivare (april 2026), och ett "röda och gula frågor"-avsnitt som visar att Lotsa svarar ur manualen på ECRI:s fråga om neutralelektroden | Regionerna saknar ofta AI-policy och kommer att använda myndighetens checklista. Kortar godkännandet | Låg | Ej tillämpligt (dokument) |
| 5 | **Valideringsrapport per release, efter UpToDate-modellen men ärligare.** Testmängd med obesvarbara frågor (≥25 %), kriterier skrivna av MT-ingenjörer, mätvärden: citatprecision, citat-recall, andel korrekt "står inte i manualen", 100 % vägran på röda frågor, latens på referensdatorer. Inkludera svensk fråga mot engelsk manual (Agri-Query-upplägget) | Ger både produktansvarsförsvar (planen) och ett säljbart förtroendebevis. Socialstyrelsen kräver lokal validering | Medel | Ja |
| 6 | **Lokalt valideringskit för kunden.** MT kör ett inbyggt testläge på sina egna manualer med egna frågor och får en rapport (PDF) | Socialstyrelsen: CE-märkning eller leverantörens test räcker inte, validering ska ske i det egna arbetsflödet. Gör kunden delaktig | Medel | Ja |
| 7 | **Import av utrustningslista från MT-systemet (Medusa m.fl.)** via CSV/Excel: inventarienummer, modell, tillverkare, avdelning, UDI-DI. Dokument kopplas till modell, inte till enskild apparat | Nuvolo och Medusa visar att manualer hör ihop med inventariet. MT registrerar inte gärna två gånger. Ingen integration med utrustningen, så regel 3.3 påverkas inte | Medel | Ja (filimport) |
| 8 | **Art. 50-märkning enligt uppförandekoden.** Text i början av varje session ("Du använder ett AI-verktyg. Kontrollera alltid mot utdraget."), synlig märkning per AI-stycke och maskinläsbar metadata i exporterade svar och utskrivna snabbkort | Koden (10 juni 2026) och riktlinjerna (20 juli 2026) är nu slutliga. Siemens Healthineers gör redan så | Låg | Ja |
| 9 | **Ingen white label.** Lotsa AB står som tillverkare/leverantör i appen och i "Om". Regionen kan bara konfigurera, inte döpa om eller göra om designen | Läkemedelsverket v2: egen märkning ger vårdgivaren tillverkaransvar. Skyddar både kunden och kvalificeringsanalysen | Låg | Ej tillämpligt |
| 10 | **Tillgänglighetsrapport enligt EN 301 549 V4.1.1** (ACR/VPAT) och automatiska axe-core-tester i `test/` | LOU 9 kap. 2 § vid annonserad upphandling. Nödvändigt om en webbversion eller mobilvy erbjuds (DOS-lagen) | Låg–medel | Ja |
| 11 | **Avgör QR- och mobilflödet för den lokala versionen.** Dagens app säljer "fråga i mobilen via QR-koden på enheten", men en offline skrivbordsapp kan inte nås från mobilen. Alternativ: QR-koden öppnar Lotsa på avdelningens dator direkt på rätt enhet (lokalt URI-schema), eller skrivs ut med snabbkortet så att koden pekar på kortets innehåll. En webbversion på regionens server ger mobilstöd men gör DOS-lagen och tillgänglighetsredogörelse tillämpliga | Löftet i `09-about-tour.js` stämmer annars inte med den lokala produkten. Bättre att bestämma nu än att få frågan i en upphandling | Låg (beslut), medel (lokalt URI-schema) | Delvis |
| 12 | **Länka ut, blanda aldrig in.** Fasta länkar per enhetstyp till Vårdhandboken (rengöring, hygien) och regionens egna rutiner. Visas som "Se även", aldrig som del av AI-svaret | Personalen litar på Vårdhandboken. Håller Lotsa ren som "bara manualen" och utanför kliniskt innehåll | Låg | Ja (länkar öppnas i webbläsaren när nät finns) |
| 13 | **Rapportera AI-fel.** Knappen "Flagga svaret" får ett val "AI-svaret var fel eller vilseledande". Det skapar ett ärende hos MT med frågan, utdraget och svaret (bara om användaren själv väljer att bifoga texten) och en färdig text för att rapportera till Lotsa AB. Lotsa AB för register över inrapporterade fel och tar med det i release- och CRA-rutinen | ECRI ber vården rapportera AI-fel. Läkemedelsverkets checklista kräver rapportering till tillverkaren. Ger underlag för produktansvarsförsvaret | Låg | Ja |
| 14 | **Säkerhetskopiering och export av MT:s registreringar** (dokumentregister, versioner, larmregister, godkända tips), signerad och återläsbar | Nya produktansvarslagen ersätter förlust eller förvanskning av data. Exit-krav i upphandlingar | Låg–medel | Ja |
| 15 | **Felkoder via strukturerad tabell, inte via modellen.** Larmregistret fylls från manualens tabell (extraheras en gång och granskas av MT), och sökning på felkod är ren uppslagning med sidhänvisning. Modellen används bara för fritext | INGENZI: felkodstolkning blev 100 % korrekt med struktur, åtgärdsförslag bara 80 %. Snabbt på CPU | Medel (extraktion och granskningsvy) | Ja, mycket lämpligt |
| 16 | **Låg k och hybridsökning som standard.** Hämta få avsnitt (3–5), kombinera FTS5 med vektorsök och visa "Sökträffar utan AI" som standardläge när modellen är osäker | VERICITE: fler dokument ger sämre citat. Agri-Query: hybrid slår långa kontextfönster. Planens prefillgräns på 2 000 tokens pekar åt samma håll | Låg (inställningar) | Ja |
| 17 | **Guidade felsökningsträd** (ja/nej-steg) som MT bygger ur manualens felsökningsavsnitt, granskade innan de publiceras | Mavenoid och Bruviti bygger sin produkt på detta. Deterministiskt, snabbt och lätt att validera | Medel–hög | Ja |
| 18 | **Mall för avtalsklausul om digital intern användning av bruksanvisningar** som MT kan använda vid inköp av utrustning, och en lista över tillverkarnas portaler och villkor (B. Braun läst, övriga att läsa) | B. Brauns villkor och robotstopp. Minskar kundens upphovsrättsrisk och gör det möjligt att i framtiden erbjuda licensierade funktioner | Låg | Ej tillämpligt |
| 19 | **Publicera en liten öppen testmängd** för frågor om bruksanvisningar (frågor, förväntad sida/avsnitt, kategori, inga manualtexter) och bjud in en pilotregion som medförfattare | Det finns inget sådant testset. Gör Lotsa AB till referens och ger forskningssamarbete (och Vinnova-argument) | Medel | Ej tillämpligt |
| 20 | **Kvittens "jag har läst avsnittet" som tillval för utbildning** (av som standard, kräver beslut av regionen) | Regionala riktlinjer kräver att personalen tagit del av bruksanvisningen. Säljbart till vårdenhetschefer. Men personbundna loggar kräver MBL-förhandling och ökar dataskyddsfrågorna, därför sist och som tillval | Medel | Ja |

### Vad som inte bör byggas
- **Koppling till utrustningens loggar eller larmflöden**, som GE OnWatch och TRIMEDX gör. Det gör Lotsa till en del av produkten enligt regel 3.3.
- **Automatisk hämtning från tillverkarnas eIFU-portaler** utan avtal (B8).
- **White label för regioner** (B4).
- **Klinisk kunskap från Vårdhandboken, Internetmedicin eller Janusinfo inbakad i svaren**. Länka i stället.
- **Säljpåståenden om patientsäkerhet** även när ECRI-exemplet används. Formulera det som "svarar bara ur tillverkarens bruksanvisning, med sidhänvisning", inte som "förebygger brännskador".

---

## Källor

**Produkter och tjänster**
- Philips InCenter: https://www.usa.philips.com/healthcare/support/incenter
- Philips Resource center (eIFU): https://eifu.philips.com
- Philips Customer Services Portal, användarguide: https://www.philips.com/c-dam/b2bhc/master/support/philips-customer-services-portal-user-guide.pdf
- B. Braun eIFU: https://eifu.bbraun.com (robots.txt kontrollerad 2026-11-22)
- B. Braun, villkor: https://www.bbraun.com/en/terms-of-use.html
- B. Braun, AI-berättelse: https://www.bbraun.com/en/about-us/company/stories/artificial-intelligence-proves-itself-in-medical-technology.html
- Siemens Healthineers, integritetsmeddelande: https://www.siemens-healthineers.com/en-my/privacy-notice-digital-and-business-activities
- TRIMEDX: https://www.trimedx.com/resource/trimedx-introduces-new-agentic-ai-capabilities och https://www.trimedx.com/blog/how-ai-is-powering-smarter-medical-equipment-service
- Mavenoid: https://mavenoid.com/en/medical-devices
- Neuron7: https://www.neuron7.ai/industries/medical-devices
- Bruviti: https://bruviti.com/blogs/ai-solves-medical-device-support-challenges
- Nuvolo: https://www.nuvolo.com/solutions/clinical
- ServiceNow CMMS: https://www.servicenow.com/docs/r/xanadu/healthcare-life-sciences/cmms-workflow-issue-scenario.html
- ServiceNow Now Assist: https://newsroom.servicenow.com/press-releases/details/2023/ServiceNow-launches-major-expansion-to-Now-Assist-generative-AI-portfolio-with-new-capabilities-to-transform-experiences-and-increase-productivity-11-16-2023-traffic/default.aspx
- Accruent: https://www.accruent.com/industries/healthcare
- Medusa: https://www.clinicalservicesjournal.com/story/9684/medical-engineering-efficient-work-solutions och https://apps.apple.com/se/app/medusa-mobile/id1181817886
- ECRI 2026 hazards: https://home.ecri.org/blogs/ecri-news/misuse-of-ai-chatbots-tops-annual-list-of-health-technology-hazards
- ECRI AI-resurser: https://home.ecri.org/pages/ai-resources
- ECRI Problem Reporting Network: https://home.ecri.org/blogs/ecri-news/ecri-expands-problem-reporting-network-and-calls-for-more-data-on-ai-errors-in-patient-care/
- Wolters Kluwer valideringsramverk: https://www.wolterskluwer.com/en/news/validation-framework-evaluating-clinical-ai-point-of-care
- OpenEvidence/JAMA: https://consultorsalud.com/wp-content/uploads/2026/10/jama_patel_2026_oi_260127_1791842940.75115.pdf
- Inera, förstudie 1177 för vårdpersonal: https://www.inera.se/globalassets/inera/media/dokument/projekt/1177-och-nara-vard/forstudie-1177-for-vardpersonal---slutrapport.pdf
- Inera, verksamhetsinriktning 2026–2028: https://www.inera.se/globalassets/inera/media/dokument/om-inera/sa-styrs-inera/ineras-verksamhetsinriktning-2026-2028-med-budgetram.pdf
- Region Örebro län, riktlinjer MTP: https://vardgivare.regionorebrolan.se/globalassets/media/dokument/platina/riktlinjer/riktlinjer-for-hantering-av-medicintekniska-produkter---undersokningsutrustningbehandlingshjalpmedel.876989.pdf
- Region Halland, mall bruksanvisning: https://vardgivare.regionhalland.se/app/uploads/2026/05/Bilaga-5a-Bruksanvisning-Egentillverkad-medicinteknisk-produkt-enligt-MDR.docx
- Matrix eIFU: https://matrixone.health/blog/eudamed-and-eifu-how-to-register-your-url-before-the-may-2026-mandatory-deadline och villkor https://a.storyblok.com/f/339665/x/8839b0faaa/matrix-eifu-terms-of-service-and-sla-20260101.pdf

**Forskning**
- VERICITE: https://aclanthology.org/2026.bionlp-1.62/
- Med-V1: https://arxiv.org/abs/2603.05308, https://huggingface.co/nlm-dir/Med-V1-Q3B, https://huggingface.co/nlm-dir/Med-V1-L3B
- Qwen2.5-3B-Instruct (licens qwen-research): https://huggingface.co/Qwen/Qwen2.5-3B-Instruct
- MedCite: https://arxiv.org/abs/2506.06605
- SourceCheckup: https://arxiv.org/abs/2402.02008
- Agri-Query: https://arxiv.org/abs/2508.18093
- INGENZI: https://arxiv.org/abs/2601.16967
- Best practices medicinsk RAG: https://arxiv.org/abs/2602.03368
- RAG nuklearmedicinska manualer: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12339626/

**Regler och myndigheter**
- Prop. 2026/27:12: https://data.riksdagen.se/dokument/HE0312
- Bet. 2026/27:CU4: https://data.riksdagen.se/dokument/HE01CU4
- AI-omnibusen: https://www.cuatrecasas.com/en/portugal/intellectual-property/art/digital-omnibus-ai-has-been-published, https://www.orrick.com/ja-JP/Insights/2026/07/EU-AI-Act-Update-Digital-Omnibus-Finalizes-8-Compliance-Changes
- Uppförandekod för AI-genererat innehåll: https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content
- Riktlinjer art. 50 (kommentar): https://www.faegredrinker.com/zh/insights/publications/2026/7/eu-ai-act-commission-confirms-transparency-code-of-practice-as-adequate-and-publishes-final-version-of-its-guidelines-on-transparency-obligations
- Freshfields om koden: https://www.freshfields.com/en/our-thinking/blogs/technology-quotient/eu-ai-act-unpacked-33-the-final-code-of-practice-on-transparency-of-ai-generate-102n4yx
- ENISA SRP: https://www.enisa.europa.eu/topics/product-security/single-reporting-platform-srp och FAQ https://www.enisa.europa.eu/topics/product-security/single-reporting-platform-srp/frequently-asked-questions
- CSA om SRP: https://labs.cloudsecurityalliance.org/wp-content/uploads/2026/09/CSA_research_note_cra_single_reporting_platform_20260916-csa-styled.pdf
- MDCG-lista: https://health.ec.europa.eu/medical-devices-sector/new-regulations/guidance-mdcg-endorsed-documents-and-other-guidance_en
- Läkemedelsverket, AI-vägledning v2 (2026-04-02): https://www.lakemedelsverket.se/globalassets/dokument/medicinteknik/artificiell-intelligens-ai/vagledning-anvandning-av-artificiell-intelligens-i-svensk-sjukvard_ver_2.pdf
- Läkemedelsverket, publicerade FSN: https://www.lakemedelsverket.se/sv/medicinteknik/folj-upp-anvandning/rapportering-av-fsca-fsn/publicerade-sakerhetsmeddelanden-fsn/
- Läkemedelsverket, prenumeration FSN: https://www.lakemedelsverket.se/sv/medicinteknik/folj-upp-anvandning/rapportering-av-fsca-fsn/prenumeration-av-publicerade-sakerhetsmeddelanden-fsn/
- Socialstyrelsen, ansvarsfull AI (2026): https://www.socialstyrelsen.se/publikationer/ansvarsfull-anvandning-av-ai-i-halso--och-sjukvarden--insikter-och-forslag-fran-en-forstudie-med-brostcancerscreening-som-exempel-2026-9-10396/
- Regeringen, uppdrag till IVO: https://www.regeringen.se/pressmeddelanden/2026/01/regeringen-ger-ivo-uppdrag-om-samverkan-och-kortare-handlaggningstider/
- Cybersäkerhetsförordningen (2025:1507): https://data.riksdagen.se/dokument/sfs-2025-1507.html
- DOS-lagen (2018:1937): https://data.riksdagen.se/dokument/sfs-2018-1937.html
- LOU (2016:1145): https://data.riksdagen.se/dokument/sfs-2016-1145.html
- Upphovsrättslagen (1960:729): https://data.riksdagen.se/dokument/sfs-1960-729.html
- eIFU och UDI: https://www.cuatrecasas.com/en/spain/life-sciences-healthcare/art/eu-electronic-ifu-rules, https://health.ec.europa.eu/medical-devices-eudamed/udidevices-registration_en, https://webgate.ec.europa.eu/eudamed-play-help/en/files/Public%20API%20-%20user%20guide.pdf

## Öppna frågor efter den här genomgången
- Kammarens beslut om produktansvarslagen 25 november 2026: kontrollera SFS-numret efteråt.
- Kommissionens riktlinjer om art. 50 (20 juli 2026) ska läsas i primärtext: räknas RAG-svar med ordagranna citat som syntetisk text?
- Villkoren för Philips, Getinge, Dräger, Baxter och Medtronics eIFU-portaler är inte lästa.
- EUDAMED:s publika API: visas eIFU-adressen per UDI-DI? Kontrollera innan funktion 3 utökas med automatisk länk.
- Licens för en verifieringsmodell (funktion 2): välj modell med kommersiellt tillåten licens.
