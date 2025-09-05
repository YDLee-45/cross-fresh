[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
chcp 65001 | Out-Null
# connect-android.ps1
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8  # 한글 깨짐 방지(선택)
$ErrorActionPreference = "SilentlyContinue"

$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\sdk"
$adb = Join-Path $env:ANDROID_HOME 'platform-tools\adb.exe'

& $adb disconnect | Out-Null
& $adb kill-server | Out-Null
& $adb start-server | Out-Null

& $adb -d wait-for-device
& $adb -d devices

& $adb -d reverse tcp:8081 tcp:8081
& $adb -d reverse tcp:8086 tcp:8086

Write-Host "✅ USB 연결 + 8081/8086 reverse 완료"
