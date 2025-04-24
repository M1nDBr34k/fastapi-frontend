// ListTasksScreen.jsx
import React, { useCallback, memo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/* ----------------------------------
   main component
-----------------------------------*/
const ListTasksScreen = ({
  navigation,
  route,
  tasks,
  deleteTask,
  toggleTaskCompletion,
  editTask,
  isDarkMode,
}) => {
  const listName = route.params?.listName ?? 'General List';

  // Define categories array as user confirmed
  const categories = [
    { name: 'Wish List' },
    { name: 'Go to List' },
    { name: 'Shopping List' },
  ];

  const [categorizedData, setCategorizedData] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const updated = categories.map((cat) => {
        const count = cat.name === 'General List'
          ? tasks.length
          : tasks.filter((t) => t.category === cat.name).length;

        return { ...cat, count };
      });
      setCategorizedData(updated);
    }, [tasks])
  );

  /* --- filter the tasks that belong to this list --- */
  const listTasks = tasks.filter((t) =>
    listName === 'General List' ? true : t.category === listName
  );

  /* --- renderer (memoised to avoid re‑creation) --- */
  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={[
          styles.taskItem,
          isDarkMode ? styles.darkTaskItem : styles.lightTaskItem,
          item.completed && styles.completedTask,
        ]}
        onPress={() => toggleTaskCompletion(item.id)}
        onLongPress={() => navigation.navigate('AddTask', { taskToEdit: item })}
      >
        <View style={styles.taskContent}>
          <Ionicons
            name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
            size={24}
            color={isDarkMode ? '#8b5cf6' : '#6d28d9'}
          />
          <Text
            style={[
              styles.taskText,
              isDarkMode ? styles.darkText : styles.lightText,
              item.completed && styles.completedTaskText,
            ]}
          >
            {String(item.text ?? '')}
          </Text>
        </View>

        <TouchableOpacity onPress={() => deleteTask(item.id)}>
          <Ionicons
            name="trash-outline"
            size={20}
            color={isDarkMode ? '#9ca3af' : '#6b7280'}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    ),
    [isDarkMode, toggleTaskCompletion, deleteTask, navigation]
  );

  /* --- screen output --- */
  return (
    <View
      style={[
        styles.container,
        isDarkMode ? styles.darkContainer : styles.lightContainer,
      ]}
    >
      {/* ---------- header ---------- */}
      <View
        style={[
          styles.header,
          isDarkMode ? styles.darkHeader : styles.lightHeader,
        ]}
      >
        <TouchableOpacity onPress={navigation.goBack}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={isDarkMode ? '#fff' : '#000'}
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.headerTitle,
            isDarkMode ? styles.darkText : styles.lightText,
          ]}
          numberOfLines={1}
        >
          {listName}
        </Text>

        {/* Invisible view to balance the back button width */}
        <View style={{ width: 24 }} />
      </View>

      {/* ---------- list ---------- */}
      <FlatList
        data={listTasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text
              style={[
                styles.emptyText,
                isDarkMode ? styles.darkSubText : styles.lightSubText,
              ]}
            >
              No tasks in this list
            </Text>
          </View>
        }
      />

      {/* ---------- add‑task FAB ---------- */}
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: getCategoryColor(listName) }]}
        onPress={() => navigation.navigate('AddTask', { presetCategory: listName })}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

/* -------------- helpers -------------- */
const getCategoryColor = (category) =>
  ({
    'General List': '#8b5cf6',
    'Wish List': '#ec4899',
    'Go to List': '#3b82f6',
    'Shopping List': '#10b981',
  }[category] || '#6b7280');

/* -------------- styling -------------- */
const styles = StyleSheet.create({
  container: { flex: 1 },
  lightContainer: { backgroundColor: '#f8fafc' },
  darkContainer: { backgroundColor: '#121212' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  lightHeader: { borderBottomColor: '#e5e7eb' },
  darkHeader: { borderBottomColor: '#374151' },

  headerTitle: { flex: 1, textAlign: 'center', fontSize: 20, fontWeight: 'bold' },

  listContent: { padding: 16 },

  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  lightTaskItem: { backgroundColor: '#ffffff' },
  darkTaskItem: { backgroundColor: '#1e1e1e' },

  taskContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  taskText: { marginLeft: 12, flex: 1 },
  lightText: { color: '#1f2937' },
  darkText: { color: '#f3f4f6' },
  lightSubText: { color: '#6b7280' },
  darkSubText: { color: '#9ca3af' },

  completedTask: { opacity: 0.6 },
  completedTaskText: { textDecorationLine: 'line-through' },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 16, textAlign: 'center' },

  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

/* memo export to avoid unnecessary re‑renders */
export default memo(ListTasksScreen);
