import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { navigationTypes } from './src/types/navigation';
import LoginScreen from './src/screens/Auth/LoginScreen';
import SignUpScreen from './src/screens/Auth/SignUpScreen';
import EmailSignUpScreen from './src/screens/Auth/EmailSignUp';
import SetUpProfile from './src/screens/Profile/SetProfile';
import PhoneVerificationScreen from './src/screens/Auth/PhoneVerification';
import { ThemeProvider } from './src/theme/ThemeContext';
import HomeScreen from './src/screen/HomeScreen';
import { Provider as PaperProvider } from 'react-native-paper';
import OtpVerificationScreen from './src/screens/Auth/OtpVerification';
import SuccessScreen from './src/screens/Auth/SuccessScreen';
import ProfileSetup from './src/screens/Profile/ProfileSetup';
import { SignupProvider } from './src/context/SignupContext';
import ContactsScreen from './src/screens/contacts/contactScreen';
import NotificationsScreen from './src/screens/notifications/notificationScreen';
import MainScreen from './src/screens/mainScreen/mainScreen';
import ProfilePage from './src/screens/Profile/profilePage';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './src/lib/firebaseConfig';
import ProfileScreen from './src/screens/Profile/UserProfile';
import SetTimeSlotScreen from './src/screens/Profile/SetTimeslot';
import ReadOnlyScreen from './src/screens/Profile/ReadOnlyProfile';
import { en, registerTranslation } from 'react-native-paper-dates';
registerTranslation('en', en);

const Stack = createNativeStackNavigator();


function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        setInitialRoute('mainScreen');
      } else {
        setInitialRoute('Home');
      }
    });
    return unsubscribe;
  }, []);

  if (!initialRoute) {
    // Optionally show a splash/loading screen here
    return null;
  }

  return (
    <SignupProvider>
      <PaperProvider>
        <ThemeProvider>
          <NavigationContainer>
            <Stack.Navigator 
              initialRouteName={initialRoute}
              screenOptions={{
                headerShown: false
              }}
            >
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="SignUp" component={SignUpScreen} />
              <Stack.Screen name="PhoneVerification" component={PhoneVerificationScreen}/>
              <Stack.Screen name="EmailSignUp" component={EmailSignUpScreen} />
              <Stack.Screen name="SetpProfile" component={SetUpProfile} />
              <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
              <Stack.Screen name="Success" component={SuccessScreen}/>
              <Stack.Screen name="setProfile" component={ProfileSetup}/>
              <Stack.Screen name="contacts" component={ContactsScreen}/>
              <Stack.Screen name="notifications" component={NotificationsScreen}/>
              <Stack.Screen name="mainScreen" component={MainScreen}/>
              <Stack.Screen name="Profile" component={ProfilePage}/>
              <Stack.Screen name="ProfilePage" component={ProfileScreen}/>
              <Stack.Screen name="SetTime" component={SetTimeSlotScreen}/>
              <Stack.Screen name="OthersProfile" component={ReadOnlyScreen}/>
            </Stack.Navigator>
          </NavigationContainer>
        </ThemeProvider>
      </PaperProvider>
    </SignupProvider>
  );
}

export default App; 