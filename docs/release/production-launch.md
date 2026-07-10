# Production Launch

This repository contains the release defaults and runbooks needed to ship `Currency Converter` to Google Play.

## Release Values

| Item | Value |
| --- | --- |
| Product name | `Currency Converter` |
| React Native module name | `CurrencyConverter` |
| Android application ID | `com.currencyconverter` |
| Store version | `1.0.0` |
| Build number | `1` |
| Android signing config | `android/key.properties` |
| Release keystore template | `android/key.properties.example` |
| Support email | `stanislavkholmanskii@gmail.com` |
| Privacy policy source | `docs/release/privacy-policy.md` |
| Privacy policy URL | https://stasholmansky.github.io/currency-converter-privacy/ |
| Store listing draft | `docs/release/store-listing.md` |
| Brand master icon | `docs/branding/app-icon.png` |

## Before Submission

1. Use the public privacy policy URL above in Google Play Console.
2. Confirm the support email inbox (`stanislavkholmanskii@gmail.com`) is monitored.
3. Prepare feature graphic `1024x500` and at least 2 phone screenshots.
4. Complete Data safety, content rating, target audience, and ads declaration in Play Console.

## Accounts

1. `Google Play Console`
2. Support inbox for `stanislavkholmanskii@gmail.com`

## Android Release Setup

1. Ensure the shared upload keystore is available.
2. Copy `android/key.properties.example` to `android/key.properties` if needed.
3. Fill in the real store file path, passwords, and alias.
4. Keep the keystore file and `android/key.properties` out of git.
5. Build the upload bundle:

```bash
npm install
cd android
./gradlew bundleRelease
```

Expected output:

- `android/app/build/outputs/bundle/release/app-release.aab`

## Data Safety Notes

Declare at least:

- Local app storage for selected currencies, amounts, theme preference, and cached rates
- Network access to `open.er-api.com` and `api.coingecko.com`
- No account, no ads SDK, no analytics SDK, no location permission
