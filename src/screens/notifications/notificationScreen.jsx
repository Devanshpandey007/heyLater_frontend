import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { FIREBASE_APP, FIREBASE_AUTH } from '../../lib/firebaseConfig';





const NotificationsScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('all');

  const userLogo = require('../../assets/images/icons/User.png');
  const bellLogo = require('../../assets/images/icons/Bell.png');
  const phoneLogo = require('../../assets/images/icons/Phone.png');
  const homeLogo = require('../../assets/images/icons/Icon.png');

  const thumbsUpImg = require('../../assets/images/icons/thumb_up.png');
  const thumbsDownImg = require('../../assets/images/icons/thumb_down.png');
  // Sample notification data;


  const [notifications, setNotifications] = useState([]);

  const [demoNotifications, setDemoNotifications] = useState([
    {
      id: '1',
      type: 'connection',
      name: 'Lee Williamson',
      time: '06.12',
      message: 'Send you request to connect',
      status: 'pending'
    },
    {
      id: '2',
      type: 'personal',
      name: 'Ajit Tomar',
      time: '06.12',
      timeframe: '(2:30pm - 2:40pm)',
      code: 'T0',
      message: 'Are you free on Monday if yes then I have sended you the slot req please accept',
      status: 'pending'
    },
    {
      id: '3',
      type: 'personal',
      name: 'Ajit Tomar',
      time: '06.12',
      timeframe: '(2:30pm - 2:40pm)',
      code: 'M0',
      message: 'Are you free on Monday if yes then I have sended you the slot req please accept',
      status: 'pending'
    },
    {
      id: '4',
      type: 'connection',
      name: 'Rajiv Negi',
      time: '06.12',
      message: 'Send you request to connect',
      status: 'pending'
    },
    {
      id: '5',
      type: 'connection',
      name: 'Rajiv Negi',
      time: '06.12',
      message: 'Send you request to connect',
      status: 'pending'
    }
  ]);



  // Map backend notification to existing demo shape

  const transformNotification = (notif, fallbackSenderName, fallbackSenderPhoto) => {
  const createdAt = new Date(notif.created_at);
  const month = String(createdAt.getMonth() + 1).padStart(2, '0');
  const day = String(createdAt.getDate()).padStart(2, '0');
  const data = notif?.data || {};

  // Safely check if data.senderPhoto exists before calling trim()
  const avatarUrl = data.senderPhoto 
    ? data.senderPhoto.trim()
    : fallbackSenderPhoto;

  // Debug: Log the avatar URL to check if it's valid
  console.log("Avatar URL:", avatarUrl);

  return {
    id: `srv-${String(notif.id)}`,
    type: notif.type === 'invite_request' ? 'connection' : 'personal',
    name: data.senderName || fallbackSenderName || 'Unknown',
    time: `${month}.${day}`,
    timeframe: data.timeframe,
    code: data.code,
    message: notif.message,
    status: notif.is_read ? 'read' : 'pending',
    avatarUrl: avatarUrl
  };
};

  const manageNotifications = async () => {
    console.log("manageNotifications called");
    try {
      const currentUser = FIREBASE_AUTH.currentUser;
      if (!currentUser) {
        console.error("No current user!");
        return;
      }
      const idToken = await currentUser.getIdToken();
      const response = await axios.get('http://192.168.29.223:3000/api/notifications', {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      });
      
      // Remove success check since backend doesn't send it
      console.log("data->", response.data);
      const { notificationData = [], senderName, senderPhoto } = response.data;
      const mapped = notificationData.map(n => {
        const endProduct = transformNotification(n, senderName, senderPhoto);
        console.log("Transformed notification:", endProduct);
        return endProduct;
      });
      if (mapped.length) {
        // prepend new items so they show first, and dedupe by id
        setDemoNotifications(prev => {
          const existingIds = new Set(prev.map(item => item.id));
          const uniqueNew = mapped.filter(item => !existingIds.has(item.id));
          return [...uniqueNew, ...prev];
        });
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  }


  useEffect(()=>{ 
    manageNotifications();
  },[]);
  // Filter notifications based on active tab
  const filteredNotifications = activeTab === 'all' 
    ? demoNotifications
    : demoNotifications.filter(notif => 
        activeTab === 'personal' ? notif.type === 'personal' : notif.type === 'connection'
      );

  // Placeholder images for thumbs up/down and avatar

  const avatarImg = { uri: 'https://via.placeholder.com/48x48.png?text=U' };

  // Render a connection request notification
  const renderConnectionNotification = ({ item }) => (
    <View style={styles.notificationCard}>
      <View style={styles.row}>
        <View style={styles.avatarContainer}>
          <Image source={item.avatarUrl ? { uri: item.avatarUrl } : avatarImg} style={styles.avatar} />
          <View style={styles.onlineDot} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.notificationHeader}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
          <Text style={styles.message}>{item.message}</Text>
        </View>
      </View>
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn}>
          <Image source={thumbsUpImg} style={styles.actionImg} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Image source={thumbsDownImg} style={styles.actionImg} />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render a personal notification
  const renderPersonalNotification = ({ item }) => (
    <View style={styles.notificationCard}>
      <View style={styles.row}>
        <View style={styles.avatarContainer}>
          <Image source={item.avatarUrl ? { uri: item.avatarUrl } : avatarImg} style={styles.avatar} />
          <View style={styles.onlineDot} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.notificationHeader}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
          <View style={styles.timeframeContainer}>
            <Text style={styles.timeframe}>{item.timeframe || '12:00pm - 2:00pm'}</Text>
            <View style={styles.dayTag}><Text style={styles.dayTagText}>{item.code === 'T0' ? 'Tu' : 'Mo'}</Text></View>
          </View>
          <Text style={styles.message}>{item.message}</Text>
        </View>
      </View>
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn}>
          <Image source={thumbsUpImg} style={styles.actionImg} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Image source={thumbsDownImg} style={styles.actionImg} />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render item based on type
  const renderItem = ({ item }) => {
    if (item.type === 'connection') {
      return renderConnectionNotification({ item });
    } else {
      return renderPersonalNotification({ item });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>{'<Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Notifications</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'all' && styles.activeTab]} 
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'personal' && styles.activeTab]} 
          onPress={() => setActiveTab('personal')}
        >
          <Text style={[styles.tabText, activeTab === 'personal' && styles.activeTabText]}>Personal</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'connection' && styles.activeTab]} 
          onPress={() => setActiveTab('connection')}
        >
          <Text style={[styles.tabText, activeTab === 'connection' && styles.activeTabText]}>Connection</Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <FlatList
        data={filteredNotifications}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
       <View style={styles.bottomNavBar}>
            <TouchableOpacity style={styles.navItem} onPress={()=>navigation.navigate('mainScreen')}>
            <Image source={homeLogo} style={styles.navIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={()=> navigation.navigate('Notifications')}>
            <Image source={bellLogo} style={styles.navIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={()=> navigation.navigate('Contacts')}>
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
    backgroundColor: '#FAFAFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECFA',
    backgroundColor: '#fff',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#7B61FF',
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#7B61FF',
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F2FF',
    borderRadius: 10,
    marginTop:12,
    marginBottom:10,
    padding: 1,
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
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 7,
  },
  activeTab: {
    backgroundColor: '#7B61FF',
  },
  tabText: {
    fontSize: 14,
    color: '#7B61FF',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
  listContainer: {
    padding: 8,
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#7B61FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarContainer: {
    marginRight: 12,
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ECECFA',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CD964',
    borderWidth: 2,
    borderColor: '#fff',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D2057',
    flex: 1,
  },
  time: {
    fontSize: 13,
    color: '#A1A1B3',
    marginLeft: 8,
  },
  timeframeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  timeframe: {
    fontSize: 13,
    color: '#7B61FF',
    backgroundColor: '#F3F2FF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  dayTag: {
    backgroundColor: '#E5E0FF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  dayTagText: {
    color: '#7B61FF',
    fontWeight: '600',
    fontSize: 13,
  },
  message: {
    fontSize: 14,
    color: '#2D2057',
    lineHeight: 20,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 12,
  },
  actionBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#F3F2FF',
  },
  actionImg: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});

export default NotificationsScreen;
