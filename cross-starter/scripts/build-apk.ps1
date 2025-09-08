# PowerShell: scripts/build-apk.ps1
# 사용법:
#   최초 1회:  npx eas credentials -p android    # keystore 생성(완료됨)
#   빌드     :  powershell -ExecutionPolicy Bypass -File .\scripts\build-apk.ps1
#   대화형   :  powershell -ExecutionPolicy Bypass -File .\scripts\build-apk.ps1 -Interactive

param([switch]$Interactive)
$ErrorActionPreference = 'Stop'

function Ensure-Tool($cmd,$hint){ try{ & $cmd --version *> $null }catch{ throw $hint } }
Ensure-Tool "node" "Node.js가 필요합니다."
Ensure-Tool "npm"  "npm(Node) 설치 필요."

# npx.cmd의 실제 경로를 안전하게 추출
$NPX = (Get-Command npx.cmd -ErrorAction Stop).Source

# 인자는 배열로 분리해 전달
$easArgs = @("eas","build","-p","android","--profile","preview")
if (-not $Interactive) { $easArgs += "--non-interactive" }

Write-Host "`n[빌드] EAS Android APK(preview) 시작..." -ForegroundColor Cyan
& $NPX @easArgs
