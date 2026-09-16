import React, {useRef, useState} from 'react';
import {
  View,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

const {width, height} = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    image: require('../../assets/images/onboarding1.png'),
  },
  {
    id: '2',
    image: require('../../assets/images/onboarding2.png'),
  },
  {
    id: '3',
    image: require('../../assets/images/onboarding3.png'),
  },
];

const OnboardingScreen = ({navigation}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const onViewableItemsChanged = useRef(({viewableItems}) => {
    if (
      viewableItems?.length > 0 &&
      viewableItems[0]?.index != null
    ) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  // NEXT
  const goNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      navigation.replace('Login');
    }
  };

  const skipOnboarding = () => {
    navigation.replace('Login');
  };

  // PREVIOUS
  const goPrevious = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
    }
  };

  return (
    <View style={styles.container}>

      <StatusBar
        hidden
      />

      {/* ================= FULL SCREEN IMAGE ================= */}

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        renderItem={({item}) => (
          <View style={styles.slide}>
            <Image
              source={item.image}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}
        keyExtractor={item => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfig}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      {currentIndex > 0 && (
        <TouchableOpacity
          style={styles.leftArrowTouch}
          onPress={goPrevious}
          activeOpacity={1}
          accessibilityLabel="Previous onboarding screen"
        />
      )}

      <TouchableOpacity
        style={styles.rightArrowTouch}
        onPress={goNext}
        activeOpacity={1}
        accessibilityLabel="Next onboarding screen"
      />

      <TouchableOpacity
        style={styles.skipTouch}
        onPress={skipOnboarding}
        activeOpacity={1}
        accessibilityLabel="Skip onboarding"
      />

    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#050510',
  },

  slide: {
    width: width,
    height: height,
  },

  image: {
    width: width,
    height: height,
  },

  // ==========================================
  // LEFT ARROW TOUCH AREA
  // ==========================================

  leftArrowTouch: {
    position: 'absolute',
    left: 0,
    bottom: 40,
    width: width * 0.35,
    height: 180,
    backgroundColor: 'transparent',
  },

  rightArrowTouch: {
    position: 'absolute',
    right: 0,
    bottom: 40,
    width: width * 0.35,
    height: 180,
    backgroundColor: 'transparent',
  },

  skipTouch: {
    position: 'absolute',
    top: 70,
    right: 0,
    width: width * 0.3,
    height: 100,
    backgroundColor: 'transparent',
  },
};

export default OnboardingScreen;