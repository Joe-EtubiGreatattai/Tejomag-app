import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Dimensions,
} from "react-native";
import uuid from "react-native-uuid";
import NewsCard from "./NewsCard";
import NewsArticleCard from "./NewsCardTwo";
import NewsArticleCardFour from "./NewsCardFour";
import NewsArticleFive from "./NewsCardFive";
import Popular from "./NewsCardThree";
import CategoryView from "./CategoryGrid";
import CustomLoader from '../components/CustomLoader';

const PLACEHOLDER_IMAGE = { uri: 'https://example.com/path/to/placeholder-image.png' };

const Content = ({ category, onPress }) => {
  const [newsItems, setNewsItems] = useState([]);
  const [popularItem, setPopularItem] = useState(null);
  const [gridItems, setGridItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [offset, setOffset] = useState(0);

  const fetchData = useCallback(async (reset = false) => {
    if (isLoading || (!hasMoreData && !reset)) return;

    setIsLoading(true);
    setError(null);

    try {
      const limit = 10;
      const newOffset = reset ? 0 : offset;
      let url;
      if (category === 'latest') {
        url = `https://tejomag.com/wp-json/tejo-mag/v1/posts?limit=${limit}&offset=${newOffset}&search=`;
      } else {
        url = `https://tejomag.com/wp-json/tejo-mag/v1/posts?limit=${limit}&offset=${newOffset}&category=${category}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      const articles = result.map((item) => ({
        id: item.post.ID,
        title: item.post.title,
        author: item.post.author,
        date: item.post.date,
        image: item.thumbnail ? { uri: item.thumbnail } : PLACEHOLDER_IMAGE,
        subtitle: item.post.excerpt,
        permalink: item.post.permalink,
        uniqueKey: uuid.v4(),
      }));

      if (reset) {
        setNewsItems(articles.slice(5));
        setPopularItem(articles[0]);
        setGridItems(articles.slice(0, 5));
        setOffset(5);
      } else {
        setNewsItems((prevItems) => [...prevItems, ...articles]);
        setOffset((prevOffset) => prevOffset + articles.length);
      }

      if (articles.length < limit) {
        setHasMoreData(false);
      } else {
        setHasMoreData(true);
      }
    } catch (error) {
      console.error("Error fetching news data:", error);
      setError("Failed to fetch news. Please try again later.");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [category, isLoading, hasMoreData, offset]);

  useEffect(() => {
    fetchData(true);
  }, [category]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData(true);
  }, [fetchData]);

  const renderNewsItem = ({ item, index }) => {
    switch (index % 4) {
      case 0:
        return (
          <NewsCard
            key={item.uniqueKey}
            id={item.id}
            title={item.title}
            author={item.author}
            date={item.date}
            image={item.image}
            permalink={item.permalink}
            onPress={() => onPress(item.id)}
            style={styles.centeredComponent}
          />
        );
      case 1:
        return (
          <NewsArticleCard
            key={item.uniqueKey}
            id={item.id}
            title={item.title}
            subtitle={item.subtitle}
            author={item.author}
            date={item.date}
            image={item.image}
            permalink={item.permalink}
            onPress={() => onPress(item.id)}
            style={styles.centeredComponent}
          />
        );
      case 2:
        return (
          <NewsArticleCardFour
            key={item.uniqueKey}
            logoSource={item.image}
            title={item.title}
            date={item.date}
            permalink={item.permalink}
            onPress={() => onPress(item.id)}
            style={styles.centeredComponent}
          />
        );
      case 3:
        return (
          <NewsArticleFive
            key={item.uniqueKey}
            id={item.id}
            title={item.title}
            subtitle={item.subtitle}
            author={item.author}
            date={item.date}
            image={item.image}
            permalink={item.permalink}
            onPress={() => onPress(item.id)}
            style={styles.centeredComponent}
          />
        );
    }
  };

  const getCategoryTitle = (category) => {
    const titles = {
      latest: "Ultimas noticias",
    };
    return titles[category] || category.charAt(0).toUpperCase() + category.slice(1);
  };

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <FlatList
      data={newsItems}
      keyExtractor={(item) => item.uniqueKey}
      renderItem={renderNewsItem}
      ListHeaderComponent={
        <>
          {gridItems.length === 5 && (
            <CategoryView
              title={getCategoryTitle(category)}
              mainArticle={gridItems[0]}
              otherArticles={gridItems.slice(1)}
              category={category}
            />
          )}
        </>
      }
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      onEndReached={() => fetchData()}
      onEndReachedThreshold={0.1}
      ListFooterComponent={
        isLoading && (
          <View style={styles.loadingFooter}>
            <CustomLoader text="Loading post . . . " />
          </View>
        )
      }
    />
  );
};

const styles = StyleSheet.create({
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  loadingFooter: {
    height: Dimensions.get("window").height / 1.4,
    alignItems: "center",
    justifyContent: "center",
  },
  footerContainer: {
    paddingVertical: 20,
  },
  centeredComponent: {
    alignSelf: "center",
  },
});

export default Content;