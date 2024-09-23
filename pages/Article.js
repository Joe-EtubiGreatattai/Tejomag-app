import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Platform,
  Text,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import Header from "./../components/TopbarSubscribe";
import ArticlePage from "./../components/ArticlePage";
import VideoPlayer from "./../components/VideoPlayer";
import Slider from "./../components/SliderShow";
import NewsLetter from "./../components/NewsLetter";
import RelatedStories from "./../components/RelatedStories";
import CommentSection from "../components/CommentSection";
import RenderHtml from "react-native-render-html";
import CustomLoader from "../components/CustomLoader";

const contentWidth = Dimensions.get("window").width;

const Article = () => {
  const route = useRoute();
  const { id } = route.params;
  const [postData, setPostData] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPostData = useCallback(async () => {
    try {
      const [postResponse, commentsResponse] = await Promise.all([
        fetch(`https://tejomag.com/wp-json/tejo-mag/v1/post?id=${id}`),
        fetch(`https://tejomag.com/wp-json/tejo-mag/v1/comments?post_id=${id}`),
      ]);

      if (!postResponse.ok) {
        throw new Error(`Network response was not ok: ${postResponse.statusText}`);
      }

      const [postData, commentsData] = await Promise.all([
        postResponse.json(),
        commentsResponse.json(),
      ]);

      setPostData(postData);
      setComments(commentsData);

      // Fetch related posts
      const categorySlug = postData.taxonomies?.categories?.[0]?.slug;
      if (categorySlug) {
        const relatedResponse = await fetch(
          `https://tejomag.com/wp-json/tejo-mag/v1/posts?limit=4&category=${categorySlug}`
        );
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          setRelatedPosts(relatedData.filter(post => post.post.ID !== id).slice(0, 3));
        }
      }
    } catch (error) {
      console.error("Error fetching post data:", error);
      setError("Failed to fetch article. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPostData();
  }, [fetchPostData]);

  const renderItem = useCallback(({ item }) => {
    switch (item.type) {
      case 'article':
        return (
          <ArticlePage
            title={item.title}
            image={item.image}
            category={item.category}
            author={item.author}
            date={item.date}
            excerpt={item.excerpt}
            permalink={item.permalink}
          />
        );
      case 'content':
        return (
          <RenderHtml
            contentWidth={contentWidth}
            source={{ html: item.content }}
            baseStyle={styles.htmlContent}
          />
        );
      case 'video':
        return item.videoUrl ? <VideoPlayer source={{ uri: item.videoUrl }} /> : null;
      case 'slider':
        return item.sliderImages.length > 0 ? <Slider images={item.sliderImages} /> : null;
      case 'related':
        return <RelatedStories relatedPosts={item.relatedPosts} />;
      case 'newsletter':
        return <NewsLetter />;
      case 'comments':
        return <CommentSection comments={item.comments} />;
      default:
        return null;
    }
  }, []);

  const keyExtractor = useCallback((item) => item.type, []);

  const flatListData = useMemo(() => {
    if (!postData) return [];
    const {
      post = {},
      taxonomies,
      thumbnail: image = null,
      meta: { videoUrl = null, sliderImages = [] } = {},
    } = postData;

    return [
      {
        type: 'article',
        title: post.title || "No Title Available",
        image,
        category: taxonomies?.categories?.[0]?.name || "No Category Available",
        author: post.author || "Unknown",
        date: post.date || "No Date Available",
        excerpt: post.excerpt || "",
        permalink: post.permalink || "#",
      },
      { type: 'content', content: post.content || "<p>No Content Available</p>" },
      { type: 'video', videoUrl },
      { type: 'slider', sliderImages },
      { type: 'related', relatedPosts },
      { type: 'newsletter' },
      { type: 'comments', comments },
    ];
  }, [postData, relatedPosts, comments]);

  if (loading) {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.loadingContainer}>
          <CustomLoader text="Please wait..." />
        </View>
      </KeyboardAvoidingView>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={styles.container}>
        <Header />
        <FlatList
          data={flatListData}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.flatListContent}
          removeClippedSubviews={Platform.OS === 'android'}
          initialNumToRender={2}
          maxToRenderPerBatch={1}
          updateCellsBatchingPeriod={100}
          windowSize={7}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorText: {
    fontSize: 16,
    color: "#333",
  },
  htmlContent: {
    fontSize: 18,
    lineHeight: 32,
    color: "#333",
  },
});

export default Article;