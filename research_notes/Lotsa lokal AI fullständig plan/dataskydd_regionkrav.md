# Dataskydd, offentlighet, cybersäkerhet, arbetsrätt och regionernas IT-säkerhetskrav för Lotsa som offline-skrivbordsapp (läge 22 november 2026)

**Om källorna (läs först).** Webbsökning fungerade, men hämtning av hela sidor var spärrad i den här sessionen för bland annat imy.se, ncsc.se, lakartidningen.se och legal500.com (DNS-fel i sessionens nätverksregler). Uppdraget utgick från att nätet var öppet, men så var det inte. Alla citerade fynd nedan bygger därför på **sökträffarnas utdrag** ur de angivna källorna, inte på genomläsning av hela dokumentet. Påståenden märkta **[ej verifierad]** bygger på välkänd lagtext eller vägledning som jag inte kunde se i någon sökträff i sessionen. De måste kontrolleras mot riksdagen.se, imy.se eller lagen.nu innan de används i avtal, säljmaterial eller DPIA-underlag.

Anteckningarna bygger vidare på `research_notes/Lokal AI app för sjukhus/dataskydd_cyber_ansvar.md` (2026-11-22), som redan täcker CRA, produktansvar och modellicenser. Här fördjupas de frågor som den filen lämnade öppna. Utgångspunkten är att Lotsa **inte** är en medicinteknisk produkt (MDR utreds separat).

**Produktantaganden:** helt offline, ingen telemetri, leverantören (Lotsa AB) har ingen åtkomst till installationen. Möjliga funktioner: användarnamn, frågehistorik/loggar, gemensamt manualbibliotek på en nätverksdisk, diktering. Personal kan av misstag skriva in patientuppgifter.

---

## 1. GDPR och dataskyddslagen (2018:218): personuppgifter, roller, DPIA och inbyggt dataskydd

### Takeaway
Lotsa behandlar personuppgifter så fort användarnamn eller frågeloggar sparas. Patientuppgifter som skrivs in av misstag blir känsliga uppgifter om hälsa. **Regionen eller den privata vårdgivaren är personuppgiftsansvarig.** Lotsa AB blir personuppgiftsbiträde först när bolaget i praktiken får tillgång till data, systematiskt eller som en planerad del av supporten. Enligt EDPB 07/2020 avgör tillgången och vem som bestämmer ändamål och medel, inte avtalsrubriken. En DPIA är sannolikt obligatorisk enligt IMY:s tvåkriterieregel: ny teknik (AI), anställda som registrerade och risk för känsliga uppgifter. Leverantören bör leverera ett färdigt DPIA-underlag och bygga in dataminimering som standard.

### Cited Findings
**Roller enligt EDPB:s riktlinjer 07/2020**
- En personuppgiftsansvarig behöver inte själv ha tillgång till uppgifterna. Den som har ett avgörande inflytande över ändamål och väsentliga medel är ansvarig även om den aldrig ser datan. — [EDPB Guidelines 07/2020 (version för offentligt samråd)](https://www.edpb.europa.eu/sites/default/files/consultation/edpb_guidelines_202007_controllerprocessor_en.pdf); [Lexology/HSF, seven takeaways](https://www.hsfkramer.com/notes/data/2020-10/new-edpb-guidelines-on-the-concepts-of-controller-and-processor-seven-practical-takeaways)
- En tjänsteleverantör kan vara biträde även om personuppgiftsbehandling inte är tjänstens huvudsyfte, t.ex. IT-support som oundvikligen får systematisk tillgång till data. Den som bara stöter på mycket begränsade personuppgifter tillfälligt, t.ex. när ett specifikt fel rättas, blir inte automatiskt biträde. Riktlinjernas exempel är städpersonal som inte förväntas komma åt personuppgifter. — [HSF Kramer](https://www.hsfkramer.com/notes/data/2020-10/new-edpb-guidelines-on-the-concepts-of-controller-and-processor-seven-practical-takeaways); [Hunton](https://www.hunton.com/privacy-and-cybersecurity-law-blog/edpb-publishes-guidelines-on-the-concepts-of-controller-and-processor-in-the-gdpr); [headlesslaw, EDPB 07/2020 final](https://www.headlesslaw.com/gdpr/level-3/guidelines/edpb-07-2020-controller-processor)
- Sökträffarna blandar samrådsversionen (september 2020) och den slutliga versionen (juli 2021). Punktnummer bör kontrolleras mot den antagna versionen på edpb.europa.eu. — [EDPB samrådsversion](https://www.edpb.europa.eu/sites/default/files/consultation/edpb_guidelines_202007_controllerprocessor_en.pdf)

**IMY och Region Skåne om roller**
- IMY: en leverantör får normalt ingen GDPR-roll bara genom att sälja eller installera. Flyttar leverantören kundens databaser, användarkonton eller loggar blir den biträde. — [IMY, Ansvarsroller vid finjustering av AI-applikationer](https://www.imy.se/globalassets/dokument/rapporter/ansvarsroller-enligt-gdpr-vid-finjustering-av-ai-applikationer.pdf) (från tidigare session)
- Region Skåne: en leverantör som får tillgång till personuppgifter vid support, utveckling eller underhåll är biträde, och då krävs ett PUB-avtal. — [Region Skåne, PUB-avtal information och stöd](https://vardgivare.skane.se/siteassets/2.-patientadministration/journalhantering-och-registrering/informationssakerhet/personuppgiftsbitradesavtal---fillistning/pub-avtal_information_och_stod.pdf) (från tidigare session)
- IMY (presentation 25 mars 2026) pekar på vårdgivaren som personuppgiftsansvarig och tar upp tystnadsplikten. — [IMY, Hantering av personuppgifter i hälso- och sjukvården 25 mars 2026](https://www.imy.se/globalassets/dokument/utbildningar-presentationer/hantering-av-personuppgifter-i-halso--och-sjukvarden-25-mars-2026.pdf)

**DPIA (konsekvensbedömning)**
- IMY: uppfyller en planerad behandling minst två av kriterierna i IMY:s förteckning enligt art. 35.4 ska en DPIA göras. Förteckningen är inte uttömmande, och en DPIA kan behövas även när bara ett kriterium är uppfyllt. Systematisk övervakning är ett av kriterierna. — [IMY, Konsekvensbedömning inför kamerabevakning](https://www.imy.se/verksamhet/kamerabevakning/konsekvensbedomning-infor-kamerabevakning/); [IMY, När ska en konsekvensbedömning genomföras?](https://www.imy.se/verksamhet/dataskydd/det-har-galler-enligt-gdpr/konsekvensbedomning/nar-ska-en-konsekvensbedomning-genomforas/)
- IMY:s vägledning från februari 2025 består av en praktisk guide och en bilaga med rättsligt tolkningsstöd (avsnitt 4.3 om EDPB:s kriterier och IMY:s förteckning, 4.4 om när DPIA inte krävs). Till den finns tre mallar: bedömning av behovet, själva konsekvensbedömningen och ett Excelblad för riskhantering. — [IMY, Rättsligt tolkningsstöd](https://www.imy.se/globalassets/dokument/vagledningar/rattsligt-tolkningsstod.pdf); [IMY, Mall för bedömning av behovet](https://www.imy.se/globalassets/dokument/mallar/mall-for-bedomning-av-behovet-av-konsekvensbedomning.pdf); [IMY, Mall för konsekvensbedömning](https://www.imy.se/globalassets/dokument/mallar/mall-for-konsekvensbedomning-enligt-dataskyddsforordningen.pdf)
- IMY har en svensk översättning av Artikel 29-gruppens riktlinjer om konsekvensbedömning (WP248, godkända av EDPB). — [IMY, Riktlinjer om konsekvensbedömning (WP248)](https://www.imy.se/globalassets/dokument/riktlinjer-om-konsekvensbedomning-avseende-dataskydd.pdf). **[ej verifierad]** WP248:s nio kriterier är:
  1. utvärdering eller poängsättning
  2. automatiserat beslutsfattande
  3. systematisk övervakning
  4. känsliga uppgifter
  5. storskalig behandling
  6. samkörning
  7. sårbara registrerade (anställda nämns uttryckligen)
  8. innovativ användning av ny teknik
  9. behandling som hindrar de registrerade från att utöva sina rättigheter
- IMY:s februari 2025-dokument om GDPR och generativ AI i offentlig förvaltning tar upp ansvarsskyldighet, övertro på AI-utdata och konsekvensbedömningar. — [IMY, nationella riktlinjer för generativ AI lanserade](https://www.imy.se/en/news/national-guidelines-for-generative-ai-in-public-administration-are-launched/)

**IMY:s tillsyn 2026**
- AI i offentlig sektor är ett av IMY:s tre prioriterade områden för vägledning och tillsyn 2026. — [IMY, News in English](https://www.imy.se/en/news/); [IMY:s AI-strategi](https://www.imy.se/globalassets/dokument/ovrigt/integritetsskyddsmyndighetens-ai-strategi.pdf)
- Enligt en sekundärkälla inledde IMY i maj 2026 tillsyn av Region Gävleborgs AI-baserade transkribering. Uppgiften är inte verifierad hos IMY. — [quasa.io (sekundär)](https://quasa.io/sv/media/imy-satter-ai-i-offentlig-sektor-under-lupp-kansliga-data-star-i-centrum)
- IMY:s innovationssandlåda publicerade i april 2026 en rapport om transkribering inom socialtjänsten. Den är relevant för Lotsas dikteringsfunktion. — [IMY, Transkribering inom socialtjänsten](https://www.imy.se/globalassets/dokument/rapporter/transkribering-inom-socialtjansten.pdf)

**Lagrum [ej verifierad]**
- Dataskyddslagen 2 kap. 2 § ger rättslig grund för myndigheters behandling enligt art. 6.1 e (uppgift av allmänt intresse eller myndighetsutövning). 3 kap. 3 § tillåter myndigheter att behandla känsliga personuppgifter med stöd av art. 9.2 g, bland annat när uppgifterna har lämnats till myndigheten, eller när behandlingen är nödvändig med hänsyn till ett viktigt allmänintresse och inte innebär ett otillbörligt intrång. — [Dataskyddslag (2018:218), riksdagen.se](https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-2018218-med-kompletterande-bestammelser_sfs-2018-218/)
- GDPR art. 25 (inbyggt dataskydd och dataskydd som standard), art. 28 (biträde), art. 30 (register), art. 32 (säkerhet), art. 35 (DPIA) och art. 88 (anställningsförhållanden). — [GDPR, EUR-Lex](https://eur-lex.europa.eu/eli/reg/2016/679/oj)

### Inferences
- **Vilka personuppgifter Lotsa kan behandla, med varierande risk:**
  1. personalens identitet (användarnamn, AD-konto)
  2. frågehistorik kopplad till person, som säger något om kompetens och arbetsbeteende och därmed kan användas för kontroll av anställda
  3. fritext med av misstag inskrivna patientuppgifter (art. 9-uppgifter och sekretess)
  4. ljud från diktering, som är röstdata och kan fånga patientsamtal i bakgrunden
  5. manualer, som normalt inte innehåller personuppgifter men kan ha namn på kontaktpersoner.
- **Roller.** Huvudregeln är att regionen eller vårdgivaren är personuppgiftsansvarig och att Lotsa AB inte har någon roll. Det kräver att supporten utformas så att leverantören inte får tillgång till data: inga fjärrsessioner mot produktionsdata, och felrapporter som kunden själv exporterar och som innehåller loggar utan fritext eller användarnamn. Lotsa AB bör ändå ha ett färdigt PUB-avtal som option för kunder som vill ha fjärrsupport. Lotsa AB blir personuppgiftsansvarig för egen del bara om bolaget samlar in data för egna ändamål, t.ex. för att förbättra modellen. Det ska uttryckligen uteslutas.
- **DPIA.** Minst två kriterier är sannolikt uppfyllda: ny teknik (generativ AI), anställda som registrerade och möjliga hälsouppgifter. Personbundna loggar som går att följa upp lägger till systematisk övervakning. Regionen gör DPIA:n, men den blir snabbare och mer positiv om Lotsa AB levererar ett ifyllt underlag i IMY:s mallformat.
- **Inbyggt dataskydd (art. 25) som leverantören bör bygga:**
  - Frågelogg **avstängd** som standard eller endast anonym. Personbunden logg aktiveras uttryckligen av en administratör, med motivering.
  - Konfigurerbar automatisk gallring (t.ex. 0, 30 eller 90 dagar). Den måste kunna stängas av om arkivbeslut kräver bevarande, se avsnitt 3.
  - Lokalt filter som varnar för personnummer (mönster ÅÅMMDD-NNNN med kontrollsiffra), samordningsnummer och reservnummer. Valfritt för namn eller datum. Varningen visas innan frågan skickas till modellen och sparas, med möjlighet att maskera.
  - Diktering helt lokalt. Ljud lagras inte, bara transkriberad text som går genom samma filter.
  - Kryptering i vila av databas och loggar (t.ex. via operativsystemets nyckelring eller BitLocker-krav).
  - Rollbaserad åtkomst: vanlig användare, manualförvaltare, loggranskare. Loggranskaren ska vara en egen roll så att chefer inte automatiskt ser frågor.
  - Export (CSV/JSON) och radering per användare, för registrerades rättigheter och utlämnande.
  - Ingen telemetri och inga anrop ut. Det ska gå att verifiera, t.ex. med en brandväggsregel som regionen kan sätta och en dokumenterad lista över nätverksanrop (= inga).
  - Användarinformation enligt art. 13 som en färdig text regionen kan använda.

### Gaps
- IMY:s faktiska förteckning enligt art. 35.4 (kriterielista och exempel) kunde inte läsas eftersom imy.se var spärrad för hämtning. Kriterienumren måste kontrolleras i rättsligt tolkningsstöd, avsnitt 4.3.
- Inget IMY-beslut eller ingen IMY-vägledning hittades som gäller lokalt installerad AI-programvara utan leverantörsåtkomst.
- Ordalydelsen i DSL 2 kap. 2 § och 3 kap. 3 § kunde inte hämtas.

---

## 2. Patientdatalagen (2008:355) och HSLF-FS 2016:40 (inklusive ändringar 2025)

### Takeaway
PDL gäller vårdgivares behandling av personuppgifter i hälso- och sjukvården. Lotsa är inte avsett att behandla patientuppgifter och är därför inte ett journalsystem. Om fritext med patientuppgifter sparas i loggar kan regionen dock hävdas behandla patientuppgifter i ett system som saknar PDL:s kontroller: behörighetsstyrning efter behovs- och riskanalys, åtkomstloggning och logguppföljning. Det enklaste sättet att undvika det är att Lotsa **inte sparar fritext** som standard. Sparas den måste den vara rollskyddad, gallras och kunna kontrolleras. Socialstyrelsen ändrade HSLF-FS 2016:40 under 2025 (bland annat HSLF-FS 2025:57) med anledning av lagen (2022:913) om sammanhållen vård- och omsorgsdokumentation.

### Cited Findings
- HSLF-FS 2025:57 ändrar HSLF-FS 2016:40. Ändringen beror på lagen (2022:913) om sammanhållen vård- och omsorgsdokumentation och uppdaterar främst hänvisningar till upphävda PDL-bestämmelser. — [lagen.nu, HSLF-FS 2025:57](https://lagen.nu/hslffs/2025:57); [Regelrådet, remiss Socialstyrelsen RR 2025-065](https://www.regelradet.se/download/18.47f3da51196675ea1fc3ece/1745579546252/RR_2025_065f.pdf); [SLF, remiss av författningar om behandling av personuppgifter](https://slf.se/app/uploads/2025/04/gem-2025-0037-remiss-av-forfattningar-om-behandling-av-personuppgifter-i-socialtjanst-och-halso-och-sjukvard-4.1-3425-2025-svar-senast-2025-04-22.pdf)
- Det ändrade 4 kap. innehåller, enligt sökträffarnas utdrag ur remissförslaget:
  - Vårdgivaren ska se till att tilldelade behörigheter följs upp och ändras vid behov.
  - Behovs- och riskanalysen ska dokumenteras och ligga till grund för villkoren för behörighetstilldelning.
  - Varje användares åtkomst till uppgifter om en patient ska dokumenteras (loggas).
  - Kontroller av loggar ska dokumenteras, och loggar ska sparas i minst fem år.
  - Kontrollernas frekvens ska anpassas efter antal behöriga användare, behandlingens omfattning och villkoren för behörighet.
  - Källor: [Stockholms stad, bilaga Socialstyrelsens föreskrifter om ändring i HSLF-FS 2016:40](https://meetingspublic.stockholm.se/welcome-sv/namnder-styrelser/kommunstyrelsen/mote-2025-04-23/agenda/bilaga-socialstyrelsens-foreskrifter-om-andring-i-foreskrifterna-och-allmanna-raden-hslf-fs-201640-om-journalforing-och-behandling-av-personuppgifter-i-halso-och-sjukvardenpdf?downloadMode=open); [Stockholms stad, remiss](https://meetingspublic.stockholm.se/welcome-sv/namnder-styrelser/kommunstyrelsen/mote-2025-04-23/agenda/remiss-forslag-till-andring-i-foreskrifterna-och-allmanna-raden-hslf-fs-201640-om-journalforing-och-behandling-av-personuppgifter-i-halso-och-sjukvardenpdf?downloadMode=open)
  - **Obs:** utdraget kommer från remissversionen. Den beslutade lydelsen och ikraftträdandedatumet bekräftades inte.
- Socialstyrelsens ändringsföreskrifter från oktober 2025 nämner bland annat 4 kap. 2 b § om uppföljning av behörigheter. 4 kap. 6 § upphävdes genom HSLF-FS 2025:57. — [Socialstyrelsen 2025-10-9825](https://www.socialstyrelsen.se/contentassets/b9a1be491b0244339c63b2ae41609dab/2025-10-9825.pdf); [Socialstyrelsen 2025-10-9830](https://www.socialstyrelsen.se/contentassets/387350f793154a38821222a4952732e6/2025-10-9830.pdf) (från tidigare session)
- Konsoliderad lydelse av HSLF-FS 2016:40. — [Socialstyrelsen, konsoliderad HSLF-FS 2016:40](https://www.socialstyrelsen.se/kunskapsstod-och-regler/regler-och-riktlinjer/foreskrifter-och-allmanna-rad/konsoliderade-foreskrifter/201640-om-journalforing-och-behandling-av-personuppgifter-i-halso--och-sjukvarden/)
- IMY har kritiserat vårdgivare för brister i behovs- och riskanalys och åtkomstkontroll. — [IMY, beslut Sahlgrenska DI-2019-3840](https://www.imy.se/globalassets/dokument/beslut/beslut-tillsyn-sahlgrenska-universitetssjukhuset-di-2019-3840.pdf)
- Socialstyrelsen publicerade i september 2026 en rapport om ansvarsfull användning av AI i hälso- och sjukvården, med förslag om bland annat uppföljning av AI i vården. — [Socialstyrelsen 2026-9-10396](https://www.socialstyrelsen.se/contentassets/1bff2db76fe14d0dbe33dff187de1df9/2026-9-10396.pdf)
- **[ej verifierad]** PDL 1 kap. 1 § anger att lagen gäller vårdgivares behandling av personuppgifter inom hälso- och sjukvården. 4 kap. 2 § gäller behörighetstilldelning och 4 kap. 3 § systematisk och återkommande kontroll av åtkomst (loggkontroll). — [PDL (2008:355), riksdagen.se](https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/patientdatalag-2008355_sfs-2008-355/)

### Inferences
- **När blir Lotsa "behandling av patientuppgifter" enligt PDL?** Sannolikt inte när en enstaka uppgift skrivs in av misstag och raderas direkt. Om appen sparar fritext som systematiskt innehåller patientuppgifter, t.ex. för att personalen vanemässigt skriver "patient X på sal 4 har larm på pumpen", kan regionen inte avfärda det. Då gäller PDL:s krav på behörighetsstyrning och loggkontroll även för Lotsa-loggarna, och dessutom sekretess enligt 25 kap. OSL. Det här är en tolkning. Ingen källa i sessionen behandlar frågan uttryckligen.
- **Design som håller Lotsa utanför PDL:s krav:**
  1. ingen lagring av fritext som standard
  2. personnummerfilter före lagring
  3. tydlig avsedd användning i bruksanvisningen ("Lotsa ska inte användas för patientuppgifter")
  4. om historik krävs: rollskyddad läsning, åtkomstlogg över vem som läst historik, export för regionens loggkontroll och automatisk gallring.
- PDL:s krav på 5 års lagring av åtkomstloggar gäller journalsystemets loggar. Om Lotsa ändå skulle bedömas omfattas kolliderar det med kort gallring av frågeloggar. Det är ytterligare ett skäl att inte spara fritext.
- PDL gäller både regioner och privata vårdgivare. Leverantören har inga egna skyldigheter enligt PDL, men regionens krav förs över i upphandlingen.
- Om Lotsa i framtiden integreras med journalen, t.ex. för att hämta vilken pump patienten har, förändras bedömningen helt och PDL:s krav gäller fullt ut. Det bör ligga utanför produkten.

### Gaps
- Ikraftträdandedatum för HSLF-FS 2025:57 och den beslutade lydelsen av 4 kap. 2, 2 b, 3 och 9 §§ bekräftades inte. Läs den konsoliderade versionen hos Socialstyrelsen.
- Ingen vägledning hittades om AI-assistenter i vården som inte är avsedda för patientdata i förhållande till PDL.

---

## 3. Offentlighets- och sekretesslagen (2009:400), tryckfrihetsförordningen och arkivlagen (1990:782)

### Takeaway
Hos en **region** blir sparade frågeloggar och uppladdade manualer sannolikt **allmänna handlingar**:
- Manualerna har kommit in till myndigheten.
- Loggarna är tekniskt färdiga sammanställningar, enligt praxis om automatiskt skapade listor och loggar (RÅ 1998:44, JO om e-postloggar).
- Undantag kan finnas, t.ex. för minnesanteckningar eller tillfälliga utkast.

Sparade loggar måste alltså kunna sökas fram, sekretessprövas (25 kap. 1 § OSL om patientuppgifter finns) och gallras **enbart med stöd av ett gallringsbeslut** (Riksarkivets eller regionens egna föreskrifter). Automatisk radering utan gallringsbeslut är ett rättsligt problem.

**Privata vårdgivare** omfattas normalt inte av offentlighetsprincipen. Undantaget är bolag där en region har rättsligt bestämmande inflytande (2 kap. 3 § OSL).

### Cited Findings
- RÅ 1998:44: en lista som e-postprogramvaran skapade automatiskt ansågs vara en allmän handling som upprättades när den var tekniskt färdig att ta emot poster. RÅ 1999:18: en cookie som bara lagrades i myndighetens egen dator ansågs inte vara allmän handling. — [RÅ 1998:44 (lagen.nu)](https://lagen.nu/dom/ra/1998:44); [RÅ 1999:18 (lagen.nu)](https://lagen.nu/dom/ra/1999:18) (från tidigare session)
- JO har bedömt att en e-postlogg är en allmän handling (2 kap. 10 § andra stycket 1 TF). Att en handling är allmän betyder inte att den är offentlig. — [JO, Offentlighet och sekretess 2025](https://www.jo.se/app/uploads/2026/02/offentlighet-och-sekretess-2025.pdf) (från tidigare session)
- eSam (juni 2025) har en rapport om allmänna handlingar i AI-utveckling, och en vägledning från 2022 om chattbotar. Chattbotsvägledningen konstaterar att inkommande konversationer blir allmänna handlingar och att systemet bör kunna lagra alla dialoger. — [eSam ES2025-11, Allmänna handlingar i AI-utveckling](https://www.esamverka.se/download/18.2c1061191975d5b3870ef6/1750145864554/ES2025-11%20Rapport%20Allm%C3%A4nna%20handlingar%20i%20AI-utveckling.pdf); [eSam ES2022-02, Vägledning bedömning och utveckling av chattbotar](https://www.esamverka.se/download/18.1ec521a61817ffb56511acf3/1655993640430/ES2022-02%20V%C3%A4gledning%20Bed%C3%B6mning%20och%20utveckling%20av%20chattbotar.pdf)
  - Obs: chattbotsfallet gäller medborgare som skriver till myndigheten. Det är inte samma sak som anställdas interna frågor.
- Länsstyrelsernas juridiska utredning om AI:
  - Det går inte att generellt slå fast att varje prompt är en allmän handling från det ögonblick den skrivs.
  - En tillfällig text i en pågående intern beredning kan ha en annan ställning än ett AI-genererat dokument i ett avslutat ärende.
  - Gallring kräver ett beslut som gäller den aktuella handlingstypen. Riksarkivet beslutar om gallring om inte lag eller förordning har särskilda regler.
  - [Länsstyrelsen, Utredning om de rättsliga förutsättningarna för AI på länsstyrelserna](https://www.lansstyrelsen.se/download/18.4814d8ed19a0a426351ed47/1761230468487/Juridisk%20utredning%20om%20AI%20inom%20L%C3%A4nsstyrelsernas%20Utforska%20AI-projekt.pdf)
- En juristbyrå varnar: om informationen är en allmän handling som ska bevaras kan en tjänst som raderar automatiskt skapa ett rättsligt problem. — [Stockholms juristbyrå, AI Act för myndigheter 2026 (sekundär)](https://www.stockholmsjuristbyra.se/ai-act-for-myndigheter-rattsliga-krav/)
- Om AI-material är en allmän handling avgörs av registratorn eller arkivfunktionen, inte av den som konfigurerar verktyget. — [AI på svenska, Hur länge sparas era AI-chattar? (sekundär)](https://aipasvenska.se/artiklar/hur-lange-sparas-ai-chattarna.html)
- SKR:s vägledning om AI i socialtjänsten: AI-genererade transkriptioner kan, om åtkomsten begränsas, behandlas som minnesanteckningar i stället för allmänna handlingar (med undantag). Varje nämnd fattar själv det slutliga beslutet. — [SKR, Använda AI i socialtjänsten](https://skr.se/digitaliseringivalfarden/digitaliseringsocialtjansten/anvandaaiisocialtjansten.8997.html)
- DIGG har konstaterat att det finns ett stort behov av vägledning om hur befintliga regler om allmänna handlingar och sekretess tillämpas på AI. — [DIGG, Redovisning av myndighetens arbete med AI](https://www.digg.se/download/18.7c8902fd19703b8a214216/1748850354842/Redovisning%20av%20myndighetens%20arbete%20med%20artificiell%20intelligens_rapportering%20av%20regleringsbrevsuppdrag_Digg_%20Anpassad.pdf)
- 2 kap. 3 § OSL: aktiebolag, handelsbolag, ekonomiska föreningar och stiftelser där kommuner eller regioner har rättsligt bestämmande inflytande likställs med myndigheter. Detsamma gäller vid tillämpning av arkivlagen (2 och 2 a §§). Sådana organ ska registrera och arkivera allmänna handlingar. — [Linköpings kommun, bolagspolicy bilaga 2](https://www.linkoping.se/contentassets/lank-bolagspolicy-for-linkopings-stadshuskoncern/bilaga-2-till-bolagspolicy-ur-kommunal-och-aktiebolagslagen.pdf); [OSL (lagen.nu)](https://lagen.nu/2009:400)
- SOU 2016:62 föreslog att offentlighetsprincipen i princip skulle införas i offentligt finansierad, privat utförd välfärd. Det kunde inte bekräftas att förslaget blivit lag. — [SOU 2016:62 (lagen.nu)](https://lagen.nu/sou/2016:62)
- Riksarkivets föreskrifter om gallring (t.ex. RA-FS 2021:3 om säkerhetshandlingar, RA-FS 2021:6) visar regelverkets struktur. Regioner beslutar själva om gallring i sina informationshanteringsplaner. — [lagen.nu, RA-FS 2021:3](https://lagen.nu/ra-fs/2021:3); [Riksarkivet, RA-FS 2021:6 konsoliderad](https://riksarkivet.se/files/2024/09/konsoliderad-version-ra-fs-2021-6.pdf)
- 10 kap. 2 a § OSL (sedan 1 juli 2023) tillåter att sekretessbelagda uppgifter lämnas till en enskild för teknisk bearbetning eller lagring. — [SFS 2023:335](https://www.svenskforfattningssamling.se/sites/default/files/sfs/2023-06/SFS2023-335.pdf) (från tidigare session)
- **[ej verifierad]**
  - TF 2 kap. 4 § (allmän handling = förvarad, inkommen eller upprättad).
  - TF 2 kap. 12 § (minnesanteckningar och utkast är inte allmänna om de inte arkiveras).
  - OSL 25 kap. 1 § (hälso- och sjukvårdssekretess med omvänt skaderekvisit).
  - Arkivlagen 3 och 10 §§ (regionen ska arkivera och får gallra bara enligt beslut). Kommuner och regioner beslutar själva om gallring för sina handlingar.
  - Privata vårdgivare har i stället tystnadsplikt enligt 6 kap. 12 § patientsäkerhetslagen (2010:659).
  - Källor: [TF, riksdagen.se](https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/tryckfrihetsforordning-1949105_sfs-1949-105/); [Arkivlag (1990:782), riksdagen.se](https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/arkivlag-1990782_sfs-1990-782/)

### Inferences
- **Manualer:** inkomna allmänna handlingar hos regionen, i regel offentliga. Det kan finnas sekretess för tillverkarens affärsförhållanden enligt 31 kap. 16 § OSL **[ej verifierad]**, men bruksanvisningar är oftast publika. Det gemensamma biblioteket på nätverksdisken är regionens handlingar och ska in i informationshanteringsplanen. Lotsa AB äger dem inte.
- **Frågeloggar hos region:** sannolikt allmänna handlingar när de sparas, enligt RÅ 1998:44-analogin. En möjlig motsatt tolkning är att frågor som bara sparas lokalt för användarens egen sessionshistorik liknar arbetsmaterial eller minnesanteckningar, jfr SKR:s transkriberingsresonemang. Lotsa AB ska inte göra den bedömningen åt kunden. Produkten bör stödja båda utfallen:
  - **Läge A, ingen lagring:** frågan och svaret finns bara i minnet under sessionen och sparas inte. Inget att lämna ut eller gallra.
  - **Läge B, lagring med regionens gallringsfrist:** sökbar och exporterbar logg, där gallringsfristen sätts av regionens arkivfunktion. Ingen hårdkodad automatisk radering, men stöd för gallring efter beslut. Ett gallringsprotokoll loggar när och vad som gallrats.
- **Sekretess:** innehåller loggen patientuppgifter gäller 25 kap. 1 § OSL. Exportfunktionen bör därför kunna maska personnummer, så att regionen kan lämna ut en maskad version efter sekretessprövning.
- **Diktering:** ljud som sparas blir upptagningar, alltså också handlingar. Spara inte ljud.
- **Privat vårdgivare:** offentlighetsprincipen gäller inte (om det inte är ett regionägt bolag), men GDPR och tystnadsplikt gäller. Samma lägen fungerar.
- **Säljargument:** "Lotsa sparar ingen fritext som standard" förenklar arkiv- och utlämnandefrågan mycket för regionen.

### Gaps
- Inget JO-beslut eller avgörande från HFD om generativa AI-chattloggar hos myndigheter hittades.
- eSam-rapporten ES2025-11 kunde inte läsas i sin helhet.
- Det hittades inget regionalt gallringsbeslut för AI-loggar.
- Kontrollera om det finns en ny arkivlag eller ändringar i arkivlagen 2025–2026. Det söktes inte.

---

## 4. Cybersäkerhetslagen (2025:1506), cybersäkerhetsförordningen (2025:1507) och MCF:s föreskrifter

### Takeaway
Cybersäkerhetslagen gäller sedan den 15 januari 2026 för **regioner** och för medelstora och större verksamheter inom hälso- och sjukvård, alltså även privata vårdgivare av den storleken. Den gäller inte Lotsa AB direkt.

MCF:s föreskrifter **MCFFS 2026:11** om säkerhetsåtgärder och ledningens utbildning gäller från den **1 oktober 2026** och preciserar säkerheten i leverantörskedjan:
- Innan system förvärvas ska verksamhetsutövaren bedöma och hantera risker.
- Verksamhetsutövaren ska säkerställa att leverantören uppfyller relevanta cybersäkerhetskrav och bedöma om leverantören kan göra det **under hela avtalstiden**.
- Avtal som ingåtts före den 1 oktober 2026 ska om möjligt kompletteras.

Detta förs i praktiken vidare till Lotsa AB som avtalskrav.

### Cited Findings
- Lagen (2025:1506) och förordningen (2025:1507) trädde i kraft den 15 januari 2026 och ersatte lagen (2018:1174). — [SFS 2025:1506](https://svenskforfattningssamling.se/sites/default/files/sfs/2025-12/SFS2025-1506.pdf); [Regeringen, januari 2026](https://regeringen.se/pressmeddelanden/2026/01/nu-skarps-kraven-pa-svensk-cybersakerhet/) (från tidigare session); [riksdagen.se, Cybersäkerhetslag (2025:1506)](https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/cybersakerhetslag-20251506_sfs-2025-1506/)
- Lagen omfattar statliga myndigheter, regioner, kommuner och verksamhetsutövare i NIS2-sektorerna som är medelstora eller större. — [Excedo, Den nya cybersäkerhetslagen – offentlig sektor (sekundär)](https://www.excedo.se/blog-articles/den-nya-cybersaekerhetslagen-vad-offentlig-sektor-behoever-veta); [lagen.nu, 2025:1506](https://lagen.nu/2025:1506)
- Incidentrapportering: en betydande incident ska anmälas så snart det kan ske, dock senast 24 timmar efter kännedom. Sekundärkällor anger i övrigt 72 timmar för incidentanmälan och en månad för slutrapport, men de är delvis oeniga. — [lagen.nu, 2025:1506](https://lagen.nu/2025:1506); [nis2europe.eu (sekundär)](https://nis2europe.eu/se/sv/artiklid/nis2-incidentrapportering-sverige-frister-myndighet)
- Länsstyrelser är tillsynsmyndigheter för kommuner och regioner. Sekundärkällor nämner IVO för hälso- och sjukvård, och rapportering till NCSC/CERT-SE. — [Cybersäkerhetsförordning (2025:1507), riksdagen.se](https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/cybersakerhetsforordning-20251507_sfs-2025-1507/); [zorc.se (sekundär)](https://zorc.se/kunskapsbank/lagar/cybersakerhetslagen); [opsiocloud (sekundär)](https://opsiocloud.com/sv/blogs/nya-cybersakerhetslagen-guide-vad-innebar-den-2026-guide/)
  - Obs: uppgifterna om tillsyn för privata vårdgivare är motstridiga och måste verifieras i förordningen.
- **MCFFS 2026:11**, "föreskrifter och allmänna råd om säkerhetsåtgärder och ledningens utbildning för väsentliga och viktiga verksamhetsutövare", gäller från den 1 oktober 2026 och innehåller både bindande regler och allmänna råd. — [NCSC, MCFFS 2026:11 (PDF)](https://www.ncsc.se/siteassets/radgivning-och-stod/foreskrifter/mcffs-2026-11-foreskrifter-och-allmanna-rad-om-sakerhetsatgarder-och-ledningens-utbildning-for-vasentliga-och-viktiga-verksamhetsutovare.pdf); [laglig.se, MCFFS 2026:11](https://www.laglig.se/foreskrifter/mcffs-2026-11); [cyberklar.se (sekundär)](https://cyberklar.se/blogg/foreskrifterna-1-oktober-2026)
- Leverantörskrav i MCFFS 2026:11 (enligt laglig.se och ension.se):
  - Verksamhetsutövaren ska bedöma cybersäkerhetsrisker från leverantörer och underleverantörer.
  - Före förvärv av system eller utkontraktering ska den utvärdera om leverantören kan uppfylla kraven under hela avtalstiden.
  - Ledningens sammanställningar ska innehålla information om brister hos leverantörer.
  - Förvärv, utveckling och underhåll regleras i 4 kap. 5–7 §§ (även 27 och 30–31 §§ nämns).
  - Avtal från före den 1 oktober 2026 ska om möjligt kompletteras.
  - Källor: [laglig.se](https://www.laglig.se/foreskrifter/mcffs-2026-11); [ension.se, MCFFS 2026:11 (sekundär)](https://ension.se/cybersakerhet/cybersakerhetslagen-nis2/mcffs-2026-11)
  - Paragrafnumren kommer från sekundärkällor och är **inte verifierade** mot PDF:en.
- **MCFFS 2026:12** gäller säkerhetsrevisioner och skanningar: granskning av dokumentation, intervjuer, tekniska kontroller och vid behov kontroll på plats (7 §). — [MCF, MCFFS 2026:12](https://www.mcf.se/contentassets/6ece72fbb2684346a837afada4844bfa/mcffs-2026-12.pdf)
- **MCFFS 2026:8** finns, men innehållet (troligen registrering eller incidentrapportering) kunde inte bekräftas. — [lagen.nu, MCFFS 2026:8](https://lagen.nu/mcffs/2026:8)
- Sedan den 1 juli 2026 har FRA (NCSC) föreskriftsrätten, men föreskrifter som MCF redan har meddelat gäller oförändrat. Uppgiften kommer från sökträffar och är inte verifierad. — [cyberklar.se (sekundär)](https://cyberklar.se/blogg/foreskrifterna-1-oktober-2026); [obrium.se (sekundär)](https://obrium.se/blogg/msp-och-molnleverantorer-foreskrifterna/)
- Den äldre MSBFS 2020:7 (statliga myndigheter) anger att säkerhetskrav vid anskaffning bland annat ska omfatta säkerhetstester, granskningar, ändringshantering och uppdatering. Den kan användas som checklista. — [MCF/MSB, MSBFS 2020:7](https://www.mcf.se/siteassets/dokument/regler/forfattningar/msbfs-2020-7-foreskrifter-om-sakerhetsatgarder-i-informationssystem-for-statliga-myndigheter.pdf)
- SKR:s verktyg KLASSA, som kommuner och regioner använder för att klassa information och ta fram säkerhetskrav vid IT-upphandling, uppges sedan december 2025 täcka kraven i cybersäkerhetslagen. — [Insyn Sverige, Bilaga 6 Dnr T2025-03764 Informationssäkerhet – ledningens genomgång 2025](https://insynsverige.se/documentHandler.ashx?did=2063989) (sannolik källa för sökträffens påstående, inte verifierad)

### Inferences
- **Vem som omfattas:** regionen (alltid) och större privata vårdgivare. Lotsa AB omfattas sannolikt inte själv: bolaget är litet, och "tillverkare av programvara" är generellt inte en NIS2-sektor. Lotsa AB får dock kraven via avtal och via CRA (se tidigare anteckningar).
- **Vad regionen sannolikt kräver av Lotsa AB för att uppfylla 4 kap. MCFFS 2026:11** (slutsats, eftersom de exakta kraven inte lästes):
  - dokumenterad säker utvecklingsprocess
  - sårbarhetshantering och säkerhetsuppdateringar med tidsfrister
  - incidentanmälan till kunden inom kort tid, så att regionen hinner rapportera inom 24 timmar
  - SBOM
  - signerade installationspaket och modellfiler med publicerade kontrollsummor
  - supportperiod som täcker hela avtalstiden
  - rätt för kunden att granska (revision eller säkerhetsfrågeformulär)
  - en plan för att avveckla produkten (exit).
- **Offline är en fördel:** ingen extern attackyta och ingen dataöverföring. Uppdateringskedjan (USB eller intern distribution via SCCM/Intune), lokala sårbarheter i llama.cpp och PDF-tolkare, och nätverksdisken för manualbiblioteket är dock fortfarande attackytor. Integritetsskydd för modell och manualer (hash, signatur) bör därför ingå.

### Gaps
- Den fullständiga texten i MCFFS 2026:11 (4 kap.) kunde inte läsas eftersom ncsc.se var spärrad. Paragrafnumren är inte verifierade.
- Innehållet i MCFFS 2026:8, registreringsfristen för regioner och vem som är tillsynsmyndighet för privata vårdgivare bekräftades inte.
- MCF:s eller NCSC:s metodstöd om leverantörskrav (enligt sekundärkälla planerad uppdatering 27 oktober 2026) hittades inte.

---

## 5. Säkerhetsskyddslagen (2018:585) och ändringar 2026–2027

### Takeaway
Ett säkerhetsskyddsavtal krävs bara om leverantören vid upphandling eller avtal kan få tillgång till säkerhetsklassificerade uppgifter (klass konfidentiell eller högre) eller till säkerhetskänslig verksamhet av motsvarande betydelse. För ett offline-verktyg med bruksanvisningar och utan leverantörsåtkomst är det **osannolikt**. Det kan dock aktualiseras om regionen klassar delar av sin IT-miljö eller sin beredskapsverksamhet som säkerhetskänslig och Lotsa AB får installera eller ge support på plats. Från den **1 juli 2026** har tillsynsmyndigheterna fått större befogenheter, och från den **1 januari 2027** gäller en anmälningsplikt för säkerhetsskyddade upphandlingar och avtal.

### Cited Findings
- 4 kap. 1 §: en verksamhetsutövare som planerar upphandling, avtal eller samarbete där motparten kan få tillgång till säkerhetsklassificerade uppgifter (konfidentiell eller högre) eller annan säkerhetskänslig verksamhet av motsvarande betydelse ska teckna ett säkerhetsskyddsavtal. — [Justitieutskottets betänkande 2025/26:JuU36](https://data.riksdagen.se/dokument/HD01JuU36.html); [Upphandlingsmyndigheten, säkerhetsskyddad upphandling](https://www.upphandlingsmyndigheten.se/globalassets/dokument/upphandling/dokumentversion-webbstod-sakerhetsskyddad-upphandling.pdf)
- Prop. 2025/26:182 (antagen maj 2026, gäller från 1 juli 2026):
  - Tillsynsmyndigheter får förelägga om särskild säkerhetsskyddsbedömning och lämplighetsprövning.
  - Kravet på säkerhetsskyddsavtal kompletteras med två "kontrollstationer".
  - Källor: [Prop. 2025/26:182](https://data.riksdagen.se/dokument/HD03182); [Regeringen, mars 2026](https://regeringen.se/pressmeddelanden/2026/03/starkta-mojligheter-att-agera-nar-avtal-och-samarbeten-hotar-sveriges-sakerhet/); [riksdagen.se, Utökade möjligheter att ingripa i säkerhetskänslig verksamhet](https://www.riksdagen.se/sv/dokument-lagar/dokument/_HD01JuU36)
- Från den 1 januari 2027 gäller en ny anmälningsplikt för alla som bedriver säkerhetskänslig verksamhet (4 kap. 1 a §, SFS 2026:764). — [Länsstyrelsen Västernorrland, 2026-07-01](https://www.lansstyrelsen.se/vasternorrland/om-oss/nyheter-och-press/nyheter---vasternorrland/2026-07-01-andringar-i-sakerhetsskyddslagen-ger-fyra-lansstyrelser-okade-befogenheter-i-sin-tillsynsverksamhet.html); [SFS 2026:764](https://xn--svenskfrfattningssamling-roc.se/sites/default/files/sfs/2026-05/SFS2026-764.pdf)
- Fyra länsstyrelser har fått ökade befogenheter i sin säkerhetsskyddstillsyn från den 1 juli 2026. — [Länsstyrelsen Värmland, 2026-07-01](https://www.lansstyrelsen.se/varmland/om-oss/nyheter-och-press/nyheter---varmland/2026-07-01-andringar-i-sakerhetsskyddslagen-ger-fyra-lansstyrelser-okade-befogenheter-i-sin-tillsynsverksamhet.html)
- Prop. 2025/26:303 (ny lag om ökad motståndskraft hos kritiska verksamhetsutövare, CER-direktivet) föreslås gälla från 1 januari 2027 och möjliggör högre sanktionsavgifter enligt säkerhetsskyddslagen för enskilda verksamhetsutövare. Prop. 2025/26:302 (civilplikt och säkerhetsprövning) föreslås också gälla från 1 januari 2027. Status för riksdagsbesluten bekräftades inte. — [sökträff, riksdagen.se via JuU36-sökning](https://data.riksdagen.se/dokument/HD01JuU36.html)
- En säkerhetsskyddad upphandling kräver inte alltid ett separat säkerhetsskyddsavtal. Myndigheten kan i stället ställa krav på säkerhetsskyddsåtgärder. — [Polisen, säkerhetsskyddad upphandling](https://polisen.se/aktuellt/upphandlingar/sakerhetsskyddad-upphandling/) (från tidigare session)

### Inferences
- **Lotsa AB:s läge:** produkten levereras som installationspaket, och regionens egen IT installerar den. Leverantören har ingen åtkomst och inget säkerhetsklassificerat innehåll (bruksanvisningar). Regionens säkerhetsskyddsanalys bör därför inte kräva säkerhetsskyddsavtal. Lotsa AB bör ändå kunna intyga att bolaget inte behöver eller begär åtkomst, och vara berett på frågor om ägarförhållanden, underleverantörer och var utvecklingen sker. Den nya lämplighetsprövningen och de nya "kontrollstationerna" handlar om motpartens tillförlitlighet.
- Om en region ändå begär säkerhetsskyddsavtal, t.ex. för installation på sjukhus med beredskapsuppdrag, krävs säkerhetsprövning av personal och placering i säkerhetsklass. Det är tungt för ett litet bolag. Motåtgärden är en leveransmodell där regionen själv installerar och uppdaterar.
- CER-lagen kan göra vissa regioner eller sjukhus till "kritiska verksamhetsutövare" från 2027. Det ökar sannolikt kraven på leverantörskedjan generellt. Detta är en slutsats och inte verifierat.

### Gaps
- Ordalydelsen i 4 kap. 1 a § (anmälan till vem, innehåll) och riksdagens beslut om prop. 2025/26:302 och 303 bekräftades inte.
- Säpos vägledning om säkerhetsskyddad upphandling för regioner lästes inte.

---

## 6. Tillgänglighet: DOS-lagen (2018:1937), EN 301 549 och WCAG 2.2

### Takeaway
DOS-lagen ställer krav på digital service som en offentlig aktör tillhandahåller. DIGG:s föreskrifter anger att lagen omfattar **webbplatser och mobila applikationer**. Ett internt installerat skrivbordsprogram faller därför sannolikt utanför lagens direkta krav. Ansvaret ligger i vilket fall på regionen, inte på leverantören.

I upphandling ska tillgänglighet beaktas, och regioner hänvisar till **EN 301 549**. Version **V4.1.1** (publicerad 2 september 2026) bygger på **WCAG 2.2 AA** och täcker uttryckligen icke-webbaserad programvara. Den är ännu inte citerad i EU:s officiella tidning, och V3.2.1 (WCAG 2.1) är fortfarande den formella referensen. Lotsa bör sikta på V4.1.1 / WCAG 2.2 AA.

### Cited Findings
- 1 § DOS-lagen: lagen innehåller bestämmelser om krav på tillgänglighet till digital service som tillhandahålls av en offentlig aktör. 10–11 §§ gäller tekniska lösningar under aktörens kontroll respektive under tredje parts kontroll ("så långt det är möjligt"). 8 § innehåller undantag (ändrad genom SFS 2025:992). — [data.riksdagen.se, SFS 2018:1937](https://data.riksdagen.se/dokument/sfs-2018-1937.html); [lagen.nu, 2018:1937](https://lagen.nu/2018:1937); [SFS 2025:992](https://svenskforfattningssamling.se/sites/default/files/sfs/2025-10/SFS2025-992.pdf)
- DIGG:s föreskrifter (MDFFS 2019:2): "Webbplatser och mobila applikationer är de tekniska lösningar som omfattas av tillämpningsområdet för lagen." — [DIGG:s föreskrifter om tillgänglighet till digital offentlig service](https://www.digg.se/download/18.129a4fef1939e2e1c1f21960/1653918115721/DIGGs-foreskrifter-om-tillganglighet-till-digital-offentlig-service.pdf)
- SFS 2026:1625 ändrar 4 § (definitionen av "offentlig aktör"). Innehållet lästes inte. — [SFS 2026:1625](https://svenskforfattningssamling.se/sites/default/files/sfs/2026-08/SFS2026-1625.pdf)
- EN 301 549 V4.1.1:
  - publicerad av ETSI, CEN och CENELEC den 2 september 2026
  - uppdaterar webbkraven från WCAG 2.1 till WCAG 2.2 A/AA
  - kopplar standarden till tillgänglighetsdirektivets (EAA) väsentliga krav
  - V3.2.1 är fortfarande den som är citerad i EUT
  - att uppfylla WCAG 2.2 AA är inte detsamma som att uppfylla EN 301 549 V4.1.1, som även täcker icke-webbaserad programvara och dokument.
  - Källor: [NDA Irland, EN 301 549 published](https://nda.ie/news/en301549-published); [Deque, EN 301 549 v4.1.1 is final](https://www.deque.com/blog/en-301-549-v4-1-1-is-final-what-changed-what-it-means-and-what-you-should-do/); [DWT, EAA ICT standards update (september 2026)](https://www.dwt.com/insights/2026/09/european-accessibility-act-ict-standards-update); [ETSI EN 301 549 v4.1.0 (utkast)](https://www.etsi.org/deliver/etsi_en/301500_301599/301549/04.01.00_20/en_301549v040100ev.pdf)
- Lag (2023:254), som genomför EAA, gäller i huvudsak konsumentprodukter och -tjänster. — [SFS 2023:254](https://svenskforfattningssamling.se/sites/default/files/sfs/2023-05/SFS2023-254.pdf) (från tidigare session)
- **[ej verifierad]** LOU 9 kap. 2 §: tekniska specifikationer ska om möjligt bestämmas med hänsyn till tillgänglighet för personer med funktionsnedsättning. — [LOU, riksdagen.se](https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-20161145-om-offentlig-upphandling_sfs-2016-1145/)

### Inferences
- Lotsas gränssnitt är HTML/CSS/JS (enligt `CLAUDE.md`). I en Tauri- eller webbvy-app kan WCAG 2.2 AA tillämpas nästan direkt:
  - tangentbordsnavigering
  - fokusmarkering
  - kontrast
  - skärmläsarstöd i webbvyn (kontrollera NVDA och JAWS på Windows)
  - diktering som alternativ inmatning
  - textstorlek.
- EN 301 549 kap. 11 (programvara) ställer också krav på samverkan med operativsystemets hjälpmedelstjänster. Det måste testas i den paketerade appen, inte bara i webbläsaren.
- Leverantören bör ta fram en **tillgänglighetsredogörelse / EN 301 549-överensstämmelserapport (ACR/VPAT)** som anbudsbilaga.

### Gaps
- Ordalydelsen i 2–3 §§ DOS-lagen och innehållet i SFS 2026:1625 lästes inte.
- Ingen DIGG-vägledning om intranät eller skrivbordsprogram hittades.
- Det bekräftades inte om V4.1.1 har citerats i EUT efter september 2026.

---

## 7. Arbetsrätt: MBL 11 och 19 §§, övervakning genom loggar, fackliga ståndpunkter

### Takeaway
Att införa ett AI-verktyg i vården är sannolikt en **viktigare förändring** som kräver förhandling enligt 11 § MBL innan beslut. Regionens lokala samverkansavtal kan ersätta förhandlingen med samverkan. Arbetsgivaren ska också löpande informera enligt 19 §.

Loggar som kan kopplas till enskilda anställda gör frågan känsligare. Enligt sekundärkällor har facket medbestämmanderätt när kontroll- eller övervakningssystem införs, och en DPIA ersätter inte förhandling. Facken har inga AI-specifika ståndpunkter om just detta. Deras genomgående krav är inflytande vid val och införande och att AI ska minska arbetsbördan. **Det är regionens skyldighet, men det påverkar leverantörens tidplan och vilken logg som är "säljbar".**

### Cited Findings
- 11 § MBL: arbetsgivaren ska på eget initiativ förhandla före beslut om viktigare förändringar. 14 § ger facket rätt att begära central förhandling. — [Östhammars kommun, genomgång MBL](https://ines.osthammar.se/globalassets/dokument/information/lon-hr-information/chefsportalen/lagar-avtal-och-styrdokument/genomgang_mbl.pdf); [MBL (lagen.nu)](https://lagen.nu/1976:580) (från tidigare session)
- Lokala samverkansavtal i regioner kan ersätta förhandling enligt 11, 12, 19 och 38 §§ MBL med samråd i samverkansgrupp. — [Lokalt samverkansavtal NU-sjukvården (lawinsider)](https://lawinsider.com/sv/contracts/38kbfaaw1TV) (från tidigare session)
- AD 2026 nr 25 gällde arbetsgivarens skyldighet enligt 19 a § MBL att hålla facket informerat om förändringar i verksamheten. AD 2026 nr 38 gällde 15, 16 och 19 a §§. — [AD 2026 nr 25](https://arbetsdomstolen.se/media/dxibccfu/ad-2026-nr-25.pdf); [AD 2026 nr 38](https://arbetsdomstolen.se/media/4mef4ir1/ad-2026-nr-38.pdf)
  - Ingen av domarna gäller AI. De visar att informationsskyldigheten prövas aktivt 2026.
- Sekundärkälla (advokatblogg): facket har medbestämmanderätt när övervakningssystem införs, och har arbetsgivaren inte förhandlat före införandet kan det vara ett separat brott. En DPIA ersätter inte förhandling. — [Legiscope, kamerabevakning och förhandling (sekundär)](https://www.legiscope.com/blog/kamerabevakning-arbetsplats-forhandling.html)
- Saco publicerade 2026 sina ståndpunkter om integritet i arbetslivet. Innehållet lästes inte. — [Saco, Sacos ståndpunkter om integritet i arbetslivet (2026)](https://www.saco.se/globalassets/bilder-video-och-dokument/sacos-rapporter/2026/sacos-standpunkter-om-integritet-i-arbetslivet/sacos-standpunkter-om-integritet-i-arbetslivet.pdf)
- **Läkarförbundet:**
  - En enkät visar att 10 av 18 svarande regioner saknar policy för AI-användning. Förbundet vill ha en nationell strategi för AI i vården.
  - En motion (Mellersta Skåne) kräver att läkare får verkligt inflytande över hur AI-system väljs, testas, införs och utvärderas.
  - Förbundet har policyer från 15 maj 2025 om vårdinformationssystem och hälsodata och om upphandling, utveckling och uppdatering av digitala system.
  - Källor: [Läkartidningen, 10 regioner saknar riktlinjer för AI](https://lakartidningen.se/nyheter/10-regioner-saknar-riktlinjer-for-ai-slf-vill-se-nationell-strategi/); [Läkartidningen, Läkarförbundets fullmäktige 2026](https://lakartidningen.se/tema/lakarforbundets-fullmaktigemote-2026/); [SLF, policy vårdinformationssystem och hälsodata 2025-05-15](https://slf.se/app/uploads/2025/09/policy-vardinformationssystem-halsodata-250515.pdf); [SLF, policy upphandling av digitala system 2025-05-15](https://slf.se/app/uploads/2025/09/policy-upphandling-utveckling-uppdatering-digitala-system-250515.pdf)
  - Datum för enkätartikeln saknas.
- Läkartidningen: AI måste minska arbetsbördan, inte öka den. — [Läkartidningen](https://lakartidningen.se/nyheter/ai-maste-minska-arbetsbordan-inte-oka-den/)
- **Vårdförbundet:**
  - Rapporten "Den dumma digitaliseringen" har ett avsnitt om AI i hälso- och sjukvården.
  - Förbundsordföranden: tekniken är inte problemet, utan hur den införs. Vårdprofessionerna ska involveras i upphandling och utveckling av IT-stöd.
  - Inriktningspropositionen 2026–2030 nämner inte AI i de utdrag som syntes.
  - Källor: [Vårdförbundet, Den dumma digitaliseringen](https://www.vardforbundet.se/contentassets/a10a5316a6f74ca2a2c7fed74d05fb56/den-dumma-digitaliseringen_finaldraft.pdf); [Vårdförbundet, pressmeddelande om digital stress](https://via.tt.se/pressmeddelande/3919090/digital-stress-i-halso-och-sjukvarden-kostar-bade-vardtid-och-miljarder-ny-rapport-fran-vardforbundet); [Vårdförbundet, inriktningsproposition 2026–2030](https://www.vardforbundet.se/siteassets/kongress-2026/vardforbundet---vi-formar-framtiden-inriktningsproposition-2026-2030.pdf)
- **Kommunal:** ingen AI-ståndpunkt hittades. Ett äldre remissvar om digitala lösningar i omsorgen betonar tillitsbaserad digitalisering och verkligt samtycke till övervakningsteknik. — [Kommunal, remissvar (regeringen.se)](https://www.regeringen.se/contentassets/08f95572a7b74970b75538c507306995/kommunal.pdf)
- **Andra förbund:** Akavia vill att fackliga företrädare involveras i styrningen av AI och har åtta tips för samverkan vid AI-införande (nulägesanalys, riskbedömning, uppföljning). Vision vill att arbetsgivare tar fram riktlinjer för AI-användning. — [Akavia, AI och arbetsplatsen – tips för förtroendevalda](https://akavia.se/siteassets/05-fortroendevald/presentationer/ai-och-arbetsplatsen---tips-for-fortroendevalda.pdf); [Akavia, pressmeddelande](https://via.tt.se/pressmeddelande/4223295/utbredd-ai-anvandning-i-kommunerna-men-brist-pa-styrning-och-utbildning); [Vision, arbetsrätt grund](https://vision.se/globalassets/documents/utbildning/utbildningsmaterial/vision-och-arbetsratten---grund/vision-och-arbetsratten-grund-digitalt-upplagg.pdf)
- Region Stockholms Centrum för arbets- och miljömedicin har en rapport om arbetsmiljön när AI blir chef. Innehållet lästes inte. — [CAMM Region Stockholm, Vad händer med arbetsmiljön när AI blir chef](https://www.camm.regionstockholm.se/49d1a8/globalassets/verksamheter/forskning-och-utveckling/centrum-for-arbets--och-miljomedicin1/dokument/rapporter/vad-hander-med-arbetsmiljon-nar-ai-blir-chef-tg-version.pdf)
- **[ej verifierad]** 19 § MBL: arbetsgivaren ska fortlöpande hålla facket underrättat om hur verksamheten utvecklas produktionsmässigt och ekonomiskt och om riktlinjerna för personalpolitiken. — [MBL (lagen.nu)](https://lagen.nu/1976:580)

### Inferences
- **För leverantören:** ge regionen ett färdigt **samverkansunderlag** (2–3 sidor):
  - vad Lotsa gör och inte gör
  - att personbunden logg är avstängd som standard
  - vem som kan se vad
  - att loggar inte är avsedda för prestationsuppföljning
  - kompetenskrav och utbildning (koppling till AI-förordningens art. 4 om AI-kunnighet)
  - riskbedömning för arbetsmiljön (t.ex. övertro på svar, ökad arbetsbörda).
- **Funktioner som minskar övervakningsrisken:**
  - aggregerad statistik utan användarnamn (vilka manualer frågas mest)
  - en egen roll för loggranskning med åtkomstlogg
  - skriftlig "ändamålsbegränsning" i användarinformationen.
- Att personalen deltar i val och test, som Läkarförbundet och Vårdförbundet kräver, kan användas i säljprocessen: pilot med referensgrupp av sjuksköterskor, undersköterskor och MT-ingenjörer.

### Gaps
- Ingen AD-dom om förhandlingsskyldighet vid införande av AI-verktyg hittades.
- Ingen formell AI-ståndpunkt från Vårdförbundet eller Kommunal hittades. Läkarförbundets AI-policy (om den finns) hittades inte.
- Arbetsmiljöverkets föreskrifter (AFS 2023 om organisatorisk och social arbetsmiljö, nu i ny struktur) och AI söktes inte.

---

## 8. Regionernas konkreta IT- och säkerhetskrav på programvaruleverantörer

### Takeaway
Det gick inte att hitta någon publik, aktuell regional "säkerhetsbilaga" i fulltext för programvaruleverantörer. Mönstret framgår ändå av styrdokument, revisionsrapporter, Ineras villkor och SKR:s material:
- Regionerna ställer **samma informationssäkerhetskrav på leverantören som på sig själva**.
- Kraven tas fram med informationsklassning (ofta SKR:s **KLASSA**) och förs in via standardbilagor.
- Det finns ofta ett ledningssystem i linje med **ISO/IEC 27001**.
- Regionerna har eller tar fram egna riktlinjer för generativ AI (VGR:s handlingsplan gäller från 11 februari 2026). Många saknade fortfarande policy 2025.

Krav på SBOM och penetrationstest hittades inte uttryckligen i regionala dokument. De följer dock av MCFFS 2026:11 (leverantörsbedömning) och CRA (SBOM), och efterfrågas i praktiken.

### Cited Findings
**Region Stockholm**
- Vägledningen för avtalsskrivning har tre mallar för informationssäkerhetsbilagor: behandling hos leverantören, behandling i regionens IT-system och behandling i leverantörens IT-system. Revisorerna noterade att det är svårt att ställa krav på leverantörer, och att sjukhusen hade svårt att få leverantörer att följa regionens generella riktlinjer. — [Region Stockholm, Regionrevisorerna rapport 3/2020, IT-säkerhet i nätverksansluten medicinteknisk utrustning](https://www.regionstockholm.se/493553/siteassets/om-region-stockholm/om-region-stockholm/rapporter-fran-regionrevisorerna/2020/projektrapport-3-2020-it-sakerhet-i-natverksansluten-medicinteknisk-utrustning.pdf)
- Inköpspolicyn (RS 2023-0758): krav som skyddar regionens information ska ställas i enlighet med styrande dokument för informationssäkerhet. — [Region Stockholm, Policy och riktlinjer Inköp](https://www.regionstockholm.se/4a896e/siteassets/om-region-stockholm/om-region-stockholm/styrande-dokument/ekonomi/policy-och-riktlinjer-for-inkop.pdf)
- Revisionsrapport 9/2022: de övergripande kraven på uppföljning av externa vårdgivare framgår av regionens riktlinjer. Kraven ställs via en standardbilaga som hänvisar till regionövergripande styrdokument. — [Region Stockholm, Regionrevisorerna rapport 9/2022, Externa vårdgivares informationssäkerhet](https://www.regionstockholm.se/4adb0d/siteassets/om-region-stockholm/om-region-stockholm/rapporter-fran-regionrevisorerna/2022/projektrapport-9-2022-externa-vardgivares-informationssakerhet.pdf); [Fia Ewald, blogg (åsikt)](https://fiaewald.se/blogg/1177-igen-2/)
- Riktlinje för informationssäkerhet och dataskydd 2025 (via Locums styrelseyttrande):
  - Externa leverantörer ska ha samma skydd för regionens informationstillgångar som om regionen själv hanterade dem.
  - Risker från beroende av leverantörer ska minimeras.
  - Kraven ska regleras i avtalet.
  - Källa: [Locum (Region Stockholm), yttrande över riktlinje för informationssäkerhet samt dataskydd, 2025-08-27](https://www.locum.se/globalassets/global/5.-om-oss/styrelsen-dokument/2025-08-27-styrelsen-arkiv/09beslut-yttrande-over-riktlinje-for-informationssakerhet-samt-dataskydd.pdf)

**Inera**
- Ineras ledningssystem bygger på ISO 27001. Ett äldre policyutdrag kräver ett ledningssystem för informationssäkerhet i linje med SS-EN ISO/IEC 27001 för komponenter som ansluts till Inera.
- Systemleverantörer ska följa Ineras informationssäkerhetspolicy och kvalitetssäkras av Inera för att få åtkomst.
- Det finns krav på bakgrundskontroller för vissa roller hos Inera och dess leverantörer.
- PUB-avtalet kräver tester och riskanalyser i testmiljö före driftsättning.
- Källor: [Inera, Informationssäkerhet och juridik](https://inera.se/tjanster/gemensam-arkitektur/informationssakerhet-och-juridik); [Inera, avtal om Agentens användning av Ineras tjänster, bilaga 1](https://www.inera.se/globalassets/inera/media/dokument/kontakta-oss/avtal/agentavtal/bilaga-1---reglering-av-agentens-anvandning-av-ineras-tjanster.pdf); [Inera, NLL](https://www.inera.se/tjanster/nll/); [Ineras personuppgiftsbiträdesavtal](https://www.inera.se/globalassets/inera/media/dokument/kontakta-oss/avtal/kundavtal-2/ineras-personuppgiftsbitradesavtal-1.pdf)
- Inera har utrett anslutning av tredjepartsprodukter. Det är relevant bara om Lotsa någon gång ska integreras med Ineras tjänster, t.ex. inloggning via SITHS. — [Inera, Behovsbild och väg framåt för anslutning av tredjepartsprodukter](https://www.inera.se/globalassets/inera/media/dokument/projekt/utredning-behovsbild-tredjepartsprodukter_v1.0-1.pdf)

**SKR och regionerna om AI**
- SKR:s "Färdplan för AI i regionerna – nulägeskartläggning" (december 2025) är regionernas första gemensamma leverans om AI. De flesta regioner har riktlinjer för anställdas användning av generativ AI. — [SKR, Färdplan för AI i regionerna](https://skr.se/download/18.1964f27f19ad3ac3673a1315/1764752556135/Fardplan-for-AI-i-regionerna-nulageskartlaggning.pdf); [SKR, Artificiell intelligens](https://skr.se/digitaliseringivalfarden/datadrivenutveckling/artificiellintelligensai.716.html)
- VGR: dokumentet "Införande av AI inom hälso- och sjukvården" gäller från den 11 februari 2026 och ger strategisk inriktning. Det konstaterar att generativa verktyg nu är allmänt tillgängliga för personalen. — [VGR, Införande av AI inom hälso- och sjukvården](https://mellanarkiv-offentlig.vgregion.se/alfresco/s/archive/stream/public/v1/source/available/sofia/ssn12937-108688567-32/surrogate/Inf%c3%b6rande%20av%20AI%20inom%20h%c3%a4lso-%20och%20sjukv%c3%a5rden.pdf)
- AI Sweden-kartläggningen 2025: fem regioner står för drygt 60 procent av vårdens AI-initiativ. Det är stor ojämlikhet mellan regionerna. — [AI Sweden, Ny kartläggning](https://www.ai.se/sv/nyheter/ny-kartlaggning-stor-ojamlikhet-i-regionernas-ai-arbete-inom-varden); [Voister](https://www.voister.se/artikel/2025/04/kartlaggning-fem-regioner-star-for-drygt-60-procent-av-vardens-ai-initiativ/)
- DIGG:s riktlinjer om att köpa generativ AI enligt LOU varnar för leverantörsvillkor som låter indata träna modeller. Leverantörer som stöder informationsklassning, hantering av känsliga uppgifter och kryptering kan vara bättre val. — [DIGG, Köp generativ AI enligt LOU](https://www.digg.se/ai-for-offentlig-forvaltning/riktlinjer-for-generativ-ai/kop-generativ-ai-enligt-lagen-om-offentlig-upphandling); [DIGG/IMY, Riktlinjer för användning av generativ AI (Fi2024-01535)](https://www.digg.se/download/18.41bb5ce61939e3df66831ea/1737390380051/Rapport%20Riktlinjer%20f%C3%B6r%20anv%C3%A4ndning%20av%20generativ%20AI%20och%20kompetensh%C3%B6jande%20insatser%20(Fi2024-01535).pdf); [Regeringen, nationella riktlinjer för generativ AI (jan 2025)](https://www.regeringen.se/pressmeddelanden/2025/01/regeringen-har-tagit-emot-nationella-riktlinjer-for-generativ-ai/)

**Andra kravkataloger som visar mönstret**
- Mittuniversitetets kravkatalog (2021): leverantören ska visa tillräcklig kompetens inom informationssäkerhet och rapportera incidenter. Avesta kommun: tydliga informationssäkerhetskrav vid upphandling, och avtalen ska reglera support och incidenter. — [Miun, Riktlinjer – kravkatalog upphandling](https://www.miun.se/globalassets/forvaltning/infra/informationssakerhet/miun-2020-2505-riktlinjer-kravkatalog-upphandling-inkl-informationssakerhet_20210203.pdf); [Avesta, Riktlinjer för informationssäkerhet](https://avesta.se/globalassets/for-alla-sidor/kommun-och-demokrati/styrande-dokument/riktlinjer/riktlinjer-for-informationssakerhet.pdf)
- Stockholms stads informationssäkerhetsbilaga (Skolplattformen 2018) är ett exempel på en detaljerad bilaga i en upphandling. — [Stockholms stad, Bilaga 3c Informationssäkerhet](https://start.stockholm/globalassets/start/forskola-och-skola/skolplattformen/upphandling-planering-och-bedomning/bilaga-3c---informationssakerhet.pdf)
- VGR:s äldre vägledning om medicinska informationssystem (2012) finns. — [VGR, Vägledning medicinska informationssystem](https://vgrblogg.se/utveckling/wp-content/uploads/sites/3/2020/04/vagledning_medicinska_informationssystem_2012-11-06.pdf)
- IMY:s frågeformulär för molntjänster frågar om art. 28.3-avtal med mera och visar vad offentliga kunder efterfrågar. — [IMY, frågeformulär molntjänster](https://www.imy.se/globalassets/dokument/ovrigt/frageformular-molntjanster.pdf) (från tidigare session)
- SBOM: ingen svensk regel för regioner hittades. SBOM följer av CRA, och svenska branschröster förespråkar SBOM-krav i upphandling. — [Advania, Vad är SBOM](https://www.advania.se/ordforradet/sbom); [Digitalist, Kräv en SBOM (åsikt)](https://www.digitalist.se/blogg/upphandla-inte-it-tjanster-i-en-svart-lada-krav-en-sbom)

### Inferences
- **Vilken evidens regionerna sannolikt begär** (sammanställt från mönstret ovan, MCFFS 2026:11 och CRA; ingen enskild regional källa listar allt):
  1. **Informationssäkerhet hos leverantören:** ISO/IEC 27001-certifikat, eller en redovisning av ett LIS i linje med 27001. För ett litet bolag kan en självdeklaration med kontrollmappning, t.ex. mot CIS Controls eller ISO 27002, accepteras i stället för certifiering, men det varierar.
  2. **Säkerhetsbeskrivning (security whitepaper):** arkitektur, dataflöden, kryptering, autentisering, loggning, uppdateringsprocess, härdningsguide.
  3. **Dataflödesdiagram** som visar att inga data lämnar klienten eller nätverksdisken.
  4. **Svar på KLASSA-baserade krav** efter regionens informationsklassning. Frågeloggar med möjliga patientuppgifter klassas troligen högt för konfidentialitet.
  5. **Penetrationstest eller säkerhetsgranskning** av oberoende part, med sammanfattning.
  6. **SBOM** (CycloneDX/SPDX) och policy för sårbarhetshantering (CVD).
  7. **DPIA-underlag** och beskrivning av roller (inget PUB-avtal behövs, eller PUB-avtal som option).
  8. **Tillgänglighetsredovisning** (EN 301 549).
  9. **Supportåtagande:** säkerhetsuppdateringar under hela avtalstiden, incidentanmälan, exit och radering.
  10. **AI-specifikt:** modellkort (modell, licens, version, kända begränsningar), utvärdering av svarskvalitet och hallucinationer (citatkontroll), avsedd användning och klassning enligt AI-förordningen och MDR.
- **Regionernas godkännandeprocess för AI-verktyg:** troligen informationsklassning, risk- och sårbarhetsanalys, DPIA, juridisk bedömning (MDR, AI-förordningen, OSL), samverkan med fack och beslut i förvaltningsorgan. Det är en slutsats från VGR:s handlingsplan och SKR:s färdplan. Detaljerna lästes inte.

### Gaps
- Inga aktuella fulltextbilagor från Region Stockholm, VGR, Region Skåne eller Region Uppsala hämtades. Det krävs direkt kontakt eller sökning i upphandlingsportaler (t.ex. e-Avrop, Visma TendSign).
- VGR:s och SKR:s dokument kunde bara ses via sökträffar.
- Inget regionalt krav på penetrationstest eller SBOM kunde citeras.
- Ineras aktuella informationssäkerhetspolicy lästes inte.

---

## 9. Svårigheter, motåtgärder och dokumentationschecklista för Lotsa AB

### Takeaway
De största svårigheterna:
1. **Fritextloggar** med möjliga patientuppgifter gör att GDPR art. 9, PDL, OSL 25 kap. och arkivregler gäller samtidigt.
2. **Personbundna loggar** blir en fråga om övervakning av anställda, med krav på MBL-förhandling och DPIA.
3. **Supporten** kan göra Lotsa AB till biträde.
4. **Leverantörskraven enligt MCFFS 2026:11 och CRA** är tunga för ett litet bolag.
5. **Regioner skiljer sig åt** och har ofta ofärdiga AI-processer.

Den viktigaste motåtgärden är dataminimering som standard. Den näst viktigaste är ett färdigt dokumentationspaket som regionen kan använda direkt.

### Cited Findings
- Revisorerna i Region Stockholm har noterat svårigheter att ställa och följa upp krav på leverantörer. — [Region Stockholm, Regionrevisorerna rapport 3/2020](https://www.regionstockholm.se/493553/siteassets/om-region-stockholm/om-region-stockholm/rapporter-fran-regionrevisorerna/2020/projektrapport-3-2020-it-sakerhet-i-natverksansluten-medicinteknisk-utrustning.pdf)
- 10 av 18 svarande regioner saknade AI-policy enligt Läkarförbundets enkät. — [Läkartidningen](https://lakartidningen.se/nyheter/10-regioner-saknar-riktlinjer-for-ai-slf-vill-se-nationell-strategi/)
- Debattartiklar beskriver att patientdata hamnar i ChatGPT medan vården saknar AI-policy. Det visar risken för skugg-AI, vilket är ett argument för ett godkänt lokalt verktyg. — [Realtid, debatt](https://www.realtid.se/debatt/patientdata-hamnar-i-chatgpt-medan-varden-saknar-ai-policy/)
- Automatisk radering kan strida mot bevarandeskyldighet. — [Stockholms juristbyrå (sekundär)](https://www.stockholmsjuristbyra.se/ai-act-for-myndigheter-rattsliga-krav/)
- Avtal från före den 1 oktober 2026 ska om möjligt kompletteras med cybersäkerhetskrav (MCFFS 2026:11). — [laglig.se](https://www.laglig.se/foreskrifter/mcffs-2026-11)

### Inferences

**Svårigheter och motåtgärder**

| Svårighet | Vem | Motåtgärd i produkt eller process |
|---|---|---|
| Patientuppgifter i fritext, med följder för art. 9, PDL, sekretess och arkiv | Region | Fritext sparas inte som standard. Personnummerfilter med varning och maskning. Tydlig avsedd användning. Rollskyddad historik med gallring när historik behövs. |
| Loggar som övervakning av anställda | Region (MBL, DPIA) | Personbunden logg av som standard. Aggregerad statistik utan namn. Egen roll för loggranskare med åtkomstlogg. Färdigt samverkansunderlag. |
| Frågeloggar som allmänna handlingar och gallring | Region | Två lägen: ingen lagring, eller lagring med gallringsfrist som regionen bestämmer. Export med maskning. Gallringsprotokoll. Ingen hårdkodad radering. |
| Leverantören blir biträde vid support | Lotsa AB | Supportmodell utan dataåtkomst: kunden exporterar diagnostikpaket utan fritext eller användarnamn, och fjärrsupport sker bara mot testmiljö. PUB-avtal finns som option. |
| Diktering fångar patientsamtal | Region | Lokal taligenkänning (ASR). Inget ljud lagras. Tryck-för-att-prata. Texten går genom samma filter. |
| Gemensamt bibliotek på nätverksdisk: integritet och åtkomst | Region (IT) | Läsrätt för alla, skrivrätt bara för manualförvaltare. Hash eller signatur per manual. Ändringslogg. Ingen personinformation i biblioteket. |
| Uppdateringar till offlinemiljö | Båda | Signerade paket. Publicerade SHA-256-summor. Stöd för SCCM/Intune/MSI. Dokumenterad uppdateringstakt. SBOM per release. |
| Leverantörskrav enligt MCFFS 2026:11 och CRA för ett litet bolag | Lotsa AB | Lätt LIS i linje med ISO 27001 med kontrollmappning (certifiering senare). Årligt externt penetrationstest. CVD-policy med kontaktpunkt. Supportåtagande på minst 5 år. |
| Säkerhetsskyddsavtal begärs | Region | Leveransmodell där regionen själv installerar, och intyg om att leverantören inte behöver åtkomst. |
| Regionerna har olika och ofärdiga AI-processer | Lotsa AB | Ett paket för AI-godkännande som går att återanvända. Pilot med referensgrupp av personal. |
| Privata vårdgivare har andra regler (ingen OSL, tystnadsplikt enligt PSL) | Vårdgivare | Samma tekniska lägen fungerar. Separat informationsblad. |

**Dokumentationschecklista för Lotsa AB**
1. **Säkerhetsbeskrivning:** arkitektur, komponenter (llama.cpp, PDF-tolkare, ASR), lagringsplatser, kryptering, autentisering (Windows/AD), roller, loggning, nätverk (inga utgående anrop, med testmetod), uppdateringsprocess, härdningsguide och brandväggsregler.
2. **Dataflödesdiagram**, ett per funktion: fråga och svar, uppladdning av manual, diktering, export och gallring.
3. **Ifyllt DPIA-underlag** i IMY:s mallformat: ändamål, kategorier av personuppgifter och registrerade, rättslig grund (förslag), risker (inklusive av misstag inskrivna hälsouppgifter och övervakning av anställda), åtgärder och kvarvarande risk.
4. **Rollbeskrivning (PUA och PUB):** "Lotsa AB behandlar inga personuppgifter för kundens räkning" och villkoren för när det ändras. Färdigt PUB-avtal som option, gärna baserat på SKR:s eller regionens mall.
5. **Logg- och gallringspolicy:** vilka loggar som finns (tekniska loggar, frågelogg, åtkomstlogg för historik och administratörsåtgärder), standardläge, konfigurerbara frister, export, maskning och vem som ser vad. Förklara kopplingen till arkivlagen och att regionen bestämmer gallringsfristen.
6. **Text för användarinformation** enligt art. 13 och en text för startskärmen ("skriv inte patientuppgifter").
7. **Samverkansunderlag** för MBL och arbetsmiljö.
8. **SBOM** (CycloneDX) och licensförteckning för bibliotek och modellvikter.
9. **Policy för sårbarhetshantering och CVD**, rutin för incidentanmälan till kunden (frist som ger regionen marginal mot 24 timmar) och CRA-rapportering.
10. **Sammanfattning av penetrationstest** från oberoende part.
11. **Redovisning av informationssäkerhet hos leverantören:** LIS, eventuell kontrollmappning mot ISO 27001/27002, utvecklingsprocess (säker kodning, kodgranskning, signering), bakgrundskontroller för personal.
12. **Tillgänglighetsredovisning** enligt EN 301 549 V4.1.1 / WCAG 2.2 AA.
13. **Modellkort och avsedd användning:** modell, version, licens, begränsningar, citatkontroll, utvärderingsresultat, MDR- och AI-förordningsbedömning (från den separata utredningen).
14. **Support-, uppdaterings- och exitplan:** supportperiod, uppdateringstakt, avinstallation och radering av data, export av manualbibliotek.
15. **Säkerhetsskyddsintyg:** att leverantören inte behöver åtkomst, samt uppgifter om ägarförhållanden och underleverantörer (för regionens säkerhetsskyddsanalys och lämplighetsprövning).

### Gaps
- Ingen region publicerar, i det som syntes i sessionen, en färdig checklista för "AI-verktygsgodkännande" för leverantörer. Checklistan ovan är en slutsats.
- Om regioner accepterar självdeklaration i stället för ISO 27001-certifiering från små leverantörer är inte belagt.
- Nästa steg: läs VGR:s dokument "Införande av AI inom hälso- och sjukvården", SKR:s färdplan, MCFFS 2026:11 4 kap. och IMY:s DPIA-förteckning i fulltext när imy.se, ncsc.se och regionernas webbplatser kan nås.
