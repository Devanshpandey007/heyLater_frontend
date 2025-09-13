import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components/ui/button';
import { Select } from '../../components/ui/select';
import { useTheme } from '../../theme/ThemeContext';


const SetProfile = () => {
  const navigation = useNavigation();
  const themeContext = useTheme();
  console.log('Theme Context:', themeContext);
  const { theme } = themeContext;
  console.log('Theme:', theme);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [selectedGender, setSelectedGender] = useState('');

  const handleNext = () => {
    // Add your validation logic here
    navigation.navigate('SignUp');
  };

  const handleSkip = () => {
    navigation.navigate('SignUp');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleDateChange = (Text) => {
   
    const cleaned = Text.replace(/\D/g, '');
    if (cleaned.length <= 8) {
      let formatted = cleaned;
      if (cleaned.length > 4) {
        formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
      } else if (cleaned.length > 2) {
        formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
      }
      setDateOfBirth(formatted);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme?.background || '#F7F7F7' }]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Image
              source={require('../../assets/images/icons/heyLaterLogo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.content}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Set Up Your Profile</Text>
              <Text style={styles.subtitle}>
                Tell us a bit about yourself to get started
              </Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: theme.inputBackground,
                    color: theme.text,
                    shadowColor: theme.shadowColor,
                  }]}
                  placeholder="Enter your full name"
                  placeholderTextColor={theme.placeholder}
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.emailContainer}>
                  <TextInput
                    style={[styles.emailInput, { 
                      backgroundColor: theme.inputBackground,
                      color: theme.text,
                      shadowColor: theme.shadowColor,
                    }]}
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    placeholderTextColor={theme.placeholder}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <TouchableOpacity style={styles.otpButton}>
                    <Text style={styles.otpThemeText}>Get OTP</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.label }]}>Date of Birth</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: theme.inputBackground,
                    color: theme.text,
                    shadowColor: theme.shadowColor,
                  }]}
                  placeholder="DD/MM/YYYY"
                  value={dateOfBirth}
                  placeholderTextColor={theme.placeholder}
                  onChangeText={handleDateChange}
                  keyboardType="numeric"
                  maxLength={10}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Gender</Text>
                <Select
                  items={[
                    { label: 'Male', value: 'male' },
                    { label: 'Female', value: 'female' },
                    { label: 'Other', value: 'other' },
                  ]}
                  placeholder="Select your gender"
                  style={styles.select}
                />
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <Button
                variant="primary"
                onPress={handleNext}
                style={styles.nextButton}
              >
                Next
              </Button>
              <Button
                variant="secondary"
                onPress={handleSkip}
                style={styles.skipButton}
              >
                Skip for now
              </Button>
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
    paddingHorizontal: 0,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    paddingRight: 0,
  },
  backButton: {
    padding: 8,
  },
  backButtonThemeText: {
    fontSize: 16,
    color: '#53175C',
  },
  logo: {
    height: 60,
    width: '30%',
    marginStart: '40%',
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  titleContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#53175C',
    marginBottom: 8,
    fontFamily: 'ShipporiMincho-Regular',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'ShipporiMincho-Regular',
  },
  formContainer: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    marginBottom: 6,
    fontWeight: '500',
    fontSize: 12,
  },
  input: {
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 16,
    elevation: 3,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  emailInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    marginRight: 10,
  },
  otpButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  otpThemeText: {
    color: '#6D187A',
    fontWeight: 'bold',
    fontSize: 13,
  },
  select: {
    height: 50,
    marginTop: 8,
    backgroundColor: '#ffff',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 }
  },
  buttonContainer: {
    marginTop: 32, 
    gap: 16,
  },
  nextButton: {
    width: '100%',
    height:60,
    borderRadius:30
  },
  skipButton: {
    width: '100%',
    height: 60,
    borderRadius:30
  },
});

export default SetProfile; 