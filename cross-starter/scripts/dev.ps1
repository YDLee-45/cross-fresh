Param(
  [switch],
  [switch],
  [switch],
  [switch]
)
\Continue = 'Stop'

if (-not \) {
  Write-Host "
[1/2] React DevTools 실행..." -ForegroundColor Cyan
  Start-Process "cmd.exe" "/c nWrite-Host "[2/2] Expo(DEV) 시작..." -ForegroundColor Cyan

# ADB 상태 감지
\ = & adb devices 2>\
\  = (\ | Select-String "device$").Count -gt 0
\ = (\ | Select-String "offline$").Count -gt 0

# Expo 인자
\ = "start"
if (\) { \ += " -c" }

if (\) {
  \ = "1"; \ += " --tunnel"
} elseif (\) {
  \ = "1"; \ += " --lan"
} else {
  if (-not \ -or \) {
    \ = "1"; \ += " --tunnel"
    Write-Host "ADB 미연결/오프라인 감지  터널 모드로 전환" -ForegroundColor Yellow
  }
}

npx expo \
