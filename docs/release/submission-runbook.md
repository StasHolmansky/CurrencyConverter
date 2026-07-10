# Submission Runbook

## Recommended Sequence

1. Finish store assets (feature graphic + screenshots)
2. Create a release candidate AAB
3. Test the release APK/AAB on a physical device
4. Upload to `Internal testing` on Google Play
5. Fix issues from internal review
6. Submit for production review
7. Roll out gradually and monitor feedback

## Android

### Build

```bash
npm install
cd android
./gradlew bundleRelease
```

Expected output:

- `android/app/build/outputs/bundle/release/app-release.aab`

### Upload

1. Open `Google Play Console`
2. Create the app entry for `Currency Converter`
3. Complete store listing, Data safety, content rating, and app access sections
4. Set privacy policy URL to `https://stasholmansky.github.io/currency-converter-privacy/`
5. Upload the `.aab` to `Internal testing`
6. Verify install and update flows from the Play test track

## Rollout Guardrails

- Start with a limited Android rollout percentage
- Watch support inbox and store reviews after launch
- Prepare a `1.0.1` hotfix if the first production build needs a quick follow-up
