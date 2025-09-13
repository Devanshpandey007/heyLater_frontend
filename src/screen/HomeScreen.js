import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/icons/Hey_later_logo_no_bg.png')}
        style={styles.logo}
      />
      <Text style={styles.tagline}>
        TIME FOR OTHERS, TIME FOR YOU — OUR AVAILABILITY PROMISE.
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.loginButton} onPress={()=>navigation.navigate('Login')}>
          <Text style={styles.loginButtonText}>Log in</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signupButton} onPress={() => navigation.navigate('EmailSignUp')}>
          <Text style={styles.signupButtonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#FFFFFF', 
  },
  logo: {
    width: '50%',
    height: '34%',
    marginBottom: 32,
    marginTop: 80,
  },
  tagline: {
    fontFamily: 'ShipporiMincho-Regular',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 60,
    color: '#333333',
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 13,
  },
  loginButton: {
    backgroundColor: 'transparent',
    borderColor: '#5A67D8',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignItems: 'center',
    marginRight: 8,
  },
  signupButton: {
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignItems: 'center',
    marginLeft: 8,
  },
  loginButtonText: {
    fontSize: 16,
    color: '#5A67D8',
    fontWeight: '500',
  },
  signupButtonText: {
    fontSize: 16,
    color: '#5A67D8',
    fontWeight: '500',
    opacity: 0.7,
  },
});

export default HomeScreen;

// export default HomeScreen;