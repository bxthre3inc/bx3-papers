# OTA Release Management

## APK Inventory with OTA Endpoints

| # | App | Package | OTA Endpoint | Current Version | APK Path |
|---|-----|---------|--------------|-----------------|----------|
| 1 | AgentOS | `com.bxthre3.agentos` | `/api/ota/agentos/check` | 7.0.0 | `the-agentos-project/releases/` |
| 2 | VPC | `com.valleyplayersclub.vpc` | `/api/ota/vpc/check` | 8.1.0 | `the-valleyplayersclub-project/android-native/` |
| 3 | **Zo Space** | `com.bxthre3.zospace` | `/api/ota/zospace` | 1.0.0 | `zo-space-android/releases/` |
| 4 | **Zo Computer** | `com.bxthre3.zocomputer` | `/api/ota/zocomputer` | 1.0.0 | `zo-computer-android/releases/` |

## OTA API Response Format

All endpoints return JSON:
```json
{
  "app": "App Name",
  "package": "com.bxthre3.appname",
  "versionCode": 1,
  "versionName": "1.0.0",
  "downloadUrl": "https://brodiblanco.zo.space/ota/app.apk",
  "changelog": "What's new",
  "forceUpdate": false,
  "minSdk": 28,
  "updatedAt": "2026-04-05"
}
```

## Release Process

1. Build APK locally with Android Studio
2. Upload to `zo.pub` or `zo.space` assets
3. Update OTA endpoint with new version
4. Apps auto-check on launch

## App-Specific Icons

| App | Color | Icon |
|-----|-------|------|
| Zo Space | Purple (#7B1FA2) | White "Z" with orbit ring |
| Zo Computer | Green (#2E7D32) | Terminal prompt (>)

