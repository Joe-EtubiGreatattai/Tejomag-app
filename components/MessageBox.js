// MessageBox.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const MessageBox = ({ message, type }) => {
  return (
    <View style={[styles.container, type === "error" ? styles.errorBox : styles.successBox]}>
      <Text style={styles.messageText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: "center",
  },
  errorBox: {
    backgroundColor: "#f8d7da",
    borderColor: "#f5c2c7",
  },
  successBox: {
    backgroundColor: "#d4edda",
    borderColor: "#c3e6cb",
  },
  messageText: {
    color: "#721c24",
  },
});

export default MessageBox;
