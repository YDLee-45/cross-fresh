Param(
  [switch],
  [switch],
  [switch],
  [switch]
)
\Continue = 'Stop'

if (-not \) {
  Write-Host "
[1/2] React DevTools ����..." -ForegroundColor Cyan
  Start-Process "cmd.exe" "/c nWrite-Host "[2/2] Expo(DEV) ����..." -ForegroundColor Cyan

# ADB ���� ����
\ = & adb devices 2>\
\  = (\ | Select-String "device$").Count -gt 0
\ = (\ | Select-String "offline$").Count -gt 0

# Expo ����
\ = "start"
if (\) { \ += " -c" }

if (\) {
  \ = "1"; \ += " --tunnel"
} elseif (\) {
  \ = "1"; \ += " --lan"
} else {
  if (-not \ -or \) {
    \ = "1"; \ += " --tunnel"
    Write-Host "ADB �̿���/�������� ����  �ͳ� ���� ��ȯ" -ForegroundColor Yellow
  }
}

npx expo \
