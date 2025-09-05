param([string]$HostPort)
if (-not $HostPort) { Write-Error "사용법: adb-connect.ps1 <IP:PORT>"; exit 1 }
adb kill-server | Out-Null
adb start-server | Out-Null
adb disconnect   | Out-Null
adb connect $HostPort
adb devices -l
