
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView } from 'react-native';
import { TextInput, Provider as PaperProvider } from 'react-native-paper';
import CheckBox from '@react-native-community/checkbox';
import facebookIcon from '../../assets/images/icons/facebook-icon.png'
import googleIcon from '../../assets/images/icons/google-icon.png';
import appleIcon from '../../assets/images/icons/apple-icon.png';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH} from '../../lib/firebaseConfig'; 
import {signInWithEmailAndPassword} from 'firebase/auth';
import axios from 'axios';

const auth = FIREBASE_AUTH;




const EmailLogInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const navigation = useNavigation();

  const toggleVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleAppleLogIn = ()=>{
    console.log("AppleSignIn");
  }

  const handleGoogleLogIn = ()=>{
    console.log("GoogleSignIn");
  }

  const handleFacebookLogIn = ()=>{
    console.log("FacebookSignIn");
  }

  const handleLogin = async()=>{
    try{
      const userCredentials =  await signInWithEmailAndPassword(auth, email, password);
      if (!userCredentials || !userCredentials.user){
        throw new Error("Login failed!")
      }
      // const user = 
      // const response  = axios.post("#", {email: email, password: password});
      // if (!response){
      //   throw new Error("Something went wrong!");
      // }
      // console.log((await response).data);
      navigation.navigate('mainScreen');

    }catch(err){
      console.log(err.message);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1}}>
        <TouchableOpacity style={styles.backButton} onPress={()=> navigation.navigate('Home')}>
          <Text style={styles.backText} >{'< Back'}</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Welcome Back!</Text>

        <TextInput
          label="Email address"
          mode="outlined"
          value={email}
          onChangeText={setEmail}
          style={{ backgroundColor: 'white', marginBottom: 10 }}
          activeOutlineColor="#6A5ACD"
          outlineColor='#6A5ACD'
          theme={{roundness: 20}}
        />
        
        <View style={{ position: 'relative' }}>
          <TextInput
            label="Password"
            mode="outlined"
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#A9A9A9"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            activeOutlineColor="#6A5ACD"
            outlineColor="#6A5ACD"
            theme={{ roundness: 20 }}
          />
          <TouchableOpacity
            onPress={toggleVisibility}
            style={{ position: 'absolute', right: 16, top: 18 }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons
              name={showPassword ? 'eye-off' : 'eye'}
              size={24}
              color="#6A5ACD"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.checkboxContainer}>
          <CheckBox
            value={agree}
            onValueChange={setAgree}
            tintColors={{ true: '#6A5ACD', false: '#6A5ACD' }}
          />
          
          <Text style={styles.checkboxLabel}>Remember me</Text>
          <TouchableOpacity onPress={()=>console.log("currently empty")}>
            <Text style={[styles.link, {marginStart:"28%"}]}>Forgot Password?</Text>
          </TouchableOpacity>
          
        </View>
        
        <TouchableOpacity style={styles.signUpButton} onPress={handleLogin}>
          <Text style={styles.signUpText}>Log In</Text>
        </TouchableOpacity>

        <View style={styles.socialSignUpContainer}>
          <View style={styles.socialDividerRow}>
            <View style={styles.line} />
            <Text style={styles.socialText}>Log In</Text>
            <View style={styles.line} />
          </View>
          <View style={styles.socialIcons}>
            <TouchableOpacity onPress={handleFacebookLogIn}>
              <Image source={facebookIcon} style={styles.iconImage} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleGoogleLogIn}>
              <Image source={googleIcon} style={styles.iconImage} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAppleLogIn}>
              <Image source={appleIcon} style={styles.iconImage} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.loginText}>
          Don't have an account? <Text style={styles.link}>Signup</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  backText: {
    fontSize: 16,
    color: '#6A5ACD', 
  },
  title: {
    fontFamily: 'ShipporiMincho-Regular',
    fontSize: 24,
    color: '#6A5ACD', 
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 20
  },
  input: {
    height: 50,
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  checkboxLabel: {
    marginLeft: 8,
    color: '#6A5ACD',
  },
  link: {
    color: '#6A5ACD',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  signUpButton: {
    backgroundColor: '#6A5ACD',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 35,
  },
  signUpText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  socialSignUpContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  socialText: {
    fontSize: 16,
    marginBottom: 1,
    color: '#6A5ACD'
    
  },
  socialIcons: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '65%',
  },
  iconImage: {
    width: 35,
    height: 35,
    marginHorizontal: 8,
    resizeMode: 'contain',
  },
  loginText: {
    fontFamily: 'ShipporiMincho-Regular',
    textAlign: 'center',
    color: '#6A5ACD'
  },
  socialDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#6A5ACD',
    marginHorizontal: 10,
  },
});

export default EmailLogInScreen;
