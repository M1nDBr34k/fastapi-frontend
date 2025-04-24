import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Animated
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AddTaskScreen = ({
  navigation,
  route,
  addTask,
  editTask,
  isDarkMode,
}) => {
  const [text, setText] = useState("");
  const [category, setCategory] = useState(route.params?.presetCategory || "General List");
  const [priority, setPriority] = useState("Medium");
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [buttonScale] = useState(new Animated.Value(1));

  useEffect(() => {
    if (route.params?.taskToEdit) {
      const { taskToEdit } = route.params;
      setText(taskToEdit.text);
      setCategory(taskToEdit.category);
      setPriority(taskToEdit.priority);
      setIsEditing(true);
      setCurrentTaskId(taskToEdit.id);
      navigation.setOptions({ title: "Edit Task" });
    } else if (route.params?.presetCategory) {
      setCategory(route.params.presetCategory);
      navigation.setOptions({ title: `Add to ${route.params.presetCategory}` });
    } else {
      setIsEditing(false);
      setCurrentTaskId(null);
      navigation.setOptions({ title: "Create Task" });
    }
  }, [route.params]);

  const handleSubmit = () => {
    if (text.trim()) {
      const newTask = {
        id: Date.now().toString(),
        text: text.trim(),
        completed: false,
        category,
        priority,
        createdAt: new Date().toISOString(),
      };
      addTask(newTask);
      navigation.goBack();
    }
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(handleSubmit);
  };

  const categories = ["General List", "Wish List", "Go to List", "Shopping List"];
  const priorities = ["Low", "Medium", "High"];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[
        styles.container,
        isDarkMode ? styles.darkContainer : styles.lightContainer,
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              isDarkMode ? styles.darkInput : styles.lightInput,
            ]}
            placeholder="What do you need to do?"
            placeholderTextColor={isDarkMode ? "#9ca3af" : "#9ca3af"}
            value={text}
            onChangeText={setText}
            multiline
            autoFocus
          />
        </View>

        <View style={styles.section}>
          <Text style={[
            styles.label,
            isDarkMode ? styles.darkLabel : styles.lightLabel
          ]}>
            Category
          </Text>
          <View style={styles.optionsContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.optionButton,
                  category === cat && styles.selectedOption,
                  {
                    borderColor: getCategoryColor(cat),
                    backgroundColor: category === cat 
                      ? getCategoryColor(cat) 
                      : isDarkMode 
                        ? 'rgba(30, 30, 30, 0.7)' 
                        : 'rgba(255, 255, 255, 0.7)'
                  },
                ]}
                onPress={() => setCategory(cat)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.optionText,
                  category === cat && styles.selectedOptionText
                ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[
            styles.label,
            isDarkMode ? styles.darkLabel : styles.lightLabel
          ]}>
            Priority
          </Text>
          <View style={styles.optionsContainer}>
            {priorities.map((pri) => (
              <TouchableOpacity
                key={pri}
                style={[
                  styles.optionButton,
                  priority === pri && styles.selectedOption,
                  {
                    borderColor: getPriorityColor(pri),
                    backgroundColor: priority === pri 
                      ? getPriorityColor(pri) 
                      : isDarkMode 
                        ? 'rgba(30, 30, 30, 0.7)' 
                        : 'rgba(255, 255, 255, 0.7)'
                  },
                ]}
                onPress={() => setPriority(pri)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.optionText,
                  priority === pri && styles.selectedOptionText
                ]}>
                  {pri}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[
        styles.footer,
        isDarkMode ? styles.darkFooter : styles.lightFooter
      ]}>
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              {
                backgroundColor: text.trim() 
                  ? getCategoryColor(category) 
                  : isDarkMode ? '#374151' : '#d1d5db',
              },
            ]}
            onPress={animateButton}
            disabled={!text.trim()}
            activeOpacity={0.7}
          >
            <Text style={styles.submitButtonText}>
              {isEditing ? "Update Task" : "Add Task"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
};

const getCategoryColor = (category) => {
  const colors = {
    'General List': "#8b5cf6",
    'Wish List': "#ec4899",
    'Go to List': "#3b82f6",
    'Shopping List': "#10b981",
  };
  return colors[category] || "#6b7280";
};

const getPriorityColor = (priority) => {
  const colors = {
    Low: "#10b981",
    Medium: "#f59e0b",
    High: "#ef4444",
  };
  return colors[priority] || "#f59e0b";
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lightContainer: {
    backgroundColor: '#ffffff',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  scrollContainer: {
    padding: 24,
    paddingBottom: 100,
  },
  inputContainer: {
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    minHeight: 60,
    textAlignVertical: "top",
  },
  darkInput: {
    color: "#f3f4f6",
    backgroundColor: "rgba(30, 30, 30, 0.7)",
    borderColor: "#374151",
  },
  lightInput: {
    color: "#1f2937",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderColor: "#d1d5db",
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  darkLabel: {
    color: "#f3f4f6",
  },
  lightLabel: {
    color: "#1f2937",
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedOption: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  optionText: {
    fontWeight: "500",
    fontSize: 14,
  },
  selectedOptionText: {
    color: "#fff",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  lightFooter: {
    backgroundColor: '#ffffff',
    borderTopColor: '#e5e7eb',
  },
  darkFooter: {
    backgroundColor: '#1e1e1e',
    borderTopColor: '#374151',
  },
  submitButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});

export default AddTaskScreen;