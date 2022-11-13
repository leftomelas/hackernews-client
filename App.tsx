import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { FlashList } from '@shopify/flash-list';

const queryClient = new QueryClient();

const fetchFrontPage = async () => {
  const response = await fetch(
    'http://hn.algolia.com/api/v1/search?tags=front_page',
  );
  const json = await response.json();
  return json;
};

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.header}>Front Page</Text>
    </View>
  );
};

const UnreadIcon = () => {
  return <View style={styles.unreadIcon} />;
};

const JSONStringify = ({ children, style }) => {
  return (
    <ScrollView style={style}>
      <Text>{JSON.stringify(children, null, 2)}</Text>
    </ScrollView>
  );
};

const Item = ({ title }) => (
  <View style={styles.itemContainer}>
    <View style={styles.unreadContainer}>
      <UnreadIcon />
    </View>
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  </View>
);

const List = () => {
  const query = useQuery({ queryKey: ['front_page'], queryFn: fetchFrontPage });

  if (query.isLoading) {
    return (
      <View style={styles.listViewLoading}>
        <Text style={styles.listViewLoadingText}>Checking for Updates...</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => <Item title={item.title} />;

  const data = query.data.hits.map((item) => ({
    url: item.url,
    title: item.title,
    numberOfComments: item.num_comments,
    id: item.objectID,
  }));

  return (
    <ScrollView style={styles.listView}>
      {/* <JSONStringify style={styles.jsonView}>{query}</JSONStringify> */}
      <FlashList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </ScrollView>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={styles.container}>
        <Header />
        <List />
        <StatusBar style="auto" />
      </SafeAreaView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  headerContainer: {
    height: 54,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  header: {
    fontSize: 34,
    fontWeight: 'bold',
  },
  listView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listViewLoading: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f4f4f7',
    paddingTop: 2 * 44,
  },
  listViewLoadingText: {
    fontSize: 15,
    color: '#8e8e93',
  },
  itemContainer: {
    backgroundColor: '#fff',
    minHeight: 60,
    flexDirection: 'row',
  },
  unreadContainer: {
    paddingTop: 15, // Figma showed 13?
    paddingHorizontal: 8,
  },
  item: {
    flex: 1,
    // backgroundColor: '#ff9',
    borderTopWidth: 1,
    borderTopColor: '#e5e5ea',
    paddingVertical: 8,
    paddingRight: 20,
  },
  title: {
    fontSize: 17,
    lineHeight: 22,
    // fontFamily: 'System',
  },
  jsonView: {
    height: 100,
    paddingHorizontal: 20,
    backgroundColor: '#fbfbfb',
  },
  unreadIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#477aff',
  },
});
