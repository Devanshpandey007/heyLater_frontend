import React, { useState } from 'react';
import { 
  View, 
  Text,
  Image, 
  TextInput, 
  StyleSheet, 
  Pressable,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Menu } from 'react-native-paper';

import { useNavigation } from '@react-navigation/native';
// We don't need useSignup here anymore
import axios from 'axios';


const PhoneVerificationScreen = () => {
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();


  const handleTestButtonClick = ()=>{
    console.log("Button Clicked!");
    navigation.navigate('OtpVerification');
  }
  const handleContinue = async () => { 
    try {
      const cellNumber = countryCode+phoneNumber;
      console.log("phone-number: ", cellNumber);
      const response = await axios.post('http://192.168.29.223:3000/api/auth/phone-signin', { phone: cellNumber });
      console.log(response);

      if (response.data.otp) {
        alert(`Your OTP is: ${response.data.otp}`);
      }

      // Pass the phone number to the next screen as a navigation parameter
      navigation.navigate('OtpVerification', { phoneNumber: cellNumber });

    } catch (err) {
      console.log({ message: err.response?.data || err.message });
      alert('Failed to send OTP. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={{flex:1}}>
            <TouchableOpacity
              onPress={() => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                } else {
                  navigation.navigate('Home'); // or any other screen you want as fallback
                }
              }}
              style={styles.backButton}
            >
                <Text style={styles.backText}>{'< Back'}</Text>
            </TouchableOpacity>
            <View style={styles.mainContent}>
                <View style={styles.imageContainer}>
                <Image style={styles.image} source={require('../../assets/images/icons/Image.png')}/>
                </View>
                <Text style={styles.title}>OTP Verification</Text>
                <Text style={styles.subtitle}>Enter phone number to send one time Password</Text>
                <View style={styles.phoneInputRow}>
                <Menu
                    visible={visible}
                    onDismiss={() => setVisible(false)}
                    anchor={
                    <Pressable onPress={() => setVisible(true)} style={styles.countryCodeBox}>
                        <Text style={styles.countryCodeText}>{countryCode}</Text>
                    </Pressable>
                    }
                    contentStyle={{ width: 60 }} // Set your desired width here
                >
                    {['+91', '+1', '+44'].map(code => (
                    <Menu.Item key={code} onPress={() => { setCountryCode(code); setVisible(false); }} title={code} />
                    ))}
                </Menu>
                <View style={styles.verticalDivider} />
                <TextInput
                    style={styles.phoneInput}
                    placeholder="Phone Number"
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    placeholderTextColor="#aaa"
                />
                </View>
                <TouchableOpacity 
                style={[styles.button, !phoneNumber && styles.buttonDisabled]} 
                onPress={handleContinue} 
                disabled={!phoneNumber}
                >
                <Text style={styles.buttonText}>Continue</Text> 
                </TouchableOpacity>
            </View>
        </View>
      </ScrollView>
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
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  backText: { 
    fontSize: 16,
    color: '#6A5ACD',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  image: {
    width: 240,
    height: 240,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6b52ae',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 24,
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 24,
    backgroundColor: '#fff',
    height: 50,
  },
  countryCodeBox: {
    width: 60,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  countryCodeBoxPressed: {
    backgroundColor: '#f0f0f0',
  },
  countryCodeText: {
    fontSize: 16,
    color: '#000',
  },
  verticalDivider: {
    width: 1,
    height: '60%',
    backgroundColor: '#ccc',
    marginHorizontal: 6,
    alignSelf: 'center',
  },
  phoneInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 10,
    color: '#000',
    fontSize: 16,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  button: {
    backgroundColor: '#6A5ACD',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 35,
    width: '100%', // Add this line
  },
  buttonDisabled: {
    backgroundColor: '#b9aee0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',      // <--- This centers the modal vertically
    alignItems: 'center',          // <--- This centers the modal horizontally
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalItem: {
    fontSize: 18,
    paddingVertical: 10,
    textAlign: 'center',
  },
});

export default PhoneVerificationScreen;
