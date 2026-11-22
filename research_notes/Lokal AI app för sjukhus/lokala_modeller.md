# Lokala (offline) språkmodeller för Lotsa på sjukhusdatorer (läge november 2026)

> Metodnot: I den här sessionen gick det inte att hämta sidor från euroeval.com, huggingface.co, intel.com, dev.to och linuxlinks.com, eftersom nätverket blockerade dem. Uppgifter från de domänerna kommer därför från sökmotorns sammanfattningar och inte från helt lästa sidor. Det gäller särskilt Gemma 4-licensen och Qwen3.5-modellkorten. github.com gick att läsa. Påståenden märkta **[bakgrund, ej verifierat här]** bygger på tidigare kunskap med kanonisk käll-URL men kontrollerades inte i den här sessionen. Kontrollera dem innan de används i beslut. Ingen aktuell siffra från EuroEvals svenska topplista kunde hämtas, se Gaps.

## 1. Vilka open-weight-modeller klarar svenska väl?

### Takeaway
2026 års huvudkandidater för en lokal svensk RAG-modell är Qwen3.5 (0.8B/2B/4B/9B, Apache 2.0, mars 2026), Gemma 4 (E2B/E4B och större, numera Apache 2.0, april 2026) och Ministral 3 (3B/8B/14B, Apache 2.0, dec 2025). De rena svenska/nordiska modellerna (GPT-SW3, Viking) är från 2023–2024, inte instruktionstränade för modern RAG och ligger efter. En ny nationell svensk modell håller på att tränas under 2026 men är inte släppt.

### Cited Findings
- Qwen3.5 small: fyra täta modeller, 0.8B, 2B, 4B och 9B, släpptes 2 mars 2026 under Apache 2.0, med 262K kontext. Artificial Analysis bedömer 9B och 4B som de mest kapabla i sina storleksklasser under 10B. — [Artificial Analysis](https://artificialanalysis.ai/articles/qwen3-5-small-models); [Qwen/Qwen3.5-2B (HF)](https://huggingface.co/Qwen/Qwen3.5-2B); [VentureBeat](https://venturebeat.com/technology/alibabas-small-open-source-qwen3-5-9b-beats-openais-gpt-oss-120b-and-can-run)
- Påståendet att Qwen3.5-9B "slår 120B-modeller" är leverantörsnära marknadsföring. Den oberoende jämförelsen är mer återhållsam. — [NYU Shanghai RITS](https://rits.shanghai.nyu.edu/ai/qwen-3-5-small-models-9b-parameters-that-beat-120b/) vs [Artificial Analysis](https://artificialanalysis.ai/articles/qwen3-5-small-models)
- Gemma 4 släpptes 2 april 2026 under Apache 2.0, ett brott mot tidigare Gemma-villkor. Edge-varianterna E2B och E4B har upp till 128K kontext och ljudinmatning. Uppgifterna om antalet storlekar går isär: bloggen anger E2B, E4B, 26B MoE och 31B dense, medan HF-korten enligt sökresultatet också har en 12B. — [Google blog](https://blog.google/innovation-and-ai/technology/developers-tools/gemma-4/); [eWeek](https://www.eweek.com/news/google-gemma-4-apache-2-open-models/); [HF gemma-4-E4b-it](https://huggingface.co/google/gemma-4-E4b-it)
- Ministral 3 omfattar 3B, 8B och 14B, var och en som base, instruct och reasoning, under Apache 2.0. Modellerna har bildförståelse, 256K kontext och är destillerade från Mistral Small 3.1. De släpptes 2 dec 2025. — [Mistral](https://mistral.ai/news/mistral-3); [arXiv 2601.08584](https://arxiv.org/abs/2601.08584v1); [The Register](https://www.theregister.com/2025/12/02/mistral_3/)
- GPT-SW3 (AI Sweden, RISE, WASP) finns i 126M–40B. De senaste licensvillkoren tillåter kommersiell användning royaltyfritt, men kräver tydlig attribution och att man följer GPT-SW3:s guidelines och användarpolicy. Äldre versioner var RAIL-baserade och avsedda för forskning. Licensen skiljer sig mellan versioner och repon. — [ScanCode LicenseDB: AI Sweden LLM AI Model License](https://scancode-licensedb.aboutcode.org/ai-sweden-llm-ai-model-2023.html); [GPT-SW3-paper](https://ar5iv.labs.arxiv.org/html/2305.12987); [AI Sweden](https://www.ai.se/en/news/open-release-first-large-nordic-language-model-gpt-sw3)
- Regeringen och Knut och Alice Wallenbergs stiftelse aviserade i februari 2026 en nationell svensk språkmodell inom WARA AI-TRICS. Målet är att det mesta av träningen görs under 2026. Inget släpp har bekräftats. — [WASP](https://wasp-sweden.org/new-initiative-aims-to-give-sweden-its-own-large-scale-ai-language-model/); [The Star/AFP](https://www.thestar.com.my/tech/tech-news/2026/02/23/sweden-to-develop-home-grown-ai-model-in-swedish)
- AI Sweden deltar i OpenEuroLLM (mars 2026). — [AI Sweden](https://www.ai.se/en/news/unique-language-model-expertise-strengthens-swedish-and-european-independence)
- Enligt aggregatorn Wizwand leder EuroLLM "EuroEval Swedish (held-out)" med 52,8 (maj 2026). Det är ingen officiell källa. — [Wizwand](https://www.wizwand.com/sota/cross-lingual-nlp-evaluation-on-euroeval-swedish-held-out)
- EuroEval (tidigare ScandEval) är MIT-licensierat och täcker bland annat svenska, danska och norska. Topplistan ligger som HF Space. — [GitHub EuroEval](https://github.com/EuroEval/EuroEval); [HF Space EuroEval/leaderboard](https://huggingface.co/spaces/EuroEval/leaderboard/tree/main)
- En diagnostisk benchmark för Sverigerelaterad faktakunskap testade Gemma 3 (270M–27B) och EuroLLM (1.7B, 9B). Den mäter kunskap, inte RAG-förmåga. — [arXiv 2510.21360](https://arxiv.org/abs/2510.21360)
- EuroLLM-22B:s tekniska rapport jämför mot Gemma 3 och Qwen 3. EuroLLM-familjen är byggd för alla EU-språk, inklusive svenska. — [arXiv 2602.05879](https://arxiv.org/pdf/2602.05879)
- **[bakgrund, ej verifierat här]** EuroLLM 1.7B och 9B är Apache 2.0. Viking 7B/13B/33B (Silo AI och Turku, 2024) är Apache 2.0 och tränade på nordiska språk, men är basmodeller med begränsad instruktionsträning. — [HF utter-project/EuroLLM-9B-Instruct](https://huggingface.co/utter-project/EuroLLM-9B-Instruct); [HF LumiOpen/Viking-7B](https://huggingface.co/LumiOpen/Viking-7B)
- **[bakgrund, ej verifierat här]** Phi-4-mini (3.8B) är MIT-licensierad, IBM Granite (3.x/4.x) Apache 2.0 och SmolLM2/3 (HF) Apache 2.0. SmolLM:s flerspråkighet omfattar främst engelska, franska, spanska, tyska, italienska och portugisiska, inte svenska. — [HF microsoft/Phi-4-mini-instruct](https://huggingface.co/microsoft/Phi-4-mini-instruct); [HF ibm-granite](https://huggingface.co/ibm-granite); [HF HuggingFaceTB/SmolLM3-3B](https://huggingface.co/HuggingFaceTB/SmolLM3-3B)

### Inferences
- För svenska svar med exakta citat av tysk eller engelsk text behövs en starkt flerspråkig, instruktionstränad modell. Qwen3.5-4B/9B, Gemma 4 E4B (eller 12B, om den finns) och Ministral 3 8B är de rimliga kandidaterna. GPT-SW3 och Viking bör inte väljas som standard: de är äldre, saknar modern instruktions- och JSON-träning och har sämre tyska.
- SmolLM och de minsta Granite-modellerna är troligen för svaga på svenska.
- Teamet bör själv köra EuroEval (pip-paketet `euroeval`) på svenska med just de GGUF-kvantiseringar som ska skeppas, eftersom topplistan normalt mäter oskvantiserade modeller.

### Gaps
- Aktuella svenska EuroEval-poäng för Qwen3.5, Gemma 4 och Ministral 3 kunde inte hämtas, eftersom euroeval.com och huggingface.co var blockerade. Kontrollera https://euroeval.com/leaderboards/Monolingual/swedish/ direkt.
- Det gick inte att bekräfta om Gemma 4 finns i en 12B-variant.
- Ingen information hittades om nya svenska instruktionsmodeller från 2026 (till exempel från AI Sweden eller Viking-efterföljare). Den nationella modellen är inte släppt.

## 2. Storlekar, kvantisering, RAM och hastighet på CPU (inkl. promptbearbetning)

### Takeaway
Promptbearbetning (prefill) på CPU är flaskhalsen. Mätningar visar att en 7–8B-modell på en vanlig bärbar Intel-dator läser in prompten med cirka 13–16 token/s, medan en 16-kärnig stationär Ryzen klarar cirka 100–150 token/s med standard-llama.cpp. 8k token manualtext tar alltså flera minuter på en kontorslaptop med en 8B-modell. I praktiken krävs 1–4B-modeller, kortare kontext (2–4k token) och/eller iGPU- eller NPU-acceleration.

### Cited Findings
- LLaMA-3.1-8B-Instruct, Ryzen 9 7950X (AVX2-väg, 16 trådar), llama.cpp build 4384 (dec 2024), pp512: Q4_0 153,5 t/s, Q4_K_S 108,4 t/s, Q8_0 147,9 t/s. Generering (tg128, 2 trådar): Q4_0 11,2 t/s, Q4_K_S 9,6 t/s. Forken ik_llama.cpp nådde cirka 270 t/s pp512 för samma kvantiseringar. Siffrorna är snart två år gamla och llama.cpp har förbättrats sedan dess. — [ik_llama.cpp discussion #164](https://github.com/ikawrakow/ik_llama.cpp/discussions/164)
- Samma källa, Apple M2 Max (8 trådar, endast CPU): Q4_0 pp512 114,6 t/s och Q4_K_S 43,3 t/s, med tg 23,9 respektive 17,6 t/s. Q4_0 och IQ4_NL repackas för ARM och blir därför mycket snabbare på prefill. — [ik_llama.cpp #164](https://github.com/ikawrakow/ik_llama.cpp/discussions/164)
- Bärbar Lenovo Yoga 730-15IKB (troligen Intel Core i5/i7 8:e gen; CPU-modellen anges inte), 7B Q4_0: pp512 13,4 t/s med 4 trådar och 16,3 t/s med 8 trådar. En gammal i7-2640M med enbart AVX gav 1,98 t/s. — [mgroeber.de: Benchmarking llama.cpp on legacy hardware](https://www.mgroeber.de/benchmarking-llamacpp-on-legacy-hardware-2.html)
- Bloggmätningar (svag evidens): i7-8550U ThinkPad T480s med 32 GB och Q4_K_M ger cirka 6 token/s generering, och Ryzen 7 PRO 6850U cirka 8 token/s. — [kubaik.github.io](https://kubaik.github.io/run-llms-locally-on-laptops-real-limits/)
- Mistral-7B Q8_0 med CPU-BLAS prefill gav en median på 69 t/s på OpenBenchmarking (hårdvara oklar). — [OpenBenchmarking pts/llama-cpp](https://mail.openbenchmarking.org/test/pts/llama-cpp-2.1.1)
- Artificial Analysis har en separat sida med inferensprestanda för laptops och arbetsstationer. — [Artificial Analysis laptops](https://artificialanalysis.ai/hardware-inference-stack/laptops-workstations)

### Inferences
- **RAM (beräknat, inte mätt):** Q4_K_M motsvarar cirka 4,8–5 bitar per vikt. Det ger ungefär 0,6 GB fil för 1B, cirka 1,5 GB för 2B, cirka 2,5–2,8 GB för 4B, cirka 5–5,7 GB för 8–9B och cirka 8,5–9 GB för 14B. Till det kommer KV-cache: för 8k kontext typiskt 0,3–1,2 GB beroende på arkitektur, eftersom GQA, hybridattention och glidande fönster minskar den. Lägg också till själva appen och Windows. Slutsats: med **8 GB RAM fungerar högst 4B, med 16 GB fungerar 8–9B och 14B är marginellt**.
- **Väntetid vid 8k prompt (extrapolerat):** En bärbar i5/i7 med cirka 4 P-kärnor har ungefär en fjärdedel till en åttondel av 7950X:s prefill-kapacitet. 8B Q4 ger då cirka 15–35 t/s, så 8 000 token tar **4–9 minuter**. En 4B-modell tar ungefär hälften så lång tid, cirka 2–4 minuter, och en 1–2B-modell cirka 0,5–1,5 minuter. Det är för långsamt för interaktiv användning med 8k kontext. Rekommendationen är 2–3k token kontext (till exempel 4–6 utdrag om cirka 400 token) och prefix- eller KV-cache-återanvändning av systemprompten.
- **Generering:** På en kontorslaptop kan man förvänta sig cirka 5–10 t/s för 8B Q4 och cirka 12–25 t/s för 3–4B Q4. Det är minnesbandbredden som begränsar. Ett JSON-svar på 300 token tar 15–60 s.
- Q4_0 eller IQ4_NL kan ge betydligt snabbare prefill än Q4_K_M i llama.cpp tack vare repacking, särskilt på ARM (Snapdragon och Mac). Jämför kvantiseringarna på målhårdvaran.
- Integrerad grafik (Intel Iris Xe/Arc, AMD Radeon) via llama.cpp med Vulkan- eller SYCL-backend, eller via OpenVINO GPU, ger typiskt flera gånger snabbare prefill än CPU. Det är sannolikt den viktigaste accelerationen på vanliga sjukhusdatorer, men inga nyare mätningar hittades i den här sessionen.

### Gaps
- Inga aktuella (2026) llama-bench-siffror för pp8192 på typiska Intel Core i5/i7 (12:e–14:e gen eller Core Ultra) med Qwen3.5 eller Gemma 4 hittades. Mät med `llama-bench -m model.gguf -p 512,2048,8192 -n 128 -t <fysiska kärnor>`.
- Inga Vulkan- eller iGPU-mätningar på Intel Iris Xe hittades i den här sessionen.

## 3. NPU på Copilot+-datorer (Intel Core Ultra, Snapdragon X, AMD Ryzen AI)

### Takeaway
NPU-vägen är mogen i den meningen att verktygen är GA: Foundry Local blev GA 9 april 2026 och Windows ML i september 2025. Prestandan är dock ojämn, modellutbudet begränsat till förkompilerade modeller och en sjukhuspark består sällan av Copilot+-datorer. NPU bör vara en valfri accelerator, inte grunden.

### Cited Findings
- Foundry Local blev GA 9 april 2026 som en plattformsoberoende, lokal-först-lösning för chatt- och ljudappar. Den detekterar NPU, GPU och CPU och laddar automatiskt ner rätt execution provider via Windows ML. — [Microsoft Foundry blog (GA)](https://devblogs.microsoft.com/foundry/foundry-local-ga/); [Foundry Local meets more silicon](https://devblogs.microsoft.com/foundry/foundry-local-meets-more-silicon/)
- Windows ML blev GA 23 september 2025. Foundry Locals WinML-paket använder WinML 2.0 utan beroende på Windows App SDK och kan anropas från Python, JS, Rust och C++ (enligt sammanfattning av ett Build 2026-inlägg). — [Windows Developer blog](https://blogs.windows.com/windowsdeveloper/2025/09/23/windows-ml-is-generally-available-empowering-developers-to-scale-local-ai-across-windows-devices); [Microsoft Foundry blog](https://devblogs.microsoft.com/foundry/accelerate-edge-ai-development-with-foundry-local/)
- Qualcomm anger upp till 80 TOPS för Hexagon-NPU i Snapdragon X. Det är ett toppvärde, inte uppmätt LLM-hastighet. NPU-stöd finns via Olive och ORT GenAI. — [Qualcomm](https://www.qualcomm.com/developer/windows-on-snapdragon/windows-on-snapdragon-ai); [Qualcomm WindowsML blog](https://www.qualcomm.com/developer/blog/2025/09/accelerate-ai-apps-windowsml-on-snapdragon-x-elite-devices)
- I Foundry Local-katalogen finns bland annat Qwen 2.5 7B (QNN, med GPU-fallback) och Phi-4 Mini (QNN). — [Microsoft Tech Community](https://techcommunity.microsoft.com/blog/surfaceitpro/vibe-coding-for-the-npu/4497674)
- Intels NPU-resultat i MLPerf Client v0.6 (Intels eget pressmeddelande): TTFT 1,09 s och 18,55 token/s. — [Intel newsroom](https://newsroom.intel.com/client-computing/intel-achieves-first-only-full-npu-support-mlperf-client-v0-6-benchmark)
- Ett oberoende test på Core Ultra 7 155U (Meteor Lake) med Qwen 2.5 1.5B gav cirka 9 t/s på NPU (OpenVINO) mot cirka 22 t/s med llama.cpp på CPU. NPU-laddningen tog 96 s. Siffrorna är grova, uppskattade från ord/s. — [dev.to (sökutdrag, sidan ej läst)](https://dev.to/mr1azl/i-tried-running-llms-on-intels-npu-heres-what-actually-happened-5h17)
- På Core Ultra 7 356H (Panther Lake) gav OpenVINO 2026.3 med Llama 3.2 1B på NPU 65,26 t/s och TTFT 275 ms. — [LinuxLinks (sökutdrag)](https://www.linuxlinks.com/minisforum-m2-panther-lake-mini-pc-npu/)
- Intel har publicerat OpenVINO-stöd för Qwen3 på NPU och iGPU (Core Ultra 200V och 285H). — [Intel developer](https://www.intel.com/content/www/us/en/developer/articles/technical/accelerate-qwen3-large-language-models.html)

### Inferences
- På Meteor Lake (Core Ultra serie 1) kan NPU:n vara långsammare än CPU:n. På Lunar och Panther Lake är den betydligt bättre. Sjukhus köper sällan nyaste generationen, så CPU och iGPU måste vara huvudvägen.
- Foundry Local styr modellvalet till sin katalog, och det är oklart om Qwen3.5 eller Gemma 4 i NPU-format finns där. Egna modeller kräver Olive- eller OpenVINO-konvertering per kiselleverantör, vilket är en betydande underhållskostnad.
- NPU:er har historiskt haft begränsningar i maximal promptlängd och statiska former. Kontrollera detta för 8k kontext.

### Gaps
- Inga oberoende mätningar av prefill för 8k token på NPU hittades, och inga mätningar på AMD Ryzen AI-NPU (Lemonade/ONNX hybrid).
- Det gick inte att bekräfta exakt vilka modeller som finns i Foundry Local-katalogen i november 2026.

## 4. Inferensmotorer: inbäddning, licens, JSON/grammatik

### Takeaway
llama.cpp (MIT) är det säkraste valet att bädda in. Det kör GGUF på CPU, Vulkan/iGPU, Metal och CUDA och har inbyggd GBNF-grammatik och JSON-schema-begränsning. OpenVINO GenAI eller Foundry Local kan läggas till som accelerationsväg på Intel- eller Copilot+-maskiner. MLX gäller bara Mac.

### Cited Findings
- **[bakgrund, ej verifierat här]** llama.cpp har MIT-licens, stöder GBNF-grammatik och `--json-schema`/`response_format` i llama-server och har backends för CPU (AVX2/AVX-512), Vulkan, SYCL, Metal och CUDA. — [GitHub ggml-org/llama.cpp](https://github.com/ggml-org/llama.cpp); [grammars README](https://github.com/ggml-org/llama.cpp/blob/master/grammars/README.md)
- **[bakgrund, ej verifierat här]** Ollama har MIT-licens, bygger på llama.cpp och har strukturerad utdata via JSON-schema i `format`. Ollama är dock en separat tjänst (port 11434) och därför svårare att skeppa integrerat. — [GitHub ollama/ollama](https://github.com/ollama/ollama); [Ollama structured outputs](https://ollama.com/blog/structured-outputs)
- **[bakgrund, ej verifierat här]** LM Studio-appen är proprietär. lmstudio-js och lmstudio-python (MIT) är klienter som kräver att LM Studio är installerat, så de passar inte för inbäddning i en såld produkt. — [lmstudio.ai](https://lmstudio.ai/docs)
- **[bakgrund, ej verifierat här]** ONNX Runtime GenAI har MIT-licens, har guidance och JSON-begränsning via llguidance och kör DirectML, QNN, OpenVINO och CUDA. OpenVINO och OpenVINO GenAI har Apache 2.0 och stöder strukturerad utdata via xgrammar i nyare versioner. — [GitHub microsoft/onnxruntime-genai](https://github.com/microsoft/onnxruntime-genai); [GitHub openvinotoolkit/openvino.genai](https://github.com/openvinotoolkit/openvino.genai)
- **[bakgrund, ej verifierat här]** MLX och mlx-lm (Apple) har MIT-licens och kör bara på Apple Silicon. — [GitHub ml-explore/mlx-lm](https://github.com/ml-explore/mlx-lm)
- Foundry Local erbjuder SDK för flera språk och auto-provisionering av execution providers (se avsnitt 3). — [Microsoft Foundry blog](https://devblogs.microsoft.com/foundry/foundry-local-ga/)

### Inferences
- Lotsa är idag en ren HTML/JS-app. En desktopversion skulle naturligt bli Electron eller Tauri med llama.cpp: antingen `llama-server` som sidecar-process på localhost med OpenAI-kompatibelt API, eller via node-llama-cpp (MIT, [bakgrund](https://github.com/withcatai/node-llama-cpp)), som också stöder JSON-schema-grammatik. Då kan `src/js/00-standalone.js` byta API-bas-URL i stället för att skriva om logiken.
- Grammatikbegränsad JSON garanterar giltig JSON men inte riktiga citat. Citatkontrollen i Lotsa behövs fortfarande.

### Gaps
- Licens- och funktionsstatus för runtimes kontrollerades inte mot primärkällor i den här sessionen (bara github.com gick att läsa, och tiden räckte inte). Kontrollera innan beslut.

## 5. Modellicenser: kommersiell användning och vidaredistribution, EU

### Takeaway
Apache 2.0-modeller (Qwen3.5, Gemma 4, Ministral 3, Granite, EuroLLM, Viking) och MIT (Phi) är enklast att bunta med en såld produkt. Det räcker att bifoga licens och notiser. Llama har en egen community-licens med krav på attribution, användarpolicy och en klausul om 700 miljoner användare. Llama 3.2:s multimodala modeller undantar EU-baserade företag. GPT-SW3 kräver attribution och att policyn följs.

### Cited Findings
- Gemma 4 har Apache 2.0, medan tidigare Gemma-versioner hade Googles egna Gemma-villkor. — [Google blog](https://blog.google/innovation-and-ai/technology/developers-tools/gemma-4/); [eWeek](https://www.eweek.com/news/google-gemma-4-apache-2-open-models/)
- Qwen3.5 small har Apache 2.0. — [Artificial Analysis](https://artificialanalysis.ai/articles/qwen3-5-small-models)
- Ministral 3 (alla storlekar) har Apache 2.0. — [Mistral](https://mistral.ai/news/mistral-3)
- Llama 3.2: licensrättigheterna till de multimodala 11B- och 90B-modellerna gäller inte personer eller företag med huvudsäte i EU. Slutanvändare i EU av en produkt som byggts av ett icke-EU-företag omfattas inte av begränsningen. Textmodellerna 1B och 3B berörs inte. — [Meta Llama FAQ](https://www.llama.com/faq/); [Meta Llama 3.2 license](https://developer.meta.com/ai/llama3_2/license/); [Slator](https://tech.slator.com/?p=100185); [Nils Durner](https://ndurner.github.io/llama-multi-modal-eu)
- GPT-SW3 (nyare licens): kommersiell användning är tillåten och royaltyfri, med krav på tydlig attribution till AI Sweden, RISE och WASP och att GPT-SW3:s guidelines följs. — [ScanCode LicenseDB](https://scancode-licensedb.aboutcode.org/ai-sweden-llm-ai-model-2023.html)
- **[bakgrund, ej verifierat här]** Llama Community License kräver "Built with Llama", att licensen och AUP följer med, och en separat licens över 700 miljoner MAU. Phi-4 har MIT. — [Llama 3.2 license](https://developer.meta.com/ai/llama3_2/license/); [HF Phi-4-mini](https://huggingface.co/microsoft/Phi-4-mini-instruct)

### Inferences
- Lotsa är ett svenskt (EU-)bolag, så Llama 3.2 Vision och Llama 4 multimodal bör undvikas helt. Llama-textmodeller går att använda, men Apache 2.0-alternativ är enklare och minst lika bra på svenska.
- Kontrollera alltid licensfilen i exakt det HF-repo och den commit som skeppas, eftersom GGUF-konverteringar från tredje part kan ha felaktig metadata.
- Kontrollera med jurist om appen klassas som medicinteknisk produkt (MDR) eller faller under AI-förordningen. Det ligger utanför den här rapporten.

### Gaps
- Gemma 4-licensens exakta text (eventuell kvarvarande användarpolicy) kunde inte läsas, eftersom huggingface.co och ai.google.dev var blockerade.

## 6. Faithfulness och hallucination hos små modeller i RAG och citatextraktion

### Takeaway
Små modeller (≤7B) har dokumenterat svårt att faktiskt använda hämtad kontext. Specialiserade små modeller och verifierare kan dock nå eller överträffa större modeller. Grundning måste säkras utanför modellen: grammatikbegränsad JSON, exakt strängmatchning av citat mot manualtexten, och avböjande när ingen träff finns.

### Cited Findings
- "Can Small Language Models Use What They Retrieve?" (mars 2026), modeller upp till 7B: en flaskhals i utnyttjandet gör att även kapabla små modeller har svårt att grunda svar i hämtad kontext. — [arXiv 2603.11513](https://arxiv.org/html/2603.11513v1)
- OCC-RAG (maj 2026): specialiserade 0.6B- och 1.7B-modeller för grundad QA med citatmedveten utdata når eller överträffar generella modeller som är 2–6 gånger större på faithfulness (ConFiQA) och avböjande (MuSiQue-Un). — [arXiv 2606.00683](https://arxiv.org/html/2606.00683)
- HalluGuard (ACL Findings 2026): en 4B-verifierare som klassar dokument–påstående-par som grundade eller hallucinerade, med 77,1 % balanced accuracy mot GPT-4o:s 75,9 %. — [arXiv 2510.00880](https://arxiv.org/html/2510.00880)
- LIT-RAGBench (mars 2026) utvärderar generatorn, inklusive förmågan att avstå. — [arXiv 2603.06198](https://arxiv.org/html/2603.06198)
- RAGTruth är en korpus för hallucinationer i RAG, och Vectara FaithJudge är en leaderboard för faithfulness. — [arXiv 2401.00396](https://arxiv.org/pdf/2401.00396); [arXiv 2505.04847](https://arxiv.org/abs/2505.04847v2)

### Inferences
Tekniker som passar Lotsa:
1. **JSON-schema-grammatik** i llama.cpp, så att utdata alltid kan parsas, med ett fält för "hittades inte i manualen".
2. **Extrahera först, svara sedan:** låt modellen först välja ID för utdrag eller meningar ur den numrerade kontexten och skriv därefter svaret. Citattexten hämtas sedan ur källan med kod, inte ur modellens utdata. Det eliminerar felciterade ord helt, och citaten blir per definition ordagranna med korrekt sidnummer.
3. **Strängverifiering** (som Lotsa redan gör) med normalisering av blanksteg och bindestreck. Kasta påståenden som saknar verifierat citat.
4. **Avböjande:** om retrieval-poängen ligger under en tröskel eller inget citat verifieras, svara "finns inte i bruksanvisningen" i stället för att låta modellen gissa.
5. Låg temperatur (0–0,2). Stäng av "thinking"-läge (Qwen3.5) för snabbhet, eller begränsa det.
6. Citat på tyska eller engelska bör återges ordagrant på originalspråket, med svensk förklaring vid sidan av, så att verifieringen inte bryts av översättning.

### Gaps
- Ingen benchmark för ordagrann citatextraktion på svenska eller tyska med små modeller hittades. Lotsa behöver ett eget testset med manualfrågor.

## 7. Rekommendation: standardmodell, reserv och minimikrav

### Takeaway
Standardmodell: **Qwen3.5-4B Q4_K_M** (cirka 2,7 GB, Apache 2.0) via inbäddad llama.cpp. På 16 GB-maskiner, med acceptans för längre väntan, kan **Qwen3.5-9B / Ministral 3 8B / Gemma 4 E4B** ge bättre kvalitet. Reserv för svag hårdvara: **Qwen3.5-2B eller Gemma 4 E2B**. Utvärdera alla på eget svenskt testset innan beslut. Minimikrav: 8 GB RAM (16 GB rekommenderat), CPU med AVX2 (Intel 8:e gen eller senare), cirka 6 GB ledigt diskutrymme. Kontexten bör hållas till cirka 2–3k token.

### Cited Findings
- Qwen3.5-4B och -9B är de mest kapabla i sina storleksklasser enligt Artificial Analysis, Apache 2.0. — [Artificial Analysis](https://artificialanalysis.ai/articles/qwen3-5-small-models)
- Gemma 4 E2B och E4B är edge-modeller under Apache 2.0. — [Google blog](https://blog.google/innovation-and-ai/technology/developers-tools/gemma-4/)
- Ministral 3 3B och 8B är avsedda för edge och lokal användning, Apache 2.0. — [Mistral](https://mistral.ai/news/mistral-3)
- Prefill för 7–8B på en bärbar dator mäts till cirka 13–16 t/s (7B Q4_0, äldre Intel-laptop). — [mgroeber.de](https://www.mgroeber.de/benchmarking-llamacpp-on-legacy-hardware-2.html)

### Inferences
- **Föreslagen nivåindelning:** (a) 8 GB, ingen NPU: 2B-modell med 2k kontext. (b) 16 GB: 4B-modell med 3k kontext, med iGPU via Vulkan om det finns. (c) 16–32 GB och modern iGPU, NPU eller Apple M-serie: 8–9B. Appen kan välja nivå automatiskt utifrån RAM och ett kort benchmark vid första start.
- På Mac (M1 eller senare, 16 GB) räcker llama.cpp med Metal eller MLX gott för 8–9B.
- Säkerhetsmarginalen ligger i arkitekturen (extrahera först och citera med kod), inte i modellstorleken. Det gör en 4B-modell realistisk.

### Gaps
- Inga uppmätta siffror för Qwen3.5 eller Gemma 4 på svenska RAG-uppgifter eller på typiska sjukhusdatorer. Det kräver egna mätningar.
- Qwen3.5 använder enligt uppgift en ny hybridarkitektur. Hur mogen CPU-prefill i llama.cpp är för den arkitekturen jämfört med vanliga transformer-modeller kunde inte verifieras.
