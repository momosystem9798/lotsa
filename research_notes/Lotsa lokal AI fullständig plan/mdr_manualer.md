# Lotsa och MDR: kvalificering som medicinteknisk produkt, följder och rättsläget för bruksanvisningar som kunskapsbas (Sverige/EU, november 2026)

Läsanvisning. Varje påstående är märkt med typ av källa:
- **[LAG]**: bindande rätt (EU-förordning, svensk lag, förordning eller föreskrift).
- **[VÄGL]**: officiell, icke-bindande vägledning (MDCG, Läkemedelsverket).
- **[KOMM]**: kommentar från konsulter, advokatbyråer, nyhetsmedier eller sökmotorsammanfattningar.
- **[SLUTS]**: min egen slutsats, som inte har stöd i någon källa.

Primärtexterna laddades ned och lästes i sin helhet den 22 november 2026: MDR (konsoliderad 10.01.2025), MDCG 2019-11 rev.1, originalet av MDCG 2019-11 (2019) för jämförelse, Borderline-manualen version 5, MDCG 2021-24 rev.1, eIFU-förordningen 2021/2226 och ändringen 2025/1234, URL (SFS 1960:729), DSM-direktivet, SFS 2021:631, HSLF-FS 2021:52, kommissionens förslag COM(2025) 1023 och Läkemedelsverkets remissvar av den 9 april 2026.

Det gick inte att läsa Läkemedelsverkets egna webbsidor. De renderas med JavaScript, och ett försök att läsa dem via sajtens innehålls-API stoppades av sessionens behörighetsregler. Därför bygger avsnittet om Läkemedelsverket på myndighetens pressmeddelanden (via.tt.se), remissvaret och svensk författningstext.

---

## 1. Är Lotsa (a) ingen medicinteknisk produkt, (b) ett tillbehör eller (c) en medicinteknisk produkt i klass I eller IIa?

### Takeaway
Med nuvarande avsedda ändamål är Lotsa med stor sannolikhet **ingen medicinteknisk produkt och inget tillbehör**. Det finns tre skäl:
1. Lotsa har inget medicinskt syfte i den mening som avses i art. 2.1. Programmet ger information om hur en utrustning hanteras, inte om en patients diagnos eller behandling.
2. Informationen är generisk och inte "för enskilda patienters nytta" (beslutssteg 4 i MDCG 2019-11).
3. Lotsa är inte avsedd att användas tillsammans med vissa bestämda produkter för att möjliggöra eller direkt bistå deras medicinska funktion, vilket krävs för att vara ett tillbehör.

Lotsa klarar däremot **inte** undantaget för "simple search". Sedan rev.1 (juni 2025) säger MDCG uttryckligen att sökning med NLP inte räknas som "simple search" om den bidrar till ett medicinskt syfte. Kvalificeringen avgörs därför helt av steg 4 och av det avsedda ändamålet. Den största risken är att Lotsa ses som programvara som "driver eller påverkar användningen" av en produkt. Då skulle Lotsa enligt implementeringsregel 3.3 få samma klass som den styrda produkten, alltså IIa/IIb för infusionspumpar, ventilatorer, defibrillatorer och dialys.

### Cited Findings

**MDR, definitioner [LAG]**
- Art. 2.1 definierar en medicinteknisk produkt som bland annat "software ... intended by the manufacturer to be used ... for human beings for one or more of the following specific medical purposes: diagnosis, prevention, monitoring, prediction, prognosis, treatment or alleviation of disease; diagnosis, monitoring, treatment, alleviation of, or compensation for, an injury or disability; investigation, replacement or modification of the anatomy or of a physiological or pathological process or state; providing information by means of in vitro examination ...". Även "products specifically intended for the cleaning, disinfection or sterilisation of devices" räknas som medicintekniska produkter. — [MDR konsoliderad, EUR-Lex](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02017R0745-20250110)
- Art. 2.2 definierar ett tillbehör som "an article which, whilst not being itself a medical device, is intended by its manufacturer to be used together with one or several particular medical device(s) to specifically enable the medical device(s) to be used in accordance with its/their intended purpose(s) or to specifically and directly assist the medical functionality of the medical device(s) ..." — [MDR](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02017R0745-20250110)
- Art. 2.12 definierar avsett ändamål som "the use for which a device is intended according to the data supplied by the manufacturer on the label, in the instructions for use or in promotional or sales materials or statements and as specified by the manufacturer in the clinical evaluation". Även marknadsföring och säljmaterial avgör alltså ändamålet. — [MDR](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02017R0745-20250110)
- Art. 2.14 definierar bruksanvisning som "the information provided by the manufacturer to inform the user of a device's intended purpose and proper use and of any precautions to be taken". — [MDR](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02017R0745-20250110)

**MDR, bilaga VIII [LAG]**
- Regel 11 lyder: "Software intended to provide information which is used to take decisions with diagnosis or therapeutic purposes is classified as class IIa, except if such decisions have an impact that may cause: death or an irreversible deterioration ... class III; or a serious deterioration ... or a surgical intervention ... class IIb. Software intended to monitor physiological processes is classified as class IIa [IIb för vitala parametrar] ... All other software is classified as class I." — [MDR bilaga VIII 6.3](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02017R0745-20250110)
- Implementeringsregel 3.2 säger: "Accessories for a medical device shall be classified in their own right separately from the device with which they are used." Regel 3.3 säger: "Software, which drives a device or influences the use of a device, shall fall within the same class as the device. If the software is independent of any other device, it shall be classified in its own right." — [MDR bilaga VIII](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02017R0745-20250110)

**MDCG 2019-11 rev.1 (juni 2025) [VÄGL]**
- Dokumentet listar själv sina ändringar:
  - 1: förtydligat tillämpningsområde.
  - 3: tydligt avsett ändamål och modulär programvara.
  - 3.1: programvara enligt bilaga XVI.
  - 3.2: nya exempel, bland annat på programvara avsedd att behandla.
  - 4.2.1: förtydligande av regel 11 (underregel a) och prevention.
  - 7: moduler.
  - Bilaga I c.1: samspelet med EHDS för journalsystem.
  - Bilaga IV: ett nytt exempel i klass I.

  Revisionen tar också med MDAI (medicinteknisk AI) i tillämpningsområdet och hänvisar till MDCG/AIB:s vägledning om samspelet med AI-förordningen. — [MDCG 2019-11 rev.1, PDF](https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en?filename=mdcg_2019_11_en.pdf); [Kommissionens nyhet 17.6.2025](https://health.ec.europa.eu/latest-updates/update-mdcg-2019-11-rev1-qualification-and-classification-software-regulation-eu-2017745-and-2025-06-17_en)
- **Ny text om "simple search" i rev.1 (avgörande för Lotsa).** Rev.1 behåller meningen att "Simple search, which refers to the retrieval of records by matching record metadata against record search criteria or to the retrieval of information does not qualify as MDSW (e.g. library functions)". Därefter har en ny mening lagts till: "However, software would not be considered as conducting 'Simple search' if it contributes to achieving a medical purpose. E.g. User Interface (UI) search feature or a software that performs search using Natural Language Processing (NLP) where those actions contribute to achieving a medical purpose." Originalet från 2019 innehöll bara den första meningen, vilket jag kontrollerade genom att jämföra texterna. — [MDCG 2019-11 rev.1 avsnitt 3.1](https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en?filename=mdcg_2019_11_en.pdf); [MDCG 2019-11 original, okt 2019](https://ec.europa.eu/docsroom/documents/37581/attachments/1/translations/en/renditions/native)
- Även denna mening har formulerats om: "software which is intended to process, analyse, interpret, calculate, create or modify medical information may be qualified as a MDSW if the creation or modification of that information is governed by a medical intended purpose". I 2019 års version stod "process, analyse, create or modify"; "interpret, calculate" har tillkommit. — [MDCG 2019-11 rev.1](https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en?filename=mdcg_2019_11_en.pdf)
- Nytt i rev.1, avsnitt 3: "Crafting a well-defined and clear intended purpose is paramount ... The intended purpose must comprehensively describe all functionalities of the MDSW that serve a medical purpose, leaving no ambiguity ... Ambiguities can lead to misclassification". — [MDCG 2019-11 rev.1](https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en?filename=mdcg_2019_11_en.pdf)
- Dokumentet anger exempel på programvara utan medicinskt syfte: "invoicing, staff planning, e-mailing, web or voice messaging, data parsing, word processing, and back-up". — [MDCG 2019-11 rev.1](https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en?filename=mdcg_2019_11_en.pdf)
- Definitionen av "Software driving or influencing the use of a device" lyder: "Software which is intended to drive or influence the use of a (hardware) medical device and does not have or perform a medical purpose on its own ... This software can, but is not limited to: (a) operate, modify the state of, or control the device either through an interface ... or via the operator of this device (b) or supply output related to the (hardware) functioning of that device." Sådan programvara "may be qualified as an accessory". — [MDCG 2019-11 rev.1, avsnitt 2 och 3.3](https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en?filename=mdcg_2019_11_en.pdf)
- Beslutsstegen:
  - Steg 2: om programvaran är ett tillbehör eller driver eller påverkar en produkt ska den bedömas som en del av den produkten, eller självständigt om den är ett tillbehör.
  - Steg 3: om programvaran utför en åtgärd på data utöver "storage, archival, communication, simple search, lossless compression" kan den vara MDSW.
  - Steg 4 frågar: "is the action for the benefit of individual patients? Examples of software which are not considered as being for the benefit of individual patients are those which are intended only to aggregate population data, provide generic diagnostic or treatment pathways (not directed to individual patients), scientific literature, medical atlases, models and templates as well as software intended only for epidemiological studies or registers."

  — [MDCG 2019-11 rev.1, s. 12–13](https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en?filename=mdcg_2019_11_en.pdf)
- Det nya exemplet i klass I enligt regel 11c (rev.1) är en app som omvandlar valda symboler till tal för personer med kommunikationsstörning. Det redan befintliga exemplet gäller en fertilitetsapp. — [MDCG 2019-11 rev.1, bilaga IV](https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en?filename=mdcg_2019_11_en.pdf)
- Kommentatorerna är oeniga om hur stor revisionen är. Open Regulatory menar att kvalificeringslogiken inte ändrades, medan Casus beskriver "a fairly significant rewrite". Båda uppgifterna kommer från en sökmotorsammanfattning. Själv konstaterade jag att det finns konkreta textändringar om NLP-sökning och avsett ändamål. — [Open Regulatory](https://openregulatory.com/mdcg/mdcg-2019-11) [KOMM]; [Casus Consulting](https://casusconsulting.com/mdcg-2019-11-rev-1-updated-guidance-software-qualification-classification-mdr-ivdr/) [KOMM]

**Manual on Borderline and Classification, version 5 (april 2026) [VÄGL]**
- Den aktuella versionen är "Version 5 – April 2026". Programvara behandlas bara i två avsnitt: 1.1.9.1 om en smartphone-app för STI-prevention, som bedömdes som kommunikation och epidemiologiskt verktyg och därför inte som medicinteknisk produkt, och 1.1.9.2 om medicinska kalkylatorer, som bedömdes vara medicintekniska produkter i minst klass IIa enligt regel 11. Det finns **inga** avsnitt om programvara som presenterar bruksanvisningar, kunskapsbaser, utbildningsprogram eller LLM-verktyg. — [Borderline-manualen v5](https://health.ec.europa.eu/document/download/71a87df8-5ca1-4555-b453-b65bdf8de909_en?filename=md_borderline_manual_en.pdf)
- I fallet med kalkylatorerna motiveras bedömningen så här: "Calculation of a score according to a specific formula ... is an action on data beyond the use of simple search" och "the calculation is for the benefit of individual patients, as it does not only provide generic diagnostic or treatment pathways". — [Borderline-manualen v5, 1.1.9.2](https://health.ec.europa.eu/document/download/71a87df8-5ca1-4555-b453-b65bdf8de909_en?filename=md_borderline_manual_en.pdf)
- I STI-fallet: "On this basis alone, the software would not perform an action on data other than communication, as per in MDCG 2019-11." — [Borderline-manualen v5, 1.1.9.1](https://health.ec.europa.eu/document/download/71a87df8-5ca1-4555-b453-b65bdf8de909_en?filename=md_borderline_manual_en.pdf)
- Manualen beskriver sin egen status så här: den registrerar BCWG:s överenskommelser enligt Helsingforsproceduren och "does not relieve national competent authorities from their duty to issue decisions ... on a case-by-case basis". — [Borderline-manualen v5](https://health.ec.europa.eu/document/download/71a87df8-5ca1-4555-b453-b65bdf8de909_en?filename=md_borderline_manual_en.pdf)

**MDCG 2021-24 rev.1 (april 2026) [VÄGL]**
- Den gällande versionen är "MDCG 2021-24 Rev.1, April 2026". — [MDCG 2021-24 rev.1](https://health.ec.europa.eu/document/download/cbb19821-a517-4e13-bf87-fdc6ddd1782e_en?filename=mdcg_2021-24_en.pdf)
- Om regel 11 och tillbehör: "Software or equipment attached to devices which do not specifically enable device(s) to be used in accordance with their intended purpose, or to specifically or directly assist the medical functionality of the device ... do not meet the definition of an accessory. Software used in conjunction with medical devices(s) which solely record, store or display information would generally not be considered devices". — [MDCG 2021-24 rev.1, regel 11](https://health.ec.europa.eu/document/download/cbb19821-a517-4e13-bf87-fdc6ddd1782e_en?filename=mdcg_2021-24_en.pdf)
- Om avsedd och oavsiktlig användning: "It is the intended and not the accidental use of the device that determines the class ... if a healthcare professional or others uses the device in a manner not intended by the manufacturer, this does not change the class ... However, if the normal clinical use of the device changes in time with evolving clinical practice ... this should be addressed by the manufacturer". — [MDCG 2021-24 rev.1](https://health.ec.europa.eu/document/download/cbb19821-a517-4e13-bf87-fdc6ddd1782e_en?filename=mdcg_2021-24_en.pdf)

**Pågående lagstiftning: COM(2025) 1023 [LAG-förslag, ej gällande]**
- Kommissionens förslag av den 16 december 2025 ersätter regel 11. Programvara "intended to generate an output that confers a clinical benefit and is used for diagnosis, treatment, prevention, monitoring, prediction, prognosis, compensation or alleviation of a disease or condition" ska som huvudregel vara **klass I**. Högre klasser gäller beroende på hur allvarlig situationen är och om programvaran ska "drive" eller "inform" klinisk hantering. Förslaget kodifierar också Helsingforsproceduren för kvalificering och klassificering och ger expertpanelerna en roll i den. — [COM(2025) 1023, EUR-Lex](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:52025PC1023)
- Läkemedelsverket säger i sitt remissvar av den 9 april 2026 att det "stödjer inte heller förslaget till omformulering av regel 11 ... Förslaget riskerar att försvaga kontrollen av medicinteknisk programvara". Myndigheten är däremot "övergripande positiv" till ett nytt förfarande för att bedöma en produkts regulatoriska status. — [Läkemedelsverkets yttrande, Dnr 3.4.1-2026-009628](https://regeringen.se/contentassets/d79c8e7023fa46fb92388a96cb382b40/lakemedelsverket.pdf)
- Status i oktober 2026: förslaget låg i ENVI/SANT-utskottet, det preliminära plenumdatumet var 14 december 2026 och rådet siktade på en allmän riktlinje före årets slut. Uppgiften kommer från en sökmotorsammanfattning; sidan har inte lästs i sin helhet. — [Deemed Consulting, okt 2026](https://www.deemedconsulting.com/insights/2026-10-05-eu-mdr-ivdr-targeted-revision-proposal-status) [KOMM]

### Inferences
- [SLUTS] **Steg 1 (programvara):** ja.
- [SLUTS] **Steg 2 (tillbehör eller driver/påverkar):**
  - Lotsa är inte ett tillbehör. Den är inte avsedd för "particular medical device(s)", eftersom den är generisk för valfri bruksanvisning. Den "enables" eller "directly assists" inte heller produktens medicinska funktion, och MDCG 2021-24 utesluter uttryckligen programvara som inte gör det.
  - Lotsa styr ingen hårdvara (punkt a). Punkt b, "supply output related to the (hardware) functioning of that device", är den svaga punkten. Svar som "så kvitterar du larm X" handlar om hur hårdvaran fungerar.
  - Ordalydelsen (programvara "intended to drive or influence the use of a (hardware) medical device") och exemplen (styrning av analysinstrument och QC-programvara) visar ändå att det handlar om programvara som är kopplad till en bestämd produkt eller som tar emot data från den.
  - Lotsa tar emot text från en bruksanvisning, inte data från produkten. **Lotsa får aldrig kopplas till utrustningens loggar, larmflöden eller gränssnitt.** Annars förskjuts bedömningen mot regel 3.3, och då ärver Lotsa produktens klass, IIa/IIb.
- [SLUTS] **Steg 3 (mer än "simple search"):** ja. Generering med LLM, översättning och sammanfattning är mer än att hämta poster, och rev.1 säger att NLP-sökning inte är "simple search" *om* den bidrar till ett medicinskt syfte. Steg 3 utesluter alltså inte Lotsa, men det avgör inte heller frågan. Det leder vidare till frågan om medicinskt syfte.
- [SLUTS] **Steg 4 och art. 2.1 (medicinskt syfte för enskild patient):** nej.
  - Svaren gäller hur en produkt hanteras (förberedelse av pumpen, rengöring, larmmenyer). Informationen är densamma oavsett patient och kan liknas vid "scientific literature, medical atlases, models and templates" och "generic ... pathways (not directed to individual patients)".
  - Ingen patientdata matas in. Det skiljer Lotsa avgörande från kalkylatorerna i Borderline-manualen, där patientspecifika variabler matas in.
  - Lotsa är därmed närmast "en digital bruksanvisningshylla med sökning och översättning".
- [SLUTS] **Spelar omformulering eller översättning roll?** För kvalificeringen gör den det inte i sig. En översättning av hur ett filter byts ger inte ett medicinskt syfte. Den spelar däremot roll för (i) risken och ansvaret om en översättning blir fel (avsnitt 4 och 7) och (ii) gränsen mot klinisk rådgivning. Om modellen sammanställer information som bara är giltig för en viss patient, till exempel en flödeshastighet eller ventilatorinställningar utifrån vikt, eller tolkar fysiologiska larm ("SpO2 låg, vad ska jag göra med patienten?"), finns ett medicinskt syfte för en enskild patient. Då blir Lotsa sannolikt programvara enligt regel 11 i minst klass IIa (dagens regel 11a).
- [SLUTS] **Klass om Lotsa ändå bedöms som medicinteknisk produkt:**
  - Om Lotsa ses som fristående programvara som bara ger information om produktens hantering, och inte information "used to take decisions with diagnosis or therapeutic purposes", gäller "All other software", alltså klass I enligt regel 11 tredje stycket.
  - Om informationen ses som underlag för terapeutiska beslut (dosering eller behandlingsinställningar) blir klassen IIa eller högre.
  - Om Lotsa ses som programvara som påverkar användningen av en produkt gäller regel 3.3: klass IIb för ventilatorer och defibrillatorer och IIa/IIb för infusionspumpar och dialys. Klassen ärvs dessutom per produkt, vilket i praktiken är ohanterligt för ett generiskt verktyg.
  - Om COM(2025) 1023 antas blir utgångspunkten klass I för programvara med "clinical benefit", men Läkemedelsverket motsätter sig ändringen. Lotsa kan inte planera utifrån den.

### Gaps
- Det finns inget avgörande, ingen Helsingfors-överenskommelse och inget MDCG-exempel som direkt gäller programvara som presenterar bruksanvisningar, eIFU-portaler, kunskapsbaser för utrustning eller allmänna LLM-chattbottar. Borderline-manualen v5 har inget sådant avsnitt.
- EU-domstolens mål C-329/16 (Snitem) om programvara som använder patientspecifika data lästes inte i denna session och bör kontrolleras: [CURIA C-329/16](https://curia.europa.eu/juris/liste.jsf?num=C-329/16).
- MDCG/AIB:s vägledning om samspelet MDR/AI-förordningen (MDCG 2025-6) lästes inte.

---

## 2. Läkemedelsverket: vägledning, tillsyn av AI-assistenter 2025–2026 och hur man begär en kvalificeringsbedömning

### Takeaway
Under 2026 har Läkemedelsverket gjort tillsyn av AI-assistenter som transkriberar och sammanfattar vårdsamtal ("ambient scribes"). Myndigheten har uttalat att gränsen går där AI "bearbetar och sammanställer patient-specifik medicinsk information ... som underlag för vårdbeslut". Sedan juni 2026 är Läkemedelsverket också behörig myndighet enligt AI-förordningen för AI med hög risk i medicintekniska produkter.

Jag har inte hittat något offentligt uttalande om att AI-dokumentationsassistenter har klassats som IIa. Någon ny formell svensk vägledning om kvalificering av AI-programvara har jag inte heller hittat. Den äldre svenska vägledningen är från 2012 och skrevs före MDR.

### Cited Findings
- Pressmeddelande den 4 mars 2026: "Under våren 2026 planerar Läkemedelsverket att genomföra inspektioner av tillverkare av denna typ av system [ambient scribes] ... Myndigheten ser att gränsdragningen mellan administrativt stöd och medicinteknisk funktion inte alltid är tydlig". Sandra Sjöåker, utredare: "Om systemet inte bara spelar in och skriver ut ett patientsamtal ord för ord, utan också bearbetar och sammanställer patient-specifik medicinsk information med hjälp av AI som sedan används som underlag för vårdbeslut, omfattas det troligen av regelverket för medicinteknik. Det är alltså inte tillräckligt att betrakta produkten som enbart ett dokumentationsstöd om den i praktiken påverkar det medicinska beslutsunderlaget". Arbetet ska sammanställas i en rapport, och resultaten kan användas för "fortsatt tillsyn, vägledning till branschen". — [Läkemedelsverket, pressmeddelande 4.3.2026](https://via.tt.se/pressmeddelande/4272364/lakemedelsverket-granskar-ai-assistenter-i-sjukvarden?lang=sv) [VÄGL/myndighetsuttalande]
- Enligt Läkartidningen fokuserar inspektionerna på "hur medicinskt innehåll genereras och kvalitetssäkras, hantering av felaktiga eller ofullständiga sammanfattningar, transparens och spårbarhet i AI-modeller". — [Läkartidningen](https://lakartidningen.se/nyheter/lakemedelsverket-ska-granska-ai-assistenter/) [KOMM]
- Pressmeddelande den 17 juni 2026: regeringen har gett Läkemedelsverket i uppdrag att vara nationell behörig myndighet enligt AI-förordningen för "AI-system med hög risk som används i medicintekniska produkter och produkter för in vitro-diagnostik", med ansvar för marknadskontroll och för att utse och anmäla organ. — [Läkemedelsverket, pressmeddelande 17.6.2026](https://via.tt.se/pressmeddelande/4441254/lakemedelsverket-far-ansvar-for-ai-system-i-medicintekniska-produkter?lang=sv)
- Jag hittade inga publicerade resultat från inspektionerna våren 2026 och ingen rapport per november 2026. Sökningen gav bara aviseringar. — [Läkartidningen](https://lakartidningen.se/nyheter/lakemedelsverket-ska-granska-ai-assistenter/) [KOMM]
- Det finns en äldre vägledning från Läkemedelsverket, "Medicinska informationssystem – vägledning för kvalificering och klassificering av programvaror med medicinskt syfte" (2012), skriven under direktiven. — [engelsk översättning, fdanews](https://www.fdanews.com/ext/resources/files/archives/3/3-13-SwedenSoftwareGuidance.pdf) [VÄGL, inaktuell; inte läst i sin helhet]
- Behörighet enligt SFS 2021:631 2 kap. 1–2 §§ [LAG]: "Läkemedelsverket är behörig myndighet enligt förordning (EU) 2017/745 ... med undantag för de uppgifter som Inspektionen för vård och omsorg är behörig myndighet för". IVO är behörig för produkter enligt art. 5.5 (egentillverkning). — [SFS 2021:631](https://data.riksdagen.se/dokument/sfs-2021-631.text)
- MDR art. 4.1: på en medlemsstats begäran avgör kommissionen genom genomförandeakter "whether or not a specific product, or category or group of products, falls within the definitions of 'medical device' or 'accessory for a medical device'". [LAG] — [MDR art. 4](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02017R0745-20250110)
- Läkemedelsverket är positivt till ett formaliserat EU-förfarande för "produktens regulatoriska status" (COM(2025) 1023). Förfarandet gäller inte ännu. — [Läkemedelsverkets yttrande 9.4.2026](https://regeringen.se/contentassets/d79c8e7023fa46fb92388a96cb382b40/lakemedelsverket.pdf)
- Regeringen har gett Läkemedelsverket i uppdrag att se till att aktörer "får den information och rådgivning som krävs". I ett bildspel från 2026 nämns "MT-rådgivning"/"anpassad rådgivning". Uppgiften kommer från en sökmotorsammanfattning. — [Regeringen, pressmeddelande dec 2024](https://www.regeringen.se/pressmeddelanden/2024/12/nytt-uppdrag-for-att-starka-implementeringen-av-medicintekniska-regelverk/) [KOMM]

### Inferences
- [SLUTS] Läkemedelsverkets gränsdragning för ambient scribes ger Lotsa ett tydligt kriterium att följa: **patientspecifik medicinsk information som underlag för vårdbeslut**. Lotsa hanterar ingen patientinformation, och det ska vara uttalat i designen. Enligt samma logik räcker det inte att *kalla* produkten "informationsstöd" om den i praktiken påverkar vårdbeslut.
- [SLUTS] Det finns inget formellt svenskt förfarande för bindande förhandsbesked om kvalificering. Den realistiska vägen är:
  1. Skriv en egen kvalificeringsanalys enligt MDCG 2019-11 rev.1, steg för steg, med avsett ändamål, funktionslista, avgränsningar och marknadsföringstexter.
  2. Skicka den till Läkemedelsverket (registrator@lakemedelsverket.se, adressen står i remissvaret) med en begäran om myndighetens bedömning eller regulatorisk rådgivning.
  3. Spara svaret. Det är inte bindande, men det är värdefullt mot kunder och upphandlingar.

  Läkemedelsverket kan i sin tur ta frågan vidare till BCWG/Helsingforsproceduren eller till kommissionen enligt art. 4.

### Gaps
- Läkemedelsverkets egna webbsidor om programvara/appar, "Medicinteknisk produkt eller inte" och kontaktvägar kunde inte läsas, eftersom sidorna renderas med JavaScript och API-åtkomst nekades i sessionen. Exakta sidnamn, kontaktformulär och eventuella avgifter för rådgivning är därför inte verifierade.
- Uppgiften i uppdraget om att "AI-dokumentationsassistenter klassats som IIa" kunde inte beläggas. Pressmeddelandet säger bara "omfattas det troligen av regelverket" och anger ingen klass.

---

## 3. Formulering av avsett ändamål, marknadsföring, friskrivningar och jämförbara produkter

### Takeaway
Avsett ändamål bestäms enligt art. 2.12 av **allt** tillverkaren kommunicerar: märkning, bruksanvisning, säljmaterial och uttalanden. En friskrivning som motsägs av funktioner eller marknadsföring väger lätt. MDCG kräver nu att det avsedda ändamålet är otvetydigt. Påståenden som rör patientsäkerhet, kliniska beslut eller enskilda patienter kan göra Lotsa till en medicinteknisk produkt.

### Cited Findings
- Art. 2.12 omfattar "label, ... instructions for use or in promotional or sales materials or statements". [LAG] — [MDR](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02017R0745-20250110)
- Art. 7 förbjuder i märkning, bruksanvisning, tillhandahållande och reklam för *produkter* att vilseleda genom att "(a) ascribing functions and properties to the device which the device does not have ... (d) suggesting uses for the device other than those stated to form part of the intended purpose". [LAG] — [MDR art. 7](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02017R0745-20250110)
- MDCG 2019-11 rev.1 säger att påståenden om medicinskt syfte måste stödjas av klinisk evidens, "If this is not the case, the software ... may not be CE marked as a medical device, nor present said claims". [VÄGL] — [MDCG 2019-11 rev.1, avsnitt 3](https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en?filename=mdcg_2019_11_en.pdf)
- MDCG 2021-24 rev.1 säger att oavsiktlig användning inte ändrar klassen, men att tillverkaren måste agera om den normala kliniska användningen förändras över tid. [VÄGL] — [MDCG 2021-24 rev.1](https://health.ec.europa.eu/document/download/cbb19821-a517-4e13-bf87-fdc6ddd1782e_en?filename=mdcg_2021-24_en.pdf)
- Läkemedelsverket om ambient scribes: "Det är alltså inte tillräckligt att betrakta produkten som enbart ett dokumentationsstöd om den i praktiken påverkar det medicinska beslutsunderlaget". Etiketten väger alltså lätt mot den faktiska funktionen. — [Läkemedelsverket 4.3.2026](https://via.tt.se/pressmeddelande/4272364/lakemedelsverket-granskar-ai-assistenter-i-sjukvarden?lang=sv)
- Borderline-manualen: medicinska kalkylatorer med patientspecifik inmatning bedöms som medicintekniska produkter i klass IIa eller högre, och en app för informationsutbyte som bara kommunicerar bedöms inte som medicinteknisk produkt. — [Borderline-manualen v5](https://health.ec.europa.eu/document/download/71a87df8-5ca1-4555-b453-b65bdf8de909_en?filename=md_borderline_manual_en.pdf)
- Philips egna utbildningssidor anger att "the Instructions for Use is considered leading information". Tillverkare betraktar alltså själva bruksanvisningen som auktoritativ och annat material som sekundärt. Uppgiften kommer från ett sökresultat. — [Philips healthcare education](https://www.usa.philips.com/healthcare/education/HPMEDU118) [KOMM]

### Inferences
- [SLUTS] **Förslag till avsett ändamål som håller Lotsa utanför MDR:** "Lotsa är ett verktyg för att söka i och läsa tillverkares bruksanvisningar för utrustning som verksamheten har laddat upp. Lotsa visar ordagranna utdrag med sidhänvisning och kan visa en svensk arbetsöversättning av utdraget. Lotsa är inte avsett att ge information för diagnos, behandling, övervakning eller beslut om enskilda patienter, ersätter inte bruksanvisningen, utbildning eller verksamhetens rutiner och ska inte användas för att ställa in behandlingsparametrar."
- [SLUTS] **Formuleringar som tippar över gränsen och ska undvikas:**
  - "ökar patientsäkerheten", "minskar vårdskador", "beslutsstöd", "kliniskt stöd" och "hjälper dig att välja rätt inställning för patienten"
  - "larmtolkning" för fysiologiska larm, "dosering", "rätt flöde" och "felsökning av patientens tillstånd"
  - "validerad mot klinisk praxis" och "ersätter bruksanvisningen"
  - marknadsföring mot intensivvård med påståenden om snabbare åtgärder vid larm
  - integration med utrustning eller journal som ger kontext om patienten

  Tillåtet och lämpligt är till exempel "snabbare åtkomst till tillverkarens bruksanvisning", "spårbara citat med sidnummer" och "stöd för MT-avdelningens dokumenthantering".
- [SLUTS] En friskrivning ("inte en medicinteknisk produkt") stärker analysen bara om produkten *tekniskt* hindrar klinisk användning, till exempel genom att vägra frågor om dosering, patientspecifika inställningar och fysiologisk tolkning. Lotsa gör det redan enligt beskrivningen, och vägrandet bör dokumenteras och testas som en designkontroll.
- [SLUTS] Jämförbara produktkategorier i den icke-medicintekniska zonen är dokument- och bibliotekssystem (som "library functions" i MDCG), tillverkarnas egna eIFU-portaler och generiska sökfunktioner. På den medicintekniska sidan finns medicinska kalkylatorer och verktyg som tolkar patientdata.

### Gaps
- Jag hittade inga verifierade, publicerade kvalificeringsbeslut för kunskapsbaser i UpToDate-stil, kliniska LLM-chattbottar på sjukhus eller tillverkares bruksanvisningsappar i EU/Sverige. Det behövs fortsatt sökning. Tillverkarnas eIFU-portaler är en del av tillverkarens skyldigheter enligt eIFU-förordningen, men de är inte egna medicintekniska produkter enligt någon källa som lästs.

---

## 4. eIFU-förordningen (EU) 2021/2226, MDR bilaga I §23 och tredjeparts roll när innehåll ur bruksanvisningar presenteras

### Takeaway
Det är tillverkaren som ansvarar för bruksanvisningen. Den ska enligt svensk rätt finnas **på svenska** även för produkter för yrkesmässigt bruk, och den måste versionshanteras och uppdateras. Sedan juli 2025 får alla produkter för yrkesmässigt bruk ha eIFU.

En tredje part som Lotsa blir inte "tillverkare" av bruksanvisningen genom att visa den. MDR art. 16.2 visar ändå att lagstiftaren ser översättning av tillverkarens information som en reglerad aktivitet när en ekonomisk aktör gör den. Den största regulatoriska och ansvarsmässiga risken för Lotsa är att en AI-översättning eller sammanfattning avviker från bruksanvisningen, eller bygger på en inaktuell version.

### Cited Findings
- MDR bilaga I 23.1(a): "instructions for use shall be written in terms readily understood by the intended user". 23.1(f): eIFU bara enligt de särskilda reglerna. 23.1(g): kvarstående risker ska anges som "limitations, contra-indications, precautions or warnings". Informationen ska "if the manufacturer has a website, be made available and kept up to date on the website". [LAG] — [MDR bilaga I avsnitt 23](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02017R0745-20250110)
- MDR art. 10.11: tillverkaren ska se till att produkten åtföljs av informationen i avsnitt 23 "in an official Union language(s) determined by the Member State". [LAG] — [MDR](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02017R0745-20250110)
- SFS 2021:631 3 kap. 1 §: informationen i avsnitt 23 i bilaga I "ska anges på svenska när en produkt tillhandahålls användare eller patienter i Sverige, oavsett om den är avsedd för yrkesmässig eller annan användning". [LAG] — [SFS 2021:631](https://data.riksdagen.se/dokument/sfs-2021-631.text)
- MDR art. 16.2(a): "provision, including translation, of the information supplied by the manufacturer, in accordance with Section 23 of Annex I" räknas *inte* som en ändring av produkten. Men enligt art. 16.3–16.4 måste en distributör eller importör som översätter ha ett kvalitetsledningssystem "which ensure that the translation of information is accurate and up-to-date", informera tillverkaren och den behöriga myndigheten minst 28 dagar i förväg och visa ett certifikat från ett anmält organ. [LAG] — [MDR art. 16](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02017R0745-20250110)
- Förordning 2021/2226 i originallydelse: eIFU var tillåtet för implantat, fast installerade produkter och produkter med inbyggd visning, och bara för yrkesanvändare. Art. 2 definierar eIFU som bruksanvisningar som "made available through a software or a website". Art. 4 kräver en dokumenterad riskbedömning, bland annat för tillfällig otillgänglighet och versionshantering. Art. 5: pappersversion inom 7 dagar på begäran, bruksanvisningen på webbplatsen på medlemsstatens språk, "effective systems and procedures ... to ensure that device users having downloaded instructions for use from the website can be informed in case of updates or corrective actions", och "all issued historical electronic versions ... shall be available on the website". Art. 7.2: webbplatsen ska vara "protected against unauthorised access and tampering of content". [LAG] — [Förordning (EU) 2021/2226](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32021R2226)
- Ändringsförordning (EU) 2025/1234, i kraft 16 juli 2025, ger art. 3.1 ny lydelse: "Manufacturers may provide instructions for use in electronic form instead of in paper form where those instructions relate to devices referred to in Article 1(4) of Regulation (EU) 2017/745 intended for use by professional users". Om det kan förutses att lekmän använder produkten ska deras bruksanvisning ges i pappersform. Skälen nämner en enkät hösten 2024 som visade att vårdpersonal föredrar eIFU. [LAG] — [Förordning (EU) 2025/1234](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32025R1234); [konsoliderad 2021/2226, 16.7.2025](https://eur-lex.europa.eu/eli/reg_impl/2021/2226/2025-07-16/eng/pdf)
- HSLF-FS 2021:52 5 kap. 5 §: vårdgivaren ska anmäla "felaktigheter och brister i märkning eller bruksanvisning som kan leda till eller har lett till" död eller allvarlig försämring av hälsotillståndet. Anmälan görs till Läkemedelsverket och tillverkaren (5 kap. 2 §). [LAG] — [HSLF-FS 2021:52, Socialstyrelsen](https://www.socialstyrelsen.se/kunskapsstod-och-regler/regler-och-riktlinjer/foreskrifter-och-allmanna-rad/konsoliderade-foreskrifter/202152-om-anvandning-av-medicintekniska-produkter-i-halso--och-sjukvarden/)

### Inferences
- [SLUTS] Lotsa är varken distributör eller importör av utrustningen. Art. 16 gäller därför inte direkt, och Lotsa blir inte tillverkare av bruksanvisningen. Art. 16.3 visar ändå tydligt vilken standard en myndighet förväntar sig när någon översätter tillverkarens information: noggrannhet, aktualitet och information om korrigerande åtgärder. Det är rimligt att använda den som designkrav.
- [SLUTS] Svenska bör vara förstahandsvalet. Eftersom bruksanvisningen enligt lag ska finnas på svenska bör Lotsa i första hand använda den svenska bruksanvisningen. Om bara engelska eller tyska finns bör Lotsa (i) visa originaltexten bredvid översättningen, (ii) markera översättningen som "maskinöversättning, inte tillverkarens text" och (iii) föreslå att MT begär den svenska bruksanvisningen från tillverkaren. Att en svensk bruksanvisning saknas kan i sig vara en avvikelse hos tillverkaren.
- [SLUTS] **Versionsrisken är den största praktiska risken.** Tillverkaren ska kunna nå användare med uppdateringar och korrigerande åtgärder (FSN), men det når inte en PDF som hospitalet har laddat upp i Lotsa. Lotsa behöver därför:
  - metadata om dokumentets version och datum
  - ett krav på att varje dokument har en ansvarig person på MT
  - en påminnelse om omkontroll
  - en varning om ett dokument är äldre än X månader
  - en funktion för att snabbt dra tillbaka ett dokument
- [SLUTS] Lotsa kan stödja vårdgivarens skyldighet enligt HSLF-FS 2021:52 att anmäla brister i bruksanvisningar, till exempel med en knapp för att flagga oklar eller motsägelsefull text till MT. Lotsa ska aldrig själv anmäla.

### Gaps
- Jag hittade inget verifierat uttalande från en myndighet om ansvaret för tredjepartstjänster som visar eller översätter innehåll ur bruksanvisningar till vårdpersonal.

---

## 5. Upphovsrätt och avtal: uppladdning på sjukhuset, undantaget för text- och datautvinning, förinstallerade bruksanvisningar och villkor på eIFU-portaler

### Takeaway
Tillverkarnas bruksanvisningar är sannolikt skyddade som "beskrivande framställning i skrift" om de når verkshöjd. Det är troligt för längre bruksanvisningar, men kortare tekniska instruktioner kan falla utanför. Översättning är en ensamrätt för upphovsmannen.

En sjukhusintern uppladdning stöds delvis:
- Den ursprungliga indexeringen kan falla under TDM-undantaget i 15 a § URL, om tillverkaren inte har förbehållit sig rätten.
- Ordagranna citat kan stödjas av citaträtten i 22 §.
- Att permanent lagra och återge hela textavsnitt samt översätta dem ryms dock inte självklart i något undantag.

Den säkra vägen är en licens eller avtalsklausul, eller att förlita sig på den implicita rätt att använda bruksanvisningen som följer med köpet av utrustningen (min egen slutsats). **Lotsa får inte leverera förinstallerade bruksanvisningar utan licens från tillverkarna.**

### Cited Findings
- URL 1 § 1 p.: upphovsrätt gäller för "skönlitterär eller beskrivande framställning i skrift eller tal". [LAG] — [URL (1960:729), riksdagen.se](https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-1960729-om-upphovsratt-till-litterara-och_sfs-1960-729/)
- URL 2 §: ensamrätten omfattar framställning av exemplar och tillgängliggörande "i ursprungligt eller ändrat skick, i översättning eller bearbetning". Framställning omfattar "varje direkt eller indirekt samt tillfällig eller permanent framställning". Enligt sista stycket jämställs med överföring till allmänheten "överföringar och framföranden som i förvärvsverksamhet anordnas till eller inför en större sluten krets". [LAG] — [URL](https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-1960729-om-upphovsratt-till-litterara-och_sfs-1960-729/)
- URL 11 a §: tillfälliga exemplar som är en integrerad och väsentlig del av en teknisk process, flyktiga eller av underordnad betydelse och utan självständig ekonomisk betydelse. [LAG] — [URL](https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-1960729-om-upphovsratt-till-litterara-och_sfs-1960-729/)
- URL 15 a §: "Den som har lovlig tillgång till ett verk får framställa exemplar av verket för text- och datautvinningsändamål. Exemplaren får inte behållas längre än vad som är nödvändigt för ändamålet och får inte användas för andra ändamål. Första stycket gäller inte om upphovsmannen på lämpligt sätt har förbehållit sig den rätt som avses där." 15 b § gäller bara forskningsorganisationer och kulturarvsinstitutioner, och avtalsvillkor som inskränker den rätten är ogiltiga. 15 c §: TDM är "en automatiserad teknik som används för att analysera text och data i digital form i syfte att generera information". (Lag 2022:1712.) [LAG] — [URL](https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-1960729-om-upphovsratt-till-litterara-och_sfs-1960-729/)
- DSM-direktivet art. 4.3: undantaget gäller "on condition that the use ... has not been expressly reserved by their rightholders in an appropriate manner, such as machine-readable means in the case of content made publicly available online". Skäl 18: för innehåll online är förbehåll lämpliga "by the use of machine-readable means, including metadata and terms and conditions of a website or a service". I andra fall kan förbehållet göras "by other means, such as contractual agreements or a unilateral declaration". [LAG] — [Direktiv (EU) 2019/790](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32019L0790)
- URL 22 §: "Var och en får citera ur offentliggjorda verk i överensstämmelse med god sed och i den omfattning som motiveras av ändamålet." [LAG] — [URL](https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-1960729-om-upphovsratt-till-litterara-och_sfs-1960-729/)
- URL 49 § ger katalogskydd i 15 år för sammanställningar av "ett stort antal uppgifter" eller resultatet av "en väsentlig investering". [LAG] — [URL](https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-1960729-om-upphovsratt-till-litterara-och_sfs-1960-729/)
- I NJA 2004 s. 149 nådde en teknisk ritning inte verkshöjd. Enligt PMÖD 2018:3 uttrycker verkshöjd "samma, ganska måttliga krav på originalitet, som EU-rätten". Uppgifterna kommer från en sökmotorsammanfattning; avgörandena har inte lästs i sin helhet. — [NJA 2004 s. 149](https://lagen.nu/dom/nja/2004s149); [PMÖD 2018:3](https://lagen.nu/dom/pmod/2018:3) [KOMM]
- Philips utbildningssidor har en upphovsrättsnotis: reproduktion eller överföring "in whole or in part, in any form or by any means, electronic, mechanical or otherwise, is prohibited without prior written consent". Uppgiften kommer från ett sökresultat; eIFU-portalens egna villkor har inte lästs. — [Philips](https://www.usa.philips.com/healthcare/education/HPMEDU118) [KOMM]

### Inferences
- [SLUTS] **Uppladdning och indexering på sjukhuset:**
  - Sjukhuset har lovlig tillgång eftersom bruksanvisningen följer med produkten eller hämtas från tillverkarens webbplats.
  - Själva indexeringen, alltså att dela upp texten i delar och skapa embeddings, ligger nära TDM enligt 15 c § ("analysera ... i syfte att generera information"). Men 15 a § kräver att exemplaren "inte behållas längre än vad som är nödvändigt" och "inte användas för andra ändamål". Ett permanent RAG-index som visar ordagrann text ser ut som en varaktig användning, inte bara TDM.
  - Ett maskinläsbart förbehåll, till exempel i webbplatsvillkor eller TDM-metadata på eIFU-portalen, eller ett förbehåll i avtalet slår ut 15 a §.
  - Det mest robusta stödet är därför (1) den implicita licens att använda bruksanvisningen för att hantera produkten som följer med köpet, (2) en uttrycklig klausul i inköps- eller serviceavtal ("köparen får lagra, indexera, söka i och för intern användning översätta bruksanvisningar i interna informationssystem") och (3) citaträtten i 22 § för korta citat med källhänvisning.
- [SLUTS] **Översättning:** en AI-översättning av ett skyddat avsnitt är en "översättning" enligt 2 §. Det finns inget specifikt undantag för intern översättning. Risken är praktiskt låg om översättningen är tillfällig, visas för en användare och kopplas till ett citat av originalet, men den är rättsligt inte nollställd. En regional vårdgivare (offentlig, inte "förvärvsverksamhet") har svagare koppling till regeln om "större sluten krets" än en privat vårdgivare.
- [SLUTS] **Förinstallerade bruksanvisningar från Lotsa:** det är exemplarframställning och spridning till allmänheten (kunder). Det kräver licens, och inget TDM- eller citatundantag täcker det. Lotsa bör inte leverera bruksanvisningar. Alternativet är att kunden själv hämtar bruksanvisningen från tillverkarens eIFU-portal och laddar upp den, eller att Lotsa sluter licensavtal med tillverkare. Ett licensavtal ger också tillgång till versionsuppdateringar.
- [SLUTS] **Avtal med kunden:** kunden bör i användaravtalet garantera att den har rätt att ladda upp dokumenten. Lotsa bör i avtalet friskriva sig från ansvar för kundens rätt att använda dokumenten och erbjuda möjlighet att ta bort dokument (notice-and-takedown).

### Gaps
- Jag har inte läst något svenskt avgörande om verkshöjd för just bruksanvisningar.
- De faktiska villkoren på stora eIFU-portaler (Medtronic, Philips, GE HealthCare, B. Braun, Fresenius, Baxter, Dräger) har inte lästs. Det behövs för att avgöra om det finns TDM-förbehåll.
- Förarbetena till lag 2022:1712 (prop. 2021/22:278) om vad "på lämpligt sätt" betyder lästes inte.

---

## 6. Om Lotsa är en medicinteknisk produkt: väg för klass I och IIa, krav, EUDAMED, språk, art. 5.5 och vad köparna kräver enligt HSLF-FS 2021:52

### Takeaway
- **Klass I:** egen försäkran om överensstämmelse med teknisk dokumentation enligt bilagorna II–III, utan anmält organ. Kraven är ändå omfattande: kvalitetsledningssystem, en person med ansvar för regelefterlevnad (PRRC), klinisk utvärdering, system för övervakning efter utsläppande, vigilans, UDI och registrering i EUDAMED.
- **Klass IIa:** anmält organ enligt bilaga IX kapitel I och III med granskning av representativ teknisk dokumentation. Det ger ytterligare kostnader och ledtider, som enligt kommentatorer är cirka 25–60 tkr EUR och 12–24 månader, men siffrorna är overifierade.
- **Art. 5.5 (egentillverkning) är inte tillgängligt för Lotsa som företag.**
- Vårdgivarnas skyldigheter enligt HSLF-FS 2021:52 gör att köparna kommer att kräva CE-märkning om Lotsa är en medicinteknisk produkt. Om Lotsa inte är det kommer de att kräva en dokumenterad kvalificeringsanalys.

### Cited Findings
- Art. 52.7: tillverkare av klass I ska "declare the conformity of their products by issuing the EU declaration of conformity ... after drawing up the technical documentation set out in Annexes II and III". [LAG] — [MDR art. 52](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02017R0745-20250110)
- Art. 52.4: klass IIa "shall be subject to a conformity assessment as specified in Chapters I and III of Annex IX, and including an assessment of the technical documentation ... of at least one representative device for each category of devices". [LAG] — [MDR art. 52](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02017R0745-20250110)
- Bilaga I 17.2: programvara "shall be developed and manufactured in accordance with the state of the art taking into account the principles of development life cycle, risk management, including information security, verification and validation". 17.4: minimikrav på hårdvara, IT-nätverk och IT-säkerhet ska anges. [LAG] — [MDR bilaga I 17](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02017R0745-20250110)
- Art. 15: mikro- och småföretag "shall not be required to have the person responsible for regulatory compliance within their organisation but shall have such person permanently and continuously at their disposal". [LAG] — [MDR art. 15](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02017R0745-20250110)
- Art. 5.3: demonstration of conformity "shall include a clinical evaluation in accordance with Article 61". [LAG] — [MDR art. 5](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02017R0745-20250110)
- Art. 5.5 (egentillverkning) gäller bara "devices, manufactured and used only within health institutions". Villkoren är bland annat att produkten inte överförs till en annan juridisk person, att den tillverkas under ett lämpligt kvalitetsledningssystem, att institutionen motiverar att likvärdig produkt inte finns på marknaden och att den gör en offentlig förklaring. "This paragraph shall not apply to devices that are manufactured on an industrial scale." [LAG] — [MDR art. 5.5](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02017R0745-20250110)
- I Sverige är IVO behörig myndighet för produkter enligt art. 5.5. [LAG] — [SFS 2021:631 2 kap. 2 §](https://data.riksdagen.se/dokument/sfs-2021-631.text)
- COM(2025) 1023 föreslår att villkoren för egentillverkning görs mer flexibla, till exempel att överföring tillåts i patientsäkerhetens eller folkhälsans intresse. Läkemedelsverket anser att kriterierna för överföring är "för generösa". [LAG-förslag/VÄGL] — [COM(2025) 1023](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:52025PC1023); [Läkemedelsverkets yttrande](https://regeringen.se/contentassets/d79c8e7023fa46fb92388a96cb382b40/lakemedelsverket.pdf)
- Språk: informationen enligt avsnitt 23 i bilaga I ska vara på svenska (SFS 2021:631 3 kap. 1 §). Försäkran om överensstämmelse (art. 19) och viss annan dokumentation ska vara på svenska eller engelska (3 kap. 2 §). [LAG] — [SFS 2021:631](https://data.riksdagen.se/dokument/sfs-2021-631.text)
- **EUDAMED:** genom kommissionens beslut (EU) 2025/2371 (EUT 27.11.2025) förklarades fyra moduler funktionsdugliga: aktörsregistrering, UDI/produktregistrering, anmälda organ och certifikat samt marknadskontroll. De blev **obligatoriska den 28 maj 2026**. För produkter som redan fanns på marknaden ("legacy") gäller en övergångsperiod för UDI/produktregistrering till **28 november 2026**, och certifikat utfärdade före den obligatoriska tidpunkten ska registreras senast 28 maj 2027. Modulerna för vigilans och kliniska prövningar är ännu inte obligatoriska. Uppgifterna kommer från en sökmotorsammanfattning av HPRA, kommissionen och TÜV NORD. — [Kommissionen, EUDAMED overview](https://health.ec.europa.eu/md_eudamed/overview); [HPRA](https://www.hpra.ie/news-events/news/article/mandatory-use-of-eudamed-modules-for-medical-devices); [TÜV NORD](https://www.tuev-nord.de/en/knowledge/standards-in-focus/eudamed-mandatory-use-of-first-four-modules-from-may-28-2026/) [KOMM, primärkällor ej lästa i sin helhet]
- **Kostnader och tid för anmält organ (klass IIa):** "€25,000 - €60,000" i bedömningsavgifter och "€10,000 - €40,000/year" för övervakning, med "12-24 months" väntetid för första bedömning. Siffrorna har ingen källa och har inte verifierats. — [MedDev Insider (Substack)](https://meddevinsider.substack.com/p/master-eumdr-2017745-conformity-assessment) [KOMM, låg tillförlitlighet]
- COM(2025) 1023 föreslår att det anmälda organet för klass IIa bara granskar teknisk dokumentation för en representativ produkt och att avsnitt 3(a) i bilaga II undantas. [LAG-förslag] — [COM(2025) 1023, bilaga IX](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:52025PC1023)
- AI-förordningen: genom Digital Omnibus om AI har skyldigheterna för AI med hög risk i medicintekniska produkter skjutits upp till 2 augusti 2028. Uppgiften kommer från en sökmotorsammanfattning. — [Deemed Consulting](https://www.deemedconsulting.com/insights/2026-10-05-eu-mdr-ivdr-targeted-revision-proposal-status) [KOMM]
- **HSLF-FS 2021:52 (vårdgivarens skyldigheter) [LAG]:**
  - 2 kap. 2 §: vårdgivaren ska genom rutiner säkerställa att "endast säkra och medicinskt ändamålsenliga medicintekniska produkter och, till dessa, anslutna informationssystem används på patienter", att de är "kontrollerade och korrekt installerade" och att "information från tillverkare och myndigheter om medicintekniska produkter finns tillgänglig för hälso- och sjukvårdspersonalen".
  - 3 kap. 3 §: personalen ska ha kunskap om "produkternas funktion" och "hanteringen av produkterna".
  - 3 kap. 4 §: kontroll före användning ska ske "enligt av tillverkaren givna instruktioner".
  - 1 kap. 8 § definierar informationssystem som "system som samlar in, bearbetar, lagrar eller distribuerar och presenterar information".

  — [HSLF-FS 2021:52](https://www.socialstyrelsen.se/kunskapsstod-och-regler/regler-och-riktlinjer/foreskrifter-och-allmanna-rad/konsoliderade-foreskrifter/202152-om-anvandning-av-medicintekniska-produkter-i-halso--och-sjukvarden/)

### Inferences
- [SLUTS] **Om Lotsa blir klass I behövs:**
  - ett kvalitetsledningssystem, där ISO 13485 är praxis
  - en programvarulivscykel enligt IEC 62304
  - riskhantering enligt ISO 14971
  - användbarhet enligt IEC 62366-1
  - hälsoprogramvara enligt IEC 82304-1
  - IT-säkerhet (bilaga I 17.4)
  - klinisk utvärdering enligt art. 61 och MDCG 2020-1, med valid klinisk koppling, teknisk prestanda och klinisk prestanda. För Lotsa skulle det främst vara noggrannhet i hämtning och citat samt översättningskvalitet.
  - PMS-plan och PMS-rapport, vigilansrutiner och PRRC
  - Basic UDI-DI/UDI-DI och registrering i EUDAMED (obligatoriskt sedan 28 maj 2026)
  - märkning och bruksanvisning på svenska
  - registrering av aktören i EUDAMED (SRN)

  Standardnumren är branschpraxis och har inte verifierats mot listan över harmoniserade standarder i denna session.
- [SLUTS] Om Lotsa blir IIa eller IIb, till exempel genom regel 3.3 eller funktioner för beslutsstöd, tillkommer ett anmält organ. För ett litet bolag blir det sannolikt ett års arbete eller mer och kostnader på sex siffror i EUR. Klinisk evidens för ett generativt LLM-system är dessutom svår att ta fram, eftersom modellens beteende ändras vid varje uppdatering och det kräver hantering av förändringar.
- [SLUTS] Art. 5.5 kan inte användas av Lotsa. En region kan inte heller köpa Lotsa och kalla den egentillverkad. Om en region bygger ett eget motsvarande verktyg måste den visa att det inte finns någon likvärdig produkt på marknaden, och IVO är tillsynsmyndighet.
- [SLUTS] **Vad köparna kommer att kräva** (utifrån 2 kap. 2 § och 3 kap. 3–4 §§ i HSLF-FS 2021:52):
  - en skriftlig kvalificeringsanalys som visar att Lotsa inte är en medicinteknisk produkt eller ett informationssystem "anslutet" till produkterna
  - ett avsett ändamål som kan föras in i vårdgivarens rutiner
  - en rutin för versionshantering av bruksanvisningar
  - ett klart besked om att den officiella bruksanvisningen fortsatt är styrande
  - utbildningsmaterial
  - loggning
  - informationssäkerhet och dataskydd, även om Lotsa saknar patientdata

  Lotsa bör positioneras som ett hjälpmedel för att uppfylla kravet att "information från tillverkare ... finns tillgänglig", inte som ersättning för den.

### Gaps
- MDCG 2020-1 (klinisk utvärdering av programvara) kunde inte laddas ned; servern returnerade ett skript i stället för en PDF. Kapacitet hos anmälda organ för programvara i Norden 2026, verkliga offerter och NANDO-listor har inte undersökts.
- Produktansvar: det nya produktansvarsdirektivet (EU) 2024/2853 omfattar programvara och gäller för produkter som släpps ut från december 2026. Det är relevant för Lotsa oavsett MDR-status men har inte lästs i denna session: [EUR-Lex 2024/2853](https://eur-lex.europa.eu/eli/dir/2024/2853/oj).
- AI-förordningens transparenskrav (art. 50) och krav på AI-kunnighet (art. 4) för en icke-medicinteknisk chattbot har inte lästs i denna session.

---

## 7. Svårigheter och motåtgärder, rekommendation och vad man gör i varje scenario

### Takeaway
**Rekommendation:** Positionera Lotsa uttryckligen som **icke-medicinteknisk programvara för sökning i och läsning av bruksanvisningar**. Steg 3 avgör inte saken efter rev.1, så positioneringen ska bygga på steg 4 och art. 2.1, alltså inget medicinskt syfte för enskilda patienter. Lotsa ska också vara tekniskt låst så att den inte kan ge kliniskt eller patientspecifikt stöd. Dokumentera kvalificeringen enligt MDCG 2019-11 rev.1 och begär Läkemedelsverkets syn innan försäljningen tar fart.

Den största risken är att funktionerna växer (integration med utrustning, fysiologisk larmtolkning, inställningar) och att kunderna använder Lotsa kliniskt. Det kan göra Lotsa till en produkt i klass IIa/IIb, och de kostnaderna kan ett litet bolag knappast bära.

### Cited Findings
- MDCG 2019-11 rev.1: NLP-sökning är inte "simple search" om den bidrar till ett medicinskt syfte. Avsett ändamål ska vara otvetydigt. — [MDCG 2019-11 rev.1](https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en?filename=mdcg_2019_11_en.pdf)
- MDCG 2021-24 rev.1: tillverkaren ska agera om den normala kliniska användningen förändras över tid. — [MDCG 2021-24 rev.1](https://health.ec.europa.eu/document/download/cbb19821-a517-4e13-bf87-fdc6ddd1782e_en?filename=mdcg_2021-24_en.pdf)
- Implementeringsregel 3.3: programvara som påverkar användningen av en produkt får produktens klass. — [MDR bilaga VIII](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02017R0745-20250110)
- Läkemedelsverket: etiketten "dokumentationsstöd" räcker inte om produkten i praktiken påverkar beslutsunderlaget. — [Läkemedelsverket 4.3.2026](https://via.tt.se/pressmeddelande/4272364/lakemedelsverket-granskar-ai-assistenter-i-sjukvarden?lang=sv)
- Läkemedelsverket motsätter sig den föreslagna lättnaden i regel 11. — [Läkemedelsverkets yttrande 9.4.2026](https://regeringen.se/contentassets/d79c8e7023fa46fb92388a96cb382b40/lakemedelsverket.pdf)

### Inferences

**Scenario A: Lotsa är inte en medicinteknisk produkt (huvudscenario).** [SLUTS]
1. Skriv ett dokument om avsett ändamål och kvalificering som går igenom steg 1–5, med citat från MDCG 2019-11 rev.1 och MDCG 2021-24 rev.1.
2. Se över all marknadsföring och alla avtalstexter så att de följer avsnitt 3.
3. Bygg in skyddsmekanismer i modellen:
   - vägra dosering, patientspecifika inställningar, diagnos och tolkning av fysiologiska larm
   - visa alltid ordagranna citat med sidnummer
   - om det inte finns något citat: säg att svaret saknas
   - hänvisa till MT eller klinisk rutin
4. Ha ett testpaket med "röda frågor" (kliniska frågor som ska vägras) och kör det vid varje uppdatering av modell eller prompt.
5. Ta in kunddokument med versionsmetadata.
6. Visa originaltexten bredvid översättningen och ett tydligt maskinöversättningsmärke.
7. Följ upp kundernas användning (loggar utan patientdata).
8. Ta in en klausul i kundavtalet om att Lotsa inte får användas för kliniska beslut och att kunden ansvarar för sina rutiner enligt HSLF-FS 2021:52.
9. Begär Läkemedelsverkets syn.

Följ COM(2025) 1023, eftersom en ny regel 11 och ett nytt kvalificeringsförfarande kan ändra läget 2027–2028.

**Scenario B: Läkemedelsverket eller en kund menar att Lotsa är klass I.** [SLUTS]
- Välj mellan (i) att snäva in funktionerna, till exempel ta bort generativ sammanfattning och bara visa sökträffar med citat och översättning, eller (ii) att CE-märka i klass I genom egen försäkran. Det kräver kvalitetsledningssystem, PRRC (kan hyras in för småföretag), klinisk utvärdering, PMS, vigilans, UDI, registrering i EUDAMED och bruksanvisning på svenska.
- Räkna med 6–12 månaders arbete. Det är min uppskattning; inga källor har verifierats.

**Scenario C: klass IIa eller IIb, till exempel genom regel 3.3 eller funktioner för beslutsstöd.** [SLUTS]
- Det kräver ett anmält organ med kostnader på 25–60 tkr EUR och uppåt och 12–24 månader enligt kommentatorer (osäkert). AI-förordningens krav för hög risk tillkommer från augusti 2028.
- Det är sannolikt inte ekonomiskt försvarbart för ett generiskt bruksanvisningsverktyg. Rekommendationen är att aldrig bygga funktioner som leder hit, eller att göra dem till en separat produkt med egen plan för regelefterlevnad.

**Svårigheter och motåtgärder:** [SLUTS]
- **Kunder använder Lotsa kliniskt** ("vilka inställningar ska jag ha för patienten?"). Motåtgärder: tekniskt vägrande, utbildningsmaterial, villkor i avtalet, övervakning av frågetyper och en årlig granskning av användningen som dokumenteras. Om klinisk användning blir "normal" kräver MDCG 2021-24 att tillverkaren omprövar kvalificeringen.
- **Funktionerna växer.** Exempel är integration med utrustningens loggar eller larm, med journal eller patientöversikt, beräkning av infusionshastigheter, checklistor kopplade till patient och proaktiva varningar. Motåtgärd: en formell "MDR-grind" i utvecklingsprocessen där varje ny funktion bedöms mot steg 2–4 och regel 3.3.
- **Hallucinationer eller felöversättningar** som leder till felaktig hantering av utrustning. Motåtgärder: krav på citat, att kontrollera varje citat mot källtexten (som Lotsa redan gör enligt CLAUDE.md), att visa originalspråket, att aldrig parafrasera varningar utan att också citera dem ordagrant och att visa avsnitt med "Varning/Försiktighet" ordagrant.
- **Inaktuella bruksanvisningar eller missade FSN.** Motåtgärder: versionsfält, en ansvarig på MT, påminnelser och rutiner för att dra tillbaka dokument.
- **Upphovsrätt.** Motåtgärder: inga förinstallerade bruksanvisningar, en garanti från kunden om rätten till dokumenten, möjlighet att ta bort dokument och avtal med tillverkare.
- **Ansvar.** Även om Lotsa inte är en medicinteknisk produkt finns produktansvar (nytt PLD), avtalsansvar och skadeståndsansvar. Motåtgärder: försäkring, ansvarsbegränsning i avtalet och dokumenterad testning.

### Gaps
- Det finns inget myndighetsbeslut som bekräftar kvalificeringen för just den här produkttypen, och Läkemedelsverkets aktuella webbvägledning kunde inte läsas. Slutsatsen att Lotsa inte är en medicinteknisk produkt är därför en välgrundad bedömning utifrån officiell vägledning, inte ett myndighetsbesked.
- Tidsuppskattningarna för scenario B och C bygger inte på verifierade källor.
