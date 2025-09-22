import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';

const SplashScreen = ({ navigation }: any) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (imageLoaded) {
      const timeout = setTimeout(() => {
        navigation.replace('AppTabs');
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [imageLoaded, navigation]);

  return (
    <View style={styles.container}>
      {imageLoaded && (
        <Image
          source={require('../../../src/assets/main_logo.png')}
          style={styles.logo}
          resizeMode="contain"
          onLoad={() => setImageLoaded(true)}
        />
      )}
      {!imageLoaded && (
        <Image
          source={require('../../../src/assets/main_logo.png')}
          style={styles.logo}
          resizeMode="contain"
          onLoad={() => setImageLoaded(true)}
        />
      )}
    </View>
  );
};

export default SplashScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333333',
  },
});
