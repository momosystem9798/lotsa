# Startar Lotsa med lokal AI på en Windows-dator. Första gången hämtas också AI-programmet
# (llama.cpp, cirka 30 MB) och språkmodellen (Qwen3.5-4B, cirka 2,7 GB) till C:\lotsa-ai.
#
# Kör från mappen lotsa i PowerShell:
#   powershell -ExecutionPolicy Bypass -File local\starta-windows.ps1
#
# Annan mapp för AI-filerna: lägg till -Mapp "D:\någon\mapp".
param([string]$Mapp = 'C:\lotsa-ai')
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
# Äldre Windows PowerShell använder annars en gammal TLS-version som GitHub inte godtar.
try { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 } catch { }
$repo = Split-Path -Parent $PSScriptRoot
$llamaDir = Join-Path $Mapp 'llama'
$model = Join-Path $Mapp 'Qwen3.5-4B-Q4_K_M.gguf'
$modelUrl = 'https://huggingface.co/unsloth/Qwen3.5-4B-GGUF/resolve/main/Qwen3.5-4B-Q4_K_M.gguf'

if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw 'Node.js saknas. Installera det från https://nodejs.org och försök igen.' }
New-Item -ItemType Directory -Force -Path $Mapp, $llamaDir | Out-Null

# 1. AI-programmet llama-server
$server = Get-ChildItem $llamaDir -Recurse -Filter 'llama-server.exe' -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $server) {
  Write-Host 'Hämtar AI-programmet (llama.cpp) ...'
  $rel = Invoke-RestMethod 'https://api.github.com/repos/ggml-org/llama.cpp/releases/latest' -Headers @{ 'User-Agent' = 'lotsa-start' }
  $asset = $rel.assets | Where-Object { $_.name -like '*bin-win-cpu-x64.zip' } | Select-Object -First 1
  if (-not $asset) { throw "Hittade ingen Windows-version av llama.cpp i $($rel.tag_name). Ladda ner den för hand från https://github.com/ggml-org/llama.cpp/releases och packa upp den i $llamaDir." }
  $zip = Join-Path $Mapp 'llama.zip'
  Invoke-WebRequest $asset.browser_download_url -OutFile $zip -UseBasicParsing
  Expand-Archive $zip -DestinationPath $llamaDir -Force
  Remove-Item $zip
  $server = Get-ChildItem $llamaDir -Recurse -Filter 'llama-server.exe' | Select-Object -First 1
  Write-Host "Klart: $($rel.tag_name)"
}

# 2. Språkmodellen. curl.exe visar förloppet och fortsätter där den slutade om nedladdningen avbryts.
if (-not (Test-Path $model)) {
  Write-Host 'Hämtar språkmodellen (2,7 GB). Det kan ta en stund ...'
  & curl.exe -L --fail -C - -o "$model.part" $modelUrl
  if ($LASTEXITCODE -ne 0) { throw 'Nedladdningen av modellen misslyckades. Kör skriptet igen, så fortsätter den där den slutade.' }
  Move-Item "$model.part" $model
}

# 3. Bygg appen och starta. Webbläsaren öppnas när modellen är laddad.
Push-Location $repo
try {
  node build.mjs
  if ($LASTEXITCODE -ne 0) { throw 'Bygget misslyckades.' }
  Write-Host 'Startar Lotsa. Låt det här fönstret vara öppet. Stäng av med Ctrl+C.'
  node local/start.mjs --model $model --llama $server.FullName --open
} finally { Pop-Location }
