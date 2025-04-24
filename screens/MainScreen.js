import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * MainScreen – fully responsive 🪄
 * --------------------------------------------------
 * – Uses useWindowDimensions so every rerender gets the
 *   current width/height of the device.
 * – CARD_GAP stays constant; card width is calculated
 *   from available width so two columns always fit.
 * – Font sizes & paddings scale with a ratio derived
 *   from the device width (similar to a Tailwind break‑
 *   point approach but in pure RN).
 */
const CARD_GAP = 16; // gap between cards & screen edge

const MainScreen = ({
  tasks,
  deleteTask,
  toggleTaskCompletion,
  editTask,
  isDarkMode,
  navigation,
}) => {
  const { width } = useWindowDimensions();

  // derive a scale factor (375 = reference iPhone 11 width)
  const scale = Math.max(0.85, Math.min(1.2, width / 375));

  // card width so exactly 2 per row incl. gaps
  const CARD_WIDTH = (width - CARD_GAP * 3) / 2;

const getCountByCategory = (catName) => {
  if (catName === 'General List') {
    return tasks.length;
  }
  // Use full category names consistently
  return tasks.filter((t) => t.category === catName).length;
};

const categories = [
  { name: 'General List', icon: 'list' },
  { name: 'Wish List', icon: 'heart' },
  { name: 'Go to List', icon: 'location' },
  { name: 'Shopping List', icon: 'cart' },
];

const categorizedData = categories.map((cat) => {
  const count =
    cat.name === 'General List'
      ? tasks.length
      : tasks.filter((t) => t.category === cat.name).length;

  return { ...cat, count };
});

  const renderCategoryCard = ({ item }) => (
    <TouchableOpacity
    style={[
      styles.categoryCard,
      { width: CARD_WIDTH },
      isDarkMode ? styles.darkCategoryCard : styles.lightCategoryCard,
    ]}
    onPress={() => navigation.navigate('ListTasks', { listName: item.name })}
    activeOpacity={0.8}
  >
      <View style={styles.categoryContent}>
        <View
          style={[
            styles.categoryIconContainer,
            { backgroundColor: getCategoryColor(item.name), transform: [{ scale }] },
          ]}
        >
          <Ionicons name={item.icon} size={24 * scale} color="#fff" />
        </View>
        <Text
          style={[
            styles.categoryTitle,
            { fontSize: 18 * scale },
            isDarkMode ? styles.darkText : styles.lightText,
          ]}
        >
          {item.name}
        </Text>
        <Text
          style={[
            styles.categoryCount,
            { fontSize: 14 * scale },
            isDarkMode ? styles.darkSubText : styles.lightSubText,
          ]}
        >
          You have {item.count} {item.name.includes('List') ? 'items' : 'things'}
        </Text>
      </View>
      <View style={[styles.viewButton, { paddingVertical: 8 * scale, paddingHorizontal: 12 * scale }] }>
        <Text style={[styles.viewButtonText, { fontSize: 14 * scale }]}>View</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        isDarkMode ? styles.darkContainer : styles.lightContainer,
        { paddingHorizontal: 16 * scale, paddingTop: 24 * scale },
      ]}
    >
      {/* Header */}
      <View style={[styles.header, { marginBottom: 24 * scale }] }>
        <Text
          style={[
            styles.timeText,
            { fontSize: 16 * scale, marginBottom: 4 * scale },
            isDarkMode ? styles.darkText : styles.lightText,
          ]}
        >
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
        <Text
          style={[
            styles.headerTitle,
            { fontSize: 32 * scale },
            isDarkMode ? styles.darkText : styles.lightText,
          ]}
        >
          To‑Do List
        </Text>
      </View>

      {/* Category grid */}
      <FlatList
      data={categorizedData}
        renderItem={renderCategoryCard}
        keyExtractor={(item) => item.name}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: CARD_GAP }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 * scale }}
      />
    </View>
  );
};

const getCategoryColor = (category) => {
  const colors = {
    'General List': '#8b5cf6',
    'Wish List': '#ec4899',
    'Go to List': '#3b82f6',
    'Shopping List': '#10b981',
  };
  return colors[category] || '#6b7280';
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  lightContainer: { backgroundColor: '#f8fafc' },
  darkContainer: { backgroundColor: '#121212' },
  header: { paddingHorizontal: 8 },
  timeText: { opacity: 0.7 },
  headerTitle: { fontWeight: 'bold' },
  lightText: { color: '#1f2937' },
  darkText: { color: '#f3f4f6' },
  lightSubText: { color: '#6b7280' },
  darkSubText: { color: '#9ca3af' },
  categoryCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  lightCategoryCard: { backgroundColor: '#ffffff' },
  darkCategoryCard: { backgroundColor: '#1e1e1e' },
  categoryContent: { marginBottom: 16 },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryTitle: { fontWeight: '600', marginBottom: 8 },
  categoryCount: {},
  viewButton: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  viewButtonText: { color: '#3b82f6', fontWeight: '600' },
});

export default MainScreen;
