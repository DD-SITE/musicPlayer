import { Audio } from "expo-av";
import { create } from "zustand";

type PlayerState = {
  currentSong: any | null;
  sound: Audio.Sound | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  playSong: (song: any) => Promise<void>;
  togglePlay: () => Promise<void>;
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  sound: null,
  isPlaying: false,
  position: 0,
  duration: 1,

  playSong: async (song) => {
    try {
      const oldSound = get().sound;
      if (oldSound) {
        await oldSound.unloadAsync();
      }

      const res = await fetch(`https://saavn.sumit.co/api/songs/${song.id}`);
      const json = await res.json();
      const songData = json.data[0];

      const audioUrl =
        songData.downloadUrl.find((d: any) => d.quality === "320kbps")?.url ||
        songData.downloadUrl.find((d: any) => d.quality === "96kbps")?.url;

      const { sound, status } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true },
        (s) => {
          if (s.isLoaded) {
            set({
              position: s.positionMillis ?? 0,
              duration: s.durationMillis ?? 1,
              isPlaying: s.isPlaying,
            });
          }
        }
      );

      if (status.isLoaded) {
        set({
          currentSong: song,
          sound,
          isPlaying: true,
          position: 0,
          duration: status.durationMillis ?? 1,
        });
      }
    } catch (e) {
      console.log(e);
    }
  },

  togglePlay: async () => {
    const sound = get().sound;
    const isPlaying = get().isPlaying;

    if (!sound) return;

    if (isPlaying) {
      await sound.pauseAsync();
      set({ isPlaying: false });
    } else {
      await sound.playAsync();
      set({ isPlaying: true });
    }
  },
}));
