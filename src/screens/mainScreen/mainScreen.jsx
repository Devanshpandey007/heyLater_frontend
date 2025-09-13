import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Image } from 'react-native';
// import { FlashList } from '@shopify/flash-list';
import { useNavigation } from '@react-navigation/native';



const AVATAR_URL = 'https://randomuser.me/api/portraits/men/1.jpg'; // Placeholder avatar
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

  const userLogo = require('../../assets/images/icons/User.png');
  const bellLogo = require('../../assets/images/icons/Bell.png');
  const phoneLogo = require('../../assets/images/icons/Phone.png');
  const homeLogo = require('../../assets/images/icons/Icon.png');
  
  // Dummy data for demonstration
  const [profileData, setProfileData] = useState({
    name: 'Devansh Pandey',
    status: 'Available',
    users: [
      { id: '1', name: 'Alice Johnson', status: 'Available', avatar: USER_AVATARS[0] },
      { id: '2', name: 'Bob Smith', status: 'Not Available', avatar: USER_AVATARS[1] },
      { id: '3', name: 'Charlie Lee', status: 'Available', avatar: USER_AVATARS[2] },
      { id: '4', name: 'Diana Prince', status: 'Available', avatar: USER_AVATARS[3] },
      { id: '5', name: 'Ethan Clark', status: 'Not Available', avatar: USER_AVATARS[4] },
      { id: '6', name: 'Fiona Adams', status: 'Available', avatar: USER_AVATARS[5] },
      { id: '7', name: 'George Miller', status: 'Not Available', avatar: USER_AVATARS[6] },
    ]
  });

  // Render each user item
  const renderUserItem = ({ item }) => (
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
          {item.status}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerBox}>
        <View style={styles.headerLeft}>
          <Text style={styles.profileNameHeader}>Devansh Pandey</Text>
          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>Status - Available </Text>
            <View style={styles.statusDot} />
          </View>
        </View>
        <Image source={{ uri: AVATAR_URL }} style={styles.profileAvatar} />
      </View>
      {/* Users List */}
      <View style={styles.listContainer}>
        <FlatList
          data={profileData.users}
          renderItem={renderUserItem}
          keyExtractor={item => item.id}
          estimatedItemSize={70}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
      {/* Bottom Navigation */}
      <View style={styles.bottomNavBar}>
          <TouchableOpacity style={styles.navItem}>
          <Image source={homeLogo} style={styles.navIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('notifications')}>
          <Image source={bellLogo} style={styles.navIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('contacts')}>
          <Image source={phoneLogo} style={styles.navIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <Image source={userLogo} style={styles.navIcon} />
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
    color: '#7B61FF', // blue/purple
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
    marginTop: 0,
    marginBottom: 40, // for bottom nav
  },
  listContent: {
    paddingBottom: 20,
  },
  userCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical:10,
    paddingHorizontal:12,
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
    paddingHorizontal: 14,
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
    
  }
});

export default MainScreen;