import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSignup } from '../../context/SignupContext';
import axios from 'axios';


const OtpVerificationScreen = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [code, setCode] = useState(['', '', '', '', '', '']); 
  const inputRefs = useRef([]);
  const navigation = useNavigation();
  const route = useRoute(); 
  const { setUser } = useSignup(); 


  const { phoneNumber } = route.params;

  const handleChange = (index, value) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < code.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleBackButtonPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
    }
  }

  const handleKeyPress = (index, e) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (code[index] === '' && index > 0) {
        // Move left and clear previous
        const newCode = [...code];
        newCode[index - 1] = '';
        setCode(newCode);
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleVerify = async () => {
    const otp = code.join('');

    if (otp.length < code.length) {
      Alert.alert('Incomplete Code', 'Please enter the full verification code.');
      return;
    }

    try {
      console.log(phoneNumber);
      const response = await axios.post('http://192.168.29.223:3000/api/auth/verify-otp', {
        phone: phoneNumber,
        otp: otp,
      });
      console.log(response);

      if (response.status === 200) {
        setUser(prev => ({ ...prev, phone: phoneNumber }));

        console.log({ "message": response.data });
        navigation.navigate('setProfile');
      }
    } catch (err) {
      console.log({ message: err.response?.data || err.message });
      Alert.alert('Verification Failed', err.response?.data?.message || 'The code is incorrect. Please try again.');
    }
  };

  return (
    <SafeAreaView style = {styles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={{alignItems:'center'}}>
          <TouchableOpacity onPress={handleBackButtonPress} style={styles.back}>
            <Text style={styles.backText}>{'< Back'}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Verification Code</Text>
          <Text style={styles.subtitle}>We have sent the verification code to your phone number</Text>
          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => inputRefs.current[index] = ref}
                style={[
                  styles.codeInput,
                  digit ? styles.filledInput : (activeIndex === index ? styles.activeInput : null)
                ]}
                value={digit}
                onChangeText={(value) => handleChange(index, value)}
                onKeyPress={e => handleKeyPress(index, e)}
                keyboardType="numeric"
                maxLength={1}
                onFocus={() => setActiveIndex(index)}
              />
            ))}
          </View>
          <TouchableOpacity style={styles.button} onPress={handleVerify}>
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'flex-start'
  },
  back: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  backText: {
    color: '#6A5ACD',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6A5ACD',
    marginBottom: 10,
    marginTop:20
  },
  subtitle: {
    fontSize: 16,
    color: '#A9A9A9',
    marginBottom: 30,
    textAlign: 'center',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  codeInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 24,
  },
  activeInput: {
    borderColor: '#6A5ACD', // Focused input
  },
  filledInput: {
    borderColor: '#6A5ACD', // Filled input
  },
  button: {
    backgroundColor: '#6A5ACD',
    borderRadius: 10,
    width: '100%',
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 50,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OtpVerificationScreen;
