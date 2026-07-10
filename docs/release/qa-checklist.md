# QA Checklist

## Smoke

- [ ] App launches on a clean install
- [ ] Default currencies appear
- [ ] Changing one amount updates the other rows
- [ ] Add currency works and respects the max row limit
- [ ] Delete currency via swipe works
- [ ] Drag reorder persists after restart
- [ ] Currency picker search finds codes and country names
- [ ] Calculator returns a value into the active row
- [ ] Theme chips: System / Light / Dark apply and persist
- [ ] Feedback screen opens mail client or shows fallback message

## Network

- [ ] Fresh rates load with internet
- [ ] Cached rates still convert after airplane mode (after at least one successful fetch)
- [ ] App recovers when network returns

## Release build

- [ ] Install signed release APK/AAB
- [ ] Launcher icon and name look correct (`Currency Converter`)
- [ ] No debug menu / unexpected logs in production UX
- [ ] Support email is correct on Feedback screen
