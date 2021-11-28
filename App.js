import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import AddNoteScreen from './screens/AddNoteScreen';
import Notes from './screens/Notes';
import ViewNote from './screens/ViewNote';
import EditNote from './screens/EditNote';

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          component={HomeScreen}
          name='HomeScreen'
          options={{ headerShown: false }}
        />

        <Stack.Screen
          component={Notes}
          name='Notes'
          options={{ headerShown: false }}
        />

        <Stack.Screen
          component={ViewNote}
          name='ViewNote'
          options={{ headerShown: false }}
        />

        <Stack.Screen
          component={AddNoteScreen}
          name='AddNoteScreen'
          options={{ headerShown: false }}
        />

        <Stack.Screen
          component={EditNote}
          name='EditNote'
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>

  );
}