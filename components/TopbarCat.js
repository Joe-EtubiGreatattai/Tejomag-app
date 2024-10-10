import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Pressable,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const TopBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigation = useNavigation();

  const menuItems = [
    { id: "1", title: "Home", icon: "home-outline" },
    { id: "2", title: "Profile", icon: "person-outline" },
  ];

  const handleMenuItemPress = (item) => {
    navigation.navigate(item.title);
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("isLoggedIn");
      await AsyncStorage.removeItem("userToken");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Image
          source={require("../assets/logo-blue.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#333" style={styles.logoutIcon} />
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        animationType="slide"
        visible={isMenuOpen}
        onRequestClose={() => setIsMenuOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setIsMenuOpen(false)}>
          <View style={styles.dropdownMenu}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => handleMenuItemPress(item)}
              >
                <Ionicons name={item.icon} size={24} color="#333" style={styles.menuItemIcon} />
                <Text style={styles.menuItemText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: "100%",
    paddingBottom: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  logo: {
    width: 37,
    height: 23,
  },
  logoutIcon: {
    fontSize: 24,
    fontWeight: "700",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  dropdownMenu: {
    width: 250,
    height: Dimensions.get("window").height,
    backgroundColor: "#f8f8f8",
    paddingTop: 50,
    borderRightWidth: 1,
    borderRightColor: "#e0e0e0",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  menuItemIcon: {
    marginRight: 10,
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
  },
});

export default TopBar;
