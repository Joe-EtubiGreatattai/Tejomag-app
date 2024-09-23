import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [progress, setProgress] = useState(0);

  const videoUri = 'https://www.w3schools.com/html/mov_bbb.mp4'; // Placeholder video

  useEffect(() => {
    const playVideo = async () => {
      if (videoRef.current) {
        await videoRef.current.playAsync();
        setIsPlaying(true);
      }
    };
    playVideo();

    return () => {
      if (videoRef.current) {
        videoRef.current.pauseAsync();
        setIsPlaying(false);
      }
    };
  }, []);

  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pauseAsync();
    } else {
      videoRef.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const handleReplay = () => {
    videoRef.current.replayAsync();
    setIsPlaying(true);
    setIsFinished(false);
  };

  const handlePlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setProgress(status.positionMillis / status.durationMillis);
      if (status.didJustFinish) {
        setIsPlaying(false);
        setIsFinished(true);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri: videoUri }}
        style={styles.video}
        resizeMode="cover"
        shouldPlay={true}
        isLooping={false}
        useNativeControls={false}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
      />
      <Slider
        style={styles.progressBar}
        value={progress}
        minimumValue={0}
        maximumValue={1}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
        thumbTintColor="#FFFFFF"
        disabled={true}
      />
      <TouchableOpacity style={styles.playButton} onPress={isFinished ? handleReplay : handlePlayPause}>
        <Ionicons name={isFinished ? "refresh-outline" : isPlaying ? "pause" : "play"} size={40} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width - 20,
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  progressBar: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -30 }],
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VideoPlayer;
