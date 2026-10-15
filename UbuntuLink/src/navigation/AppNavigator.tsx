import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

import { HomeScreen } from '../screens/HomeScreen';
import { VerifyScreen } from '../screens/VerifyScreen';
import { ExperienceScreen } from '../screens/ExperienceScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { AdminDashboard } from '../screens/AdminDashboard';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Verify" component={VerifyScreen} />
    <Stack.Screen name="Experience" component={ExperienceScreen} />
    <Stack.Screen name="Admin" component={AdminDashboard} />
  </Stack.Navigator>
);

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: COLORS.surface, borderTopWidth: 1,
            borderTopColor: COLORS.border, height: 70, paddingBottom: 10, paddingTop: 10,
          },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textSecondary,
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof MaterialIcons.glyphMap = 'home';
            if (route.name === 'HomeTab') iconName = 'home';
            else if (route.name === 'VerifyTab') iconName = 'verified';
            else if (route.name === 'ExperienceTab') iconName = 'auto-awesome';
            else if (route.name === 'AdminTab') iconName = 'dashboard';
            return <MaterialIcons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Home' }} />
        <Tab.Screen name="VerifyTab" component={VerifyScreen} options={{ title: 'Verify' }} />
        <Tab.Screen name="ExperienceTab" component={ExperienceScreen} options={{ title: 'AI Log' }} />
        <Tab.Screen name="AdminTab" component={AdminDashboard} options={{ title: 'Admin' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};