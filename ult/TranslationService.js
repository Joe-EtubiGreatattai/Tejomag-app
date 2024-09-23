import AsyncStorage from "@react-native-async-storage/async-storage";

// const translateText = async (text) => {
//   try {
//     const storedLanguage = await AsyncStorage.getItem("selectedLanguage") || "pt-BR";

//     const response = await fetch("https://tejomag.com/wp-json/tejo-mag/v1/translate", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         targetLanguage: storedLanguage,
//         inputText: text,
//         token: "AIzaSyDgj3F_sCfXMVJ6ulCaAdGhRUBOXd4ygYM",
//       }),
//     });

//     const result = await response.text();
   
//     // Check for the specific error message
//     if (result.includes('Gemini API operation failed:') && result.includes('status_code=429')) {
//       return text;
//     }

//     const translatedText = result || text;

//     if (typeof translatedText !== "string") {
//       return text;
//     }

//     // Decode unicode escape sequences
//     return translatedText.replace(/\\u[\dA-F]{4}/gi, (match) =>
//       String.fromCharCode(parseInt(match.replace(/\\u/, ""), 16))
//     );
//   } catch (error) {
//     console.error("Translation error:", error);
//     return text;
//   }
// };

const translateText = async (text) => {
  try {
    const storedLanguage = await AsyncStorage.getItem("selectedLanguage") || "pt-BR";
   
    // Simply return the original text without any translation
    return text;
  } catch (error) {
    console.error("Error returning text:", error);
    return text;
  }
};

export default translateText;
