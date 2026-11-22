# Paketering, signering, utrullning, uppdatering och drift av Lotsa som offline-skrivbordsapp på regionernas hanterade Windows-datorer (läge november 2026)

Metodnot (2026-11-22): WebFetch kunde inte nå `v2.tauri.app`, `learn.microsoft.com` eller `huggingface.co` i den här sessionen. Sidorna hämtades i stället med `curl` via sessionens proxy. Tauri-dokumentationen lästes som källfiler i repot `tauri-apps/tauri-docs` (gren `v2`) på raw.githubusercontent.com. Källfilen anges tillsammans med den publicerade sidans adress. github.com (issues och discussions) gick inte att läsa i fulltext, så påståenden från GitHub-issues bygger på sökresultat och är markerade som sådana. "Inferens" betyder egen slutsats utan direkt källa.

## 1. Val av skal: Tauri 2, Electron eller .NET med WebView2 (sidecars, behörigheter, CSP, installerare, WebView2, Windows 10)

### Takeaway
Tauri 2 är det bästa valet för Lotsa. Det ger en per-machine-MSI (WiX) under Program Files, ett inbyggt sidecar-stöd för `llama-server` och `whisper-server`/`whisper-cli`, en behörighetsmodell där allt är avstängt tills det tillåts, och ett WebView2-läge (`offlineInstaller`) som installerar utan internet. WebView2 och Edge får uppdateringar på Windows 10 22H2 till minst oktober 2028, även utan ESU. Därför fungerar Windows 10 tekniskt under hela den rimliga införandeperioden. Electron är ett fullgott alternativ men kräver att man själv levererar Chromium-uppdateringar. Electron stöder bara de tre senaste stora versionerna, ungefär sex månader per version. Tauri saknar inbyggt stöd för MSIX.

### Cited Findings

**Tauri 2: installerare**
- Tauri bygger antingen `.msi` (WiX Toolset v3) eller `-setup.exe` (NSIS). MSI kan bara byggas på Windows, medan NSIS kan korsbyggas från Linux och macOS. — [Tauri: Windows Installer](https://v2.tauri.app/distribute/windows-installer/) (källa: [tauri-docs windows-installer.mdx](https://raw.githubusercontent.com/tauri-apps/tauri-docs/v2/src/content/docs/distribute/windows-installer.mdx))
- Bygget av MSI kräver att Windows-funktionen VBSCRIPT är aktiverad på byggmaskinen. Saknas den kommer felet "failed to run light.exe". — [tauri-docs windows-installer.mdx](https://raw.githubusercontent.com/tauri-apps/tauri-docs/v2/src/content/docs/distribute/windows-installer.mdx)
- **NSIS installerar som standard bara för den aktuella användaren** (i `%LOCALAPPDATA%`, utan adminrätt). `installMode: "perMachine"` installerar under Program Files och kräver administratör. `both` låter användaren välja. — [tauri-docs windows-installer.mdx](https://raw.githubusercontent.com/tauri-apps/tauri-docs/v2/src/content/docs/distribute/windows-installer.mdx)
- **Tauris WiX-mall för MSI har `InstallScope="perMachine"`** och installerar i `ProgramFiles64Folder`, med `MajorUpgrade` (nedgradering blockeras om den inte uttryckligen tillåts). — [tauri-bundler main.wxs](https://raw.githubusercontent.com/tauri-apps/tauri/dev/crates/tauri-bundler/src/bundle/windows/msi/main.wxs)
- WiX-mallen kan ersättas helt (`bundle.windows.wix.template`) eller byggas ut med WiX-fragment. NSIS har hookarna `NSIS_HOOK_PREINSTALL/POSTINSTALL/PREUNINSTALL/POSTUNINSTALL`. — [tauri-docs windows-installer.mdx](https://raw.githubusercontent.com/tauri-apps/tauri-docs/v2/src/content/docs/distribute/windows-installer.mdx)
- Miljövariabeln `TAURI_BUNDLER_WIX_FIPS_COMPLIANT=true` ger en FIPS-kompatibel MSI. — [tauri-docs windows-installer.mdx](https://raw.githubusercontent.com/tauri-apps/tauri-docs/v2/src/content/docs/distribute/windows-installer.mdx)
- MSI:s `ProductVersion` har formatet `major.minor.build` med maxvärdena 255.255.65535. Windows Installer ignorerar ett fjärde fält. — [Microsoft Learn: ProductVersion property](https://learn.microsoft.com/en-us/windows/win32/msi/productversion)

**Tauri 2: WebView2-lägen**

| Läge | Kräver internet | Tillägg i installeraren |
|---|---|---|
| `downloadBootstrapper` (standard) | Ja | 0 MB |
| `embedBootstrapper` | Ja | ca 1,8 MB |
| `offlineInstaller` | Nej | ca 127 MB, "Recommended for offline environments" |
| `fixedVersion`/`fixedRuntime` | Nej | ca 180 MB |
| `skip` | Nej | 0 MB, "Not recommended" |

  — [tauri-docs windows-installer.mdx](https://raw.githubusercontent.com/tauri-apps/tauri-docs/v2/src/content/docs/distribute/windows-installer.mdx)
- Med `minimumWebview2Version` kan installeraren kräva en lägsta version av WebView2. Enligt Tauri är WebView2 en del av operativsystemet i Windows 10 (från april 2018) och Windows 11. — [tauri-docs windows-installer.mdx](https://raw.githubusercontent.com/tauri-apps/tauri-docs/v2/src/content/docs/distribute/windows-installer.mdx)
- Microsoft skriver att "the vast majority" av Windows 10-enheterna har WebView2 Runtime men att några saknar den. Den fristående Evergreen-installeraren är avsedd för offline-klienter. Körs installeraren med förhöjd behörighet blir installationen per-machine. — [Microsoft Learn: Distribute your app and the WebView2 Runtime](https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/distribution)
- **Windows 10:** "Microsoft Edge and the Microsoft WebView2 Runtime will continue to receive updates on Windows 10 22H2 until at least October 2028 … The ESU program won't be required" för att få dessa uppdateringar. — [Microsoft Learn: Microsoft Edge supported operating systems](https://learn.microsoft.com/en-us/deployedge/microsoft-edge-supported-operating-systems)
- Supporten för Windows 10 upphörde 2025-10-14. ESU för organisationer kostar 61 USD per enhet för år 1, priset fördubblas varje år, och programmet varar högst tre år. — [Microsoft Learn: Extended Security Updates for Windows 10](https://learn.microsoft.com/en-us/windows/whats-new/extended-security-updates)
- Evergreen och Fixed Version har separata uppdateringspolicyer för Edge och WebView2. Att stänga av uppdateringar för Edge påverkar inte WebView2. IT kan styra WebView2 med GPO, bland annat `UpdatesSuppressed` och WSUS eller Configuration Manager. Microsoft rekommenderar Evergreen. — [Microsoft Learn: Enterprise management of WebView2](https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/enterprise); [distribution](https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/distribution)
- WebView2:s användardatamapp (UDF) bör inte ligga på en nätverksenhet ("can result in slowdowns, crashes, or loss of data"). Används standardplatsen bredvid exe-filen under Program Files kan det bli körfel, eftersom installerade appar hamnar i skyddade kataloger. Har appen flera användare bör varje användare ha en egen UDF. — [Microsoft Learn: Manage user data folders](https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/user-data-folder)

**Tauri 2: sidecars, behörigheter och CSP**
- Sidecars konfigureras i `bundle.externalBin`. Filen måste heta `<namn>-<target-triple>` (till exempel `llama-server-x86_64-pc-windows-msvc.exe`) och startas med `app.shell().sidecar("namn")`. För `execute`/`spawn` krävs behörigheter (`shell:allow-execute` med `sidecar: true`) i `src-tauri/capabilities/`. — [Tauri: Embedding External Binaries](https://v2.tauri.app/develop/sidecar/) (källa: [sidecar.mdx](https://raw.githubusercontent.com/tauri-apps/tauri-docs/v2/src/content/docs/develop/sidecar.mdx))
- Capabilities knyts till namngivna fönster och webviews och kan begränsas till plattformar med `platforms`. — [tauri-docs capabilities.mdx](https://raw.githubusercontent.com/tauri-apps/tauri-docs/v2/src/content/docs/security/capabilities.mdx)
- CSP gäller bara om den är satt i Tauri-konfigurationen. Tauri lägger automatiskt till nonces och hashar för paketerade skript och stilar vid kompileringen. Dokumentationen avråder från fjärrinnehåll som CDN. Exemplet använder `connect-src: ipc: http://ipc.localhost`. — [Tauri: CSP](https://v2.tauri.app/security/csp/) (källa: [csp.mdx](https://raw.githubusercontent.com/tauri-apps/tauri-docs/v2/src/content/docs/security/csp.mdx))
- Standardargumenten till WebView2 i Tauri/wry är `--disable-features=msWebOOUI,msPdfOOUI,msSmartScreenProtection`. Den som sätter egna `additionalBrowserArgs` måste själv ta med dem. — [tauri-utils config.rs](https://raw.githubusercontent.com/tauri-apps/tauri/dev/crates/tauri-utils/src/config.rs)
- Kända sidecar-problem enligt sökresultat (GitHub-issues som inte lästes i fulltext): NSIS byter inte ut sidecarn vid ominstallation av samma version (#15134). En äldre MSI-bugg tappade sidecar-exe vid uppgradering (#3868). — [tauri issue #15134](https://github.com/tauri-apps/tauri/issues/15134); [tauri PR/issue #3868](https://www.github.com/tauri-apps/tauri/pull/3868)
- **MSIX:** Tauri saknar inbyggt MSIX-stöd. Feature-requesten #4818 är öppen och enligt en maintainer planeras det "probably in v3". Microsofts verktyg winapp CLI har en guide för att paketera Tauri som MSIX. — [tauri issue #4818 (via sökresultat)](https://github-redirect.dependabot.com/tauri-apps/tauri/issues/4818); [Microsoft Learn: winapp CLI Tauri-guide](https://learn.microsoft.com/en-us/WINDOWS/APPS/dev-tools/winapp-cli/guides/tauri)

**Electron**
- Electron stöder Windows 10 och senare (x64, arm64). — [electron README](https://raw.githubusercontent.com/electron/electron/main/README.md)
- "The latest three stable major versions are supported". En ny stor version kommer var 8:e vecka. Supporten för Electron 22 förlängdes tillfälligt för Windows 7/8. — [Electron Releases/timelines](https://www.electronjs.org/docs/latest/tutorial/electron-timelines)
- Fuses (`runAsNode`, `EnableNodeOptionsEnvironmentVariable`, `EnableNodeCliInspectArguments`, `embeddedAsarIntegrityValidation`, `OnlyLoadAppFromAsar`, `cookieEncryption`) används för att härda binären. — [Electron Fuses](https://www.electronjs.org/docs/latest/tutorial/fuses)
- Electrons stavningskontroll laddar som standard ner Hunspell-ordlistor från ett Google-CDN. Det ändras med `setSpellCheckerDictionaryDownloadURL`. — [Electron SpellChecker](https://www.electronjs.org/docs/latest/tutorial/spellchecker)
- `webkitSpeechRecognition` ger felet "network" i Electron (från tidigare anteckning). — [chromium-dev](https://groups.google.com/a/chromium.org/g/chromium-dev/c/RBZXqc0Zvmc)

### Inferences
- **Rekommendation:** Använd Tauri 2 med target `msi` (per-machine via WiX), `webviewInstallMode: offlineInstaller` i paketet som går till regioner som saknar WebView2, och `skip` plus ett Intune-beroende på "Microsoft Edge WebView2 Runtime" där IT redan sköter WebView2. Använd Evergreen, inte Fixed, så att Microsoft och IT patchar Chromium. Med Fixed Version ligger säkerhetspatchningen hos leverantören, vilket är svårt att försvara i en regional säkerhetsgranskning.
- **NSIS:** Om NSIS används måste det byggas med `installMode: perMachine`. Standardinstallationen per användare i `%LOCALAPPDATA%` blockeras typiskt av AppLocker/App Control (se avsnitt 3).
- **Versionsschema:** Håll semver inom MSI:s gränser (major och minor ≤ 255, patch ≤ 65535). Använd inga förhandsetiketter i det som blir MSI-version.
- **.NET (WPF/WinUI 3 + WebView2):** Det ger samma WebView2-beroende och samma CSP-fråga men tvingar fram en omskrivning av värdlogiken i C#. Fördelarna är inbyggd MSIX, DPAPI direkt i .NET och vana hos regionernas IT. För Lotsa, som redan är ren HTML/JS, väger det inte upp (inferens).
- **Electron:** Ett Electron-paket bundlar Chromium (en installerare på ca 100+ MB), och leverantören måste skicka en ny Electron-version minst var sjätte månad för att ligga inom supportfönstret. Det blir fler IT-paketeringar per år. Fördelen är att samma Chromium-version används överallt, oberoende av regionens WebView2-policy.
- **Svårighet:** Tauri-buggar kring sidecar-ersättning vid uppgradering. **Motåtgärd:** Höj alltid versionsnumret (MajorUpgrade), testa uppgradering från N-1 och N-2 i CI, och verifiera sidecarnas hash vid start.

### Gaps
- Tauris officiella signeringsdokumentation säger inte uttryckligen om `signCommand` även signerar `externalBin`-sidecars. Det måste verifieras genom att kontrollera Authenticode-signaturen på `llama-server*.exe` efter `tauri build`.
- MSIX med sidecars och stora modellfiler utanför paketet testades inte i någon källa.
- Den exakta storleken på Electron-installeraren hämtades inte från någon primärkälla.

## 2. Att bevisa "inget internet": blockera utgående trafik, 127.0.0.1, telemetri och dokumentation för säkerhetsgranskning

### Takeaway
Det går att bevisa på flera nivåer, inte med en enda inställning. Den första nivån är appens egen kod: CSP med `connect-src` bara mot IPC och 127.0.0.1, inga HTTP-plugins i Tauri, `llama-server` och `whisper-server` bundna till 127.0.0.1 med API-nyckel och webbgränssnittet avstängt. Den andra nivån är WebView2, som skickar egna diagnostikdata och kraschrapporter till Microsoft enligt Windows diagnostikinställning. Det styr IT med Windows- och Edge-policyer. SmartScreen i WebView2 stänger Tauri redan av. Den tredje nivån, som ger det tekniska beviset, är Windows Defender-brandväggsregler från Intune som blockerar utgående trafik för appens binärer.

### Cited Findings
- WebView2 samlar in diagnostikdata via Chromium/Edge-telemetri, Windows datarapportering och Watson (kraschdumpar). Insamlingen styrs av Windows inställning för diagnostikdata (Settings > Privacy & security > Diagnostics & feedback). "Required data" samlas in oavsett inställning. — [Microsoft Learn: Data and privacy in WebView2](https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/data-privacy)
- SmartScreen i WebView2 styrs av `IsReputationCheckingRequired`. Den som inte stänger av SmartScreen måste informera användarna om att data skickas till Microsoft. "Generally, all other services in edge://settings/privacy are turned off, for WebView2." — [Microsoft Learn: Data and privacy in WebView2](https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/data-privacy)
- Kraschdumpar från WebView2 skickas till Microsoft. Med `IsCustomCrashReportingEnabled = true` skickas inget till Microsoft, och dumparna finns i `CrashDumpFolderPath`. — [Microsoft Learn: Data and privacy in WebView2](https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/data-privacy)
- Tauri/wry stänger som standard av `msSmartScreenProtection` i WebView2. — [tauri-utils config.rs](https://raw.githubusercontent.com/tauri-apps/tauri/dev/crates/tauri-utils/src/config.rs)
- WebView2 Runtime uppdateras via samma mekanism som Edge (EdgeUpdate). IT kan styra det med Edge-uppdateringspolicyer eller stänga av det med `UpdatesSuppressed`. — [Microsoft Learn: Enterprise management of WebView2](https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/enterprise)
- **llama-server:** `--host` har standardvärdet `127.0.0.1`. Det finns `--api-key`/`--api-key-file`. Det inbyggda webbgränssnittet (Llama Chat) är **aktiverat som standard** och stängs av med `--no-webui`. Det finns en experimentell `--ui-mcp-proxy` "for Llama Chat to reach public MCP servers". README anger `--port` med standardvärdet 9931. — [llama.cpp tools/server/README.md](https://raw.githubusercontent.com/ggml-org/llama.cpp/master/tools/server/README.md)
- **whisper.cpp server:** `--host` har standardvärdet `127.0.0.1` och `--port` 8080. — [whisper.cpp examples/server/README.md](https://raw.githubusercontent.com/ggml-org/whisper.cpp/master/examples/server/README.md)
- Tauri-CSP: allt som inte tillåts i CSP blockeras. Fjärrinnehåll avråds. — [tauri-docs csp.mdx](https://raw.githubusercontent.com/tauri-apps/tauri-docs/v2/src/content/docs/security/csp.mdx)
- Electron: stavningskontrollens nedladdningar från Google-CDN måste pekas om eller stängas av. — [Electron SpellChecker](https://www.electronjs.org/docs/latest/tutorial/spellchecker)
- Intune har en profil för brandväggsregler under Endpoint security (Microsoft Defender Firewall rules). — [Microsoft Learn: Intune endpoint security firewall policy](https://learn.microsoft.com/en-us/intune/intune-service/protect/endpoint-security-firewall-policy) **[sidan hämtades inte i fulltext. Adressen är härledd från sökresultat och Intunes dokumentationsstruktur]**

### Inferences
- **Konkret design:**
  1. CSP i `tauri.conf.json`: `default-src 'self'; connect-src ipc: http://ipc.localhost http://127.0.0.1:<port-llm> http://127.0.0.1:<port-stt>; img-src 'self' blob: data:; worker-src 'self' blob:` (för pdf.js-workern). Inget `https:` någonstans. Lägg till `'wasm-unsafe-eval'` om WASM används.
  2. Ta inte med `tauri-plugin-http`, `shell:allow-open` mot URL:er eller updater-pluginet i offlinebygget.
  3. Starta `llama-server` med `--host 127.0.0.1 --port <slumpad ledig port> --api-key-file <per-session-fil> --no-webui` och slå inte på MCP-proxyn. Starta whisper på samma sätt.
  4. Sätt `IsCustomCrashReportingEnabled` via wry/WebView2-miljön och be IT sätta diagnostikdata till "Required" eller lägre via policy.
  5. Distribuera via Intune en brandväggsregel som blockerar utgående trafik för `Lotsa.exe`, `llama-server.exe` och `whisper-server.exe` till allt utom loopback. Det är det tekniska bevis som IT kan verifiera själv. Obs: WebView2-processerna (`msedgewebview2.exe`) körs från WebView2 Runtime-katalogen och är delade med andra appar. Att blockera dem påverkar Teams och liknande. Dokumentera därför att WebView2:s egen trafik styrs av Microsoft-policyer, inte av Lotsa.
- **Dokument för IT-säkerhetsgranskningen:** Ta fram en "Nätverksbeteende"-bilaga som listar alla processer, portar (endast loopback), vad som aldrig görs, och vad WebView2 och Windows gör som Lotsa inte styr (diagnostikdata, EdgeUpdate). Bifoga ett testprotokoll: kör appen i en VM med Wireshark eller Sysmon (händelse 3, NetworkConnect) och visa att ingen trafik lämnar loopback från Lotsas processer.
- **Svårighet:** Lokala portar på 127.0.0.1 nås av alla processer och användare på samma dator. Det är särskilt kritiskt på delade terminalservrar (Citrix multi-session), där en annan användare kan anropa en annans llama-server. **Motåtgärd:** API-nyckel per session (slumpad vid start och skickad till frontend via IPC), slumpad port, en llama-server per användarsession, eller named pipes/Unix-socket om llama-server stöder `.sock` på Windows (README nämner sökvägar som slutar på `.sock`; stöd på Windows är inte verifierat).

### Gaps
- Ingen Microsoft-källa hittades som listar exakt vilka värdnamn WebView2 Runtime kontaktar (telemetri, komponentuppdateringar).
- Det är inte verifierat om Tauri/wry exponerar `IsCustomCrashReportingEnabled` och `IsReputationCheckingRequired` via konfigurationen eller om det kräver egen Rust-kod mot `webview2-com`.
- Det är inte verifierat om llama-server stöder Unix-socket (AF_UNIX) på Windows.

## 3. Utrullning i företagsmiljö: Intune, Configuration Manager, App Control/AppLocker, modellfiler, VDI och delat manualbibliotek

### Takeaway
Leverera en signerad per-machine-MSI som IT paketerar som Win32-app i Intune (`.intunewin`) eller som Configuration Manager-applikation. Leverera modellerna som ett separat Win32-paket som lägger GGUF-filer med SHA-256-manifest i `C:\ProgramData\Lotsa\models`. App Control:s managed installer litar på filer som Intune eller ConfigMgr skriver, men **inte på appar som uppdaterar sig själva**. Därför måste updatern vara avstängd och allt gå via IT. Det delade manualbiblioteket bör vara ett förbyggt, skrivskyddat index (SQLite med `immutable=1`) på en filresurs eller lokalt kopierat. Det får inte vara en skrivbar SQLite-databas på SMB, eftersom SQLite varnar för korruption och WAL inte fungerar över nätverk.

### Cited Findings

**Intune och Configuration Manager**
- En Win32-app i Intune får vara högst 30 GB. Intune stöder detektionsregler, beroenden, krav (fil, register, script), supersedence och installation i System- eller User-kontext. — [Microsoft Learn: Win32 app management](https://learn.microsoft.com/en-us/intune/intune-service/apps/apps-win32-app-management); [Add a Win32 app](https://learn.microsoft.com/en-us/intune/intune-service/apps/apps-win32-add)
- Win32-innehåll kan hämtas via Delivery Optimization (peer-to-peer, påslaget som standard) och cachas i Microsoft Connected Cache på ConfigMgr-distributionspunkter. — [Microsoft Learn: Win32 app management](https://learn.microsoft.com/en-us/intune/intune-service/apps/apps-win32-app-management)
- Standardtiden för installation är 60 minuter. Överskrids den markeras installationen som misslyckad. — [Microsoft Learn: Add a Win32 app](https://learn.microsoft.com/en-us/intune/intune-service/apps/apps-win32-add)
- Intune rekommenderar Win32 (Intune Management Extension) även för `.msi`. Windows Autopilot stöder inte att Win32- och LOB-appar blandas, men Autopilot device preparation gör det. — [Microsoft Learn: Add Windows LOB app](https://learn.microsoft.com/en-us/intune/intune-service/apps/lob-apps-windows)

**App Control for Business (WDAC) och AppLocker**
- Managed installer använder en särskild regelsamling i AppLocker. Filer som en betrodd installerare (Intune Management Extension eller ConfigMgr) och dess barnprocesser skriver märks med ett extended attribute ("origin claim"). — [Microsoft Learn: Allow apps deployed with a managed installer](https://learn.microsoft.com/en-us/windows/security/application-security/application-control/app-control-for-business/design/configure-authorized-apps-deployed-with-a-managed-installer)
- **"App Control, based on managed installer, doesn't support applications that self-update."** Filer som skapas efter att installerarprocessen avslutats ärver inte förtroendet. — [samma](https://learn.microsoft.com/en-us/windows/security/application-security/application-control/app-control-for-business/design/configure-authorized-apps-deployed-with-a-managed-installer)
- Origin claims från managed installer och ISG gäller bara på OS-volymen, inte på andra volymer. — [samma](https://learn.microsoft.com/en-us/windows/security/application-security/application-control/app-control-for-business/design/configure-authorized-apps-deployed-with-a-managed-installer)
- Microsoft rekommenderar att först köra i audit-läge och granska händelse 3076 (`AppControlCodeIntegrityPolicyAudited`). — [samma](https://learn.microsoft.com/en-us/windows/security/application-security/application-control/app-control-for-business/design/configure-authorized-apps-deployed-with-a-managed-installer)
- AppLockers standardregler (path-regler för Windows och Program Files, allt för administratörer) är tänkta som en startpolicy. — [Microsoft Learn: Understanding AppLocker default rules](https://learn.microsoft.com/en-us/windows/security/application-security/application-control/app-control-for-business/applocker/understanding-applocker-default-rules)
- Artifact Signing-certifikat förnyas dagligen och gäller i 72 timmar. Att knyta förtroende till ett enskilt certifikats thumbprint håller därför inte. Använd i stället den profilspecifika EKU:n i WDAC-policyn. Alla Public Trust-certifikat har dessutom EKU:n `1.3.6.1.4.1.311.97.1.0`. — [Microsoft Learn: Artifact Signing certificate management](https://learn.microsoft.com/en-us/azure/artifact-signing/concept-certificate-management)

**SQLite på nätverksresurser**
- Synkning och låsning i nätverksfilsystem har orsakat korruption i SQLite ("The bottom line is that network filesystem sync and locking reliability…"). — [SQLite: SQLite Over a Network](https://www.sqlite.org/useovernet.html)
- "All processes using a database must be on the same host computer; WAL does not work over a network filesystem." — [SQLite: Write-Ahead Logging](https://www.sqlite.org/wal.html)
- URI-parametern `immutable=1` gör att SQLite öppnar filen skrivskyddat och hoppar över all låsning och ändringsdetektering. Den är avsedd för skrivskyddade medier. `mode=ro` ger ett vanligt skrivskyddat läge. — [SQLite: URI filenames](https://www.sqlite.org/uri.html)

**VDI/Citrix och delade arbetsstationer**
- I multi-session kan FSLogix Profile Containers bara skriva tillbaka från en session åt gången. Övriga sessioner är skrivskyddade och deras ändringar kastas. — sökresultat som citerar [Citrix blog: multi-session write-back with WEM](https://www.citrix.com/blogs/2020/05/19/get-multi-session-write-back-support-with-citrix-wem/) och [Microsoft Learn: FSLogix known issues](https://learn.microsoft.com/fslogix/troubleshooting-known-issues)
- Kända problem med WebView2-appar (nya Teams) på AVD/Citrix multi-session är vit skärm och låsta `local_<user>`-mappar. Källorna är forum. — [Microsoft Q&A: Teams white screen AVD multisession](https://learn.microsoft.com/en-us/answers/questions/1274356/teams-white-screen-and-crashing-on-win11-avd-multi)
- WebView2:s UDF ska inte ligga på en nätverksenhet. Varje användare bör ha en egen UDF. — [Microsoft Learn: user data folder](https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/user-data-folder)

### Inferences
- **Paketstruktur (förslag):**
  - `Lotsa-App-x.y.z.msi`: ca 20–150 MB beroende på WebView2-läge. Innehåller Tauri-exe, sidecars (`llama-server`, `whisper-server`) och små standardmodeller (KB-Whisper base q5_0, ca 55 MB). Detektionsregel: MSI ProductCode eller version.
  - `Lotsa-Modell-<namn>-<ver>`: ett separat Win32-paket (zip/7z plus PowerShell-script eller en egen MSI) som installeras i System-kontext till `C:\ProgramData\Lotsa\models\<namn>\<ver>\` med `manifest.json` (SHA-256, storlek, licens) och en signatur. Detektionsregel: fil plus version i registret, `HKLM\SOFTWARE\Lotsa\Models\<namn>`. Appen ska vägra ladda en modell vars hash inte stämmer.
  - Modellfiler är data, inte körbar kod. App Control och AppLocker påverkar dem inte. Däremot måste ACL:en på `ProgramData\Lotsa\models` vara skrivskyddad för användare, så att ingen kan byta ut GGUF-filen (integritet). Skapa ACL:en i installationsscriptet.
- **App Control:** Be IT antingen förlita sig på managed installer (Intune/ConfigMgr) eller lägga in en publisher- eller EKU-regel för Lotsas signeringsprofil. EKU-regeln är robustare, eftersom den även täcker filer som installeras manuellt av administratörer. Leverera en färdig policyfil (XML) och AppLocker-XML för Lotsa som IT kan granska. Sidecars i Program Files måste vara signerade med samma identitet.
- **Svårighet:** En stor modell (2–6 GB) i Win32-paketet tar tid över VPN och kan överskrida 60 minuters timeout. **Motåtgärd:** Höj installationstiden i Intune, använd Delivery Optimization/Connected Cache, och ha modellen som ett eget paket med beroende, så att appuppdateringar inte drar om modellen.
- **Svårighet:** VDI/Citrix multi-session. RAM per session (en LLM på 4–6 GB per användare) gör att en multi-session-värd snabbt tar slut på minne. **Motåtgärd:** Ett läge där llama-server körs som en delad Windows-tjänst per värd, med köhantering och autentisering. Det är i praktiken en "liten lokal server". Alternativt: rekommendera fat client eller ett on-prem-läge i VDI. UDF och användardata ska ligga lokalt i `%LOCALAPPDATA%` och undantas från FSLogix-roaming (cachar). Endast användarens inställningar och historik får roama. Inferens från FSLogix- och WebView2-källorna ovan.
- **Delade, roterande arbetsstationer:** Data ska vara per användare (`%LOCALAPPDATA%\Lotsa`) och modeller per maskin (`ProgramData`). Erbjud en policy för "ingen lokal historik" eller en kort lagringstid (se avsnitt 7).
- **Delat manualbibliotek, jämförelse:**

| Alternativ | Fördelar | Nackdelar |
|---|---|---|
| Skrivskyddad filresurs (SMB) med förbyggt index (SQLite med `immutable=1`, plus vektorfil) som publiceras av en "bibliotekarie" | Ingen server, IT känner igen modellen, enkelt att granska | Index och embeddings måste byggas centralt med samma embeddingmodell och version som klienterna. Långsamt över WAN. Byt aldrig fil på plats: publicera en ny versionsmapp och växla en pekarfil, eftersom `immutable` förutsätter att filen inte ändras. Hantera offline-läge med lokal cache |
| Kopiera indexet lokalt (synk från resurs till `ProgramData` via Intune-paket eller schemalagd uppgift) | Snabbt, fungerar offline, ingen SQLite-över-SMB-risk | Fördröjning innan nya manualer syns. Diskutrymme |
| Liten on-prem-server (REST plus SQLite eller Postgres lokalt på servern) | Ett ställe för uppdatering, behörighetsstyrning, loggning | Kräver servertjänst, certifikat, drift och avtal. Bryter "allt lokalt"-löftet och blir en egen säkerhetsgranskning |

  Rekommendation: bygg indexet centralt, distribuera versionerade, skrivskyddade kopior och läs dem lokalt med `immutable=1` (inferens från SQLite-dokumentationen).

### Gaps
- Inga primärkällor hittades om vilka regioner som kör WDAC och vilka som kör AppLocker, eller om deras krav på signering.
- Det saknas officiell Citrix- eller Microsoft-guidning specifikt för WebView2-appar på multi-session.
- Sidan om brandväggsregler i Intune kunde inte läsas i fulltext.

## 4. Offline-uppdateringar: app och modeller utan internet

### Takeaway
Tauris updater-plugin kräver HTTP(S)-endpoints. Det verifierar signaturer, som inte kan stängas av, och på Windows kör det MSI- eller NSIS-installeraren. Det går att peka mot en intern HTTPS-server, men det krockar med managed installer i App Control ("doesn't support applications that self-update") och med att användarna saknar adminrätt för per-machine-MSI. Rekommendationen är att stänga av updatern helt i regionbygget och låta IT distribuera nya MSI-versioner via Intune (supersedence) eller ConfigMgr. Modeller och manualbibliotek uppdateras som egna signerade paket med manifest.

### Cited Findings
- Updatern i Tauri: "Tauri's updater needs a signature to verify that the update is from a trusted source. This cannot be disabled." Signeringen sker med en nyckel som genereras av `tauri signer generate` (miljövariabeln `TAURI_SIGNING_PRIVATE_KEY`). — [Tauri: Updater](https://v2.tauri.app/plugin/updater/) (källa: [updater.mdx](https://raw.githubusercontent.com/tauri-apps/tauri-docs/v2/src/content/docs/plugin/updater.mdx))
- `endpoints` ska vara en lista med URL:er. "TLS is enforced in production mode". `dangerousInsecureTransportProtocol` tillåter http. Både en dynamisk server och en statisk JSON fungerar. `version` i JSON måste vara giltig SemVer. — [updater.mdx](https://raw.githubusercontent.com/tauri-apps/tauri-docs/v2/src/content/docs/plugin/updater.mdx)
- `installMode` på Windows: `passive` (standard), `basicUi` och `quiet`. Med `quiet` "the installer cannot request admin privileges by itself so it only works in user-wide installations or when your app itself already runs with admin privileges". — [updater.mdx](https://raw.githubusercontent.com/tauri-apps/tauri-docs/v2/src/content/docs/plugin/updater.mdx)
- I updaterns källkod hämtas endpoints med reqwest `ClientBuilder` (med stöd för proxy) och MSI installeras via `msiexec.exe`. — [tauri-plugin-updater 2.10.1 updater.rs](https://docs.rs/crate/tauri-plugin-updater/2.10.1/source/src/updater.rs)
- Managed installer stöder inte appar som uppdaterar sig själva. — [Microsoft Learn: managed installer](https://learn.microsoft.com/en-us/windows/security/application-security/application-control/app-control-for-business/design/configure-authorized-apps-deployed-with-a-managed-installer)
- Intune Win32 stöder supersedence (en ny version ersätter den gamla) och beroenden. — [Microsoft Learn: Win32 app management](https://learn.microsoft.com/en-us/intune/intune-service/apps/apps-win32-app-management)

### Inferences
- **Regionbygget:** Ta inte med `tauri-plugin-updater` (eller stäng av det med en feature flag), så att appen inte kan göra nätverksanrop för uppdateringar.
- **Leveransflöde:** Leverantören publicerar per release ett "release bundle" (zip) till regionens IT via portal eller SFTP enligt avtal, eller på fysiskt medium. Paketet innehåller:
  - signerad MSI
  - `.intunewin` (valfritt)
  - SBOM (CycloneDX)
  - releasenoter på svenska
  - `SHA256SUMS` plus en fristående signatur (minisign, eller Authenticode-signerad katalogfil)
  - testprotokoll
  - en ändringslista för nätverksbeteendet

  IT laddar upp till Intune som en ny Win32-app med supersedence.
- **Modell- och biblioteksuppdateringar:** Ett separat versionerat paket. Appen läser `manifest.json`, verifierar SHA-256 och signaturen (minisign- eller ed25519-nyckel inbyggd i appen) och väljer högsta giltiga version. Gamla versioner tas bort av paketets avinstallation. Det gör att man kan rulla tillbaka genom att avinstallera den nya versionen.
- **Versionering:** `MAJOR.MINOR.PATCH` inom MSI:s gränser. Modeller får egna versioner, kopplade till en kompatibilitetsmatris (`app >= x` kräver `model-format >= y`). Embeddingmodellen och indexet måste ha samma version (`embedding_model_id` i indexets metadata). Appen vägrar använda ett index som byggts med en annan embeddingmodell.
- **Om en region ändå vill ha självuppdatering:** Det kräver en intern HTTPS-server, en per-user-installation (som App Control och AppLocker troligen blockerar) eller att appen körs med adminrätt (oacceptabelt). Avråd från det.

### Gaps
- Det är inte verifierat om updatern accepterar `file://`-URL:er. Källkoden tyder på HTTP via reqwest. En GitHub-diskussion (#9097) om lokal testning kunde inte läsas.

## 5. Kodsignering: Authenticode efter HSM-kravet, Azure Artifact Signing, OV/EV och SmartScreen, Apple

### Takeaway
Azure Artifact Signing (tidigare Trusted Signing, nu GA) går att använda för organisationer i EU, alltså även svenska aktiebolag. Priset börjar på 9,99 USD per månad. Identitetsvalideringen tar 1–30 arbetsdagar, och tjänsten utfärdar inte EV-certifikat. Certifikaten gäller i 72 timmar och förnyas dagligen, så tidsstämpling och EKU-baserade WDAC-regler är ett måste. EV ger inte längre någon fördel i SmartScreen. I hanterade regionmiljöer, där IT distribuerar via Intune, spelar SmartScreen dessutom liten roll. Det viktiga där är App Control/AppLocker och en konsekvent signeringsidentitet.

### Cited Findings
- Public Trust-certifikat i Artifact Signing finns för organisationer i USA, Kanada, **EU**, Storbritannien, Australien, Nya Zeeland, Japan, Sydkorea, Singapore, Schweiz, Norge och Israel. Privatpersoner måste finnas i USA eller Kanada. — [Microsoft Learn: Artifact Signing quickstart](https://learn.microsoft.com/en-us/azure/artifact-signing/quickstart)
  - Microsofts sida om signeringsalternativ nämner fortfarande bara "USA, Canada, EU, UK" för organisationer. Källorna skiljer sig åt, men EU ingår i båda. — [Microsoft Learn: Code signing options](https://learn.microsoft.com/en-us/windows/apps/package-and-deploy/code-signing-options)
- Identitetsvalidering för organisationer kräver:
  - en juridisk enhet
  - en webbplats
  - en bevakad e-postadress för en person, på en domän som ägs av företaget (länken gäller i sju dagar)
  - ett företagsidentifierare (organisationsnummer)
  - en företagsadress

  Processen tar "from 1 to 30 business days". — [Microsoft Learn: Artifact Signing quickstart](https://learn.microsoft.com/en-us/azure/artifact-signing/quickstart)
- Artifact Signing utfärdar inte EV-certifikat och planerar inte att göra det. Tjänsten uppfyller FIPS 140-3 Level 3. Egna CN och O stöds inte. — [Microsoft Learn: Artifact Signing FAQ](https://learn.microsoft.com/en-us/azure/artifact-signing/faq)
- Certifikaten "are renewed daily and are valid for only 72 hours". EKU:n är profilspecifik och kan användas i WDAC. — [Microsoft Learn: Artifact Signing certificate management](https://learn.microsoft.com/en-us/azure/artifact-signing/concept-certificate-management)
- Tidsstämpeltjänsten finns på `http://timestamp.acs.microsoft.com`. — [Microsoft Learn: Artifact Signing FAQ](https://learn.microsoft.com/en-us/azure/artifact-signing/faq)
- Pris: Artifact Signing "~$9.99/month" eller "Starts at $9.99/month". OV-certifikat kostar 150–300 USD per år och EV 400+ USD per år. — [Microsoft Learn: Code signing options](https://learn.microsoft.com/en-us/windows/apps/package-and-deploy/code-signing-options); [SmartScreen reputation](https://learn.microsoft.com/en-us/windows/apps/package-and-deploy/smartscreen-reputation)
  - Basic ger 5 000 signaturer per månad och Premium kostar 99,99 USD per månad för 100 000 signaturer, enligt tredjepartskällor från tidigare anteckning. Azure-prissidan renderas med JavaScript och kunde inte läsas. — [GDG Software](https://www.gdgsoft.com/faq/azure-trusted-signing-cost-effective-exe-code-signing)
- **SmartScreen:** "EV certificates no longer bypass SmartScreen … they no longer impact SmartScreen behavior." Ryktet byggs per filhash och per utgivare, och det kan ta "several weeks and hundreds of clean installs". Företag kan distribuera från betrodda intranätplatser som inte granskas av SmartScreen. Smart App Control på Windows 11 blockerar osignerade filer. — [Microsoft Learn: SmartScreen reputation for Windows app developers](https://learn.microsoft.com/en-us/windows/apps/package-and-deploy/smartscreen-reputation)
  - Electrons dokumentation påstår att Artifact Signing "gets rid of SmartScreen warnings". **Det motsägs** av Microsofts egen sida ovan. — [Electron: Code Signing](https://www.electronjs.org/docs/latest/tutorial/code-signing)
- Tauri: OV-guiden gäller bara certifikat från före 2023-06-01. För nyare certifikat hänvisar Tauri till `signCommand` med valfritt verktyg (relic för Azure Key Vault är dokumenterat). Sedan 2024 ger EV inget omedelbart SmartScreen-rykte. Smart App Control blockerar okända osignerade appar. — [Tauri: Windows Code Signing](https://v2.tauri.app/distribute/sign/windows/) (källa: [Sign/windows.mdx](https://raw.githubusercontent.com/tauri-apps/tauri-docs/v2/src/content/docs/distribute/Sign/windows.mdx))
- HSM-kravet: sedan 2023-06-01 måste nycklar för OV- och EV-kodsignering ligga i FIPS 140-2 nivå 2 eller CC EAL4+-hårdvara eller i en molntjänst (från tidigare anteckning). — [DigiCert KB](https://knowledge.digicert.com/alerts/code-signing-changes-in-2023)
- **Apple:** Developer ID-certifikatet kräver Account Holder-rollen i Apple Developer Program. Hardened runtime och entitlements krävs. Notarisering görs med `xcrun notarytool`, och `xcrun stapler` häftar biljetten. altool och Xcode 13 och äldre accepteras inte sedan 2023-11-01. — [Apple: Developer ID](https://developer.apple.com/developer-id/)

### Inferences
- **Rekommendation:** Ansök om Artifact Signing (Public Trust, organisation) direkt när AB:t har webbplats, domän-e-post och uppdaterade uppgifter hos Bolagsverket. Räkna med upp till sex veckor. Signera alla exe och dll (inklusive sidecars) och MSI:n i CI via `signCommand`, med tidsstämpel (`/tr http://timestamp.acs.microsoft.com /td sha256`).
- **WDAC/AppLocker:** Ge IT profil-EKU:n och utgivarnamnet. Byt inte certifikatprofil i onödan, eftersom en ny profil ger en ny EKU och policyn måste uppdateras.
- **Reservalternativ:** Ett OV-certifikat från en CA (DigiCert, Sectigo, GlobalSign) med molnbaserad HSM, om valideringen hos Artifact Signing drar ut på tiden eller misslyckas.
- **Svårighet:** Ett 72-timmarscertifikat utan tidsstämpel blir ogiltigt efter tre dagar. **Motåtgärd:** CI-steget ska misslyckas om tidsstämpel saknas (`signtool verify /pa /v` och en kontroll av countersignature).
- **Tillverkarens egen integritet:** Signera även modellmanifest och indexpaket med en egen ed25519-nyckel. Authenticode täcker inte GGUF-filer.

### Gaps
- Aktuella Basic- och Premium-priser i SEK eller EUR kunde inte läsas från Azure-prissidan (JS-renderad) eller från retail price-API:et (inga träffar på tjänstenamnet).
- Det är inte verifierat om identitetsvalideringen kräver någon minsta företagshistorik.

## 6. Offline svensk diktering: whisper.cpp med KB-Whisper, Web Speech API offline och Windows inbyggda alternativ

### Takeaway
KB-Whisper (KBLab, Apache-2.0) via whisper.cpp (MIT) är det enda realistiska alternativet för offline-diktering på svenska idag. Web Speech API fungerar inte offline på svenska i WebView2 eller Electron. Edges lokala modell (Canary/Dev 150+) stöder bara en, de, it, pt, es och ko. Windows nya on-device-API för taligenkänning är experimentellt och kräver Windows 11 24H2. Välj KB-Whisper small q5_0 (175 MB, WER 6,4–7,3) som standard och base q5_0 (55 MB) för svaga datorer.

### Cited Findings
- KB-Whisper har tränats på över 50 000 timmar svenskt tal, och den bästa modellen sänker WER med i genomsnitt 47 % jämfört med whisper-large-v3. kb-whisper-small slår openai/whisper-large-v3. — [Hugging Face: KBLab/kb-whisper-small](https://huggingface.co/KBLab/kb-whisper-small)
- **WER (FLEURS / CommonVoice / NST):** — [KBLab/kb-whisper-small model card](https://huggingface.co/KBLab/kb-whisper-small)

| Storlek | KBLab | OpenAI |
|---|---|---|
| tiny | 13,2 / 12,9 / 11,2 | 59,2 / 67,8 / 85,2 |
| base | 9,1 / 8,7 / 7,8 | 39,6 / 52,1 / 53,4 |
| small | 7,3 / 6,4 / 6,6 | 20,6 / 26,4 / 26,4 |
| medium | 6,6 / 5,4 / 5,8 | 12,1 / 15,8 / 17,1 |
| large-v3 | 5,4 / 4,1 / 5,2 | 7,8 / 9,5 / 11,3 |

- **Licens:** `apache-2.0` för tiny, base, small, medium och large (kontrollerat via HF API 2026-11-22). — [HF API kb-whisper-small](https://huggingface.co/api/models/KBLab/kb-whisper-small); [kb-whisper-large](https://huggingface.co/api/models/KBLab/kb-whisper-large)
- **GGML-filer (storlek i byte enligt HF API):**

| Modell | q5_0 | Okvantiserad |
|---|---|---|
| tiny | 29,9 MB | 77,7 MB |
| base | 55,3 MB | 148 MB |
| small | 175 MB | 488 MB |
| medium | 539 MB | 1,53 GB |
| large | 1,08 GB | 3,10 GB |

  — [HF API (tiny/base/small/medium/large)](https://huggingface.co/api/models/KBLab/kb-whisper-small)
- Modellerna finns i formaten HF, GGML (whisper.cpp), ONNX och CTranslate2. Sedan 2025-05-13 är "Stage 2" standard, med varianterna "subtitle" (mer komprimerad) och "strict" (mer ordagrann). Exempel: `whisper-cli -m ggml-model-q5_0.bin audio.wav`. — [KBLab/kb-whisper-small](https://huggingface.co/KBLab/kb-whisper-small)
- whisper.cpp har MIT-licens ("Copyright (c) 2023-2026 The ggml authors"). — [whisper.cpp LICENSE](https://raw.githubusercontent.com/ggml-org/whisper.cpp/master/LICENSE)
- **Prestanda:** whisper.cpp:s bench-README visar `small.en` med 4 trådar och ca 1 062 ms encode-tid (CPU anges inte). Gemenskapens bench-tabell innehåller främst Apple Silicon- och GPU-mätningar, till exempel M1 Pro Metal small encoder 135–200 ms. Inga x86-CPU-värden för small hittades. — [Debian sources whisper.cpp bench README](https://sources.debian.org/src/whisper.cpp/1.8.3%2Bdfsg-2/examples/bench/README.md); [bench-all-gg.txt](https://huggingface.co/datasets/echodict/whisper.cpp/raw/main/scripts/bench-all-gg.txt)
- **Web Speech API:** MDN dokumenterar `SpeechRecognition.processLocally` (standard false). — [MDN: processLocally](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition/processLocally)
  - Chrome har haft on-device-stöd sedan Chrome 139. Språkpaketen är ca 60 MB vardera. En "Intent to Ship" för kvalitetsnivåer (command, dictation, conversation) kom i maj 2026. Källorna är forum- och sökresultat. — [blink-dev: Intent to Ship On-Device Recognition Quality](https://groups.google.com/a/chromium.org/g/blink-dev/c/P8P-x7AnC6I); [chrome-ai-dev-preview-discuss](https://groups.google.com/a/chromium.org/g/chrome-ai-dev-preview-discuss/c/Rlyc2uAsFCY)
  - **Edge:** den lokala modellen finns bara i Canary/Dev (150.0.4076+) bakom flaggan "Speech Recognition with on-device model". Den kräver en första nedladdning av modellen via `install()`. Språk som stöds: en-US, de-DE, it-IT, pt-PT, es-ES och ko-KR. **Svenska saknas.** Sidan uppdaterades 2026-06-02. — [Microsoft Learn: SpeechRecognition API in Microsoft Edge](https://learn.microsoft.com/en-us/microsoft-edge/web-platform/speech-recognition-api)
  - Electron ger felet "network" för `webkitSpeechRecognition`. — [chromium-dev](https://groups.google.com/a/chromium.org/g/chromium-dev/c/RBZXqc0Zvmc)
- **Windows inbyggda alternativ:** Windows AI Speech Recognition (`SpeechRecognitionModel`) "is currently experimental and not supported for use in production". Det kräver Windows 11 24H2 och Windows App SDK 2.2.2-experimental9. På datorer utan NPU laddas modellen ner via Windows Update vid första anrop. — [Microsoft Learn: Windows AI speech recognition](https://learn.microsoft.com/en-us/windows/ai/apis/speech-recognition)
  - Det äldre `Windows.Media.SpeechRecognition` beror på installerade språk (`SupportedTopicLanguages`). Det är inte bekräftat att svensk diktering fungerar offline. — [Microsoft Learn: Specify the speech recognizer language](https://learn.microsoft.com/en-us/windows/apps/design/input/specify-the-speech-recognizer-language)

### Inferences
- **Paketering:** Lägg `whisper-server` som sidecar och KB-Whisper base q5_0 i app-MSI:n. Small och medium kan läggas i ett separat modellpaket. Medium (539 MB q5_0) ger bättre WER men är troligen för långsam för interaktiv diktering på kontorsdatorer utan GPU. Det måste mätas på regionernas referensdatorer (till exempel en i5 av 12:e generationen med 8–16 GB RAM).
- **Mätning:** Kör `whisper-bench` och verkliga ljudklipp på 30 s och redovisa RTF per modell och dator i en bilaga. Ingen x86-källa fanns.
- **Svårighet:** Mikrofonåtkomst i WebView2. `getUserMedia` kräver behörighet. Tauri/WebView2 visar en egen dialog. **Motåtgärd:** Hantera `PermissionRequested` i värden, eller spela in ljudet nativt i Rust (cpal) och skicka det direkt till whisper. Inferens. Kontrollera också om regionen har stängt av mikrofonåtkomst för skrivbordsappar via Windows-sekretesspolicyn.
- **Svårighet:** Hallucinationer vid tystnad. **Motåtgärd:** VAD (whisper.cpp har VAD-stöd, ej verifierat i denna session) och `condition_on_previous_text=False`, som KBLab föreslår för faster-whisper.

### Gaps
- Inga oberoende x86-CPU-mätningar (RTF) för KB-Whisper small eller medium i whisper.cpp hittades.
- Det är inte verifierat om Web Speech API i WebView2 (inte Edge) exponerar `processLocally`.
- Inga källor bekräftar offline-diktering på svenska i Windows 10 eller 11 med det äldre API:et.

## 7. Data i vila, loggar, retention och administrativa policyer

### Takeaway
Kryptera den lokala databasen per användare med SQLCipher Community (BSD-liknande licens som kräver attribution) eller med AES-GCM på applikationsnivå. Skydda nyckeln med DPAPI i användarens kontext, vilket gör att den följer inloggningen och fungerar med roamingprofiler. Lägg IT-policyer i `HKLM\SOFTWARE\Policies\Lotsa`, som en egen ADMX som Intune kan importera, plus en `C:\ProgramData\Lotsa\policy.json` som reserv. Loggar och revisionsloggar ska ha konfigurerbar lagringstid och får aldrig innehålla frågetext som standard.

### Cited Findings
- `CryptProtectData`: "Typically, only a user with the same logon credential as the user who encrypted the data can decrypt the data", och dekryptering sker normalt på samma dator. Med roamingprofil går det på andra datorer. `CRYPTPROTECT_LOCAL_MACHINE` låter alla användare på datorn dekryptera. — [Microsoft Learn: CryptProtectData](https://learn.microsoft.com/en-us/windows/win32/api/dpapi/nf-dpapi-cryptprotectdata)
- SQLCipher Community Edition har "a BSD-style license and requires attribution and reproduction of license grants in the application interface and/or materials". Det finns en Commercial Edition med prestanda- och supporttillägg. — [Zetetic: SQLCipher License](https://www.zetetic.net/sqlcipher/license/)
- Intune kan importera upp till 20 egna ADMX-filer, var och en högst 1 MB och med ett ADML-språk per ADMX (offentlig förhandsversion). — [Microsoft Learn: Import custom ADMX templates in Intune](https://learn.microsoft.com/en-us/intune/intune-service/configuration/administrative-templates-import-custom)
- Electrons fuse `cookieEncryption` krypterar cookie-databasen med OS-nycklar. Chromium lagrar annars i klartext. Det är relevant om Electron väljs. — [Electron Fuses](https://www.electronjs.org/docs/latest/tutorial/fuses)
- WebView2:s UDF (IndexedDB, cache) ligger okrypterad i användarens profilmapp. Den ska inte ligga på en nätverksenhet. — [Microsoft Learn: user data folder](https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/user-data-folder) (själva krypteringsfrågan är en inferens)

### Inferences
- **Flytta data från IndexedDB till Rust-sidan:** Dagens IndexedDB i webbappen ligger okrypterad i WebView2:s UDF. Flytta därför historik, anteckningar och dokumentindex till en SQLCipher-databas som hanteras på Rust-sidan via Tauri-kommandon. Behåll IndexedDB bara för icke-känslig UI-cache. Regionerna har normalt BitLocker, vilket skyddar mot stöld men inte mot andra användare på delade datorer.
- **Nyckelhantering:** En slumpad 256-bitars DB-nyckel per användare, lindad med DPAPI (användarkontext) och lagrad i `%LOCALAPPDATA%\Lotsa\key.bin`. Använd inte `LOCAL_MACHINE` för användardata.
- **Policynycklar (förslag):**

| Nyckel | Värde |
|---|---|
| `HistoryRetentionDays` | 0 = spara inget |
| `AuditLogEnabled` | |
| `AuditLogPath` | lokal eller UNC, endast tillägg |
| `AuditRetentionDays` | |
| `AllowDictation` | |
| `AllowedModels` | |
| `ModelPath` | |
| `LibraryPath` | |
| `LibraryIndexVersion` | |
| `DisableExport` | PDF-export via jsPDF |
| `TelemetryEnabled` | alltid 0, nyckeln dokumenteras ändå |
| `MaxRamGB` | |
| `LlmThreads` | |
| `SupportBundleIncludeLogs` | |

  Policyn läses vid start. HKLM-policy går före JSON, som går före användarinställningar. Visa "Hanteras av din organisation" i gränssnittet.
- **Revisionslogg:** Logga händelser (start, modellversion, vilket dokument som citerades, export) men **inte** fråge- eller svarstext som standard. Patientuppgifter kan förekomma i fritext, trots att appen säger att de inte ska skrivas in. Skriv loggen som JSON Lines med en hash-kedja för manipuleringsskydd. Den kan valfritt vidarebefordras till Windows Event Log (egen källa `Lotsa`), så att regionens SIEM eller Defender kan samla in den.
- **Backup:** Användardata ses som lokal cache och tas inte i backup som standard. Exportera inställningar och egna anteckningar till fil vid behov. Det delade biblioteket är det som behöver backup, och det sker centralt.

### Gaps
- Inga källor hämtades om krav på loggning i patientdatalagen eller HSLF-FS 2016:40 för ett sådant verktyg. Det täcks troligen av ett annat researchområde.
- Det är inte verifierat hur SQLCipher byggs med Rust-craten `rusqlite` (feature `bundled-sqlcipher`) på Windows, eller vilken kryptoleverantör som då används.

## 8. Supportbarhet: kraschrapporter utan internet, diagnostikpaket och fjärrsupport i regionerna

### Takeaway
Utan internet måste all felsökning ske med lokala artefakter som användaren eller IT skickar via regionens ärendesystem. Det gäller minidumps (WebView2 med `IsCustomCrashReportingEnabled`, Electron Crashpad med `uploadToServer: false`), roterande loggar och en knapp för "Skapa supportpaket" som maskerar känslig text. Fjärrsupport från leverantören går i regionerna via regionens egna portaler med tvåfaktorsautentisering, ofta SITHS. Det finns inget nationellt standardverktyg.

### Cited Findings
- WebView2: med `IsCustomCrashReportingEnabled = true` skickas inga kraschdata till Microsoft. Dumparna finns i `CrashDumpFolderPath`. — [Microsoft Learn: Data and privacy in WebView2](https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/data-privacy)
- Electron använder Crashpad, och dumparna lagras i `app.getPath('crashDumps')`, som kan ändras. Vissa krascher på Windows (`__fastfail`, till exempel STATUS_STACK_BUFFER_OVERRUN) når aldrig en in-process-hanterare. — [Electron crashReporter](https://www.electronjs.org/docs/latest/api/crash-reporter)
- Region Dalarna: leverantörens inloggning ska ske via regionens portal, med minst tvåfaktorsautentisering, helst SITHS. Bilagan för 2026 har ett avsnitt "8.2 Fjärråtkomst". — [Region Dalarna Bilaga 4 IT 2024](https://www.regiondalarna.se/contentassets/2ef5c610518249d7bb78e4e31e86db5f/bilaga-4---informationsteknik-it-2024.pdf); [Bilaga 3 IT 2026](https://www.regiondalarna.se/contentassets/01afaa3cef394b2b88489568d34422c8/bilaga-3-informationsteknik--it-vardval-primarvard-dalarna-2026_beslutad.pdf)
- Region Kronoberg kräver SITHS eID utgivet av regionen för vårdgivarens användare. — [Region Kronoberg Vårdval IT-tjänster 2025](https://www.regionkronoberg.se/contentassets/866bd057c6164d4aa42ac80ec325dced/vardval-primarvard_it-tjanster-2025.pdf)
- Region Värmland hänvisar till regionens lösning "Fjärråtkomst_Portal". — [Värmland Bilaga 1.2 IT Vårdval 2024](https://www.varmlandstrafik.se/download/18.3589ec1b18ad97eb28e28361/1697027750538/Bilaga%201.2%20till%20del%201%20IT%20V%C3%A5rdval%202024.pdf)
- Obs: dessa dokument gäller vårdgivares och leverantörers åtkomst i vårdvalsavtal, inte specifikt programvaruleverantörers supportverktyg. Källorna lästes via sökresultat.

### Inferences
- **Diagnostikpaket ("Skapa supportpaket"):** En zip-fil med:
  - appversion, modellmanifest och hash-status
  - policyvärden
  - OS-version och WebView2-version (registret `pv`)
  - CPU, RAM och AVX-stöd
  - de senaste N loggarna (utan fråge- och svarstext)
  - llama-server- och whisper-loggar
  - minidumps
  - en lista över blockerade händelser från App Control (3076/3077), om de kan läsas

  Användaren eller IT bifogar paketet i regionens ärende. Det skickas aldrig automatiskt.
- **Självtest vid start:** Kontrollera WebView2-version, signatur och hash på sidecars, att modellfilerna finns och stämmer, ledigt RAM och disk, och att porten kan bindas. Visa tydliga svenska felmeddelanden som pekar på IT ("Modellpaket saknas, kontakta IT, felkod LOTSA-M01").
- **Supportnivåer:** Nivå 1 är regionens servicedesk, med en kunskapsbas från leverantören. Nivå 2 är leverantören via ärende och supportpaket. Fjärrsessioner sker bara via regionens egen portal och verktyg, enligt avtalets bilaga.
- **Svårighet:** Krascher i llama-server (otillräckligt RAM, saknat AVX2). **Motåtgärd:** Kör sidecarn som barnprocess med en watchdog, omstart och nedgradering till en mindre modell. Logga stderr. Välj CPU-variant vid start (AVX2/AVX512-binärer).

### Gaps
- Ingen sammanställning hittades av hur regionerna (till exempel Region Stockholm, VGR och Skåne) reglerar fjärrsupport från programvaruleverantörer. Det måste efterfrågas i varje upphandling.
- Tauri har ingen dokumenterad inbyggd kraschrapportering. Det är inte verifierat hur minidumps fångas för Rust-processen (alternativ: craten `minidumper`/`crash-handler`).

## 9. Svårigheter och motåtgärder (sammanställning)

### Takeaway
De största riskerna är:
- att appen självuppdaterar och därmed krockar med App Control, vilket löses genom att alla uppdateringar går via IT
- att 72-timmarscertifikat saknar tidsstämpel
- stora modellpaket över WAN
- RAM i VDI och multi-session
- att lokala portar kan nås av andra användare på delade värdar
- att svensk taligenkänning saknas i Web Speech API
- att WebView2 har egen telemetri som Lotsa inte styr

Alla har konkreta motåtgärder (se tabellen).

### Cited Findings
- Managed installer stöder inte självuppdatering. — [Microsoft Learn: managed installer](https://learn.microsoft.com/en-us/windows/security/application-security/application-control/app-control-for-business/design/configure-authorized-apps-deployed-with-a-managed-installer)
- Artifact Signing-certifikat gäller i 72 timmar. — [Microsoft Learn: certificate management](https://learn.microsoft.com/en-us/azure/artifact-signing/concept-certificate-management)
- Win32-appar får vara högst 30 GB, med 60 minuters standardtimeout och Delivery Optimization. — [Microsoft Learn: Win32 app management](https://learn.microsoft.com/en-us/intune/intune-service/apps/apps-win32-app-management); [Add a Win32 app](https://learn.microsoft.com/en-us/intune/intune-service/apps/apps-win32-add)
- WAL fungerar inte över nätverk, och SQLite över SMB riskerar korruption. — [SQLite WAL](https://www.sqlite.org/wal.html); [SQLite over a network](https://www.sqlite.org/useovernet.html)
- Edges lokala taligenkänning saknar svenska. — [Microsoft Learn: Edge SpeechRecognition API](https://learn.microsoft.com/en-us/microsoft-edge/web-platform/speech-recognition-api)
- WebView2 skickar diagnostikdata enligt Windows-inställningen. — [Microsoft Learn: Data and privacy in WebView2](https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/data-privacy)
- llama-servers webbgränssnitt är på som standard. — [llama.cpp server README](https://raw.githubusercontent.com/ggml-org/llama.cpp/master/tools/server/README.md)
- NSIS installerar per användare som standard. — [tauri-docs windows-installer.mdx](https://raw.githubusercontent.com/tauri-apps/tauri-docs/v2/src/content/docs/distribute/windows-installer.mdx)
- Windows 10 får WebView2-uppdateringar till minst oktober 2028. — [Microsoft Learn: Edge supported OS](https://learn.microsoft.com/en-us/deployedge/microsoft-edge-supported-operating-systems)

### Inferences

| Svårighet | Motåtgärd |
|---|---|
| App Control/AppLocker blockerar appen eller sidecars | Per-machine-MSI i Program Files, alla binärer signerade med samma Artifact Signing-profil, färdiga policyexempel (EKU- eller publisher-regel) samt testning i audit-läge tillsammans med regionens IT |
| Självuppdatering bryter managed installer och kräver admin | Updater borttagen i regionbygget. Uppdateringar via Intune supersedence eller ConfigMgr |
| 72-timmarscertifikat | Obligatorisk RFC 3161-tidsstämpel och kontroll i CI |
| SmartScreen-varningar | Irrelevant vid distribution via Intune. Vid nedladdning (pilot): konsekvent signering och tydlig information |
| Modellfiler 1,5–6 GB | Separat Win32-paket med beroende, Delivery Optimization, högre timeout, SHA-256-manifest och signatur, skrivskyddad ACL i ProgramData |
| WebView2 saknas eller är gammal på Windows 10 | `offlineInstaller`-variant eller Intune-beroende på WebView2 Runtime. `minimumWebview2Version` |
| Windows 10 efter ESU | WebView2 stöds till minst oktober 2028. Planera att stödet för Windows 10 upphör senast 2028 |
| "Bevisa inget internet" | CSP, inga nätverksplugins, loopback och API-nyckel, `--no-webui`, Intune-brandväggsregel för appens exe-filer, testprotokoll med paketfångst, nätverksbilaga som skiljer på Lotsa och WebView2/Windows |
| Andra användare når 127.0.0.1-portar (multi-session) | API-nyckel per session och slumpad port. Utred named pipe eller socket |
| RAM i VDI | Läge med en delad llama-server per värd (tjänst) eller rekommendation om fat client. Konfigurerbar `MaxRamGB` och modellval via policy |
| Roaming-profiler och FSLogix | UDF och data i `%LOCALAPPDATA%`, cachar undantagna från roaming, en UDF per användare |
| Delat bibliotek på SMB | Förbyggt, versionerat, skrivskyddat index med `immutable=1`, eller lokal kopia via paket. Ingen skrivbar SQLite över SMB |
| Svensk diktering offline | whisper.cpp med KB-Whisper (base eller small q5_0), egen ljudinspelning, VAD |
| Känslig data i IndexedDB | Flytta till SQLCipher på Rust-sidan med DPAPI-nyckel. Retention via policy |
| Felsökning utan internet | Lokalt supportpaket, minidumps lokalt, självtest, felkoder, ärenden via regionens servicedesk |
| Electrons korta supportfönster om Electron väljs | Release minst var 8:e–24:e vecka. Därför Tauri |

### Gaps
- Ingen källa hittades om hur svenska regioner faktiskt hanterar WebView2-uppdateringar (Evergreen eller låst) på sina Windows 10- och 11-flottor. Det måste frågas i dialogen med respektive region.
- Kostnaden för IT-paketering per release i regionerna är okänd.
