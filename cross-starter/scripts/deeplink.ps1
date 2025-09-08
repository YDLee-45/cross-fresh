Param([string]$Url = "cross://open")
$ErrorActionPreference = 'Stop'

# 첫 번째 연결된 Android 기기
$device = (adb devices | Select-String "device$" | ForEach-Object { ($_ -split "`t")[0] } | Select-Object -First 1)
if (-not $device) { throw "No Android device found. adb devices 확인 필요." }

# 표준 VIEW 인텐트로 실행
adb -s $device shell am start -a android.intent.action.VIEW -d "$Url"
