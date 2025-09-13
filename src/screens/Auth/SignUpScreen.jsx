import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';

const SignUpScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  
  console.log('Current theme:', theme);
  console.log('Is dark mode:', isDarkMode);

  const handleEmailSignUp = () => {
    navigation.navigate('EmailSignUp');
  };
  
  const handleGoogleSignUp = () => {
    console.log('Google sign up');
  };
  
  const handleFacebookSignUp = () => {
    console.log('Facebook sign up');
  };
  
  const handleAppleSignUp = () => {
    console.log('Apple sign up');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/icons/heyLaterLogo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.centerContent}>
        <TouchableOpacity
          style={[styles.button, styles.emailButton]}
          onPress={handleEmailSignUp}>
          <View style={styles.innerButtonContent}>
            <Image
              source={require('../../assets/images/icons/emailIcon2.png')}
              style={[styles.buttonIcon, styles.emailIconFixed]}
            />
            <Text style={styles.buttonText}>Sign up with Email</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.googleButton]}
          onPress={handleGoogleSignUp}>
          <View style={styles.innerButtonContent}>
            <Image
              source={require('../../assets/images/icons/googleIcon.png')}
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Sign up with Google</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.facebookButton]}
          onPress={handleFacebookSignUp}>
          <View style={styles.innerButtonContent}>
            <Image
              source={require('../../assets/images/icons/facebookIcon.png')}
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Sign up with Facebook</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.appleButton]}
          onPress={handleAppleSignUp}>
          <View style={styles.innerButtonContent}>
            <Image
              source={require('../../assets/images/icons/appleLogoIcon.png')}
              style={[styles.buttonIcon, styles.appleLogoIconFixed]}
            />
            <Text style={styles.buttonText}>Sign up with Apple</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.loginText, { color: theme.text }]}>
          Already have an account?
          <Text style={styles.loginLink}> Log in</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: -100,
  },
  logoImage: {
    width: 300,
    height: 300,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '72%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    backgroundColor: '#000',
    marginBottom: 15,
  },
  innerButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  buttonIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginRight: 12,
  },
  emailIconFixed: {
    width: 50,
    height: 50,
    marginLeft: -12,
    marginRight: 2,
  },
  appleLogoIconFixed: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  emailButton: {
    backgroundColor: '#2FC832',
  },
  googleButton: {
    backgroundColor: '#D85040',
  },
  facebookButton: {
    backgroundColor: '#3579EA',
  },
  appleButton: {
    backgroundColor: '#08150A',
  },
  footer: {
    width: '100%',
    paddingBottom: 30,
    alignItems: 'center',
  },
  loginText: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'ShipporiMincho-Regular',
  },
  loginLink: {
    color: '#D85040',
    fontWeight: '600',
  },
});

export default SignUpScreen; 