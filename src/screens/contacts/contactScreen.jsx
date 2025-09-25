
import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import { fetchDeviceContacts } from '../../services/contactService';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { FIREBASE_AUTH } from '../../lib/firebaseConfig';
import { Alert } from 'react-native';
import { useCallback } from 'react';

const defaultAvatar = require('../../assets/images/icons/heyLaterLogo.png');
const userLogo = require('../../assets/images/icons/User.png');
const bellLogo = require('../../assets/images/icons/Bell.png');
const phoneLogo = require('../../assets/images/icons/Phone.png');
const homeLogo = require('../../assets/images/icons/Icon.png');


const ContactsScreen = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filteredContacts, setFilteredContacts] = useState([]);
  const navigation = useNavigation();
  const [contactStatus, setContactStatus] = useState({});


  useEffect(() => {
    const loadContacts = async () => {
      try {
        const deviceContacts = await fetchDeviceContacts();
        const statusMap = {};
        deviceContacts.forEach(contact => {
          statusMap[contact.id] = 'invite';
        });
        setContactStatus(statusMap);
        setContacts(deviceContacts);
        setFilteredContacts(deviceContacts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadContacts();
  }, []);

  // Remove the useEffect for fetching statuses and replace with useFocusEffect
  useFocusEffect(
    useCallback(() => {
      const fetchStatuses = async () => {
        if (contacts.length === 0) return;
        try {
          const currentUser = FIREBASE_AUTH.currentUser;
          if (!currentUser) return;
          const idToken = await currentUser.getIdToken();
          const phoneNumbers = contacts
            .filter(c => Array.isArray(c.phoneNumbers) && c.phoneNumbers.length > 0 && c.phoneNumbers[0].number)
            .map(c => removeSpacingInContact(c.phoneNumbers[0].number));
          if (phoneNumbers.length === 0) return;
          const response = await axios.post(
            "http://192.168.29.223:3000/api/contacts/fetch-status",
            { phoneNumbers },
            { headers: { Authorization: `Bearer ${idToken}` } }
          );
          if (response.data.success) {
            // Map status to contact ids
            const statusMap = {};
            contacts.forEach(contact => {
              if (Array.isArray(contact.phoneNumbers) && contact.phoneNumbers.length > 0 && contact.phoneNumbers[0].number) {
                const phone = removeSpacingInContact(contact.phoneNumbers[0].number);
                statusMap[contact.id] = response.data.statusMap[phone] || 'invite';
              } else {
                statusMap[contact.id] = 'invite';
              }
            });
            setContactStatus(statusMap);
          }
        } catch (err) {
          console.error("Error fetching statuses", err);
        }
      };
      fetchStatuses();
    }, [contacts])
  );

  useEffect(() => {
    if (!search) {
      setFilteredContacts(contacts);
    } else {
      setFilteredContacts(
        contacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
      );
    }
  }, [search, contacts]);


  const removeSpacingInContact = (phone)=>{
    return '+' + phone.replace(/\D/g, '');
  }

  const handleInvite = async (contact) => {
    try{
      const currentUser = FIREBASE_AUTH.currentUser;
      if (!currentUser) {
        console.log('No authenticated user. Please sign in first.');
        return;
      }

      // const idToken = await currentUser.getIdToken();

      const phone_number = removeSpacingInContact(contact.phoneNumbers[0].number);

      const data = {
        contact_name: contact.name,
        contact_phone: phone_number
      };
      console.log(data);
      
      const idToken = await currentUser.getIdToken();
      const response = await axios.post(
        "http://192.168.29.223:3000/api/contacts/invite",
        data,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      console.log("response", response.data);
      if (!response.data.success) {
        Alert.alert("Info", data.message || "This person is not on HeyLater yet");
        return;
      }
      console.log("response:", response.data);
      setContactStatus(prev => ({ ...prev, [contact.id]: 'pending' }));
      // setContactStatus(prev => ({ ...prev, [contact.id]: 'pending' }));
    }catch(err){
      console.error("full error", err);
      // console.log({ message: err.response?.data || err.message });
    }
    // setTimeout(() => {
    //   setContactStatus(prev => ({ ...prev, [contact.id]: 'disconnect' }));
    // }, 3000);
  };

  const handleDisconnect = (contactId) => {
    setContactStatus(prev => ({ ...prev, [contactId]: 'invite' }));
  };

  const renderStatusButton = (status, contact) => {
    if (status === 'invite') {
      return (
        <TouchableOpacity style={[styles.statusButton, styles.inviteButton]} onPress={() => handleInvite(contact)}>
          <Text style={[styles.statusButtonText, { color: '#6A5ACD' }]}>Invite</Text>
        </TouchableOpacity>
      );
    } else if (status === 'pending') {
      return (
        <View style={[styles.statusButton, styles.invitedButton]}>
          <Text style={[styles.statusButtonText, { color: '#4CAF50' }]}>Invited</Text>
        </View>
      );
    } else if (status === 'disconnect') {
      return (
        <TouchableOpacity style={[styles.statusButton, styles.disconnectButton]} onPress={() => handleDisconnect(contact.id)}>
          <Text style={[styles.statusButtonText, { color: '#FF3B30' }]}>Disconnect</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  const renderItem = ({ item }) => (
    <View style={styles.contactItem}>
      {item.thumbnailPath ? (
        <Image source={{ uri: item.thumbnailPath }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarInitials}>
          <Text style={styles.initialsText}>{item.name.charAt(0).toUpperCase()}</Text>
        </View>
      )}
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactNumber}>{item.phoneNumbers[0]?.number}</Text>
      </View>
      {renderStatusButton(contactStatus[item.id], item)}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading contacts...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>{'< Back'}</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Contacts</Text>
          {/* <View style={{ width: 32 }} /> */}
        </View>
      </View>

      {/* Floating Search Bar */}
      <View style={styles.searchBarWrapper}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search"
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#A9A9A9"
        />
      </View>

      {/* Contacts List */}
      <FlatList
        data={filteredContacts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{
          paddingTop: 50, // space for header and floating search
          paddingBottom: 80,
        }}
      />

      {/* Bottom Nav */}
      <View style={styles.bottomNavBar}>
          <TouchableOpacity style={styles.navItem} onPress={()=>navigation.navigate('mainScreen')}>
          <Image source={homeLogo} style={styles.navIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={()=> navigation.navigate('notifications')}>
          <Image source={bellLogo} style={styles.navIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={()=> navigation.navigate('contacts')}>
          <Image source={phoneLogo} style={styles.navIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={()=> navigation.navigate('Profile')}>
          <Image source={userLogo} style={styles.navIcon} />
          </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    backgroundColor: '#fff',
    zIndex: 1,
    // paddingBottom: 2,
    marginBottom: 1,
    borderBottomWidth:1,
    borderBottomColor: '#eee'
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  backButton: {
    position: 'absolute',
    left: 8,
    padding: 0,
    zIndex: 11,
  },
 backButtonText: {
    color: '#6A5ACD',
    fontSize: 16,
  },
 screenTitle: {
    fontSize: 22,
    color: '#6A5ACD',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchBarWrapper: {
    position: 'absolute',
    top: 52, // directly below header
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  searchBar: {
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 44,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    color: '#333',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  avatarInitials: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6A5ACD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  initialsText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  contactInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  contactName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  contactNumber: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  statusButton: {
    minWidth: 80,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteButton: {
    borderColor: '#6A5ACD',
    backgroundColor: '#fff',
  },
  invitedButton: {
    borderColor: '#4CAF50',
    backgroundColor: '#fff',
  },
  disconnectButton: {
    borderColor: '#FF3B30',
    backgroundColor: '#fff',
  },
  statusButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  bottomNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 55,
    backgroundColor: '#fff',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    
  },
});

export default ContactsScreen;



