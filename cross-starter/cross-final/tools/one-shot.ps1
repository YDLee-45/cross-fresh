param(
  [ValidateSet('debug','release')] [string]$Build = 'debug',
  [switch]$SdkAutoInstall
)
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location (Resolve-Path (Join-Path $SCRIPT_DIR '..'))

Write-Host "== One-Shot Start (Build=$Build) ==" -ForegroundColor Cyan

if ($SdkAutoInstall) {
  if (-not $env:ANDROID_SDK_ROOT) { throw "ANDROID_SDK_ROOT 가 설정되어 있어야 합니다." }
  $sdkmgr = Get-ChildItem -Path (Join-Path $env:ANDROID_SDK_ROOT 'cmdline-tools') -Directory |
            Sort-Object Name -Descending | Select-Object -First 1 |
            ForEach-Object { Join-Path $_.FullName 'bin\sdkmanager.bat' }
  if (-not (Test-Path $sdkmgr)) { throw "sdkmanager.bat 없음. Android Studio > SDK Tools 에서 'Android SDK Command-line Tools (latest)' 설치" }
  & $sdkmgr "platforms;android-35" "build-tools;35.0.0" "platform-tools" --sdk_root="$env:ANDROID_SDK_ROOT"
}

if (-not (Test-Path './android/gradlew')) {
  Write-Host "Android 네이티브 생성(prebuild)..." -ForegroundColor Yellow
  npx expo prebuild -p android --no-install
}

Write-Host "Gradle 캐시/빌드 정리..." -ForegroundColor Yellow
Try { & ./android/gradlew --stop } Catch { }
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue ./android/.gradle
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue ./android/app/build
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue ./android/build

Write-Host "npm install..." -ForegroundColor Yellow
npm install

Push-Location android
if ($Build -eq 'debug') {
  & ./gradlew :app:assembleDebug --no-daemon --stacktrace
  Pop-Location
  $apk = Get-ChildItem ".\android\app\build\outputs\apk\debug" -Filter "*debug*.apk" -Recurse -ErrorAction SilentlyContinue |
         Sort-Object LastWriteTime -Desc | Select-Object -First 1
  if ($apk) {
    Write-Host "APK: $($apk.FullName)" -ForegroundColor Green
    Try {
      adb devices | Out-Null
      Write-Host "adb install -r ..." -ForegroundColor Yellow
      adb install -r "$($apk.FullName)"
    } Catch { Write-Host "ADB 설치 스킵(연결 없음)" -ForegroundColor DarkYellow }
  } else {
    Write-Host "APK 생성 안 됨. 위 로그의 첫 에러 확인." -ForegroundColor Yellow
  }
} else {
  & ./gradlew :app:bundleRelease --no-daemon --stacktrace
  Pop-Location
  $aab = Get-ChildItem ".\android\app\build\outputs\bundle\release" -Filter "*.aab" -Recurse -ErrorAction SilentlyContinue |
         Sort-Object LastWriteTime -Desc | Select-Object -First 1
  if ($aab) {
    Write-Host "AAB: $($aab.FullName)" -ForegroundColor Green
  } else {
    Write-Host "AAB 생성 안 됨. 위 로그의 첫 에러 확인." -ForegroundColor Yellow
  }
}
Write-Host "== One-Shot Done ==" -ForegroundColor Cyan
