import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView, ScrollView } from 'react-native';
import { TextInput} from 'react-native-paper';
import CheckBox from '@react-native-community/checkbox';
import facebookIcon from '../../assets/images/icons/facebook-icon.png';
import googleIcon from '../../assets/images/icons/google-icon.png';
import appleIcon from '../../assets/images/icons/apple-icon.png';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useSignup } from '../../context/SignupContext';
import { FIREBASE_AUTH} from '../../lib/firebaseConfig'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';

const auth = FIREBASE_AUTH;




const EmailSignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {user, setUser} = useSignup();


  const navigation = useNavigation();

  const toggleVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleAppleSignIn = ()=>{
    console.log("AppleSignIn");
  }

  const handleGoogleSignIn = ()=>{
    console.log("GoogleSignIn");
  }

  const handleFacebookSignIn = ()=>{
    console.log("FacebookSignIn");
  }

  const testButtonClick = ()=>{
    console.log("button clicked!");
    navigation.navigate('PhoneVerification');

  }

  const handleButtonClick = async () => {
    console.log("button clicked");
  try {
    console.log(email, password);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (!userCredential || !userCredential.user) {
      throw new Error("User creation failed.");
    }
    const idToken = await userCredential.user.getIdToken();
    setUser(prev => ({ ...prev, idToken, email, password }));
    navigation.navigate('PhoneVerification');
  } catch (error) {
    alert(error.message || 'Signup failed. Please try again.');
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={{flex: 1}}>
          <TouchableOpacity style={styles.backButton} onPress={()=> navigation.navigate('Home')}>
            <Text style={styles.backText} >{'< Back'}</Text>
          </TouchableOpacity>

          <Text style={[styles.title, {fontFamily: 'ShipporiMincho-Regular'}]}>Get started</Text>

          <TextInput
            label="Email address"
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            style={[{ backgroundColor: 'white', marginBottom: 10 }, styles.input]}
            activeOutlineColor="#6A5ACD"
            outlineColor='#6A5ACD'
            theme={{roundness: 20}}
          />
          
          <View style={{ backgroundColor: 'white', marginBottom: 10 }}>
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
            <View style={{flex:1}}>
              <Text style={styles.checkboxLabel}>
                I agree to the processing of <Text style={styles.link}>Personal data</Text>
              </Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.signUpButton} onPress={handleButtonClick}> 
            <Text style={styles.signUpText}>Sign up</Text>
          </TouchableOpacity>

          <View style={styles.socialSignUpContainer}>
            <View style={styles.socialDividerRow}>
              <View style={styles.line} />
              <Text style={styles.socialText}>Sign up</Text>
              <View style={styles.line} />
            </View>
            <View style={styles.socialIcons}>
              <TouchableOpacity onPress={handleFacebookSignIn}>
                <Image source={facebookIcon} style={styles.iconImage} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleGoogleSignIn}>
                <Image source={googleIcon} style={styles.iconImage} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAppleSignIn}>
                <Image source={appleIcon} style={styles.iconImage} />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.loginText}>
            If you already have an account? <Text style={styles.link}>Login</Text>
          </Text>
        </View>
      </ScrollView>
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
    color: '#6A5ACD',
    fontFamily: 'ShipporiMincho-Regular'
    
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
    textAlign: 'center',
    color: '#6A5ACD',
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

export default EmailSignUpScreen;
