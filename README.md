# Life Counter 🕒

Life Counter is a small React Native app that turns a birthday into a live age
clock. The home-screen widget adds the useful context: years on Earth, days
lived, and the countdown to the next birthday.

## Widgets

- **Android:** add “LifeSpan Tracker” from the launcher’s widget picker. It
  refreshes at the platform-supported 30-minute cadence and opens the app when
  tapped.
- **iOS 15.1+:** the `LifeClockWidget` WidgetKit extension is included in the
  Xcode project and supports small and medium sizes.

Before signing an iOS build, select both `ReactNativeProject` and
`LifeClockWidget` in Xcode, enable the **App Groups** capability, and register
`group.org.reactjs.native.example.ReactNativeProject` for the selected team.
If you change the app bundle identifier, change this group identifier in the
two entitlement files and `WidgetBridge.m` as well.

## Development

```sh
nvm use 24
corepack yarn install --immutable
cd ios && pod install && cd ..
corepack yarn ios
# or
corepack yarn android
```

Open the generated workspace—not the `.xcodeproj`—when working in Xcode:

```sh
open ios/ReactNativeProject.xcworkspace
```

## Android release signing

Release credentials are deliberately not stored in this repository. Copy
`android/keystore.properties.example` to `android/keystore.properties`, fill
it with your local keystore details, and keep both that file and the keystore
outside version control. CI should provide the same values through its secret
store.
