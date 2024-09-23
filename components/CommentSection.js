import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommentInput from './Commentbox'; // Ensure this path is correct
import translateText from '../ult/TranslationService';
import { cleanText } from '../ult/textCleaner'; 
const DEFAULT_LANGUAGE = "pt-BR"; // Portuguese (Brazil)


const CommentSection = () => {
  const route = useRoute();
  const { id: postId } = route.params;
  const [comments, setComments] = useState([]);
  const [pendingComments, setPendingComments] = useState([]);
  const [visibleComments, setVisibleComments] = useState(3);
  const [expanded, setExpanded] = useState(false);
  const [translations, setTranslations] = useState({
    title: ["Comments", "Translating..."],
    pendingTitle: ["Pending Comments", "Translating..."],
    noComments: ["No comments yet", "Translating..."],
    seeMore: ["See More", "Translating..."],
    seeLess: ["See Less", "Translating..."],
    pendingLabel: ["Pending Approval", "Translating..."],
  });
  const [loadingTranslations, setLoadingTranslations] = useState(true);

  useEffect(() => {
    fetchComments();
    fetchPendingComments();
    fetchTranslations();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`https://tejomag.com/wp-json/tejo-mag/v1/comments?post_id=${postId}`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchPendingComments = async () => {
    try {
      const pending = await AsyncStorage.getItem(`pendingComments_${postId}`);
      if (pending) {
        setPendingComments(JSON.parse(pending));
      }
    } catch (error) {
      console.error('Error fetching pending comments:', error);
    }
  };

  const fetchTranslations = async () => {
    try {
      const storedLanguage =
        (await AsyncStorage.getItem("selectedLanguage")) || DEFAULT_LANGUAGE;

   

      // Fetch all translations
      for (const key in translations) {
        const translatedText = await translateText(translations[key][0], key);
        setTranslations((prevTranslations) => ({
          ...prevTranslations,
          [key]: [prevTranslations[key][0], translatedText]
        }));
      }

      setLoadingTranslations(false);

    } catch (error) {
      console.error("Error fetching translations:", error);
      setLoadingTranslations(false);
    }
  };

  const handleSeeMore = () => {
    setExpanded(!expanded);
    setVisibleComments(expanded ? 3 : comments.length);
  };

  const handleNewComment = (newComment) => {
    setComments(prevComments => [newComment, ...prevComments]);
    setPendingComments(prevPending => prevPending.filter(comment => comment.comment_ID !== newComment.comment_ID));
    AsyncStorage.setItem(`pendingComments_${postId}`, JSON.stringify(pendingComments));
  };

  return (
    <View style={styles.container}>
      {loadingTranslations ? (
        <ActivityIndicator size="large" color="#1F6CAE" />
      ) : (
        <>
          <Text style={styles.title}>{translations.title[1]}</Text>
          
          {/* Display pending comments */}
          {pendingComments.length > 0 && (
            <View>
              <Text style={styles.pendingTitle}>{translations.pendingTitle[1]}</Text>
              {pendingComments.slice(0, visibleComments).map((comment, index) => (
                <View key={index} style={styles.commentContainer}>
                  <Text style={styles.commentAuthor}>{cleanText(comment.author)}</Text>
                  <Text style={styles.commentDate}>{new Date().toLocaleDateString()}</Text>
                  <Text style={styles.commentContent}>{cleanText(comment.content)}</Text>
                  <Text style={styles.pendingLabel}>{translations.pendingLabel[1]}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Display approved comments */}
          {comments.length > 0 ? (
            comments.slice(0, visibleComments).map((comment) => (
              <View key={comment.comment_ID} style={styles.commentContainer}>
                <Text style={styles.commentAuthor}>{cleanText(comment.comment_author)}</Text>
                <Text style={styles.commentDate}>{new Date(comment.comment_date).toLocaleDateString()}</Text>
                <Text style={styles.commentContent}>{cleanText(comment.comment_content)}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noComments}>{translations.noComments[1]}</Text>
          )}

          {comments.length > 3 && (
            <TouchableOpacity onPress={handleSeeMore} style={styles.seeMoreButton}>
              <Text style={styles.seeMoreText}>
                {expanded ? translations.seeLess[1] : translations.seeMore[1]}
              </Text>
            </TouchableOpacity>
          )}

          {/* Comment Input Component */}
          <CommentInput onCommentSubmit={handleNewComment} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 20,
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
  },
  pendingTitle: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 10,
    color: '#777',
  },
  commentContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    backgroundColor: '#f9f9f9', // Background color for better contrast
    borderRadius: 8, // Rounded corners for a card-like effect
    width: '100%', // Ensure the card spans the width of the container
  },
  commentAuthor: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  commentDate: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  },
  commentContent: {
    fontSize: 16,
  },
  pendingLabel: {
    fontSize: 14,
    color: '#FFA500', // Orange color for pending status
    fontStyle: 'italic',
    marginTop: 5,
  },
  noComments: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
  seeMoreButton: {
    alignItems: 'center',
    marginTop: 15,
  },
  seeMoreText: {
    fontSize: 16,
    color: '#1F6CAE',
    fontWeight: 'bold',
  },
});

export default CommentSection;
