import React from "react";
import { View, StyleSheet } from "react-native";

const Divider = ({ color = "#e0e0e0", thickness = 1, marginVertical = 10 }) => {
  return (
    <View
      style={[
        styles.divider,
        {
          borderBottomColor: color,
          borderBottomWidth: thickness,
          marginVertical,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    width: "95%",
  },
});

export default Divider;
