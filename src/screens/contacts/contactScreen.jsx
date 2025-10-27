import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, TextInput, Image, Alert } from 'react-native';
import { fetchDeviceContacts } from '../../services/contactService';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { FIREBASE_AUTH } from '../../lib/firebaseConfig';
import Icon from 'react-native-vector-icons/Ionicons';



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
  const [contactStatus, setContactStatus] = useState({});
  const navigation = useNavigation();
  const route = useRoute();


  const removeSpacingInContact = (phone) => {
    return '+' + phone.replace(/\D/g, '');
  };



  useEffect(() => {
    const loadContacts = async () => {
      try {
        const deviceContacts = await fetchDeviceContacts();
        const currentUser = FIREBASE_AUTH.currentUser;

        const currentUserPhone = currentUser?.phoneNumber
          ? removeSpacingInContact(currentUser.phoneNumber)
          : null;

        const filteredDeviceContacts = deviceContacts.filter((contact) => {
          if (
            !contact.phoneNumbers ||
            contact.phoneNumbers.length === 0 ||
            !contact.phoneNumbers[0].number
          )
            return false;

          const phone = removeSpacingInContact(contact.phoneNumbers[0].number);
          return phone !== currentUserPhone;
        });

        const statusMap = {};
        filteredDeviceContacts.forEach((contact) => {
          statusMap[contact.id] = 'invite';
        });

        setContactStatus(statusMap);
        setContacts(filteredDeviceContacts);
        setFilteredContacts(filteredDeviceContacts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadContacts();
  }, []);



  useFocusEffect(
    useCallback(() => {
      const fetchStatuses = async () => {
        if (contacts.length === 0) return;
        try {
          const currentUser = FIREBASE_AUTH.currentUser;
          if (!currentUser) return;
          const idToken = await currentUser.getIdToken();

          const phoneNumbers = contacts
            .filter(
              (c) =>
                Array.isArray(c.phoneNumbers) &&
                c.phoneNumbers.length > 0 &&
                c.phoneNumbers[0].number
            )
            .map((c) => removeSpacingInContact(c.phoneNumbers[0].number));

          if (phoneNumbers.length === 0) return;

          const response = await axios.post(
            'http://192.168.29.223:3000/api/contacts/fetch-status',
            { phoneNumbers },
            { headers: { Authorization: `Bearer ${idToken}` } }
          );

          if (response.data.success) {
            const statusMap = {};
            contacts.forEach((contact) => {
              if (
                Array.isArray(contact.phoneNumbers) &&
                contact.phoneNumbers.length > 0 &&
                contact.phoneNumbers[0].number
              ) {
                const phone = removeSpacingInContact(
                  contact.phoneNumbers[0].number
                );
                statusMap[contact.id] =
                  response.data.statusMap[phone] || 'invite';
              } else {
                statusMap[contact.id] = 'invite';
              }
            });
            setContactStatus(statusMap);
          }
        } catch (err) {
          console.error('Error fetching statuses', err);
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
        contacts.filter((c) =>
          c.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, contacts]);




  const handleInvite = async (contact) => {
    try {
      const currentUser = FIREBASE_AUTH.currentUser;
      if (!currentUser) {
        console.log('No authenticated user. Please sign in first.');
        return;
      }

      const phone_number = removeSpacingInContact(
        contact.phoneNumbers[0].number
      );

      const data = {
        contact_name: contact.name,
        contact_phone: phone_number,
      };

      const idToken = await currentUser.getIdToken();
      const response = await axios.post(
        'http://192.168.29.223:3000/api/contacts/invite',
        data,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      if (!response.data.success) {
        Alert.alert('Info', response.data.message || 'User not on HeyLater');
        return;
      }

      setContactStatus((prev) => ({ ...prev, [contact.id]: 'pending' }));
    } catch (err) {
      console.error('full error', err);
    }
  };



  const handleDisconnect = (contactId) => {
    setContactStatus((prev) => ({ ...prev, [contactId]: 'invite' }));
  };



  const renderStatusButton = (status, contact) => {
    if (status === 'invite') {
      return (
        <TouchableOpacity
          style={[styles.statusButton, styles.inviteButton]}
          onPress={() => handleInvite(contact)}
        >
          <Text style={[styles.statusButtonText, { color: '#6A5ACD' }]}>
            Invite
          </Text>
        </TouchableOpacity>
      );
    } else if (status === 'pending') {
      return (
        <View style={[styles.statusButton, styles.invitedButton]}>
          <Text style={[styles.statusButtonText, { color: '#4CAF50' }]}>
            Invited
          </Text>
        </View>
      );
    } else if (status === 'accepted' || status === 'disconnect') {
      return (
        <TouchableOpacity
          style={[styles.statusButton, styles.disconnectButton]}
          onPress={() => handleDisconnect(contact.id)}
        >
          <Text style={[styles.statusButtonText, { color: '#FF3B30' }]}>
            Disconnect
          </Text>
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
          <Text style={styles.initialsText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
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
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>{'< Back'}</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Contacts</Text>
        </View>
      </View>

      <View style={styles.searchBarWrapper}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search"
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#A9A9A9"
        />
      </View>

      <FlatList
        data={filteredContacts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingTop: 50,
          paddingBottom: 80,
        }}
      />

      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('mainScreen')}
        >
          <Icon
            name="home-outline"
            size={28}
            color={route.name === 'mainScreen' ? '#8A2BE2' : '#4A4A4A'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('notifications')}
        >
          <Icon
            name="notifications-outline"
            size={28}
            color={route.name === 'notifications' ? '#8A2BE2' : '#4A4A4A'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('contacts')}
        >
          <Icon
            name="call-outline"
            size={28}
            color={route.name === 'contacts' ? '#8A2BE2' : '#4A4A4A'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('ProfilePage')}
        >
          <Icon
            name="person-circle"
            size={30}
            color={route.name === 'ProfilePage' ? '#8A2BE2' : '#4A4A4A'}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};




const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  headerContainer: {
    backgroundColor: '#fff',
    zIndex: 1,
    marginBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  backButton: { position: 'absolute', left: 8, padding: 0, zIndex: 11 },
  backButtonText: { color: '#6A5ACD', fontSize: 16 },
  screenTitle: {
    fontSize: 22,
    color: '#6A5ACD',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchBarWrapper: {
    position: 'absolute',
    top: 52,
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
  initialsText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  contactInfo: { flex: 1, justifyContent: 'center' },
  contactName: { fontSize: 16, color: '#333', fontWeight: '500' },
  contactNumber: { fontSize: 13, color: '#888', marginTop: 2 },
  statusButton: {
    minWidth: 80,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteButton: { borderColor: '#6A5ACD', backgroundColor: '#fff' },
  invitedButton: { borderColor: '#4CAF50', backgroundColor: '#fff' },
  disconnectButton: { borderColor: '#FF3B30', backgroundColor: '#fff' },
  statusButtonText: { fontSize: 15, fontWeight: '500' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { color: 'red', fontSize: 16, textAlign: 'center' },
  navButton: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 55,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
});

export default ContactsScreen;
