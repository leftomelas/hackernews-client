import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  useWindowDimensions,
  PlatformColor,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlashList } from '@shopify/flash-list';

import { RenderHtml } from './RenderHtml';
import type { StackParamList } from '../App';
import { useStory } from './hooks';
import { Comment } from './Comment';
import { MixedStyleDeclaration } from 'react-native-render-html';

const openInBrowser = (url: string) => {
  WebBrowser.openBrowserAsync(url, {
    presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
  });
};

type Props = NativeStackScreenProps<StackParamList, 'Story'>;

export const StoryScreen = ({ route, navigation }: Props) => {
  const { id, title } = route.params;
  const { story, isLoading, isRefreshing, onRefresh } = useStory(id);

  const { width } = useWindowDimensions();

  // navigation.setOptions({ title: story?.title ?? title });

  const onPressStoryTitle = () => {
    openInBrowser(story?.url ?? '');
  };

  //   <FlashList
  //   data={stories}
  //   renderItem={renderItem}
  //   keyExtractor={(item) => '' + item.id}
  // />
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <Pressable onPress={onPressStoryTitle}>
          <Header>{story?.title ?? ''}</Header>
        </Pressable>
        <View style={styles.storyTextContainer}>
          <RenderHtml
            source={{ html: story?.text ?? '' }}
            contentWidth={width}
          />
        </View>
        <FlashList
          data={story?.comments}
          renderItem={({ item }) => (
            <Comment comment={item} level={0} key={item.id} />
          )}
          keyExtractor={(comment) => '' + comment.id}
        />
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const Header = ({ children }: { children: string }) => {
  const { width } = useWindowDimensions();

  const baseStyle: MixedStyleDeclaration = {
    fontSize: 34,
    fontWeight: 'bold',
    color: PlatformColor('label'),
  };

  return (
    <View style={styles.headerContainer}>
      <RenderHtml
        source={{ html: children }}
        baseStyle={baseStyle}
        contentWidth={width}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PlatformColor('systemBackground'),
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 12,
  },
  header: {
    fontSize: 34,
    fontWeight: 'bold',
  },
  storyTextContainer: {
    paddingHorizontal: 20,
  },
  storyText: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: -0.40799999237060547,
    color: PlatformColor('label'),
  },
});
