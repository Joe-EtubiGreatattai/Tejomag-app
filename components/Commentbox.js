import React, { useState, useRef, useEffect } from "react";
import { View, TextInput, StyleSheet, Platform, Alert, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/MaterialIcons';

const CommentInput = ({ onCommentSubmit }) => {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const route = useRoute();
  const { id: postId } = route.params;
  const [bearerToken, setBearerToken] = useState("");

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          setBearerToken(token);
        } else {
          console.error("No token found");
          Alert.alert("Error", "Authentication token not available.");
        }
      } catch (error) {
        console.error("Error retrieving token:", error);
        Alert.alert("Error", "Authentication token not available.");
      }
    };

    getToken();
  }, []);

  const handleSubmit = async () => {
    if (comment.trim() && bearerToken) {
      setLoading(true);
      try {
        const response = await fetch(
          "https://tejomag.com/wp-json/tejo-mag/v1/post-comment",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${bearerToken}`,
            },
            body: JSON.stringify({
              comment: comment,
              post_id: postId,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error(`Network response was not ok: ${response.status} ${response.statusText}`);
          console.error(`Error details: ${JSON.stringify(errorData)}`);
          Alert.alert(
            "Error",
            `Failed to submit comment. Server returned ${response.status} ${response.statusText}. ${errorData.message || 'No additional details available.'}`
          );
          return;
        }

        const data = await response.json();
       
        onCommentSubmit({
          comment_ID: data.comment_ID,
          comment_author: "You",
          comment_date: new Date().toISOString(),
          comment_content: comment,
        });
  
        setComment("");
      } catch (error) {
        console.error("Error submitting comment:", error);
        Alert.alert(
          "Error",
          "Failed to submit comment. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    } else if (!bearerToken) {
      Alert.alert("Error", "Authentication token not available.");
    } else {
      Alert.alert("Error", "Please enter a comment.");
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          comment && { backgroundColor: "#e0e0e0" },
        ]}
      >
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Enter comment"
          value={comment}
          onChangeText={setComment}
          multiline={true}
          onSubmitEditing={handleSubmit}
          returnKeyType="done"
          blurOnSubmit={Platform.OS === "ios"}
        />
        <TouchableOpacity onPress={handleSubmit} style={styles.sendButton}>
          {loading ? (
            <ActivityIndicator size="small" color="#1F6CAE" />
          ) : (
            <Icon name="send" size={24} color="#1F6CAE" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginHorizontal: "auto",
    padding: 0,
    marginBottom: 15,
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    backgroundColor: "#f7f7f7",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingHorizontal: 8,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    backgroundColor: "transparent",
  },
  sendButton: {
    padding: 8,
  },
});

export default CommentInput;
