import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Image } from 'react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../lib/firebaseConfig';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';

const USER_AVATARS = [
  'https://randomuser.me/api/portraits/men/2.jpg',
  'https://randomuser.me/api/portraits/women/3.jpg',
  'https://randomuser.me/api/portraits/men/4.jpg',
  'https://randomuser.me/api/portraits/women/5.jpg',
  'https://randomuser.me/api/portraits/men/6.jpg',
  'https://randomuser.me/api/portraits/women/7.jpg',
  'https://randomuser.me/api/portraits/men/8.jpg',
];

const MainScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [admin, setAdmin] = useState({});
  const [connectedUsers, setConnectedUsers] = useState([]);


  const fetchConnectedUsers = useCallback(async () => {
    try {
      const currentUser = FIREBASE_AUTH.currentUser;
      // Get the ID reliably
      const currentUserId = admin.id; 
      
      if (!currentUser || !currentUserId) { 
        console.log('Current user or admin ID not ready.');
        return;
      }
      
      const idToken = await currentUser.getIdToken();
      const response = await axios.get('http://192.168.29.223:3000/api/users/connected-users', {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (response.status === 200 && response.data.data) {
        const usersList = response.data.data.map(invite => {
          const isInviter = invite.inviterId.toString() === currentUserId.toString();
          const otherUser = isInviter ? invite.invitee : invite.inviter;
          
          console.log("other Users", otherUser);
          return {
            id: otherUser.id,
            name: otherUser.name,
            status: otherUser.is_available ? "Available" : "Not Available",
            avatar: otherUser.picture || USER_AVATARS[Math.floor(Math.random() * USER_AVATARS.length)],
          };
        });
        setConnectedUsers(usersList);
        console.log("Connected Users fetched and processed successfully.");
      } else {
        console.log("Failed to fetch connected users:", response.status);
      }
    } catch (err) {
      console.error("Error fetching connected users:", err);
    }


  }, [admin.id]);

  const getAdminProfile = useCallback(async () => {
    try {
      const currentUser = FIREBASE_AUTH.currentUser;
      if (!currentUser) {
        console.log('No user is signed in.');
        return null;
      }
      const idToken = await currentUser.getIdToken();
      const response = await axios.get('http://192.168.29.223:3000/api/users/profile', {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (response.status === 200) {
        setAdmin(response.data);
      }
    } catch (error) {
      console.error('Error fetching admin profile:', error);
    }
  }, []);

  useEffect(() => {
    getAdminProfile();
  }, [getAdminProfile]);

  useFocusEffect(
    useCallback(() => {
      if (admin.id) {
        fetchConnectedUsers();
      }
      // fetchConnectedUsers();
    }, [admin.id, fetchConnectedUsers])
  );


  const renderUserItem = ({ item }) => (
    <TouchableOpacity
        onPress={() => {
            console.log('Navigating to OthersProfile with:', {
                userId: item.id,
                userPic: item.avatar,
                userName: item.name,
            });

            navigation.navigate('OthersProfile', {
                userId: item.id,
                userPic: item.avatar,
                userName: item.name,
            });
        }}
    >
        <View style={styles.userCard}>
            <View style={styles.userInfo}>
                <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
                <Text style={styles.userName}>{item.name}</Text>
            </View>
            <View style={[
                styles.statusBadge,
                item.status === 'Available' ? styles.badgeAvailable : styles.badgeNotAvailable
            ]}>
                <Text style={[
                    styles.badgeText,
                    item.status === 'Available' ? styles.badgeTextAvailable : styles.badgeTextNotAvailable
                ]}>
                    {item.status === 'Available' ? 'Free' : 'Busy'}
                </Text>
            </View>
        </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerBox}>
        <View style={styles.headerLeft}>
          <Text style={styles.profileNameHeader}>{admin.name || 'Loading...'}</Text>
          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>Status - {admin.name ? 'Available' : 'Not Available'} </Text>
            <View style={[styles.statusDot, { backgroundColor: admin.name ? '#34C759' : '#FF3B30' }]} />
          </View>
        </View>
        <Image source={{ uri: admin.picture || USER_AVATARS[0] }} style={styles.profileAvatar} />
      </View>
      {/* Users List */}
      <View style={styles.listContainer}>
        <FlatList
          data={connectedUsers}
          renderItem={renderUserItem}
          keyExtractor={item => item.id.toString()}
          estimatedItemSize={70}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            <Text style={styles.emptyListText}>No connected users found.</Text>
          )}
        />
      </View>
      {/* Bottom Navigation */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('mainScreen')}>
          <Icon 
            name="home-outline" 
            size={28} 
            color={route.name === 'mainScreen' ? '#8A2BE2' : '#4A4A4A'} 
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('notifications')}>
          <Icon 
            name="notifications-outline" 
            size={28} 
            color={route.name === 'notifications' ? '#8A2BE2' : '#4A4A4A'} 
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('contacts')}>
          <Icon 
            name="call-outline" 
            size={28} 
            color={route.name === 'contacts' ? '#8A2BE2' : '#4A4A4A'} 
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('ProfilePage')}>
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
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerLeft: {
    flex: 1,
  },
  profileNameHeader: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#7B61FF',
    marginBottom: 6,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#6A5ACD',
  },
  statusPillText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '500',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#34C759',
    marginLeft: 8,
  },
  profileAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginLeft: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  listContainer: {
    flex: 1,
    marginHorizontal: 8,
    marginTop: 5,
    marginBottom: 40,
  },
  listContent: {
    paddingBottom: 20,
  },
  userCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 9,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 2,
    elevation: 1,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  userName: {
    fontSize: 16,
    color: '#6A5ACD',
    fontWeight: '500',
  },
  statusBadge: {
    borderWidth: 0.5,
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 3,
    minWidth: 90,
    alignItems: 'center',
  },
  badgeAvailable: {
    borderColor: '#34C759',
    backgroundColor: '#f6fff7',
  },
  badgeNotAvailable: {
    borderColor: '#FF3B30',
    backgroundColor: '#fff6f6',
  },
  badgeText: {
    fontSize: 15,
    fontWeight: '600',
  },
  badgeTextAvailable: {
    color: '#34C759',
  },
  badgeTextNotAvailable: {
    color: '#FF3B30',
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
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

export default MainScreen;