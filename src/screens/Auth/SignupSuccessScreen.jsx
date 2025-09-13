// SuccessScreen.jsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';


const SignupSuccessScreen = ({ navigation }) => {
    const navigate = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>{'< Back'}</Text>
        </TouchableOpacity>

        <View style={styles.centerContent}>
            <View style={styles.iconContainer}>
                <Image style={styles.image} source={require('../../assets/images/icons/Success.png')}/>
            </View>
            <Text style={styles.title}>Success!</Text>
            <Text style={styles.message}>Congratulations! Your account has been created</Text>
            <TouchableOpacity style={styles.button} onPress={() => console.log('Continue pressed')}>
                <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start', 
  },
  backText: {
    color: '#6A5ACD',
    fontSize: 16,
    marginLeft: 8,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start', 
    marginTop:100,
    padding:10
  },
  content: {
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 180,
    resizeMode: 'contain',
  },
  iconContainer: {
    paddingTop: 0, // Remove extra space above image
    marginBottom: 0, // Remove extra space below image
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6A5ACD',
    marginBottom: 15,
  },
  message: {
    textAlign: 'center',
    color: 'gray',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#6A5ACD',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 35,
    width: '100%', // Add this line
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SignupSuccessScreen;
