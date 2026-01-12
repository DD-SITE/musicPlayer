import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import { create } from "zustand";

const STORAGE_KEY = "MUSIC_PLAYER_STATE";

type RepeatMode = "off" | "one" | "all";

type PlayerState = {
  queue: any[];
  currentIndex: number;
  sound: Audio.Sound | null;
  isPlaying: boolean;
  position: number;
  duration: number;

  shuffle: boolean;
  repeat: RepeatMode;

  playSong: (song: any, list?: any[]) => Promise<void>;
  togglePlay: () => Promise<void>;
  next: () => Promise<void>;
  previous: () => Promise<void>;
  restore: () => Promise<void>;

  playFromQueue: (index: number) => Promise<void>;
  removeFromQueue: (index: number) => void;
  reorderQueue: (from: number, to: number) => void;

  toggleShuffle: () => void;
  cycleRepeat: () => void;
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  queue: [],
  currentIndex: -1,
  sound: null,
  isPlaying: false,
  position: 0,
  duration: 1,

  shuffle: false,
  repeat: "off",

  playSong: async (song, list = []) => {
    try {
      const oldSound = get().sound;
      if (oldSound) await oldSound.unloadAsync();

      const queue = list.length ? list : [song];
      const index = queue.findIndex((s) => s.id === song.id);

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
          if (!s.isLoaded) return;

          set({
            position: s.positionMillis ?? 0,
            duration: s.durationMillis ?? 1,
            isPlaying: s.isPlaying,
          });

          if (s.didJustFinish) get().next();
        }
      );

      if (status.isLoaded) {
        set({
          queue,
          currentIndex: index,
          sound,
          isPlaying: true,
          position: 0,
          duration: status.durationMillis ?? 1,
        });

        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            queue,
            currentIndex: index,
            shuffle: get().shuffle,
            repeat: get().repeat,
          })
        );
      }
    } catch (e) {
      console.log(e);
    }
  },

  playFromQueue: async (index) => {
    const { queue } = get();
    const song = queue[index];
    if (song) await get().playSong(song, queue);
  },

  togglePlay: async () => {
    const sound = get().sound;
    if (!sound) return;

    if (get().isPlaying) {
      await sound.pauseAsync();
      set({ isPlaying: false });
    } else {
      await sound.playAsync();
      set({ isPlaying: true });
    }
  },

  next: async () => {
    const { queue, currentIndex, shuffle, repeat } = get();

    if (repeat === "one") {
      await get().playFromQueue(currentIndex);
      return;
    }

    let nextIndex = currentIndex + 1;

    if (shuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    }

    if (nextIndex >= queue.length) {
      if (repeat === "all") {
        nextIndex = 0;
      } else {
        return;
      }
    }

    await get().playFromQueue(nextIndex);
  },

  previous: async () => {
    const { currentIndex } = get();
    if (currentIndex - 1 < 0) return;
    await get().playFromQueue(currentIndex - 1);
  },

  toggleShuffle: () => {
    const val = !get().shuffle;
    set({ shuffle: val });

    AsyncStorage.mergeItem(
      STORAGE_KEY,
      JSON.stringify({ shuffle: val })
    );
  },

  cycleRepeat: () => {
    const current = get().repeat;
    const next =
      current === "off" ? "all" : current === "all" ? "one" : "off";

    set({ repeat: next });

    AsyncStorage.mergeItem(
      STORAGE_KEY,
      JSON.stringify({ repeat: next })
    );
  },

  restore: async () => {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    const { queue, currentIndex, shuffle, repeat } = JSON.parse(saved);

    set({
      shuffle: shuffle ?? false,
      repeat: repeat ?? "off",
    });

    if (queue?.length && currentIndex >= 0) {
      set({ queue, currentIndex });
      await get().playFromQueue(currentIndex);
    }
  },

  removeFromQueue: (index) => {
    const { queue, currentIndex } = get();
    const newQueue = [...queue];
    newQueue.splice(index, 1);

    let newIndex = currentIndex;

    if (index < currentIndex) newIndex--;
    if (index === currentIndex) {
      newIndex = Math.min(currentIndex, newQueue.length - 1);
    }

    set({ queue: newQueue, currentIndex: newIndex });

    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ queue: newQueue, currentIndex: newIndex })
    );

    if (newIndex >= 0 && newQueue[newIndex]) {
      get().playFromQueue(newIndex);
    }
  },

  reorderQueue: (from, to) => {
    const { queue, currentIndex } = get();
    const newQueue = [...queue];
    const item = newQueue.splice(from, 1)[0];
    newQueue.splice(to, 0, item);

    let newIndex = currentIndex;

    if (from === currentIndex) newIndex = to;
    else if (from < currentIndex && to >= currentIndex) newIndex--;
    else if (from > currentIndex && to <= currentIndex) newIndex++;

    set({ queue: newQueue, currentIndex: newIndex });

    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ queue: newQueue, currentIndex: newIndex })
    );
  },
}));
