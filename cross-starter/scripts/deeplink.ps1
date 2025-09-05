param([Parameter(Mandatory=$true)][string]$Path)

$lines = adb devices | Select-String "device$" | Where-Object { $_ -notmatch "^List of" }
if (-not $lines) { Write-Error "디바이스 없음. 먼저 USB 연결 또는 adb-connect/adb-pair!" ; exit 1 }

$first  = ($lines | Select-Object -First 1).ToString()
$serial = ($first -split "\s+")[0].Trim()

adb -s $serial shell am start -a android.intent.action.VIEW -d "cross://$Path"
