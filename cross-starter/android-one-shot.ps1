# ===================== ANDROID ONE-SHOT (PS 5.1 SAFE) =====================
$ErrorActionPreference = "Continue"

Write-Host "`n>>> 0) 버전 체크"
try { java -version } catch {}
try { node -v } catch {}
try { adb version } catch {}

Write-Host "`n>>> 1) Metro/노드 프로세스 종료 + 캐시 정리"
try { taskkill /F /IM node.exe /T *> $null } catch {}
Remove-Item -Recurse -Force `
  .\android\.gradle, `
  .\android\app\build, `
  .\node_modules\.cache\metro, `
  .\.expo, .\.expo-shared `
  -ErrorAction SilentlyContinue

Write-Host "`n>>> 2) ADB 재시작 & 단일 기기 확인"
adb kill-server
adb start-server
$devs = (& adb devices) -split "`n" |
  Where-Object { $_ -match "\tdevice$" -and $_ -notmatch "List of devices" } |
  ForEach-Object { ($_ -split "\s+")[0] }

if ($devs.Count -ne 1) {
  Write-Host "❌ 연결 기기는 'USB 1대'만 남겨주세요. 현재: $($devs -join ', ')"
  Write-Host "   - 무선 디버깅은 끄고, 다른 에뮬레이터/기기 분리."
  exit 1
}
$serial = $devs[0]
adb -s $serial reverse tcp:8081 tcp:8081
adb -s $serial reverse tcp:8086 tcp:8086
Write-Host "✓ USB 연결/포트 reverse 완료 ($serial)"

Write-Host "`n>>> 3) Kotlin 버전 고정 (Expo 플러그인)"
$gp = "android\gradle.properties"
$txt = ""
if (Test-Path $gp) {
  $txt = Get-Content $gp -Raw
}
if ($txt -match "expo\.kotlin\.version=") {
  $txt = $txt -replace "expo\.kotlin\.version=.*", "expo.kotlin.version=1.9.24"
} else {
  $txt = $txt + "`n# Pin Kotlin for Expo Gradle plugin`nexpo.kotlin.version=1.9.24`n"
}
Set-Content -Encoding UTF8 -Path $gp -Value $txt

Write-Host "`n>>> 4) Prebuild(네이티브 정리)"
npx expo prebuild --clean --platform android
if ($LASTEXITCODE -ne 0) { Write-Host "❌ prebuild 실패"; exit 1 }

Write-Host "`n>>> 5) Gradle 빌드 (stacktrace 로그 저장)"
Push-Location android
$env:ORG_GRADLE_PROJECT_reactNativeArchitectures = "arm64-v8a"
$buildLog = "..\_build.log"

# 전체 출력/에러를 파일에 저장 (PS 5.1 호환)
cmd /c ".\gradlew app:assembleDebug --no-daemon --stacktrace" 2>&1 | Tee-Object -FilePath $buildLog
$code = $LASTEXITCODE
Pop-Location
Write-Host "빌드 로그 저장: $buildLog"

if ($code -ne 0) {
  Write-Host "❌ 빌드 실패. _build.log 에서 가장 처음 나타나는 'Caused by:' 또는 'What went wrong' 주변 20~30줄이 진짜 원인입니다."
  exit $code
}

Write-Host "`n>>> 6) APK 설치"
$apk = Get-ChildItem -Path "android\app\build\outputs\apk\debug" -Filter "*debug*.apk" -Recurse | Select-Object -First 1
if (-not $apk) { Write-Host "❌ debug APK를 못 찾음"; exit 1 }
adb -s $serial install -r $apk.FullName

Write-Host "`n✅ 완료! 앱이 설치되었습니다. (필요 시 Dev Client에서 PC IP:8081로 접속)"
# ===================== END =====================
