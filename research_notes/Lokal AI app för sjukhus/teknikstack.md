# Teknikstack för en offline desktop-RAG-app (Lotsa) på svenska sjukhus-PC, läget 2026

Metodnot: WebFetch var blockerad i den här sessionen (huggingface.co och v2.tauri.app gick inte att nå). Allt nedan bygger på sökresultat via WebSearch och deras sammanfattningar av källsidorna. Siffror från bloggar och leverantörssidor är markerade som osäkra. Påståenden som bygger på tidigare kunskap och inte har kunnat verifieras i den här sessionen står under "Inferences" och är märkta **[ej verifierat]**.

## 1. Skal: Tauri 2, Electron eller native (.NET/WinUI)

### Takeaway
Tauri 2 passar bäst för Lotsa. Det ger en liten installerare, använder WebView2 som redan ingår i Windows 11 och kan bädda in WebView2 för offlineinstallation. Det har också en behörighetsmodell (capabilities) som stänger av allt som inte uttryckligen är tillåtet, och inbyggt stöd för sidecar-binärer som llama-server och whisper.cpp. Electron är robustare om man vill ha exakt samma Chromium överallt, men det är mycket större. Web Speech API:s taligenkänning ska inte förväntas fungera offline i någon av dem, så diktering måste byggas om med lokal Whisper.

### Cited Findings
- **WebView2 i Windows 11:** WebView2 Evergreen Runtime ingår i Windows 11. — [Microsoft Learn: WebView2 distribution](https://learn.microsoft.com/microsoft-edge/webview2/concepts/distribution)
- **WebView2 i Windows 10:** Microsoft skriver att "the vast majority" av Windows 10-enheterna har runtime. Ett litet antal saknar den, så Microsoft rekommenderar att appen distribuerar Evergreen Runtime själv. — [Microsoft Learn: distribution](https://learn.microsoft.com/microsoft-edge/webview2/concepts/distribution)
- **Utrullning till hanterade enheter:** Runtime rullades ut till hanterade, domänanslutna Windows 10-enheter efter januari 2023. — [Microsoft Edge blog 2022-12-14](https://blogs.windows.com/msedgedev/2022/12/14/delivering-microsoft-edge-webview2-runtime-to-managed-windows-10-devices/)
  - Ett äldre Intune-supporttips säger att Windows 10 inte har runtime förinstallerat. — [Intune support tip](https://techcommunity.microsoft.com/t5/intune-customer-success/support-tip-bulk-installing-webview2-runtime-on-windows-10/ba-p/3678202)
  - Det äldre tipset motsäger delvis de nyare dokumenten.
- **Styrning via GPO:** IT kan styra WebView2 med grupprinciper (GPO), till exempel `UpdatesSuppressed` och `DowngradeVersion`, och kan stänga av den automatiska installationen. — [Microsoft Learn: Enterprise management of WebView2](https://learn.microsoft.com/microsoft-edge/webview2/concepts/enterprise)
- **Fristående installerare:** Microsoft erbjuder en fullständig "Standalone Installer" för offlinemiljöer. — [Microsoft Learn: distribution](https://learn.microsoft.com/microsoft-edge/webview2/concepts/distribution)
- **WebView2-lägen i Tauri:** Tauri 2:s Windows-installerare har flera lägen för WebView2:

  | Läge | Påslag på installeraren | Kommentar |
  |---|---|---|
  | `offlineInstaller` | ca 127 MB | Rekommenderas för offlinemiljöer |
  | `fixedVersion`/`fixedRuntime` | ca 180 MB | Fast WebView2-version |
  | `embedBootstrapper` | ca 1,8 MB | Kräver nätverk vid installation |
  | `skip` | 0 MB | Installerar inte WebView2 |

  Dokumentationen använder både namnet `fixedVersion` och `fixedRuntime`, så kontrollera schemat. — [Tauri: Windows Installer](https://v2.tauri.app/distribute/windows-installer/)
- **Säkerhet med fast runtime:** Med systemets WebView2 sköter Windows säkerhetspatcharna. Med en fast runtime måste man själv leverera patcharna. — [Tauri v1 guide](https://v1.tauri.app/v1/guides/building/windows)
- **Capabilities i Tauri 2:** Anrop till plugins kräver behörigheter i `src-tauri/capabilities/`. Utan behörighet misslyckas anropet och Rust-sidan körs aldrig. — [DEV: Tauri sandbox permissions](https://dev.to/hiyoyok/tauri-sandbox-permissions-why-your-command-silently-does-nothing-hcn)
- **Sidecar-krav:** En sidecar måste heta `<namn>-<target-triple>` och kräver `shell:allow-execute` med `sidecar: true`. Annars returnerar `spawn()` felet "not allowed". — [Tauri shell JS-referens](https://v2.tauri.app/reference/javascript/shell); [docs.rs tauri-plugin-shell scope](https://docs.rs/crate/tauri-plugin-shell/2.3.1/source/src/scope.rs)
- **Avsluta sidecarn:** Ett sätt är att fånga `RunEvent::ExitRequested` och anropa `child.kill()`. Källan är tredjepart, inte officiell dokumentation. — [stuffbucket: tauri-sidecar](https://stuffbucket.github.io/skills/catalog/tauri-sidecar/)
- **Storlek och minne, Tauri mot Electron:** Siffrorna varierar kraftigt mellan källor.

  | Källa | Tauri | Electron |
  |---|---|---|
  | Hopp | 8,6 MiB, 172 MB RAM | 244 MiB, 409 MB RAM |
  | Better Stack (2026) | 57 MB | 323 MB |

  Ett Tauri-issue ifrågasätter hur minnet mättes. — [DEV/Hopp](https://dev.to/gethopp/tauri-vs-electron-performance-bundle-size-and-the-real-trade-offs-1el4); [Better Stack](https://betterstack.com/community/guides/scaling-nodejs/tauri-vs-electron-vs-deno-vs-electrobun/); [tauri issue #5889](https://github.com/tauri-apps/tauri/issues/5889)
- **Taligenkänning i Electron:** `webkitSpeechRecognition` ger felet "network" i Electron. Chromium använder ett Google-API och kräver en API-nyckel som Chromium normalt inte exponerar. — [chromium-dev](https://groups.google.com/a/chromium.org/g/chromium-dev/c/RBZXqc0Zvmc); [chromium-discuss](https://groups.google.com/a/chromium.org/g/chromium-discuss/c/HYwQR_423uk)
- **On-device Web Speech API i Chrome:** "Intent to Ship" kom i januari 2025, med stöd först på Windows, Mac och Linux. Det är inte bekräftat för WebView2 eller Electron. — [blink-dev Intent to Ship](https://groups.google.com/a/chromium.org/g/blink-dev/c/VNOok2dbmHM); [W3C TAG review #1038](https://tag-github-bot.w3.org/gh/w3ctag/design-reviews/1038)
- **Taligenkänning i Edge:** Edge beskriver en lokal SpeechRecognition som även fungerar offline. Språk som en-US listas, men svenska är inte bekräftat. — [Microsoft Learn: Edge speech recognition API](https://learn.microsoft.com/lt-lt/Microsoft-Edge/web-platform/speech-recognition-api)
  - En Q&A-tråd beskriver stödet för `webkitSpeechRecognition` i Edge som "spotty". — [MS Q&A](https://learn.microsoft.com/en-us/answers/a/2054895)

### Inferences
- **Rekommendation:** Använd Tauri 2 med `webviewInstallMode: offlineInstaller`, eller `skip` när IT redan distribuerar WebView2. Använd Evergreen-runtime så att Windows Update eller IT sköter patcharna.
- **Fallback:** Electron är ett alternativ om WebView2 visar sig vara spärrad på regionens Windows 10-maskiner.
- **Native .NET/WinUI** ger ingen fördel när UI:t redan är HTML/JS. WinUI 3 bäddar ändå in webbinnehåll via WebView2.
- **Talsyntes:** `speechSynthesis` i WebView2 använder troligen de lokala Windows-rösterna (SAPI/OneCore) och borde därför fungera offline. **[ej verifierat]**
- **Diktering:** Räkna med att taligenkänning (SpeechRecognition) inte fungerar offline. Ersätt den med lokal whisper.cpp som sidecar (avsnitt 2).
- **Sidecar för LLM:** llama.cpp `llama-server` som sidecar på `127.0.0.1` eller en named pipe, startad och dödad av Rust-sidan. Alternativet är att länka llama.cpp som bibliotek via crates som `llama-cpp-2`. **[ej verifierat]**
- **Tauri-uppdateringar:** Tauri har ett updater-plugin som kräver signerade uppdateringspaket. I en offlinemiljö är det enklare att låta IT distribuera nya MSI-versioner och stänga av updatern helt. **[ej verifierat i denna session]**

### Gaps
- Kunde inte hämta Tauri-dokumentationen om CSP, sidecar eller updater i fulltext eftersom v2.tauri.app var blockerad.
- Det är oklart om Tauri-MSI:n (WiX) installerar per-machine som standard.
- Inget belägg hittades för om WebView2 har en offline-väg för SpeechRecognition, eller för svenska.
- Inget hittades om Electron-säkerhet (`contextIsolation`, fuses, ASAR-integritet).

## 2. Svensk tal-till-text offline

### Takeaway
KBLab:s KB-Whisper är det självklara valet för svenska. Det finns i GGML-format för whisper.cpp och halverar ungefär felfrekvensen jämfört med OpenAI:s Whisper. Även tiny-modellen är användbar för svenska. Kör den via whisper.cpp som sidecar. Small eller base är en rimlig kompromiss på hårdvara med bara CPU.

### Cited Findings
- **KB-Whisper large mot OpenAI large-v3:** WER (lägre är bättre) på svenska testdata. — [KBLab kb-whisper model cards](https://huggingface.co/KBLab/kb-whisper-small); [KBLab blogg 2025-03-07](https://kb-labb.github.io/posts/2025-03-07-welcome-KB-Whisper)

  | Modell | FLEURS | CommonVoice | NST |
  |---|---|---|---|
  | KB-Whisper large | 5,4 | 4,1 | 5,2 |
  | OpenAI large-v3 | 7,8 | 9,5 | 11,3 |

- **KB-Whisper tiny mot OpenAI tiny:** — [KB-Whisper Tiny](https://huggingface.co/KBLab/kb-whisper-tiny)

  | Modell | FLEURS | CommonVoice | NST |
  |---|---|---|---|
  | KB-Whisper tiny | 13,2 | 12,9 | 11,2 |
  | OpenAI tiny | 59,2 | 67,8 | 85,2 |

- **Genomsnittlig förbättring:** I genomsnitt 47 % lägre WER än whisper-large-v3. — [arXiv 2505.17538](https://arxiv.org/html/2505.17538v2)
- **Format för whisper.cpp:** KBLab publicerar GGML-filer för whisper.cpp, både kvantiserade (q5_0) och okvantiserade, i varje storlek. — [kb-whisper-base model card](https://huggingface.co/KBLab/kb-whisper-base)
- **Stage 2 och "subtitle":** Sedan 2025-05-13 är "Stage 2" standard. Det finns också en "subtitle"-checkpoint som transkriberar mer komprimerat. — [kb-whisper-base README](https://huggingface.co/KBLab/kb-whisper-base/blob/main/README.md)
- **CoreML på Mac:** Det finns en CoreML-encoder från communityn för kb-whisper-large i whisper.cpp på Apple Silicon. — [jegeblad/kb-whisper-large-coreml](https://huggingface.co/jegeblad/kb-whisper-large-coreml)
- **CPU-hastighet (osäker):** En gist mäter int8 på CPU för cirka 2 minuters ljud: small.en 14,0 s, medium 43,1 s och large-v2 75,4 s. Implementationen är oklar. — [gist geekodour](https://gist.github.com/geekodour/8734b3bf22b8ede61fb5bfc92ce68fe3)
  - Ett benchmark av faster-whisper large-v3-turbo ger 19,6 s med int8, men hårdvaran anges inte. — [HF-diskussion](https://huggingface.co/deepdml/faster-whisper-large-v3-turbo-ct2/discussions/3)
- **Benchmarks ger skev bild:** De flesta jämförelser mellan whisper.cpp och faster-whisper mäter en enda körning med förladdad modell, vilket ger en missvisande bild av produktion. — [DEV/TildAlice](https://dev.to/tildalice/whispercpp-vs-faster-whisper-why-speed-tests-lie-107o)
- **faster-whisper:** Bygger på CTranslate2 och är Python-baserat. — [SYSTRAN/faster-whisper](https://github.com/SYSTRAN/faster-whisper)

### Inferences
- **Välj whisper.cpp** (C/C++, en enda binär, MIT-licens **[ej verifierat]**) framför faster-whisper, som kräver en Python-runtime. Det är lättare att paketera och vitlista i WDAC.
- **Modellstorlek på 8 GB RAM-maskiner:** Kör kb-whisper-small eller base i q5_0 samtidigt som LLM:en. Large är troligen för långsam för interaktiv diktering på en kontors-CPU. Det måste mätas.
- **Licens:** KB-Whisper-modellernas licens bekräftades inte i sökresultaten. Kontrollera modellkortet. Tidigare uppgift är Apache-2.0. **[ej verifierat]**

### Gaps
- Ingen verifierad WER-mätning för de kvantiserade GGML-filerna.
- Ingen pålitlig realtidsfaktor för en typisk Intel i5 med 8–16 GB RAM.
- Ingen mätning av medicinsk eller teknisk svenska.

## 3. PDF-tolkning, layout och OCR

### Takeaway
Behåll pdf.js (finns redan) eller PDFium för textlager och sidnummer. Använd Docling (MIT) om tabeller och flerspaltig layout behöver bättre struktur. Undvik PyMuPDF/MuPDF (AGPL eller kommersiell licens) och Marker (GPL-3.0) i en distribuerad produkt. För OCR offline: Tesseract (Apache-2.0, svensk och tysk traineddata) är portabel, och Windows.Media.Ocr är gratis men kräver installerade språkpaket.

### Cited Findings
- **Docling:** MIT-licens. Det körs lokalt på vanlig hårdvara och kan integreras utan restriktiva licenser. — [arXiv 2501.17887 Docling](https://arxiv.org/html/2501.17887v1)
- **Benchmark från OpenDataLoader** (ett konkurrerande projekt, så osäker). Tabellpoäng på skalan 0–1. — [opendataloader-bench](https://github.com/opendataloader-project/opendataloader-bench)

  | Verktyg | Tabellpoäng | Tid per sida | Licens |
  |---|---|---|---|
  | Docling | 0,887 | 0,76 s | MIT |
  | Marker | 0,808 | 53,9 s | GPL-3.0 |
  | PyMuPDF4LLM | 0,401 | – | AGPL |

  AGPL- och GPL-motorerna gick inte att köra från deras repo, så de siffrorna kunde inte reproduceras där.
- **PyMuPDF:** Dubbellicensierat (AGPL eller kommersiell licens). Det är snabbt men saknar layoutförståelse och avancerad tabellhantering. — [DEV: PDF parsers for air-gapped RAG](https://dev.to/ashokan/from-pdfs-to-markdown-evaluating-document-parsers-for-air-gapped-rag-systems-58eh); [DEV: pdf extractor alternatives](https://dev.to/jerin_stephen/pdf-extractor-alternatives-for-marker-pdf-ld5)
- **Tesseract svensk data:** `swe.traineddata` är Apache-2.0-licensierad enligt Arch och Alpine. — [Arch tesseract-data-swe](https://archlinux.org/packages/extra/any/tesseract-data-swe/); [Alpine](https://pkgs.alpinelinux.org/package/v3.16/community/x86_64/tesseract-ocr-data-swe)
- **Windows.Media.Ocr:** `OcrEngine.AvailableRecognizerLanguages` returnerar bara de OCR-språk som är installerade. Språkpaket installeras via Inställningar eller `Get-WindowsCapability` (`Language.OCR~~~<tagg>~`). — [Microsoft Learn: AvailableRecognizerLanguages](https://learn.microsoft.com/en-us/uwp/api/windows.media.ocr.ocrengine.availablerecognizerlanguages?view=winrt-22621); [GitHub Descolada/OCR PR](https://github.com/Descolada/OCR/pull/2)

### Inferences
- **Sidnummer för citat:** pdf.js ger text per sida och teckenpositioner, vilket räcker för att verifiera citat. Behåll den för rendering och textextraktion i UI:t.
- **Docling** kan köras som en extra sidecar för strukturerad import med tabeller i Markdown. Den kräver Python och modellfiler, vilket ger större paket och fler binärer att vitlista. Paketeringen behöver utredas.
- **Licenser för PDFium och pdf.js:** PDFium har BSD-3-licens (Google), och pdf.js har Apache-2.0. **[ej verifierat]**
- **Unstructured och PaddleOCR** hann inte undersökas. PaddleOCR är enligt tidigare kunskap Apache-2.0. **[ej verifierat]**
- **Apple Vision** (VNRecognizeTextRequest) på Mac stöder enligt tidigare kunskap svenska. **[ej verifierat]**
- **Tesseract på skannade manualer:** Kör OCR bara när en sida saknar textlager. Spara OCR-text per sida med sidnummer, och markera citat från OCR-text som "OCR-text".

### Gaps
- Det är inte bekräftat att Windows erbjuder ett svenskt OCR-språkpaket, eller vilken tagg det har.
- Ingen oberoende benchmark på flerspråkiga tekniska manualer.
- Unstructured, PaddleOCR och Apple Vision kunde inte undersökas.

## 4. Retrieval: embeddings, hybridsökning, reranker och chunkning

### Takeaway
Använd hybridsökning i en enda SQLite-fil: FTS5 (BM25) plus sqlite-vec, sammanvägt med Reciprocal Rank Fusion (RRF). Den är enkel att bädda in, säkerhetskopiera och dela. Embeddings kan komma från bge-m3 (MIT, flerspråkig) eller multilingual-e5, som presterar bäst i den skandinaviska benchmarken SEB. Reranking kan göras med bge-reranker-v2-m3. Både embedding och rerank kan köras i llama.cpp med GGUF.

### Cited Findings
- **Skandinavisk benchmark (SEB):** 24 uppgifter för danska, svenska och norska. multilingual-e5-modellerna och de kommersiella API:erna var de mest konkurrenskraftiga av 26 testade modeller. bge-m3 ingick inte i sökresultatet. — [arXiv 2406.02396 SEB](https://arxiv.org/html/2406.02396v1)
- **bge-m3 i llama.cpp:** GGUF-versioner med MIT-licens finns, och modellen körs med `--embeddings` i llama.cpp. — [gpustack/bge-m3-gguf](https://huggingface.co/gpustack/bge-m3-gguf)
- **bge-reranker-v2-m3 i llama.cpp:** Cirka 568M parametrar. Körs med `llama-server --reranking` och endpointen `/rerank`. Q4_K_M är cirka 438 MB och Q8_0 cirka 636 MB, med Apache-2.0-licens. — [smarttasks/bge-reranker-v2-m3-GGUF](https://huggingface.co/smarttasks/bge-reranker-v2-m3-GGUF); [gpustack/bge-reranker-v2-m3-GGUF](https://huggingface.co/gpustack/bge-reranker-v2-m3-GGUF/tree/main); [sehiro Q4_K_M](https://huggingface.co/sehiro/bge-reranker-v2-m3-Q4_K_M-GGUF)
- **RRF i SQLite:** RRF kombinerar sqlite-vec-KNN och FTS5 via rankning med `1/(k+rank)`, vilket undviker att jämföra råa poäng. — [Simon Willison 2024-10-04](https://simonwillison.net/2024/Oct/4/hybrid-full-text-search-and-vector-search-with-sqlite/)
  - Ett exempel på cirka 200 rader. — [DEV](https://dev.to/soytuber/building-a-hybrid-rag-in-200-lines-sqlite-fts5-sqlite-vec-rrf-38h1)
  - k sätts ofta till 60. — [Google Spanner docs](https://docs.cloud.google.com/spanner/docs/hybrid-full-text-vector-search)
  - En artikel från 2026, "SQLite is Enough" (scrydb), kombinerar FTS5, sqlite-vec och rank fusion. — [arXiv 2608.24060](https://arxiv.org/pdf/2608.24060)

### Inferences
- **Embeddingmodell för 8 GB RAM:** multilingual-e5-small eller base är lätta. bge-m3 (cirka 568M parametrar, samma bas som rerankern) är tyngre men stöder långa kontexter. Utvärdera båda på egna svenska frågor mot manualer.
- **Embeddingtid:** Indexering vid import kan ta minuter per manual på CPU. Kör den i bakgrunden.
- **BM25 är viktigt:** I tekniska manualer är artikelnummer, larmkoder och parameternamn ("E-104", "PEEP") exakta strängar. Därför väger BM25 tungt.
- **FTS5-tokenizer:** Svenska sammansättningar är ett problem. Testa `unicode61` med `remove_diacritics 0`, eventuellt med trigram som komplement. **[ej verifierat]**
- **Chunkning:** Dela upp per sida och rubrikavsnitt med cirka 300–600 tokens och lite överlapp. Spara alltid manual-id, sidnummer och rubrikkedja, och håll tabeller hela per chunk. Citatkontrollen görs mot den råa sidtexten, inte mot chunken.
- **KBLab:s svenska sentence-BERT, nomic-embed, Snowflake arctic-embed, LanceDB, Tantivy och hnswlib** hann inte undersökas. sqlite-vec räcker för några tusen till hundratusentals chunks med brute-force-KNN. **[ej verifierat]**

### Gaps
- Inga verifierade SEB-siffror för bge-m3 eller för svensk retrieval specifikt.
- Inga mätningar av embeddinghastighet på CPU.

## 5. Garantera "inget internet" och leverera stora modellfiler

### Takeaway
Bygg skydd i flera lager:

1. Strikt CSP som bara tillåter `self`, `ipc:` och lokala resurser.
2. Tauri-capabilities utan HTTP-plugin.
3. Sidecars som bara binder till loopback.
4. Utgående brandväggsregler som IT sätter per programsökväg.
5. Ett verifieringsprotokoll där appen körs i en miljö utan nätverk eller nätverkstrafiken loggas.

Modellfiler levereras som separata MSI- eller zip-paket via Intune/SCCM eller som en filresurs, och kontrolleras med SHA-256 och signatur.

### Cited Findings
- **Behörigheter i Tauri:** Allt som inte är listat i en capability-fil blockeras ("not allowed"). — [DEV: Tauri sandbox permissions](https://dev.to/hiyoyok/tauri-sandbox-permissions-why-your-command-silently-does-nothing-hcn)
- **WebView2 offline:** WebView2 kan installeras offline med Standalone Installer. — [Microsoft Learn](https://learn.microsoft.com/microsoft-edge/webview2/concepts/distribution)
- **Uppdateringar av WebView2:** IT kan pausa dem via GPO. — [Microsoft Learn enterprise](https://learn.microsoft.com/microsoft-edge/webview2/concepts/enterprise)

### Inferences
- **WebView2 gör egna anrop:** WebView2 och Edge-uppdateraren gör egna nätverksanrop för uppdateringar och SmartScreen. Detta ligger utanför appen. Dokumentera det och låt IT styra det via GPO, eller välj `fixedVersion` om absolut nolltrafik krävs. **[ej verifierat]**
- **Brandväggsregler:** Windows Defender Firewall-regler som blockerar utgående trafik för `lotsa.exe`, `llama-server.exe` och `whisper-cli.exe` kan distribueras med Intune. Det ger ett tekniskt bevis som IT kontrollerar.
- **Bevis för revision:** Testprotokoll med Procmon/Wireshark eller `netstat` under en hel arbetsgång, och ett automatiskt test som körs med nätverket avstängt.
- **Ingen telemetri:** Inga externa bibliotek eller teckensnitt från CDN. Allt bäddas in, vilket redan gäller i dagens enfilsbygge.
- **Modellfiler på flera GB:** Leverera dem som separata versionerade paket så att appuppdateringar inte kräver ny modell. Lägg dem i `C:\ProgramData\Lotsa\models` eller på en skrivskyddad nätverksresurs, med en manifestfil med SHA-256 som appen verifierar vid start.

### Gaps
- Tauri:s officiella CSP-dokumentation kunde inte hämtas (v2.tauri.app var blockerad).
- Inget hittades om exakt vilka nätverksanrop WebView2 själv gör.

## 6. Utrullning i företagsmiljö på svenska sjukhus-PC

### Takeaway
Leverera en per-machine-MSI (Tauri:s WiX-bundle) som IT paketerar som Win32-app i Intune eller som SCCM-applikation. Appen ska installeras under Program Files och vara signerad, så att WDAC/AppLocker-regler kan bygga på utgivare eller Intune som "managed installer". Installationer per användare i AppData blockeras ofta av AppLocker/WDAC. Data lagras per användare i `%LOCALAPPDATA%`. Ett gemensamt manualbibliotek för en avdelning läggs som skrivskyddad delad mapp med ett förbyggt index. En liten lokal server är ett senare steg.

### Cited Findings
- **WDAC blockerar som standard:** App Control for Business (WDAC) blockerar alla körbara filer som inte ingår i policyns tillitsområde. — [Microsoft Learn: Intune App Control policy](https://learn.microsoft.com/en-us/intune/intune-service/protect/endpoint-security-app-control-policy)
- **Managed installer:** Intune Management Extension kan sättas som "managed installer" så att appar som Intune distribuerar automatiskt blir betrodda. Spårningen kräver en AppLocker-policy. — [Microsoft Learn: Managed installer](https://learn.microsoft.com/windows/security/threat-protection/windows-defender-application-control/configure-authorized-apps-deployed-with-a-managed-installer)
- **Utan managed installer:** Utan den taggningen blockerar WDAC även appar från Intune. — [Microsoft Learn Q&A/Intune policy](https://learn.microsoft.com/en-us/intune/intune-service/protect/endpoint-security-app-control-policy)
- **AppData-regler:** Regler som nekar allt under `%APPDATA%` träffar alla körbara filer där. — [Tech Community](https://techcommunity.microsoft.com/t5/microsoft-intune/kiosk-xml-whitelist-apps-in-userprofile/m-p/3827126)
- **Exempel på hård blockering:** WDAC som blockerar exe-filer i `%userprofile%\Downloads`. — [MS Q&A](https://learn.microsoft.com/en-us/answers/questions/571119/wdac-blocking-executables-in-userprofiledownloads)

### Inferences
- **Undvik självextraherande filer:** Sidecar-binärer ska ligga signerade bredvid huvudprogrammet i Program Files. Packa aldrig upp exe- eller dll-filer till `%TEMP%` eller AppData vid körning, eftersom det fastnar i WDAC.
- **MSIX** fungerar, men sidecar-processer och stora modellfiler utanför paketet är mer komplicerade. MSI är troligen enklast för regionala IT-avdelningar. **[ej verifierat]**
- **Delat bibliotek:** SQLite på en SMB-resurs med flera skrivande användare är riskabelt på grund av fillåsning. Låt en administratör publicera biblioteket (PDF-filer plus en skrivskyddad indexfil), som klienterna kopierar eller läser skrivskyddat. Personliga anteckningar sparas lokalt.

### Gaps
- Inga källor hittades om MSIX med sidecars, om Tauri-MSI:ns standardläge (per-machine eller per-user) eller om svenska regioners konkreta policyer.

## 7. Kodsignering

### Takeaway
Sedan 1 juni 2023 måste privata nycklar för både OV- och EV-certifikat ligga i HSM eller på token, eller i en molntjänst. EV ger enligt leverantörer inte längre direkt SmartScreen-rykte. Azure Artifact Signing (tidigare Trusted Signing) är tillgängligt för organisationer i EU, alltså även svenska aktiebolag. Det kostar 9,99 USD per månad och är troligen billigast. För Mac krävs medlemskap i Apple Developer Program, ett Developer ID-certifikat och notarisering.

### Cited Findings
- **HSM-krav sedan 2023:** Från 2023-06-01 måste nycklar för kodsigneringscertifikat ligga på hårdvara certifierad enligt FIPS 140-2 nivå 2 eller Common Criteria EAL 4+, eller i en molntjänst som AWS eller Azure. Kravet gäller nya, förnyade och omutfärdade certifikat. — [DigiCert KB](https://knowledge.digicert.com/alerts/code-signing-changes-in-2023); [Entrust](https://www.entrust.com/ro/blog/2022/09/ca-browser-forum-updates-requirements-for-code-signing-certificate-private-keys)
- **EV och SmartScreen:** Enligt SSL.com ger EV inte längre omedelbar passage förbi SmartScreen, sedan mars 2024. Källan är en leverantör och saknar primärkälla från Microsoft. — [SSL.com EV](https://www.ssl.com/products/software-integrity/code-signing/ev/)
- **Artifact Signing, tillgänglighet:** Enligt Microsoft Learn är tjänsten tillgänglig för organisationer i USA, Kanada, EU och Storbritannien. Privatpersoner kan bara använda den i USA och Kanada. — [Microsoft Learn: Code signing options](https://learn.microsoft.com/en-us/windows/apps/package-and-deploy/code-signing-options)
  - Tredjepartskällor från 2026 anger 12 länder. — [itwriting](https://www.itwriting.com/blog/12462-getting-started-with-azure-artifact-signing.html); [note.com](https://note.com/mahamo/n/n0dd9377d1357?hl=en)
  - Ett GitHub-issue tar också upp tillgänglighet utanför USA och Kanada. — [GitHub issue #81](https://github.com/Azure/artifact-signing-action/issues/81)
- **Artifact Signing, pris:** Basic kostar 9,99 USD per månad för 5 000 signaturer. Premium kostar 99,99 USD per månad för 100 000 signaturer. — [GDG Software](https://www.gdgsoft.com/faq/azure-trusted-signing-cost-effective-exe-code-signing); [my-ssl](https://my-ssl.com/learn/azure-trusted-signing-vs-code-signing-certificate)
- **Artifact Signing, krav:** Ett betalt Azure-abonnemang. Identitetsvalidering som tar några arbetsdagar. En användare i Storbritannien behövde ett DUNS-nummer, en webbplats och en adress som matchar bolagsregistret. — [itwriting](https://www.itwriting.com/blog/12462-getting-started-with-azure-artifact-signing.html); [Microsoft Learn](https://learn.microsoft.com/en-us/windows/apps/package-and-deploy/code-signing-options)
- **Mac, krav:** Medlemskap i Apple Developer Program, ett Developer ID-certifikat och notarisering via `xcrun notarytool`. — [Apple: Signing your apps for Gatekeeper](https://developer.apple.com/developer-id)
- **Mac, Sequoia:** I macOS Sequoia går det inte längre att Ctrl-klicka förbi Gatekeeper. — [Apple: Updates to runtime protection in macOS Sequoia](https://developer.apple.com/news/?id=saqachfa)

### Inferences
- **Tidsplan:** Ansök om Artifact Signing som AB i ett tidigt skede.
- **WDAC:** Med signering kan IT skriva publisher-regler i WDAC. Signera även alla sidecar-exe-filer och DLL-filer.
- **Apple-avgift:** Cirka 99 USD per år. **[ej verifierat i denna session]**

### Gaps
- Microsofts primärkälla för SmartScreen och EV hittades inte.
- Det är oklart om listan med 12 länder stämmer.

## 8. Data i vila: kryptering, backup och granskningsloggar

### Takeaway
Läget är dåligt belagt i den här sessionen. Rimlig linje:

- Lita på BitLocker, som regionerna normalt kräver, för disken.
- Kryptera appens databas med SQLCipher eller kryptering på applikationsnivå, med en nyckel skyddad av Windows DPAPI eller macOS Keychain.
- Skriv granskningsloggen som en append-only-fil per användare.
- Exportera backup via en enkel exportfunktion.

Allt detta är dock inferenser.

### Cited Findings
- **Tauri Stronghold:** Pluginet fick en release (2.3.0) i juni 2025 och verkar underhållet. Ingen avvecklingsnotis hittades. — [Tauri stronghold v2.3.0](https://v2.tauri.app/release/stronghold/v2.3.0/)

### Inferences
- **Manualer är inte känsliga:** Manual-PDF:er är inte patientdata. Det största skyddsbehovet gäller frågehistorik som kan innehålla patientuppgifter om användaren skriver sådana. Överväg att inte spara historik som standard.
- **SQLCipher Community Edition** har BSD-liknande licens. **[ej verifierat]**
- **Windows DPAPI** (`CryptProtectData`) knyter nyckeln till användarkontot. Om profilen tas bort går data förlorade, och det är acceptabelt för en lokal cache. **[ej verifierat]**

### Gaps
- Inga källor hämtades om SQLCipher-licensen, DPAPI, krav på BitLocker i svenska regioner eller loggkrav enligt patientdatalagen eller MDR.

## Rekommenderad stack (sammanfattning, inferens)

| Komponent | Rekommendation | Alternativ |
|---|---|---|
| Skal | Tauri 2, per-machine-MSI, WebView2 Evergreen (`offlineInstaller` eller `skip`) | Electron |
| LLM-körning | llama.cpp `llama-server` som sidecar (loopback) | Länkad llama.cpp |
| Tal-till-text | whisper.cpp med KB-Whisper small/base q5_0 (GGML) | faster-whisper |
| PDF | pdf.js (text per sida, rendering) | Docling (MIT) för tabeller |
| OCR | Tesseract (`swe`/`deu`/`eng`) | Windows.Media.Ocr, Apple Vision |
| Index | SQLite med FTS5 och sqlite-vec, RRF | – |
| Embeddings | bge-m3 eller multilingual-e5 (GGUF, llama.cpp) | – |
| Reranker | bge-reranker-v2-m3 (GGUF) | – |
| Nätverksskydd | Strikt CSP, minimala capabilities, brandväggsregel via Intune, offline-testprotokoll | – |
| Signering | Azure Artifact Signing (Windows) | – |
| Signering Mac | Developer ID och notarisering | – |
| Modelleverans | Separata signerade modellpaket med SHA-256-manifest i `ProgramData` eller på filresurs | – |

Undvik PyMuPDF/MuPDF (AGPL) och Marker (GPL) om ingen kommersiell licens köps.
