import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Divider from "./Divider";
import translateText from "./../ult/TranslationService"; // Import the translateText function

const BASE_CATEGORIES_URL = "https://tejomag.com/wp-json/tejo-mag/v1/categories";

const SearchComponent = ({ onSearch, hidePopularSearches }) => { 
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [translatedCategories, setTranslatedCategories] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(BASE_CATEGORIES_URL);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        const filteredCategories = data
          .filter(category => category.count > 0 && category.slug !== "uncategorized")
          .slice(0, 6);

        // Translate category names
        const translated = await Promise.all(filteredCategories.map(async (category) => {
          const translatedName = await translateText(category.name);
          return { ...category, name: translatedName };
        }));

        setCategories(filteredCategories);
        setTranslatedCategories(translated);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  const clearInput = () => {
    setSearchTerm("");
    inputRef.current?.focus();
  };

  const handlePopularSearch = (slug) => {
    onSearch(slug);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.searchContainer, searchTerm && styles.searchContainerActive]}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          ref={inputRef}
          style={styles.searchInput}
          placeholder="Search by keyword"
          placeholderTextColor="#888"
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          blurOnSubmit={Platform.OS === "ios"}
        />
        {searchTerm ? (
          <TouchableOpacity onPress={clearInput} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#888" />
          </TouchableOpacity>
        ) : null}
      </View>

      {!hidePopularSearches && (
        <>
          <Divider color="#eee" thickness={1} />
          <Text style={styles.popularSearchTitle}>POPULAR SEARCHES</Text>
          <View style={styles.popularSearchContainer}>
            {translatedCategories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={styles.searchButton}
                onPress={() => handlePopularSearch(category.slug)}
              >
                <Text style={styles.searchButtonText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Divider color="#eee" thickness={1} />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    width: Dimensions.get("window").width,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    backgroundColor: "#F5F5F5",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  searchContainerActive: {
    backgroundColor: "#CECECE",
    borderBottomColor: "green",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    backgroundColor: "transparent",
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  clearButton: {
    marginLeft: 8,
  },
  popularSearchTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#963F6E",
    marginVertical: 16,
  },
  popularSearchContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  searchButton: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  searchButtonText: {
    fontSize: 14,
    color: "#000",
  },
});

export default SearchComponent;
