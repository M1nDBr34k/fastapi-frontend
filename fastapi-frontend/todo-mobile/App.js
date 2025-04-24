import React, { useEffect, useState } from 'react';
import { FlatList, View, TextInput, Button, Switch } from 'react-native';
import api from './api';
import { Provider as PaperProvider, DarkTheme, DefaultTheme, Text } from 'react-native-paper';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [dark, setDark] = useState(false);

  const fetchTasks = async () => {
    const res = await api.get('/tasks/');
    setTasks(res.data);
  };

  const addTask = async () => {
    if (!title.trim()) return;
    await api.post('/tasks/', { title });
    setTitle('');
    fetchTasks();
  };

  const toggleComplete = async (task) => {
    await api.put(`/tasks/${task.id}`, {
      title: task.title,
      completed: !task.completed,
    });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    fetchTasks();
  };

  useEffect(() => { fetchTasks(); }, []);

  return (
    <PaperProvider theme={dark ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1, padding: 20 }}>
        <Switch value={dark} onValueChange={() => setDark(!dark)} />
        <TextInput
          placeholder="New Task"
          value={title}
          onChangeText={setTitle}
          style={{ borderBottomWidth: 1, marginVertical: 12 }}
        />
        <Button title="Add" onPress={addTask} />
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
              <Button title={item.completed ? '✅' : '⬜'} onPress={() => toggleComplete(item)} />
              <Text style={{ flex: 1, marginLeft: 8 }}>{item.title}</Text>
              <Button title="🗑️" onPress={() => deleteTask(item.id)} />
            </View>
          )}
        />
      </View>
    </PaperProvider>
  );
}
