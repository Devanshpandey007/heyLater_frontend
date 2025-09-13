import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import axios from 'axios';
import { FIREBASE_AUTH } from '../../lib/firebaseConfig';
import { useNavigation } from '@react-navigation/native';

const ProfilePage = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await FIREBASE_AUTH.signOut();
      Alert.alert('Signed Out Successfully');
      navigation.navigate('Home');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>{'< Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.header}>Profile</Text>
      </View>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.buttonBackground }]}
        onPress={handleLogout}
      >
        <Text style={[styles.buttonText, { color: theme.buttonText }]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingTop: 40,
  },
  headerWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  backText: {
    color: '#6A5ACD',
    fontSize: 16,
    marginRight: 10,
  },
  header: {
    fontSize: 20,
    color: '#6A5ACD',
    fontWeight: 'bold',
  },
  button: {
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
  },
});

export default ProfilePage;
