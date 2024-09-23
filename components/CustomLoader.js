// CustomLoader.js
import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { useSpring, animated } from '@react-spring/native';

const CustomLoader = ({ text }) => {
  // Define the pulsing animation for the logo
  const pulseAnimation = useSpring({
    to: { opacity: 1, scale: 1.2 },
    from: { opacity: 0.6, scale: 1 },
    reset: true,
    reverse: true,
    config: { duration: 1000 },
    loop: true
  });


  return (
    <View style={styles.container}>
      <animated.View style={[styles.logoContainer, pulseAnimation]}>
        <Image
          source={require('../assets/appstore.png')}
          style={styles.logo}
        />
      </animated.View>
      <Text style={styles.text}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Change as needed
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: '#1F6CAE', // Change as needed
  },
});

export default CustomLoader;
