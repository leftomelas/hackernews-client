import React, { useRef } from 'react';
import { SymbolView } from 'expo-symbols';
import {
  Pressable,
  StyleSheet,
  View,
  PanResponder,
  PlatformColor,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// // import { useAsyncStorage } from '@react-native-async-storage/async-storage';

const NAVIGATION_BAR_HEIGHT = 44;
const BUTTON_SIZE = 44;
const BUTTON_MARGIN = 80;

export const FloatingButton = ({ onPress = () => {} }) => {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // TODO: understand why I need position and pan
  const position = useRef({
    x: BUTTON_MARGIN, // defaults somewhere bottom left of the screen
    y:
      height -
      insets.top -
      insets.bottom -
      BUTTON_SIZE -
      BUTTON_MARGIN -
      NAVIGATION_BAR_HEIGHT,
  });

  console.log('position', position.current);

  const pan = useRef(new Animated.ValueXY(position.current)).current;
  pan.addListener((value) => {
    position.current = value;
  });

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: position.current.x,
          y: position.current.y,
        });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
    }),
  ).current;

  return (
    <View style={styles.container}>
      <Animated.View
        {...panResponder.panHandlers}
        style={{
          transform: pan.getTranslateTransform(),
        }}
      >
        <Pressable onPress={onPress}>
          <SymbolView
            name="circle.fill"
            size={BUTTON_SIZE}
            style={styles.iconBackground}
          />
          <SymbolView
            name="chevron.down.circle"
            size={BUTTON_SIZE}
            style={styles.icon}
          />
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  iconBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    tintColor: PlatformColor('systemBackground'),
  },
  icon: {
    position: 'absolute',
    top: 0,
    left: 0,
    tintColor: PlatformColor('link'),
  },
});
