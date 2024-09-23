import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomLoader from '../components/CustomLoader';
import translateText from './../ult/TranslationService'; // Import your translation function
import { useFonts } from "expo-font"; // Import useFonts hook
// Import local images
import ScienceImage from '../assets/science.png';
import TechnologyImage from '../assets/tech.png';
import MondoImage from '../assets/mundo.png';
import EconoImage from '../assets/economia.png';
import CulturImage from '../assets/cultura.png';
import OpiniaoImage from '../assets/opiniao.png';
import EnglishImage from '../assets/english.png';
import SustentabilidadeImage from '../assets/sustentabilidade.png';
import PoliticaImage from '../assets/poli.png';
import SociaImage from '../assets/socia.png';
import LifeStyleImage from '../assets/lifestyle.jpg';
import DesportoImage from '../assets/sport.png';
import DefaultImage from '../assets/playstore.png'; // Fallback image if no category-specific image is available

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    "NotoSerifCondensed-Bold": require("../assets/fonts/static/NotoSerif_Condensed-Black.ttf"),
  });

  if (!fontsLoaded) {
    return null; // Return null or a loading component while fonts are loading
  } 
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true); // Set loading to true when fetching starts
    try {
      const response = await fetch('https://tejomag.com/wp-json/tejo-mag/v1/categories');
      const data = await response.json();

      // Translate category names and descriptions
      const translatedCategories = await Promise.all(
        data.map(async (category) => ({
          ...category,
          name: await translateText(category.name),
        }))
      );
      
      setCategories(translatedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false); // Set loading to false when fetching is complete
    }
  };

  const handleCategoryPress = (category) => {
    navigation.navigate('CategoryPage', { selectedCategory: category.slug });
  };

  // Example mapping of category slugs to local images
  const categoryBackgrounds = {
    ciencia: ScienceImage,
    tecnologia: TechnologyImage,
    mundo: MondoImage,
    economia: EconoImage,
    cultura: CulturImage,
    opiniao: OpiniaoImage,
    english: EnglishImage,
    sustentabilidade: SustentabilidadeImage,
    politica: PoliticaImage,
    sociedade: SociaImage,
    lifestyle: LifeStyleImage,
    desporto: DesportoImage,
    // Add other category-specific images here
  };

  const renderCategory = (item) => {
    // Use local image based on category slug or default image
    const backgroundImage = categoryBackgrounds[item.slug] || DefaultImage;

    return (
      <TouchableOpacity 
        key={item.id}
        style={styles.categoryContainer} 
        onPress={() => handleCategoryPress(item)}
      >
        <View style={styles.card}>
          <Image
            source={backgroundImage}
            style={styles.image}
          />
          <View style={styles.overlay}>
            <Text style={styles.categoryName}>{item.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
         <CustomLoader text="" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.gridContainer}>
      {categories.map((category) => renderCategory(category))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Ensure the background is white while loading
    height: Dimensions.get("window").height / 1.4,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryContainer: {
    width: '50%',
    padding: 5,
  },
  card: {
    backgroundColor: '#e0e0e0',
    minHeight: 120,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 120,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: "flex-end",
    alignItems: 'flex-start',
    padding: 10,
  },
  categoryName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
    textAlign: 'left',
    fontFamily: "NotoSerifCondensed-Bold",
  },
  categoryDescription: {
    textAlign: 'left',
    fontSize: 12,
    color: '#fff',
    marginTop: 5,
  },
});

export default CategoryGrid;
