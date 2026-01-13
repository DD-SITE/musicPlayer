#  React Native Music Player (Expo)

A modern music streaming app built with **React Native (Expo)** that allows users to search songs, play music in the background, manage a dynamic queue, and control playback using a **mini player** and a **full player screen**.

This project was built as part of a **React Native Intern Assignment** and focuses on **real-world music player functionality** rather than just UI.

---

##  Features

###  Search & Browse
- Search songs using the **JioSaavn public API**
- Displays **song title, artist, and album artwork**
- **“Now Playing”** indicator for the currently playing song

###  Playback
- Play / Pause  
- Next / Previous  
- Seek bar with time display  
- **Background playback** (continues when app is minimized or phone is locked)

###  Mini Player
- Persistent mini player visible across all screens  
- Displays current song and artist  
- Play / Pause control  
- Tap to open the full player  

###  Full Player
- Album artwork  
- Song and artist info  
- Seek bar with timestamps  
- Playback controls  
- Queue shortcut  
- Shuffle & Repeat modes  

###  Queue Management
- Automatically builds a queue from search results  
- View upcoming songs  
- **Drag & drop to reorder**  
- Remove songs from queue  
- Queue is **persisted locally** and restored on app restart  

###  Playback Modes (Bonus)
- Shuffle mode  
- Repeat Off → Repeat All → Repeat One  
- Fully integrated with the queue logic  

---

##  Architecture

The app uses a **single global state store** with **Zustand** to keep everything in sync across:

- Home Screen  
- Mini Player  
- Full Player  
- Queue Screen  

All playback, queue, shuffle, and repeat logic lives inside: playerStore.ts.

This ensures:
- No duplicated state  
- Instant sync across screens  
- Clean separation of UI and business logic  

Audio playback is handled by **Expo AV**, which supports:
- Background playback  
- Seeking  
- Playback status updates  

---

##  Tech Stack

| Purpose | Technology |
|-------|-----------|
| Framework | React Native (Expo) |
| Language | TypeScript |
| Navigation | React Navigation |
| State Management | Zustand |
| Audio Playback | expo-av |
| Storage | AsyncStorage |
| Queue Drag | react-native-draggable-flatlist |
| API | JioSaavn Public API |

---

##  Running Locally

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

##  Android APK

A production-ready Android APK was built using **Expo EAS Build**.

It includes:
- Background audio  
- Queue persistence  
- Proper Android network configuration  

👉 [Download Android APK]( https://github.com/yourname/music-player/releases/download/v1.0/music-player.apk](https://github.com/DD-SITE/musicPlayer/releases/download/v1.0/application-186a5bf7-4dce-45fd-b995-f074fcbc4eb3.apk )

---

##  Important Implementation Notes

### Why HTTP is allowed

The JioSaavn API is served over `http://`, which Android blocks by default in release builds.  
This project enables it safely using Expo’s build plugin:

```json
"expo-build-properties": {
  "android": {
    "usesCleartextTraffic": true
  }
}
```

This ensures the APK works correctly in production.

---

##  Why this design?

This app was designed to behave like a **real music streaming app**:

- Tapping a song creates a queue from the current search results  
- Users can reorder or remove songs  
- Shuffle and repeat modify how `next()` behaves  
- Mini player and full player stay perfectly in sync  

The goal was to prioritize **real-world functionality and architecture** over just UI.

---

##  Demo

A short demo video (2–3 minutes) is included showing:
- Searching  
- Playing songs  
- Queue management  
- Shuffle & repeat  
- Background playback  

---

##  Assignment Coverage

All required features from the assignment have been implemented:

- Home screen with search  
- Player & Mini Player  
- Queue with add, remove, reorder  
- State persistence  
- Background playback  
- Bonus: Shuffle & Repeat  



