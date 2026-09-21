import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import OtpScreen from '../screens/auth/OtpScreen';
import OnboardingScreen from '../screens/auth/OnbordScreen';
import DashboardScreen from '../screens/auth/HomeScreen';
import CreateEventScreen from '../screens/createEvent/CreateEventScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
const Stack = createNativeStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
    
    <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
    <Stack.Screen name="OtpScreen" component={OtpScreen} />
    <Stack.Screen name="Dashboard" component={DashboardScreen} />
    <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
    
   
  </Stack.Navigator>
);

export default AuthNavigator;
