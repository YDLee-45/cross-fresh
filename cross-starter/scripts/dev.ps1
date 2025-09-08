Param(
  [switch]$ClearCache,
  [switch]$NoDevTools,
  [switch]$Lan,
  [switch]$Tunnel
)

$ErrorActionPreference = 'Stop'

if (-not $NoDevTools) {
  Write-Host "`n[1/2] React DevTools 실행..." -ForegroundColor Cyan
  Start-Process "cmd.exe" "/c npx react-devtools"
} else {
  Write-Host "`n[1/2] React DevTools 생략" -ForegroundColor DarkGray
}

Write-Host "[2/2] Expo(DEV) 시작..." -ForegroundColor Cyan

# ADB 상태 감지
$adbOut    = & adb devices 2>$null
$hasDevice = ($adbOut | Select-String "device$").Count -gt 0
$hasOffline = ($adbOut | Select-String "offline$").Count -gt 0

# Expo 인자
$expoArgs = "start"
if ($ClearCache) { $expoArgs += " -c" }

if ($Tunnel) {
  $env:EXPO_NO_ADB_REVERSE = "1"; $expoArgs += " --tunnel"
} elseif ($Lan) {
  $env:EXPO_NO_ADB_REVERSE = "1"; $expoArgs += " --lan"
} else {
  if (-not $hasDevice -or $hasOffline) {
    $env:EXPO_NO_ADB_REVERSE = "1"; $expoArgs += " --tunnel"
    Write-Host "ADB 미연결/오프라인 감지 → 터널 모드로 전환" -ForegroundColor Yellow
  }
}

npx expo $expoArgs
