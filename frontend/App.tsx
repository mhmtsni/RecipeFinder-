import { StatusBar } from 'react-native';
import React, { useContext, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './tabs/HomeScreen';
import BookmarkScreen from './tabs/BookmarkScreen';
import SearchScreen from './tabs/SearchScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ShowScreen from './screens/ShowScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import { AuthProvider } from './authContext';
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const App = () => {

  return (
    <NavigationContainer>
    <AuthProvider>
        <StatusBar hidden />
        <Stack.Navigator initialRouteName={'Login'} screenOptions={{ headerShown: false }}>
          
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
            </>
          
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="Show" component={ShowScreen} />
        </Stack.Navigator>
      </AuthProvider>
      </NavigationContainer>
  );
  
};

const MainTabs = () => {
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { borderTopWidth: 0 },
        tabBarInactiveTintColor: 'yellow',
        tabBarActiveTintColor: 'black',
        headerShown: false,
        tabBarActiveBackgroundColor: 'gray',
        tabBarInactiveBackgroundColor: 'black',
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ size, focused }) => (
            <Ionicons name="home" color={focused ? 'black' : 'yellow'} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ size, focused }) => (
            <Ionicons name="search" color={focused ? 'black' : 'yellow'} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Bookmark"
        component={BookmarkScreen}
        options={{
          tabBarIcon: ({ size, focused }) => (
            <Ionicons name="bookmark" color={focused ? 'black' : 'yellow'} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default App;
