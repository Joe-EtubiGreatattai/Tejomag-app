import React, { createContext, useContext, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Import your screens
import LoginScreen from '../pages/Login';
import SignInScreen from '../pages/Sign-up';
import HomeScreen from '../pages/Home';
import ArticleScreen from '../pages/Article';
import SettingsPage from '../pages/Setting';
import TermOfUseScreen from '../pages/TermsOfUse';
import AboutusScreen from '../pages/Aboutus';
import SearchScreen from '../pages/Search';
import CategoryScreen from '../pages/Category';
import Categoriespage from '../components/CategoryPage';
import ForgotPassword from '../pages/forgotPassword';
import NewPassword from '../pages/EnterNewPassword';
import MagicEmail from '../pages/Magic-link-screen-onboarding';

// Import the custom loader component
import CustomLoader from '../components/CustomLoader'; // Adjust the path as needed

const Stack = createStackNavigator();
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for the token when the app loads
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      setIsLoggedIn(!!userToken);
    } catch (error) {
      console.error('Error checking login status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://tejomag.com/wp-json/tejo-mag/v1/login",
        { email, password }
      );
      if (response.data.status === "success") {
        await AsyncStorage.setItem("userToken", response.data.token);
        await AsyncStorage.setItem("userInfo", JSON.stringify(response.data.user));
        setIsLoggedIn(true);
        return { success: true, userName: response.data.user.name };
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (error) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error.response) {
        errorMessage = error.response.data.message || "Invalid email or password.";
      } else if (error.request) {
        errorMessage = "Unable to connect to the server. Please check your internet connection.";
      }
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userInfo");
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function AppNavigator() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    // Display the custom loader while loading
    return <CustomLoader text="Please wait..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Article" component={ArticleScreen} />
            <Stack.Screen name="Settings" component={SettingsPage} />
            <Stack.Screen name="TermsOfUse" component={TermOfUseScreen} />
            <Stack.Screen name="Aboutus" component={AboutusScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="Categories" component={CategoryScreen} />
            <Stack.Screen name="CategoryPage" component={Categoriespage} />
          </>
        ) : (
          <>
          
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignInScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="NewPassword" component={NewPassword} />
            <Stack.Screen name="magicEmail" component={MagicEmail} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
