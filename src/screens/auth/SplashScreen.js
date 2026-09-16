import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';

const {width, height} = Dimensions.get('window');

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#030018"
        translucent={false}
      />

      <Image
        source={require('../../assets/images/SplasshNew.png')}
        style={styles.splashImage}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030018',
  },

  splashImage: {
    width: width,
    height: height,
  },
});

export default SplashScreen;