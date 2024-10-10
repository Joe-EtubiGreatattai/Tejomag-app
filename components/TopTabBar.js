import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  Modal,
  Pressable,
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import translateText from './../ult/TranslationService';

const Tab = ({ title, active, onPress }) => (
  <TouchableOpacity
    style={[styles.tab, active && styles.activeTab]}
    onPress={onPress}
  >
    <Text style={[styles.tabText, active && styles.activeTabText]}>
      {title.toUpperCase()}
    </Text>
  </TouchableOpacity>
);

const TopBar = ({ onCategoryChange, navigation }) => {
  const [activeTab, setActiveTab] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [translatedMenuItems, setTranslatedMenuItems] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("https://tejomag.com/wp-json/tejo-mag/v1/categories");
      const data = await response.json();
      const filteredCategories = data.filter(category => category.count > 0 && category.slug !== "uncategorized");
      
      const translatedCategories = await Promise.all(
        filteredCategories.map(async (category) => ({
          ...category,
          name: (await translateText(category.name)).toUpperCase(),
        }))
      );
      
      // Add "Latest News" as the first category (in uppercase)
      const categoriesWithLatest = [
        { id: 'latest', name: 'ULTIMAS NOTICIAS', slug: 'latest' },
        ...translatedCategories
      ];
      
      setCategories(categoriesWithLatest);
      setActiveTab(categoriesWithLatest[0]?.name || "");
      onCategoryChange(categoriesWithLatest[0]?.slug || "");
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleTabPress = (slug, title) => {
    setActiveTab(title);
    onCategoryChange(slug);
  };

  const handleMenuItemPress = (item) => {
    setIsMenuOpen(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/logo-blue.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Modal
        transparent={true}
        animationType="slide"
        visible={isMenuOpen}
        onRequestClose={() => setIsMenuOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setIsMenuOpen(false)}>
          <View style={styles.dropdownMenu}>
            {translatedMenuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => handleMenuItemPress(item)}
              >
                <Ionicons name={item.icon} size={24} color="#333" style={styles.menuItemIcon} />
                <Text style={styles.menuItemText}>{item.title.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      <View style={styles.tabContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {categories.map((category) => (
            <Tab
              key={category.id}
              title={category.name}
              active={activeTab === category.name}
              onPress={() => handleTabPress(category.slug, category.name)}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: Dimensions.get("window").width,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  menuIcon: {
    fontSize: 24,
  },
  logo: {
    width: 37.63,
    height: 23,
  },
  profileIcon: {
    fontSize: 20,
    fontWeight: "700",
  },
  tabContainer: {
    flexDirection: "row",
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 14,
    fontWeight: "bold",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#0066cc",
  },
  activeTabText: {
    color: "#0066cc",
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  dropdownMenu: {
    width: 250,
    height: "100%",
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