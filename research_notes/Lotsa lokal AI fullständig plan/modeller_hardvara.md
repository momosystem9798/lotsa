# Lokala modeller, inferensmotorer och hårdvara för Lotsa (läge 22 november 2026)

> **Metodnot.** Den här sessionen kunde läsa euroeval.com, huggingface.co (API och modellkort), github.com (webbsidor och raw-filer), arxiv.org, ceur-ws.org, llama.com och learn.microsoft.com direkt. EuroEvals svenska topplista lästes som rådata: CSV-filen `swedish_generative` som sajten laddar (504 rader, senaste post daterad 2026-11-17). Följande domäner var blockerade i sessionens nätverk och kunde bara nås via sökmotorns sammanfattningar: devblogs.microsoft.com, docs.openvino.ai, openvinotoolkit.github.io, zenn.dev, dev.to och phoronix.com. GitHub-API och GraphQL var också blockerade. Uppgifter som bara kommer från sökmotorns sammanfattningar är märkta **[snippet, ej läst i original]**. Uppgifter som bygger på tidigare kunskap och inte kontrollerades här är märkta **[bakgrund, ej verifierat]**. Den här filen ersätter de overifierade delarna av `research_notes/Lokal AI app för sjukhus/lokala_modeller.md`, som skrevs utan åtkomst till euroeval.com och huggingface.co.
>
> **Så läser du EuroEval-siffrorna.** EuroEval kör instruktionsmodeller few-shot med modellens egen chattmall. Varje dataset samplas om till 1 024 tränings-, 256 validerings- och 1 024 eller 2 048 testexempel ([EuroEval methodology](https://euroeval.com/methodology)). "Rank score" är ett medelvärde av `1 + (bästa poäng − modellens poäng) / poolad standardavvikelse` per dataset, och **lägre är bättre** (1.0 = bäst på allt). Suffixet "(val)" tolkas här som att modellen bara körts på valideringssplitten (256 exempel), vilket ger större osäkerhet. Det är en tolkning som inte bekräftats ordagrant i dokumentationen. Läsförståelse (MultiWikiQA-sv) mäts med F1 på teckennivå / exact match ([EuroEval reading comprehension](https://euroeval.com/tasks/reading-comprehension)). Övriga kolumner anges som "primärt / sekundärt mått" så som leaderboarden visar dem.

## 1. Svensk kvalitet enligt EuroEval: vilka små modeller (≤14B) är bäst?

### Takeaway
Bland öppna modeller på ≤14B leder Gemma 4 12B-it (rank score 1.85, plats 9 totalt) svensk generering. Därefter kommer Bielik-11B v3.1, Ministral 3 14B, Qwen3.5-9B och Qwen3-4B-Thinking (cirka 2.0). I klassen 4–8B ligger Ministral-3-8B-Instruct, Gemma-4-E4B-it och Qwen3.5-4B mycket jämnt (2.21–2.36). Läsförståelsesiffrorna för Qwen3.5-instruktionsmodellerna är dock märkligt låga och måste kontrolleras på egen data. De rent svenska modellerna (GPT-SW3, AI Swedens Llama-3-8B) är från 2023–2024 och har gått om. Ingen ny svensk generativ modell från AI Sweden har publicerats på HF sedan 2024.

### Cited Findings
**Topplistans ram**
- Topplistan har 504 rader. Bästa modell är en sluten frontiermodell (gpt-6.2-astra, rank score 1.25, release 2026-11-17). Bästa öppna modeller totalt är Qwen3.6-27B-FP8 (1.58), Qwen3.8-27B (1.60) och gemma-4-31B-it (1.64). Alla är för stora för målhårdvaran. — [EuroEval svensk topplista](https://euroeval.com/leaderboards/Monolingual/swedish/)
- Svenska dataset: SweReC (sentiment), SUC 3.0 (NER), ScaLA-sv (språklig acceptans), MultiWikiQA-sv (läsförståelse), SweDN (sammanfattning av DN-artiklar), Skolprov (kunskap, bl.a. högskoleprovet och kunskapsprov för läkare, tandläkare och apotekare; 410 testfrågor), SwedishFacts, Winogrande-sv. Utöver dessa finns RAGTruth-sv (hallucination) och WMT24++/FLORES+ en→sv (översättning). — [EuroEval svenska dataset](https://euroeval.com/datasets/swedish)
- EuroEvals "Hallucination Rate" = andelen hallucinerade tokens i svar på kontextfrågor, mätt med LettuceDetect-klassificerare på RAGTruth-sv. Måttet påverkar inte rank och saknas ("?") för de flesta relevanta modeller, bland andra Gemma 4, Qwen3.5 och Ministral-3-8B. — [EuroEval hallucination detection](https://euroeval.com/tasks/hallucination-detection); [topplistan](https://euroeval.com/leaderboards/Monolingual/swedish/)

**Utdrag ur topplistan: alla relevanta modeller ≤14B** (rank score; MultiWikiQA-sv F1/EM; SweDN; Skolprov; Winogrande-sv; ScaLA-sv; HF-releasedatum enligt EuroEval) — [EuroEval svensk topplista](https://euroeval.com/leaderboards/Monolingual/swedish/)

| Modell | Param | Rank score | Läsförst. F1/EM | SweDN | Skolprov | Winogr. | ScaLA | Release |
|---|---|---|---|---|---|---|---|---|
| google/gemma-4-12B-it (val) | 12.0B | **1.85** | 76.35/54.70 | 38.73/42.06 | 45.59/60.00 | 47.33/73.36 | 59.78/79.81 | 2026-06-03 |
| speakleash/Bielik-11B-v3.1-Instruct (val) | 11.2B | 1.96 | **86.14/71.71** | 38.46/42.60 | 50.21/68.75 | 24.67/62.50 | 66.93/82.76 | 2026-11-10 |
| mistralai/Ministral-3-14B-Base-2512 (val) | 13.9B | 2.05 | 79.48/64.73 | 35.47/37.25 | 48.41/62.19 | 37.39/67.89 | 57.11/77.09 | 2025-12-02 |
| Qwen/Qwen3.5-9B (val) | 9.7B | 2.04 | **49.83/40.12** | 38.24/40.83 | 65.76/75.00 | 61.54/82.27 | 54.49/76.65 | 2026-02-27 |
| Qwen/Qwen3-4B-Thinking-2507 | 4.0B | 2.04 | 72.67/56.07 | 36.11/38.25 | 68.92/76.54 | 50.13/75.04 | 39.48/63.98 | 2025-08-05 |
| google/gemma-3-12b-it | 12.2B | 2.06 | 74.43/52.88 | 36.80/39.65 | 54.10/65.51 | 34.65/67.32 | 59.51/79.43 | 2025-03-12 |
| Qwen/Qwen3-14B (no-thinking) | 14.8B | 2.08 | 80.03/64.09 | 37.60/40.45 | 59.73/69.73 | 35.51/67.35 | 56.94/77.69 | 2025-04-28 |
| AI-Sweden-Models/Llama-3-8B-instruct (val) | 8.0B | 2.14 | 63.88/47.23 | 38.90/41.47 | 26.41/45.31 | 25.30/53.28 | 48.75/66.61 | 2024-06-01 |
| danish-foundation-models/DFM-Mimir-v1.8 (val) | 1.8B | 2.15 | 76.81/61.67 | 29.36/29.57 | 42.38/57.19 | 45.20/74.38 | 60.16/79.05 | 2026-11-16 |
| mistralai/Ministral-3-8B-Instruct-2512 (val) | 7.4B* | 2.21 | 73.52/56.16 | 37.09/41.47 | 45.47/60.31 | 24.83/65.47 | 46.37/71.64 | 2025-12-02 |
| mistralai/Ministral-3-14B-Instruct-2512 (val) | 13.9B | 2.23 | 71.08/51.69 | 35.76/40.15 | 50.68/64.06 | 39.79/69.92 | 49.65/71.47 | 2025-12-02 |
| Qwen/Qwen3-8B (no-thinking) | 8.2B | 2.25 | 76.16/59.15 | 37.36/40.13 | 47.82/60.83 | 28.25/63.83 | 45.11/70.27 | 2025-04-28 |
| google/gemma-4-E4B-it (val) | 8.0B (4.5B eff.) | 2.25 | 74.85/49.72 | 37.64/41.06 | 50.68/63.75 | 31.39/65.00 | 40.73/69.89 | 2026-04-02 |
| Qwen/Qwen3.5-4B (val) | 4.7B | 2.36 | **45.48/38.04** | 33.54/35.84 | 67.45/76.88 | 54.71/79.22 | 38.66/66.96 | 2026-02-27 |
| swiss-ai/Apertus-v1.5-8B (val) | 8.9B | 2.39 | 75.25/57.75 | 38.71/42.06 | 31.69/49.69 | 16.16/59.53 | 35.07/58.41 | 2026-07-24 |
| Qwen/Qwen3-4B (no-thinking) | 4.0B | 2.40 | 73.18/56.74 | 37.28/39.93 | 45.04/58.71 | 19.51/59.69 | 43.52/71.59 | 2025-04-28 |
| utter-project/EuroLLM-9B-Instruct-2512 (val) | 9.2B | 2.41 | 77.43/57.77 | 37.82/41.65 | 6.77/33.44 | 12.19/54.69 | 44.42/65.13 | 2026-01-26 |
| meta-llama/Llama-3.1-8B-Instruct | 8.0B | 2.43 | 69.91/45.98 | 37.60/39.78 | 32.31/49.12 | 18.62/59.15 | 32.60/64.01 | 2024-07-18 |
| google/gemma-4-E2B-it (val) | 5.1B (2.3B eff.) | 2.47 | 73.97/51.51 | 37.56/41.01 | 18.71/38.12 | 20.69/58.05 | 30.91/63.20 | 2026-04-02 |
| mistralai/Ministral-3-3B-Instruct-2512 (val) | 3.8B | 2.54 | 66.62/46.95 | 35.40/39.73 | 44.80/58.75 | 19.53/63.75 | 38.79/67.85 | 2025-12-02 |
| Qwen/Qwen3.5-2B (val) | 2.3B | 2.68 | 72.39/50.64 | 36.70/40.90 | 30.45/49.06 | 2.28/57.03 | 30.64/64.24 | 2026-03-01 |
| google/gemma-3-4b-it | 4.3B | 2.69 | 45.97/25.31 | 36.52/39.53 | 30.11/47.49 | 12.00/55.88 | 41.39/69.79 | 2025-03-12 |
| meta-llama/Llama-3.2-3B-Instruct | 3.2B | 2.84 | 62.92/43.08 | 36.22/38.39 | 20.64/39.71 | 6.29/53.05 | 20.60/57.17 | 2024-09-18 |
| HuggingFaceTB/SmolLM3-3B-Base | 3.1B | 2.96 | 68.58/51.49 | 29.77/32.19 | 20.99/40.66 | 0.83/50.33 | 0.34/33.55 | 2025-06-19 |
| Qwen/Qwen3.5-0.8B (val) | 0.9B | 3.05 | 53.45/31.26 | 35.30/39.62 | 16.41/24.69 | 4.36/37.58 | 2.49/33.37 | 2026-03-01 |
| utter-project/EuroLLM-1.7B-Instruct (val) | 1.7B | 3.29 | 53.21/34.59 | 33.37/35.24 | −15.36/16.25 | −4.45/54.37 | 0.87/40.95 | 2024-08-06 |
| AI-Sweden-Models/gpt-sw3-1.3b-instruct (val) | 1.4B | 4.41 | 0.05/0.00 | 11.06/11.85 | −0.94/18.44 | 8.86/62.19 | −5.12/43.32 | 2023-04-28 |

\* EuroEval anger 7.4B för Ministral-3-8B-Instruct medan HF anger 8.92B (inklusive vision-encoder).

**Modeller som saknas eller bara delvis är utvärderade (ingen rank score)** — [EuroEval svensk topplista](https://euroeval.com/leaderboards/Monolingual/swedish/)
- microsoft/Phi-4-mini-instruct finns inte alls i den svenska tabellen. Phi-4-mini-reasoning finns bara med ScaLA-sv 5.05/44.42, vilket är mycket svagt. phi-4 (14.7B) har bara ScaLA 53.65/75.93.
- ibm-granite/granite-4.0-micro (3.4B): läsförståelse 67.87/50.43, SweDN 36.67/39.14, Winogrande 15.68/57.66, ScaLA 28.85/62.31, utan rank. granite-4.0-h-micro: läsförståelse 71.09/54.97. Granite 4.2 (3B/8B, publicerad på HF 2026-08-07) finns inte i tabellen. — [HF ibm-granite](https://huggingface.co/ibm-granite)
- google/gemma-3n-E4B-it: läsförståelse 73.52/48.84, ScaLA 48.73/71.42 (ofullständig).
- LumiOpen/Viking-13B: bara ScaLA 4.48/47.82. Viking-7B finns inte med.
- AI-Sweden-Models/gpt-sw3-6.7b-v2-instruct: läsförståelse 0.10/0.00, alltså oanvändbar med modern chattmall. Basmodellen gpt-sw3-6.7b-v2 får 70.43/53.40.
- Qwen3.6 och Qwen3.8 har bara släppts som stora modeller (Qwen3.6-27B, 35B-A3B; Qwen3.8-27B, Flash-Next, 2.4T-A95B). Inga små varianter fanns på HF den 22 november 2026. — [HF API Qwen](https://huggingface.co/Qwen)

**Hallucinationsgrad (EuroEval, RAGTruth-sv), där den finns:** Bielik-11B-v3.1 1.13 %, AI-Sweden Llama-3-8B-instruct 1.29 %, DFM-Mimir-v1.8 1.47 %, Apertus-v1.5-8B 0.89 %, Ministral-3-14B-Instruct 2.19 %, Ministral-3-3B-Instruct 3.63 %. Måttet saknas för Gemma 4, Qwen3.5, Ministral-3-8B och Llama-3.1-8B. — [EuroEval svensk topplista](https://euroeval.com/leaderboards/Monolingual/swedish/)

**Nordiska och europeiska modeller 2025–2026**
- AI Swedens senaste generativa modeller på HF är Llama-3-8B (juni–juli 2024). Därefter har bara ModernBERT-encoders publicerats (feb och sep 2025). — [HF AI-Sweden-Models](https://huggingface.co/AI-Sweden-Models)
- Danish Foundation Models DFM-Mimir-v1.8 (1.8B, Apache 2.0, HF 2026-11-09) får rank 2.15 på svenska. Den slår alla andra modeller under 4B och är i nivå med 8B-modeller, med läsförståelse 76.81/61.67. Det finns också en variant på 0.7B (DFM-Mimir-v1.8-Mini, rank 2.75). — [HF DFM-Mimir-v1.8](https://huggingface.co/danish-foundation-models/DFM-Mimir-v1.8); [EuroEval](https://euroeval.com/leaderboards/Monolingual/swedish/)
- NbAiLab borealis (Norge, 4B/12B maj 2026; borealis2-e4b/e2b-preview sep 2026, byggd på Gemma 4) har licensen "other" / nb-license-1.0 och språktaggarna no/nb/nn. Borealis2-e4b-preview får 2.30 på svenska. — [HF borealis2-e4b-preview](https://huggingface.co/NbAiLab/borealis2-e4b-preview)
- openeurollm/prelude-base (9.1B, Apache 2.0, HF 2026-07-20) är en basmodell, rank 2.32. — [HF prelude-base](https://huggingface.co/openeurollm/prelude-base)
- En uppgiftsfinjusterad Qwen3.5-2B (deahmed/Qwen3.5-2B-da-task, danskt tränad) får läsförståelse 75.80/58.30 och rank 2.57 på svenska. Originalet Qwen3.5-2B får 72.39/50.64 och 2.68. — [EuroEval](https://euroeval.com/leaderboards/Monolingual/swedish/)

### Inferences
- **Läsförståelse är det mått som ligger närmast Lotsas uppgift.** Där är bilden en annan än i rank score. Qwen3.5-9B-instruct (49.83) och Qwen3.5-4B-instruct (45.48) ligger långt under sina egna basmodeller (80.96 resp. 80.75) och under Qwen3-4B/8B i no-thinking-läge (73–76). Den troligaste förklaringen är att Qwen3.5 tänker som standard ([HF Qwen3.5-9B](https://huggingface.co/Qwen/Qwen3.5-9B)) och att svarsformatet då inte matchar extraktionsuppgiften. Det är inte säkert att läsförmågan verkligen är sämre. Med thinking avstängt och JSON-schema kan Qwen3.5 mycket väl prestera i nivå med basmodellen, men det måste testas på Lotsas egna frågor.
- Gemma-4-E4B-it (74.85) och Ministral-3-8B-Instruct (73.52) ger stabil läsförståelse på svenska utan tankeläge. Gemma-4-12B-it ger bäst helhet.
- Bielik-11B-v3.1 har högst läsförståelse (86.14) och låg hallucinationsgrad (1.13 %), men är en polsk modell på 11B. Den kräver 16 GB RAM-klass och är gated "auto" på HF. Den är intressant som högklassalternativ och bör utvärderas.
- DFM-Mimir-v1.8 (1.8B) är den mest intressanta lösningen för svag hårdvara. Modellkortet och träningsdata bör granskas innan den används.
- SmolLM3, Phi-4-mini, Llama-3.2-3B, EuroLLM-1.7B och GPT-SW3 är klart sämre eller saknar data för svenska och bör väljas bort.

### Gaps
- Ingen EuroEval-siffra finns för översättning tyska→svenska. Översättningsdataset (WMT24++/FLORES+ en→sv) finns i dokumentationen men inte som kolumn i den svenska tabellen.
- Hallucinationsgrad saknas för huvudkandidaterna Gemma 4, Qwen3.5 och Ministral-3-8B.
- Det är inte verifierat att "(val)" betyder att bara valideringssplitten använts.
- Granite 4.2 och Phi-4-mini-instruct har ingen svensk EuroEval-mätning.

## 2. Releasedatum, storlek och exakt licens (kontrollerat mot Hugging Face)

### Takeaway
Alla huvudkandidater (Qwen3.5, Gemma 4, Ministral 3, Granite 4, EuroLLM-9B-2512, DFM-Mimir, Viking) har Apache 2.0 enligt sina HF-kort. Gemma 4 är, till skillnad från Gemma 1–3, uttryckligen Apache 2.0. Phi-4-mini har MIT. Llama 3.x (även AI Swedens Llama-3-8B) har Metas community-licens med en EU-begränsning som gäller de multimodala 3.2-modellerna. GPT-SW3 och borealis har egna licenser.

### Cited Findings
| Modell (HF-id) | Licens enligt HF-kortet | Skapad på HF | Parametrar (safetensors) | Källa |
|---|---|---|---|---|
| Qwen/Qwen3.5-9B / -4B / -2B | apache-2.0 (LICENSE-fil i repot) | 2026-02-27 / 02-27 / 02-28 | 9.65B / 4.66B / 2.27B | [HF](https://huggingface.co/Qwen/Qwen3.5-9B) |
| google/gemma-4-E4B-it / E2B-it | apache-2.0, license_link ai.google.dev/gemma/docs/gemma_4_license | 2026-03-02 | 8.00B / 5.12B (4.5B / 2.3B effektiva) | [HF](https://huggingface.co/google/gemma-4-E4B-it) |
| google/gemma-4-12B-it | apache-2.0 | 2026-05-23 | 11.96B | [HF](https://huggingface.co/google/gemma-4-12B-it) |
| mistralai/Ministral-3-3B/8B/14B-Instruct-2512 | apache-2.0 | 2025-10-31 (release dec 2025) | 3.85B / 8.92B / 13.95B | [HF](https://huggingface.co/mistralai/Ministral-3-8B-Instruct-2512) |
| microsoft/Phi-4-mini-instruct | mit | 2025-02-19 | 3.84B | [HF](https://huggingface.co/microsoft/Phi-4-mini-instruct) |
| meta-llama/Llama-3.1-8B-Instruct | llama3.1 (gated, manuell) | 2024-07-18 | 8.03B | [HF](https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct) |
| meta-llama/Llama-3.2-3B-Instruct | llama3.2 (gated, manuell) | 2024-09-18 | 3.21B | [HF](https://huggingface.co/meta-llama/Llama-3.2-3B-Instruct) |
| ibm-granite/granite-4.0-micro | apache-2.0 | 2025-09-16 | 3.40B | [HF](https://huggingface.co/ibm-granite/granite-4.0-micro) |
| HuggingFaceTB/SmolLM3-3B | apache-2.0 | 2025-07-08 | 3.08B | [HF](https://huggingface.co/HuggingFaceTB/SmolLM3-3B) |
| utter-project/EuroLLM-9B-Instruct-2512 | apache-2.0 | 2026-01-26 | 9.15B | [HF](https://huggingface.co/utter-project/EuroLLM-9B-Instruct-2512) |
| AI-Sweden-Models/Llama-3-8B-instruct | llama3 | 2024-06-01 | 8.03B | [HF](https://huggingface.co/AI-Sweden-Models/Llama-3-8B-instruct) |
| AI-Sweden-Models/gpt-sw3-6.7b-v2-instruct | other (gated, manuell) | 2023-04-28 | 7.11B | [HF](https://huggingface.co/AI-Sweden-Models/gpt-sw3-6.7b-v2-instruct) |
| LumiOpen/Viking-7B | apache-2.0 | 2024-02-16 | 7.55B | [HF](https://huggingface.co/LumiOpen/Viking-7B) |
| danish-foundation-models/DFM-Mimir-v1.8 | apache-2.0 | 2026-11-09 | 1.79B | [HF](https://huggingface.co/danish-foundation-models/DFM-Mimir-v1.8) |
| speakleash/Bielik-11B-v3.1-Instruct | apache-2.0 (gated "auto") | 2026-10-26 | 11.17B | [HF](https://huggingface.co/speakleash/Bielik-11B-v3.1-Instruct) |
| swiss-ai/Apertus-v1.5-8B | apache-2.0 (gated "auto") | 2026-07-24 | 8.90B | [HF](https://huggingface.co/swiss-ai/Apertus-v1.5-8B) |
| NbAiLab/borealis2-e4b-preview | other: nb-license-1.0 | 2026-09-28 | 8.00B | [HF](https://huggingface.co/NbAiLab/borealis2-e4b-preview) |

- Googles licenssida för Gemma 4 har rubriken "Apache License 2.0" i Gemma-dokumentationen. Det är alltså inte längre de tidigare "Gemma Terms of Use". — [ai.google.dev Gemma 4 license](https://ai.google.dev/gemma/docs/gemma_4_license)
- Llama 3.2:s Acceptable Use Policy, ordagrant: "With respect to any multimodal models included in Llama 3.2, the rights granted under Section 1(a) of the Llama 3.2 Community License Agreement are not being granted to you if you are an individual domiciled in, or a company with a principal place of business in, the European Union. This restriction does not apply to end users of a product or service that incorporates any such multimodal models." — [Llama 3.2 Use Policy](https://www.llama.com/llama3_2/use-policy/)
- EuroEvals kolumn "Commercial" markerar Ministral-3-8B-Reasoning-2512 och den äldre EuroLLM-9B-Instruct (2024) med ✗. EuroLLM-9B-Instruct-2512 och Ministral-3-8B-Instruct-2512 har ✓. — [EuroEval](https://euroeval.com/leaderboards/Monolingual/swedish/)
- Phi-4-mini-instruct anger svenska (sv) bland sina språk. Ministral 3 anger inte svenska (en, fr, es, de, it, pt, nl, zh, ja, ko, ar). Gemma 4 anger stöd för "35+ languages, pre-trained on 140+". Qwen3.5 anger 201 språk och dialekter. — [HF Phi-4-mini](https://huggingface.co/microsoft/Phi-4-mini-instruct); [HF Ministral-3-8B](https://huggingface.co/mistralai/Ministral-3-8B-Instruct-2512); [HF Gemma-4-E4B-it](https://huggingface.co/google/gemma-4-E4B-it); [HF Qwen3.5-9B](https://huggingface.co/Qwen/Qwen3.5-9B)
- **[bakgrund, ej verifierat]** Apache 2.0 tillåter kommersiell vidaredistribution, även inbäddat i en såld produkt, om man bifogar licenstexten, behåller eventuell NOTICE-fil och märker modifierade filer. Licensen ger också ett patentlicensskydd. MIT kräver bara att copyright- och licenstexten följer med. Llama-licensen kräver "Built with Llama", att licensen och AUP följer med och en separat licens över 700 miljoner MAU. — [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)

### Inferences
- För en såld svensk produkt är Apache 2.0-modellerna (Qwen3.5, Gemma 4, Ministral 3, DFM-Mimir) juridiskt enklast. Man skeppar `LICENSE` och `NOTICE` med modellfilen och visar en tredjepartslicenslista i appen.
- Llama 3.1/3.2 och AI Swedens Llama-3-8B fungerar juridiskt för textmodeller i EU, men ger märkningskrav och sämre svenska än alternativen. De bör undvikas. Llama 3.2 Vision är uteslutet för ett svenskt bolag.
- Gated "auto" (Bielik, Apertus) betyder att man accepterar villkor vid nedladdning. Läs villkoren innan modellen paketeras.

### Gaps
- LICENSE-filernas fulltext lästes inte för varje modell. Bedömningen bygger på HF-kortens licensfält och Googles sida.
- Licensen för Granite 4.2 (aug 2026) kontrollerades inte.
- Hela Gemma 4-sidan granskades inte för tilläggsvillkor, till exempel en Prohibited Use Policy. Bara rubriken "Apache License 2.0" bekräftades.

## 3. Prestanda på CPU och Intel iGPU (llama.cpp, OpenVINO)

### Takeaway
Avgörande är prefill (promptbearbetning), inte genereringshastighet. På den vanligaste sjukhushårdvaran (11:e–13:e generationens Core i5/i7 med Iris Xe) går prefill för en 7–8B Q4-modell i ungefär 40–110 tok/s. Då tar en 4k-tokens RAG-prompt 40–100 s innan svaret börjar. På Lunar Lake/Arrow Lake/Panther Lake (Core Ultra 200/300) med Vulkan eller OpenVINO går samma prefill i 500–1 400 tok/s, vilket ger 3–8 s. Modellstorleken 2–4B och korta kontexter (≤2k tokens) är därför nödvändiga på standardhårdvara.

### Cited Findings
**Intel iGPU, llama.cpp Vulkan (Llama-2-7B Q4_0, 3.56 GiB, standardbenchmark)** — [llama.cpp Discussion #10879](https://github.com/ggml-org/llama.cpp/discussions/10879)
- Iris Xe (i7-1185G7, Tiger Lake): pp512 42.0 tok/s, tg128 7.3 (jan 2025). 106.2 / 5.9 i build 5568 (juni 2025). Samma chip med bara CPU (ngl 0): pp512 73.3, tg128 5.2.
- Core Ultra 100 (Meteor Lake Arc): pp512 185.5, tg128 8.2 (utan FA); 77.7 / 7.8 med FA.
- Core Ultra 200 / Arc 140V (Lunar Lake): pp512 865–867, tg128 24.4–25.1 (13 sep 2026, build 10941).
- Core Ultra 300 (Panther Lake): pp512 1 380, tg128 24.5.
- AMD Ryzen AI 300 (890M-klass): pp512 479–533, tg 22–24. Ryzen 7000/8000 (780M): 267–313 / 20–21.

**Intel iGPU med SYCL** — [llama.cpp Discussion #23313](https://github.com/ggml-org/llama.cpp/discussions/23313)
- Arc 140V (Core Ultra 7 258V), Llama-2-7B Q4_0: pp512 535.6, tg128 24.6 (FA av); 246.0 / 25.3 (FA på) (juni 2026).
- Panther Lake Xe3 (12 EU): Llama-2-7B pp512 652, tg 19.2. Llama-3.2-1B Q4_0 pp512 3 433, tg 88.7. Qwen2.5-7B Q4_0 (fp32) pp1024 305, **pp4096 270**, tg 17.5.
- Samma Panther Lake med OpenVINO: Qwen2.5-7B Q4_0 pp1024 2 989, **pp4096 2 552**, tg 17.5.
- Sidans förbehåll: "The performance data is only used as reference, since we don't double check the data." Windows-resultat för iGPU saknas.

**Qwen3-8B Q4_K_M på Arc 140V, llama.cpp b9990 (juli 2026)** — [llama.cpp Discussion #12570](https://github.com/ggml-org/llama.cpp/discussions/12570)
- Vulkan: pp512 487.6, tg128 19.2. llama.cpps OpenVINO-backend: pp512 1 338.9, tg128 14.6. Användaren rapporterar "limited model support and bugs" i OpenVINO-bygget.
- En Intel-utvecklare (april 2025) skrev att Vulkan då gav 30–60 % snabbare generering än SYCL. Underhållare rekommenderade OpenVINO för bästa Intel-GPU-prestanda (mars 2025).

**OpenVINO GenAI på Arc 140V (Core Ultra 7 258V, 32 GB LPDDR5X-8533), INT4, median av N=5, version 2026.2.1** — [openvino Discussion #36626](https://github.com/openvinotoolkit/openvino/discussions/36626)
- Qwen3-8B prefill: 1 477 tok/s @512, **1 106 @2048**, **627 @8192**. Generering 19.6 tok/s (27.1 med spekulativ avkodning, draft Qwen3-0.6B).
- Qwen3-14B prefill: 761 @512, **747 @2048**, **388 @8192**. Generering 11.0 tok/s (17.2 med spekulativ avkodning).
- Prefill blev 28–36 % snabbare från 2026.1.0 till 2026.2.1. Genereringen var oförändrad.

**Ren CPU, laptop** — [Malakhov, CEUR-WS Vol-4164 paper 11 (ProfIT AI'25)](https://ceur-ws.org/Vol-4164/paper11.pdf)
- Core i7-13700H (14 kärnor, 32 GB DDR5), llama.cpp 4-bit GGUF, generering: Llama-3.2-1B 80 tok/s, Gemma-3-1B 70, Phi-4-mini (3.8B) 40, Qwen2.5-7B 15, DeepSeek-R1-Distill-Llama-8B 10, Gemma-3-12B 9, Mistral-Small-24B 4.
- En prompt på 256 tokens tog cirka 3 s för en 7B-modell på samma laptop, alltså cirka 85 tok/s prefill. Författaren noterar termisk strypning och att E-kärnorna begränsar vid 12B+.
- **[snippet, ej läst i original]** En 8B Llama-3 Q4_K_M på i7-1165G7 med 12 GB RAM gav 6.1–6.5 tok/s generering. Iris Xe läste prompten cirka 4 gånger snabbare än CPU men genererade 2,5 gånger långsammare. — [dev.to](https://dev.to/tekk_73/an-8b-llm-on-a-4-core-laptop-cpu-no-gpu-6-tokenssec-25gi)

**Filstorlekar (GGUF på HF)** — [unsloth/Qwen3.5-4B-GGUF](https://huggingface.co/unsloth/Qwen3.5-4B-GGUF); [unsloth/Qwen3.5-9B-GGUF](https://huggingface.co/unsloth/Qwen3.5-9B-GGUF); [unsloth/Qwen3.5-2B-GGUF](https://huggingface.co/unsloth/Qwen3.5-2B-GGUF); [google/gemma-4-E4B-it-qat-q4_0-gguf](https://huggingface.co/google/gemma-4-E4B-it-qat-q4_0-gguf); [google/gemma-4-E2B-it-qat-q4_0-gguf](https://huggingface.co/google/gemma-4-E2B-it-qat-q4_0-gguf); [google/gemma-4-12B-it-qat-q4_0-gguf](https://huggingface.co/google/gemma-4-12B-it-qat-q4_0-gguf); [unsloth/Ministral-3-8B-Instruct-2512-GGUF](https://huggingface.co/unsloth/Ministral-3-8B-Instruct-2512-GGUF)
- Qwen3.5-2B Q4_K_M 1.28 GB, Qwen3.5-4B Q4_K_M 2.74 GB, Qwen3.5-9B Q4_K_M 5.68 GB (Q8_0 9.53 GB).
- Gemma-4-E2B QAT q4_0 3.35 GB, Gemma-4-E4B QAT q4_0 5.15 GB (+ mmproj 0.99 GB, som inte behövs för text), Gemma-4-12B QAT q4_0 6.98 GB. Google publicerar QAT-vikter, alltså kvantiseringsmedvetet tränade, direkt som GGUF. E4B-varianten hade 1,16 miljoner nedladdningar.
- Ministral-3-8B Q4_K_M 5.20 GB.
- Gemma 4 E2B/E4B använder Per-Layer Embeddings: "These embedding tables are large but are only used for quick lookups". Det förklarar att filen är större än de effektiva 2.3B/4.5B parametrarna antyder. — [HF Gemma-4-E4B-it](https://huggingface.co/google/gemma-4-E4B-it)

### Inferences
**Uppskattad time-to-first-token** (egen beräkning: promptlängd / uppmätt prefillhastighet). Prefill sjunker med längre kontext, så siffrorna vid 8k är optimistiska.

| Hårdvara (8B Q4) | Prefill tok/s (källa) | 2k tokens | 4k tokens | 8k tokens |
|---|---|---|---|---|
| Iris Xe / ren CPU, 11:e–13:e gen | 40–110 (#10879, CEUR) | 20–50 s | 40–100 s | 80–200 s |
| Meteor Lake Arc, Vulkan | ~185 (#10879) | ~11 s | ~22 s | ≥45 s |
| Lunar Lake Arc 140V, Vulkan | ~490 (#12570) | ~4 s | ~8 s | ≥17 s |
| Lunar Lake, OpenVINO GenAI | 1 106 @2k / 627 @8k (#36626) | ~1.9 s | ~4–5 s | ~13 s |
| Panther Lake, OpenVINO | ~2 550 @4k (#23313) | <1 s | ~1.6 s | ~3–4 s |

- En 4B-modell ger ungefär dubbelt så snabb prefill och en 2B-modell ungefär fyra gånger (skalning efter aktiva parametrar, inte uppmätt här). Med Qwen3.5-4B eller Gemma-4-E4B på Iris Xe blir 2k tokens därför cirka 10–25 s och med en 2B-modell 5–12 s.
- Generering på Iris Xe/DDR4 för 8B: 5–8 tok/s, för 4B cirka 12–20 tok/s. Ett JSON-svar på 300 tokens tar alltså 20–60 s med 8B och 15–25 s med 4B ovanpå TTFT.
- Slutsats: på standardhårdvara behövs **4B-klass, ≤2k tokens kontext (3–5 välvalda chunkar) och streaming**. 8–12B fungerar först på Core Ultra 200/300 med GPU-offload eller OpenVINO.

### Gaps
- Inga kontrollerade llama-bench-värden hittades för ren CPU på i5-8xxx–i7-12xxx eller Core Ultra 100 med pp2048/pp4096/pp8192. Meteor Lake-siffran gäller Vulkan/iGPU.
- Inga Windows-mätningar av iGPU för SYCL. Vulkan- och OpenVINO-siffrorna är mestadels från Linux.
- Phoronix kunde inte läsas (403).

## 4. NPU (Intel Core Ultra, AMD Ryzen AI, Snapdragon X) och Foundry Local / Windows ML / OpenVINO GenAI

### Takeaway
NPU:n är 2026 fortfarande en sekundär väg för LLM:er. På Lunar Lake ger den cirka 17–18 tok/s för Gemma 4 E2B/E4B INT4, men med kompileringsproblem. AMD:s NPU-väg för LLM fungerar bara på Ryzen AI 300 och är ofta långsammare än iGPU. Foundry Local är GA och kan bäddas in (cirka 20 MB, i processen), men katalogen är kurerad och faller ibland tyst tillbaka till CPU. För Lotsa bör NPU:n vara en möjlig accelerator, inte ett krav.

### Cited Findings
- Foundry Local: "an end-to-end local AI solution for shipping applications that run entirely on your device", SDK för C#, C++, JavaScript, Rust och Python, inferens via ONNX Runtime. Runtimen "adds approximately 20 MB to your application package". Den kör "inside your app process through the SDK". Katalogen är "intentionally curated" (exempel: GPT OSS, Qwen, DeepSeek, Mistral, Phi, Whisper). Modeller "download automatically on first use" och är versionerade. Användning "governed by the product terms and licenses that apply to the software and the models in use". — [Microsoft Learn: What is Foundry Local](https://learn.microsoft.com/en-us/azure/foundry-local/what-is-foundry-local)
- **[snippet, ej läst i original]** Foundry Local är GA. På Windows integreras den med Windows ML, och execution providers för NPU levereras via Windows Update (QNN för Qualcomm, OpenVINO för Intel, VitisAI för AMD). Om ingen EP är registrerad filtreras NPU-varianterna bort och modellen körs tyst på CPU. NPU kräver Windows 11 24H2 eller senare. — [Foundry Local GA (devblogs)](https://devblogs.microsoft.com/foundry/foundry-local-ga/); [GitHub-issue #792](https://github.com/microsoft/foundry-local/issues/792); [Discussion #247](https://github.com/microsoft/Foundry-Local/discussions/247)
- **[snippet, ej läst i original]** Gemma 4 E2B INT4 ger cirka 18 tok/s och E4B INT4 16.8 tok/s på NPU:n i Core Ultra 7 258V med OpenVINO 2026. Officiella OpenVINO-IR misslyckades vid NPU-kompilering, så författaren konverterade själv. — [zenn.dev](https://zenn.dev/jkudo/articles/ae85d7d099e672?locale=en)
- I OpenVINO-mätningen på Lunar Lake var NPU som draft-enhet för spekulativ avkodning 0.55–0.74 gånger så snabb som bara GPU. Enligt inlägget hänvisas till Discussion #36484. — [openvino Discussion #36626](https://github.com/openvinotoolkit/openvino/discussions/36626)
- **[snippet, ej läst i original]** AMD: OGA-hybrid (NPU + iGPU, byggt på ONNX Runtime GenAI) stöds bara på Ryzen AI 300 (Strix Point, Krackan Point). Lemonade använder FastFlowLM för NPU. Ett test gav cirka 21.8 tok/s för Qwen3 4B på NPU, mot 31–32 tok/s på 890M via ROCm och Vulkan. Ett annat test gav 8B i hybridläge cirka 38 tok/s och bara NPU cirka 10.5 tok/s, med TTFT cirka 0.7–0.8 s. — [AMD Ryzen AI docs](https://ryzenai.docs.amd.com/en/latest/llm/overview.html); [AMD Lemonade-artikel](https://www.amd.com/en/developer/resources/technical-articles/unlocking-a-wave-of-llm-apps-on-ryzen-ai-through-lemonade-server.html)
- OpenVINO GenAI har Apache 2.0 och kör "on CPU, GPU and NPU" med samma API. — [openvino.genai README](https://raw.githubusercontent.com/openvinotoolkit/openvino.genai/master/README.md)

### Inferences
- Sjukhusens äldre i5/i7 (8:e–14:e generationen) saknar NPU. Bara Core Ultra-maskiner har NPU, så NPU-stöd påverkar högst en minoritet av flottan under 2026–2027.
- Foundry Local är intressant för Windows, men Lotsa är låst till Microsofts katalog. Ingen svensk-optimerad modell har verifierats där, och strukturerad JSON-utdata i Foundry Local har inte bekräftats. llama.cpp med Vulkan är mer förutsägbart.
- Snapdragon X är ovanlig på sjukhus. QNN via Foundry Local kan bli ett senare spår.

### Gaps
- Inga primärkällor lästes för NPU:ns TTFT vid 2k–8k tokens på Intel Core Ultra. docs.openvino.ai var blockerad. NPU-pipelinens standardgräns för promptlängd (MAX_PROMPT_LEN) kunde inte verifieras.
- Det är inte verifierat om Foundry Local stöder egna modeller (BYO ONNX), JSON-schema/grammatik eller helt offline förinstallerade modeller utan första nedladdning.
- Snapdragon X-prestanda mättes inte.

## 5. Inferensmotorer: inbäddning, licens, JSON-begränsad utdata

### Takeaway
llama.cpp (llama-server eller som bibliotek) eller node-llama-cpp (MIT, färdiga Windows-binärer, JSON-schema) är det mest robusta valet för en Electron- eller Node-app och fungerar på alla målmaskiner via CPU och Vulkan. OpenVINO GenAI (Apache 2.0) ger 2–5 gånger snabbare prefill på Intel-iGPU och är värd en separat backend för Core Ultra. Ollama och LM Studio passar sämre för inbäddning.

### Cited Findings
- llama-server stöder `json_schema` för grammatikstyrd sampling och `response_format` med `{"type":"json_object","schema":...}` respektive `{"type":"json_schema",...}` i OpenAI-format, samt `--grammar`/`--grammar-file` (GBNF). — [llama.cpp server README](https://raw.githubusercontent.com/ggml-org/llama.cpp/master/tools/server/README.md)
- node-llama-cpp har MIT-licens, "Pre-built binaries are provided" för macOS, Linux och Windows, stöd för Metal, CUDA och Vulkan, och kan "force it to follow a specific JSON schema". — [node-llama-cpp README](https://raw.githubusercontent.com/withcatai/node-llama-cpp/master/README.md)
- llama.cpp har en OpenVINO-backend som gav 2,7 gånger snabbare prefill än Vulkan på Arc 140V (1 339 mot 488 tok/s) men långsammare generering (14.6 mot 19.2), och har "limited model support and bugs". — [llama.cpp #12570](https://github.com/ggml-org/llama.cpp/discussions/12570)
- OpenVINO GenAI: Apache 2.0, ett Python- och C++-API (`LLMPipeline(..., "CPU"/"GPU")`) och "continuous batching". — [openvino.genai README](https://raw.githubusercontent.com/openvinotoolkit/openvino.genai/master/README.md)
- Foundry Local: cirka 20 MB, i processen, OpenAI-kompatibelt API (se avsnitt 4). — [Microsoft Learn](https://learn.microsoft.com/en-us/azure/foundry-local/what-is-foundry-local)
- **[bakgrund, ej verifierat]** llama.cpp och Ollama har MIT-licens. Ollama körs som separat tjänst (port 11434). ONNX Runtime GenAI har MIT-licens och JSON-begränsning via guidance/llguidance. MLX och mlx-lm har MIT-licens och kör bara på Apple Silicon. — [llama.cpp](https://github.com/ggml-org/llama.cpp); [Ollama](https://github.com/ollama/ollama); [onnxruntime-genai](https://github.com/microsoft/onnxruntime-genai); [mlx-lm](https://github.com/ml-explore/mlx-lm)

### Inferences
- Rekommenderad arkitektur: node-llama-cpp i Electron (eller llama-server som sidoprocess på localhost) med Vulkan och CPU-fallback, GGUF Q4_K_M eller Gemma-QAT q4_0, och JSON-schema för `{svar, citat:[{dokument, sida, ordagrant_citat}], status:"svar"|"saknas_i_manualen"}`. På Mac används Metal via samma bibliotek. MLX behövs inte.
- En valfri OpenVINO GenAI-backend för Core Ultra halverar eller tredjedelar TTFT. Den kräver IR-modellkonvertering och egen JSON-hantering. Om OpenVINO GenAI stöder strukturerad utdata har inte verifierats här.
- Lås llama.cpp-versionen och kör regressionstester. Siffrorna i #10879 visar att Iris Xe-prefill ändrades från 42 till 106 tok/s mellan byggen, vilket visar både förbättringar och risk för regressioner.

### Gaps
- Licens och version för Foundry Local SDK, ONNX Runtime GenAI och Ollama kunde inte läsas, eftersom GitHub-API och de repona inte var åtkomliga.
- Stöd för strukturerad utdata i OpenVINO GenAI och Foundry Local är inte verifierat.

## 6. Faithfulness, citatextraktion, verifierare och finjustering

### Takeaway
Små modeller hallucinerar mätbart även med kontext (1–4 % av tokens i EuroEvals svenska RAGTruth-test för de modeller som mätts). Med tre lager blir citaten verifierbara: extrahera först, sedan JSON-schema och sist deterministisk kontroll av ordagranna citat mot PDF-texten, vilket Lotsa redan gör. Ett valfritt fjärde lager är en liten verifieringsmodell (HalluGuard-4B, Apache 2.0, eller MiniCheck-Flan-T5-Large, MIT). LoRA-finjustering av en 2–4B-modell för uppgiften är realistiskt. Det stöds indirekt av att en uppgiftsfinjusterad Qwen3.5-2B höjde svensk läsförståelse från 72.4 till 75.8 F1.

### Cited Findings
- HalluGuard: 4B-modell (Qwen3-4B, ORPO-tränad på syntetiska HalluClaim-data) som klassificerar dokument–påstående-par som grundade eller hallucinerade och motiverar svaret. På RAGTruth ger den 84.0 % balanced accuracy, i nivå med MiniCheck-7B (84.0 %) och över Granite Guardian 3.3 8B (82.2 %). Utan tankeläge sjunker RAGTruth-resultatet med 21.8 %. Publicerad i Findings of ACL 2026. — [arXiv 2510.00880](https://arxiv.org/html/2510.00880); [ACL Anthology 2026.findings-acl.835](https://aclanthology.org/2026.findings-acl.835/)
- Motstridiga uppgifter: ACL-abstractet anger 77.1 % BAcc över hela benchmarken (GPT-4o 75.9 %). En annan tabell ger MiniCheck-7B 77.4 mot HalluGuard 76.5. Skillnaden förklaras inte i de lästa sammanfattningarna. — [ACL Anthology](https://aclanthology.org/2026.findings-acl.835/); [arXiv PDF](https://arxiv.org/pdf/2510.00880)
- Vikterna finns på HF som `lrsbrgrn/HalluGuard-Qwen3-4B` (apache-2.0, base_model unsloth/Qwen3-4B, 2026-04-08) och som GGUF. — [HF HalluGuard-Qwen3-4B](https://huggingface.co/lrsbrgrn/HalluGuard-Qwen3-4B)
- MiniCheck-Flan-T5-Large har MIT-licens på HF. Granite Guardian 3.3 8B har Apache 2.0 och finns som GGUF. Bespoke-MiniCheck-7B saknar licensfält i HF-metadata. — [HF lytang/MiniCheck-Flan-T5-Large](https://huggingface.co/lytang/MiniCheck-Flan-T5-Large); [HF granite-guardian-3.3-8b](https://huggingface.co/ibm-granite/granite-guardian-3.3-8b); [HF Bespoke-MiniCheck-7B](https://huggingface.co/bespokelabs/Bespoke-MiniCheck-7B)
- Reparation efter detektion (RAGTruth, 916 reparerade svar, tre domarmodeller): alla strategier minskar ogrundat innehåll. Att radera ogrundade påståenden minskar det mest men behåller bara 64.3 % av texten. Omskrivning behåller 80.1 % men minskar minst. 83.5 % av svar som annoterats som korrekta redigeras också. — [arXiv 2608.29307](https://arxiv.org/abs/2608.29307)
- EuroEval mäter hallucination med LettuceDetect, en tokenklassificerare tränad på MultiWikiQA-syntetiska hallucinationer och översatt RAGTruth. Samma typ av verktyg kan i princip köras lokalt. — [EuroEval hallucination detection](https://euroeval.com/tasks/hallucination-detection)
- Uppgiftsfinjusterad 2B: deahmed/Qwen3.5-2B-da-task fick svensk läsförståelse 75.80/58.30 mot originalets 72.39/50.64. — [EuroEval](https://euroeval.com/leaderboards/Monolingual/swedish/)

### Inferences
- **Rekommenderad pipeline:**
  1. Hämta 3–5 chunkar (≤2k tokens).
  2. Låt modellen i ett första steg bara extrahera ordagranna citat med sidnummer, styrt av JSON-schema.
  3. Kontrollera citaten deterministiskt mot PDF-texten (normaliserad fuzzy match). Om inget citat klarar kontrollen: svara "finns inte i manualen".
  4. Formulera svaret på svenska enbart från godkända citat.
  5. Valfritt: kör HalluGuard eller MiniCheck på varje påstående. Ta bort ogrundade påståenden (radering, enligt 2608.29307) hellre än att skriva om dem.
- Abstention: använd retrieval-poäng (BM25 + embedding) under ett tröskelvärde som tvingande "saknas". Tröskeln kalibreras på ett testset med frågor som avsiktligt saknar svar.
- HalluGuard kräver tankeläge för full noggrannhet. Det kostar hundratals extra tokens per kontroll, vilket på Iris Xe ger ytterligare 15–30 s. Lägg verifieraren som ett valfritt steg på starkare hårdvara.
- **LoRA (uppskattning, ej verifierad):** 2–5k syntetiska svenska, tyska och engelska fråga–kontext–JSON-exempel genererade ur påhittade eller licensierade manualer. QLoRA på 4B tar några GPU-timmar på en hyrd 24–80 GB-GPU, alltså storleksordningen tiotals till några hundra USD per körning. Resultatet blir en LoRA-adapter eller sammanslagen GGUF under basmodellens Apache 2.0. Kräver att utvärderingssetet är spärrat från träningsdata.

### Gaps
- Inga svenska mätningar av HalluGuard eller MiniCheck. Båda är tränade på engelska, och prestandan på svensk och tysk text är okänd.
- Ingen källa lästes om faktiska LoRA-kostnader och resultat för just citatextraktion på svenska.

## 7. Svårigheter och motåtgärder

### Takeaway
De största riskerna är, i ordning: (1) prefill-latens på Iris Xe-maskiner, (2) RAM-tryck när 8 GB-maskiner redan kör journalsystem, (3) tysk källtext med svensk svarstext och (4) hallucinerade parafraser. Alla går att hantera med modellstorlek, kontextbudget, deterministisk citatkontroll och ett inbyggt benchmarkläge.

### Cited Findings
- Prefill på Iris Xe är 42–106 tok/s för 7B (se avsnitt 3), mot 865–1 380 på Core Ultra 200/300. Skillnaden är mer än tiofaldig. — [llama.cpp #10879](https://github.com/ggml-org/llama.cpp/discussions/10879)
- Toppminne var cirka 20.85 GB delat RAM för Qwen3-14B INT4 med OpenVINO på en 32 GB-maskin. Författaren påpekar att siffran inte är ett tillförlitligt mått på KV-cachen. — [openvino #36626](https://github.com/openvinotoolkit/openvino/discussions/36626)
- Qwen3.5 rekommenderar själv minst 128K kontext "to preserve thinking capabilities" och tänker som standard. Det passar inte en RAM-begränsad CPU-deployment, så thinking ska stängas av. — [HF Qwen3.5-9B](https://huggingface.co/Qwen/Qwen3.5-9B)
- Ministral 3 listar inte svenska bland sina språk, men får ändå 73.5 F1 i svensk läsförståelse. — [HF Ministral-3-8B](https://huggingface.co/mistralai/Ministral-3-8B-Instruct-2512); [EuroEval](https://euroeval.com/leaderboards/Monolingual/swedish/)
- llama.cpp-byggen ändrar prestanda kraftigt: Iris Xe-prefill 42 → 106 tok/s och tg 7.3 → 5.9 mellan jan och jun 2025, och FA på eller av ger 77.7 mot 185.5 på Meteor Lake. — [llama.cpp #10879](https://github.com/ggml-org/llama.cpp/discussions/10879)

### Inferences
| Svårighet | Motåtgärd |
|---|---|
| Långsam prefill (Iris Xe 20–100 s för 2–4k) | 4B eller 2B som standard. ≤2k tokens kontext. Kort systemprompt som KV-cachas och återanvänds (llama.cpp prompt-cache). Vulkan-offload även på Iris Xe (pp ~1,5 gånger CPU). Visa citatkandidater från retrieval direkt medan LLM:en arbetar. |
| RAM-tryck (8 GB-maskiner) | Qwen3.5-4B Q4_K_M (2.74 GB) eller Qwen3.5-2B (1.28 GB), mmap, KV-cache q8_0, kontext 4k. Ladda modellen vid första fråga och frigör efter inaktivitet. Ladda aldrig mmproj (vision). Gemma-4-E4B (5.15 GB) passar 16 GB. |
| Tyska manualer, svenska svar | Citera ordagrant på originalspråket och lägg till svensk parafras märkt "översättning". Validera citatet mot den tyska texten, inte mot översättningen. Använd en flerspråkig embeddingmodell för retrieval över språk. Ta med ett eget de→sv-test i utvärderingen. |
| Hallucination och felaktiga sidnummer | Sidnummer sätts av appen från chunk-metadata, aldrig av modellen. Använd JSON-schema, citatkontroll och radering av ogrundade påståenden. Tvingande "saknas" när retrieval-poängen är låg. |
| Tankeläge och formatfel (Qwen3.5) | Stäng av thinking. Mät på eget set, eftersom EuroEvals läsförståelse visar 45–50 F1 för Qwen3.5-instruct. |
| Modelluppdateringar | Lås modell-SHA och llama.cpp-version per release. Kör regressionstester på ett fast svenskt, tyskt och engelskt testset före byte. Distribuera modellen som separat signerat paket (offline-installerbart). |

### Gaps
- Ingen mätning av samtidig RAM-användning för typiska sjukhusklienter (Cosmic, Millennium, Citrix) hittades.
- Kvaliteten på översättning från tyska till svenska hos små modeller har inte mätts av någon källa som lästes här.

## 8. Rekommendation: modeller, hårdvarunivåer och benchmark på kundens hårdvara

### Takeaway
**Standardmodell:** Qwen3.5-4B (Apache 2.0, 2.74 GB Q4_K_M, thinking avstängt) eller Gemma-4-E4B-it QAT q4_0 (Apache 2.0, 5.15 GB). Välj mellan dem med ett eget citat-testset, eftersom EuroEval ger dem samma helhetsnivå men Qwen3.5 har ett avvikande lågt läsförståelsevärde. **Reserv för svag hårdvara:** Qwen3.5-2B eller DFM-Mimir-v1.8 (1.8B). **Högklassalternativ:** Gemma-4-12B-it QAT (6.98 GB, bäst ≤14B på EuroEval), alternativt Ministral-3-8B-Instruct eller Qwen3.5-9B, på Core Ultra 200/300 med 16–32 GB.

### Cited Findings
- Gemma-4-12B-it har rank 1.85, högst bland öppna modeller ≤14B, och läsförståelse 76.35. Gemma-4-E4B-it har 2.25 och 74.85. Qwen3.5-4B har 2.36 och 45.48 (basmodellen 80.75). Qwen3.5-2B har 2.68 och 72.39. DFM-Mimir-v1.8 har 2.15 och 76.81. Ministral-3-8B-Instruct har 2.21 och 73.52. — [EuroEval](https://euroeval.com/leaderboards/Monolingual/swedish/)
- Filstorlekar: Qwen3.5-2B 1.28 GB, Qwen3.5-4B 2.74 GB, Gemma-4-E4B QAT 5.15 GB, Ministral-3-8B 5.20 GB, Qwen3.5-9B 5.68 GB, Gemma-4-12B QAT 6.98 GB. — [HF GGUF-repon, se avsnitt 3](https://huggingface.co/google/gemma-4-12B-it-qat-q4_0-gguf)
- Uppmätt prefill för 7–8B: Iris Xe 42–106, Meteor Lake 185, Lunar Lake 488–1 106 (Vulkan/OpenVINO), Panther Lake 1 380–2 550 tok/s. — [llama.cpp #10879](https://github.com/ggml-org/llama.cpp/discussions/10879); [#12570](https://github.com/ggml-org/llama.cpp/discussions/12570); [openvino #36626](https://github.com/openvinotoolkit/openvino/discussions/36626); [#23313](https://github.com/ggml-org/llama.cpp/discussions/23313)
- `llama-bench` kör som standard pp512 och tg128 med 5 upprepningar. Antal trådar påverkar tg kraftigt på hybrid-Intel. — [computingforgeeks llama.cpp cheat sheet](https://computingforgeeks.com/llama-cpp-cheat-sheet/) **[snippet, ej läst i original]**

### Inferences
**Hårdvarunivåer (förslag):**

| Nivå | Hårdvara | Modell | Förväntat (egen uppskattning) |
|---|---|---|---|
| Minimum | Core i5 8:e–10:e gen, UHD 620, 8 GB RAM, SSD, Win 10/11 64-bit, AVX2 | Qwen3.5-2B eller DFM-Mimir-1.8B, 2k kontext | TTFT ~10–20 s, svar 300 tokens ~20–30 s. Fungerar men är trögt. |
| Standard (vanligast) | Core i5/i7 11:e–13:e gen, Iris Xe, 16 GB | Qwen3.5-4B eller Gemma-4-E4B, Vulkan, 2–3k kontext | TTFT ~10–30 s, totalt ~30–60 s |
| Rekommenderad | Core Ultra 5/7 (Meteor Lake och nyare), Arc iGPU, 16 GB | 4B standard, 8B valfritt | TTFT 3–10 s (4B), 8B ~10–20 s |
| Högklass | Core Ultra 200V/200H/300 (Lunar/Arrow/Panther Lake), 32 GB | Gemma-4-12B-it eller Qwen3.5-9B och Ministral-3-8B, OpenVINO eller Vulkan | TTFT 2–5 s vid 2–4k, gen 11–25 tok/s |

**Benchmark på kundens hårdvara (inbyggt "diagnosläge" i appen):**
1. Detektera CPU (AVX2/AVX-512/VNNI), RAM, ledigt RAM, iGPU och Vulkan-stöd, samt Windows-version.
2. Kör en llama-bench-motsvarighet via node-llama-cpp: prefill av fasta prompter på 512, 2 048 och 4 096 tokens och generering av 128 tokens, 3 upprepningar, för CPU och Vulkan, med 2B- och 4B-modellen.
3. Kör ett fast set med 30 svenska, tyska och engelska frågor mot påhittade manualer (inklusive 10 frågor där svaret saknas). Mät TTFT, total tid, andel giltig JSON, andel citat som klarar kontrollen och korrekt "saknas".
4. Välj automatiskt modell och backend som klarar målet (till exempel TTFT under 15 s vid 2k tokens) och spara en rapport som IT kan exportera, utan patientdata.
5. Kör om testet efter Windows-, drivrutins- eller modelluppdatering.

### Gaps
- Ingen direkt jämförelse mellan Qwen3.5-4B och Gemma-4-E4B på citatextraktion med JSON-schema finns. Den måste köras internt.
- Prefill-siffrorna för 4B på Iris Xe och ren CPU är extrapolerade, inte uppmätta.
- Minsta hårdvara med 8 GB RAM och samtidig journalklient är inte verifierad i praktiken.
