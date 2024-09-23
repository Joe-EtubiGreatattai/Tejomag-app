import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, FontAwesome, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const BottomTab = ({ activePage }) => {
  const navigation = useNavigation(); // Initialize useNavigation hook

  // Define tabs with their corresponding screens and icons
  const tabs = [
    { name: 'Home', icon: 'home', type: 'Ionicons', screen: 'Home' },
    { name: 'Search', icon: 'search', type: 'Feather', screen: 'Search' },
    { name: 'Categories', icon: 'th-large', type: 'FontAwesome', screen: 'Categories' },
    { name: 'Settings', icon: 'gear', type: 'FontAwesome', screen: 'Settings' },
  ];

  // Handle tab press and navigation
  const handleTabPress = (tabName, screen) => {
    navigation.navigate(screen); // Navigate to the specified screen
  };

  return (
    <View style={styles.navbar}>
      {tabs.map((tab) => {
        const IconComponent = getIconComponent(tab.type);
        return (
          <TouchableOpacity
            key={tab.name}
            style={[styles.tab, activePage === tab.name && styles.activeTab]}
            onPress={() => handleTabPress(tab.name, tab.screen)}
          >
            <IconComponent
              name={tab.icon}
              size={24}
              color={activePage === tab.name ? '#fff' : '#888'}
            />
            <Text style={[styles.label, activePage === tab.name && styles.activeLabel]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// Function to return the correct icon component based on the type
const getIconComponent = (type) => {
  switch (type) {
    case 'Ionicons':
      return Ionicons;
    case 'FontAwesome':
      return FontAwesome;
    case 'Feather':
      return Feather;
    default:
      return Ionicons;
  }
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#333',
    paddingVertical: 10,
    elevation: 10, // Replace boxShadow with elevation for Android
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
  },
  activeTab: {
    
  },
  label: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
  },
  activeLabel: {
    color: '#fff',
  },
});

export default BottomTab;
