import React from "react";
import { View, TouchableOpacity, Platform, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const TopActionBar = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
       <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",

  },
  button: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  rightButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10, // Adjust this value to control the space between the Share and Subscribe buttons
  },
  subscribeButton: {
    backgroundColor: "#b71c1c",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  subscribeText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TopActionBar;
