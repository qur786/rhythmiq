import React, { useCallback, useEffect, useState } from "react";
import type { PressableProps } from "react-native";
import { View, StyleSheet, Pressable } from "react-native";
import TrackPlayer, {
  RepeatMode,
  State,
  usePlaybackState,
} from "react-native-track-player";
import Icon from "react-native-vector-icons/MaterialIcons";

const RepeatModeIcons: Record<RepeatMode, string> = {
  [RepeatMode.Off]: "sync-disabled",
  [RepeatMode.Queue]: "sync",
  [RepeatMode.Track]: "repeat-one",
};

export function Controllers(): JSX.Element {
  const [repeatMode, setRepeatMode] = useState<RepeatMode>(RepeatMode.Off);
  const playbackState = usePlaybackState();

  const handlePrevPress: PressableProps["onPress"] = async () => {
    await TrackPlayer.skipToPrevious();
  };
  const handleNextPress: PressableProps["onPress"] = async () => {
    await TrackPlayer.skipToNext();
  };
  const handleTogglePlayPause: PressableProps["onPress"] =
    useCallback(async () => {
      const currentTrack = await TrackPlayer.getActiveTrack();

      if (currentTrack) {
        if (
          playbackState.state === State.Paused ||
          playbackState.state === State.Ready
        ) {
          await TrackPlayer.play();
        } else {
          await TrackPlayer.pause();
        }
      }
    }, [playbackState]);

  useEffect(() => {
    TrackPlayer.getRepeatMode().then(setRepeatMode).catch(console.log);
  }, []);
  return (
    <View style={styles.container}>
      <Pressable>
        <Icon name={"share"} size={20} color="#2ECC72" />
      </Pressable>
      <View style={styles.playerContainer}>
        <Pressable onPress={handlePrevPress}>
          <Icon name="skip-previous" size={40} color="white" />
        </Pressable>
        <Pressable onPress={handleTogglePlayPause}>
          <Icon
            name={
              playbackState.state === State.Playing
                ? "pause-circle"
                : "play-circle"
            }
            size={60}
            color="#2ECC72"
          />
        </Pressable>
        <Pressable onPress={handleNextPress}>
          <Icon name="skip-next" size={40} color="white" />
        </Pressable>
      </View>
      <Pressable>
        <Icon name={RepeatModeIcons[repeatMode]} size={20} color="#2ECC72" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  playerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
});
