import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const CategoryView = ({ title, category, mainArticle, otherArticles }) => {
  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    "NotoSerifCondensed-Bold": require("../assets/fonts/static/NotoSerif_Condensed-ExtraBold.ttf"),
  });

  if (!fontsLoaded) {
    return null; // Render nothing until the font is loaded
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { fontFamily: "NotoSerifCondensed-Bold" }]}>
        {title}
      </Text>

      <TouchableOpacity
        onPress={() => navigation.navigate("Article", { id: mainArticle.id })}
      >
        <ImageBackground
          source={{ uri: mainArticle.image.uri }}
          style={styles.mainArticle}
          imageStyle={styles.image}
        >
          {/* Add a gradient overlay */}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={styles.gradient}
          />
          <Text style={styles.category}>{category}</Text>
          <Text
            style={[
              styles.mainTitle,
              { fontFamily: "NotoSerifCondensed-Bold" },
            ]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {mainArticle.title}
          </Text>
          <Text style={styles.date}>{mainArticle.date}</Text>
        </ImageBackground>
      </TouchableOpacity>

      <View style={styles.smallArticlesContainer}>
        {otherArticles.map((article) => (
          <TouchableOpacity
            key={article.id}
            onPress={() => navigation.navigate("Article", { id: article.id })}
          >
            <ImageBackground
              source={{ uri: article.image.uri }}
              style={styles.smallArticle}
              imageStyle={styles.image}
            >
              {/* Add a gradient overlay */}
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.7)"]}
                style={styles.gradientSmall}
              />
              <Text
                style={styles.smallTitle}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {article.title}
              </Text>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "center",
    justifyContent: "center",
    marginVertical: 0,
    width: Dimensions.get("window").width,
  },
  heading: {
    fontSize: 24,
    marginBottom: 15,
    fontWeight: "bolder",
    marginLeft: 15,
  },
  mainArticle: {
    width: Dimensions.get("window").width - 20,
    height: 219,
    justifyContent: "flex-end",
    marginBottom: 20,
    marginHorizontal: "auto",
  },
  smallArticlesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 10,
  },
  smallArticle: {
    width: Dimensions.get("window").width / 2 - 15,
    height: 120,
    justifyContent: "flex-end",
    borderRadius: 10,
    marginBottom: 10,
    minHeight: 80,
  },
  image: {
    borderRadius: 10,
    width: "100%",
  },
  category: {
    backgroundColor: "purple",
    color: "white",
    padding: 5,
    marginLeft: 10,
    borderRadius: 15,
    fontSize: 12,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  mainTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "700",
    color: "white",
    paddingHorizontal: 5,
    marginLeft: 10,
  },
  date: {
    fontSize: 14,
    color: "white",
    padding: 5,
    paddingTop: 0,
    marginBottom: 10,
    marginLeft: 10,
  },
  smallTitle: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    padding: 10,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "60%", // Adjust this to control how much of the card is covered by the gradient
    borderRadius: 10,
  },
  gradientSmall: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "70%", // Adjust this for smaller articles
    borderRadius: 10,
  },
});

export default CategoryView;
