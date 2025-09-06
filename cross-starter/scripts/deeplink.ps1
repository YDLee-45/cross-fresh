# scripts/deeplink.ps1
Param([string]$Url = "cross://open")
$ErrorActionPreference = 'Stop'

$device = (adb devices | Select-String "device$" | ForEach-Object { ($_ -split "`t")[0] } | Select-Object -First 1)
if (-not $device) { throw "No Android device found. adb devices 확인 필요." }

adb -s $device shell am start -a android.intent.action.VIEW -d "$Url" com.android.chrome
