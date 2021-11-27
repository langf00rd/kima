import React from 'react';
import { StyleSheet, StatusBar, Text } from 'react-native';
import { NavigationContainer, useNavigation, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import Notes from './screens/Notes';
import ViewNote from './screens/ViewNote';
import EditNote from './screens/EditNote';

// const HomeScreen = () => { return <Text>lol</Text> }


export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      {/* <StatusBar backgroundColor="transparent" barStyle="light-content" /> */}
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
          component={EditNote}
          name='EditNote'
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
