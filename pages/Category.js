import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, ScrollView } from "react-native";
import Header from "./../components/Topbar";
import CategoryGrid from "./../components/CategoryPageGrid";
import BottomTab from "./../components/BottomTab";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Categories() {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        horizontal={false}
      >
        <CategoryGrid />
      </ScrollView>
      <BottomTab activePage="Categories" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    width: Dimensions.get("window").width,
  },
});
