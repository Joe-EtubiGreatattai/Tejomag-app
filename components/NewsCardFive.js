import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font'; // Import useFonts hook
import { cleanText } from '../ult/textCleaner'; 
// Function to clean up unwanted characters in text


const NewsHeader = ({ title, date, onPress }) => {
  // Load custom fonts
  const [fontsLoaded] = useFonts({
    "NotoSerifCondensed-Bold": require("../assets/fonts/static/NotoSerif_Condensed-ExtraBold.ttf"),
  });

  if (!fontsLoaded) {
    return null; // Return null or a loading component while fonts are loading
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.title}>{cleanText(title)}</Text>
      <Text style={styles.date}>{cleanText(date)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    margin: 'auto'
  },
  title: {
    fontSize: 24,
    fontFamily: "NotoSerifCondensed-Bold",
    color: '#000',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
});

export default memo(NewsHeader);
