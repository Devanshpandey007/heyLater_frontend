import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../lib/firebaseConfig';
import axios from 'axios';

const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const formatTimeRange = (start, end) => {
  const formatSingleTime = (time) => {
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes.toString().padStart(2, '0'); 
    return `${hours}:${minutes} ${ampm}`;
  };
  return `${formatSingleTime(start)} - ${formatSingleTime(end)}`;
};

const DynamicTimelineBar = ({ slots }) => {
  const totalMinutesInDay = 24 * 60;
  if (!slots || slots.length === 0) {
    return <View style={{ flex: 1, backgroundColor: '#A8E6CF' }} />;
  }

  const sortedSlots = [...slots].sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));
  let lastEndTimeMinutes = 0;
  const segments = [];

  sortedSlots.forEach((slot, index) => {
    const startTimeMinutes = timeToMinutes(slot.start);
    
    const endTimeMinutes = timeToMinutes(slot.end);

    if (startTimeMinutes > lastEndTimeMinutes) {
      const gapDuration = startTimeMinutes - lastEndTimeMinutes;
      segments.push(
        <View key={`gap-${index}`} style={{ flex: gapDuration, backgroundColor: '#A8E6CF' }} />
      );
    }

    const duration = endTimeMinutes - startTimeMinutes;
    if (duration > 0) {
      const color = slot.type === 'available' ? '#A8E6CF' : '#FF8A80';
      segments.push(
        <View key={slot.start} style={{ flex: duration, backgroundColor: color }} />
      );
    }

    lastEndTimeMinutes = endTimeMinutes;
  });

  if (lastEndTimeMinutes < totalMinutesInDay) {
    const finalSegmentDuration = totalMinutesInDay - lastEndTimeMinutes;
    segments.push(
      <View key="final-gap" style={{ flex: finalSegmentDuration, backgroundColor: '#A8E6CF' }} />
    );
  }

  return <View style={{ flexDirection: 'row', flex: 1 }}>{segments}</View>;
};

const TimeSlotItem = ({ type, start, end, tags = [] }) => {
  const isAvailable = type === 'available';
  const slotColor = isAvailable ? '#A8E6CF' : '#FF8A80';
  const borderColor = isAvailable ? '#75Bda3' : '#e57a70';

  return (
    <View style={[styles.slotItem, { borderColor: borderColor }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={[styles.slotColorIndicator, { backgroundColor: slotColor }]} />
        <Text style={styles.slotTimeText}>{formatTimeRange(start, end)}</Text>
      </View>
      {tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const ReadOnlyScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedDay, setSelectedDay] = useState('Thu');
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [userSlots, setUserSlots] = useState({});
  const { userId, userPic, userName } = route.params || {};

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const currentDaySlots = userSlots[selectedDay] || [];

  console.log("user-id: ", userId, "user-pic,", userPic, "user-name:", userName);
  

  const availableSlots = currentDaySlots.filter((slot) => slot.type === 'available');
  const busySlots = currentDaySlots.filter((slot) => slot.type === 'busy');

  const fetchUserSlots = async () => {
    try {
      console.log('Fetching user slots...');
      const user = FIREBASE_AUTH.currentUser;
      if (!user) return;
      const idToken = await user.getIdToken();

      const response = await axios.get(`http://192.168.29.223:3000/api/users/slots/${userId}`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      if (response.status !== 200) return;

      const slotsFromBackend = response.data.slots || []; 
      
      if (slotsFromBackend.length === 0) return;
      
      // Determine the day key from the first slot
      const dayKey = slotsFromBackend[0].day || 'Thu';

      // Helper function to format the time object { hour: 8, minute: 0 } into '8:00'
      const formatTimePart = (timePart) => {
          // Pad start time hours if necessary (optional, but robust)
          const hour = timePart.hour.toString();
          const minute = timePart.minute.toString().padStart(2, '0');
          return `${hour}:${minute}`;
      };

      const formattedSlotsArray = slotsFromBackend.map((slot) => {
          return {
              // 1. Correctly map the backend's 'is_free' property to the local 'type' property
              type: slot.is_free === 'free' ? 'available' : 'busy',
              
              // 2. Correctly format the nested time objects into the 'HH:MM' string format
              start: formatTimePart(slot.start),
              end: formatTimePart(slot.end),
              
              tags: slot.tags || [],
          };
      });

      // 3. Set the state under the correct day key
      setUserSlots(prevSlots => ({
          ...prevSlots,
          [dayKey]: formattedSlotsArray,
      }));

      console.log('Fetched Slots (Final):', { [dayKey]: formattedSlotsArray });
    } catch (error) {
      console.error('Error fetching user slots:', error?.response?.data || error.message);
    }
  };


  useEffect(() => {
    fetchUserSlots();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileContainer}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: userPic || 'https://i.pravatar.cc/150?u=default' }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.profileName}>{userName || 'User'}</Text>
        </View>

        <View style={styles.scheduleCard}>
          <View style={styles.daySelector}>
            {days.map((day) => (
              <TouchableOpacity key={day} onPress={() => setSelectedDay(day)} style={styles.dayButton}>
                <Text style={[styles.dayText, selectedDay === day && styles.selectedDayText]}>
                  {day}
                </Text>
                {selectedDay === day && <View style={styles.dayIndicator} />}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.timelineContainer}>
            <DynamicTimelineBar slots={currentDaySlots} />
          </View>

          <View style={styles.timeLabels}>
            {['12 am', '4 am', '8 am', '12 pm', '4 pm', '8 pm', '12 am'].map((label, i) => (
              <Text key={i} style={styles.timeLabelText}>{label}</Text>
            ))}
          </View>

          <View style={styles.slotsListContainer}>
            <Text style={styles.slotTitle}>😊 Available</Text>
            {availableSlots.length > 0 ? (
              availableSlots.map((slot, index) => <TimeSlotItem key={`avail-${index}`} {...slot} />)
            ) : (
              <Text style={styles.noSlotsText}>No available slots for {selectedDay}.</Text>
            )}

            <Text style={[styles.slotTitle, { marginTop: 20 }]}>😠 Busy</Text>
            {busySlots.length > 0 ? (
              busySlots.map((slot, index) => <TimeSlotItem key={`busy-${index}`} {...slot} />)
            ) : (
              <Text style={styles.noSlotsText}>No busy slots for {selectedDay}.</Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Nav Bar */}
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

// same styles as before
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F7FF' },
  container: { alignItems: 'center', paddingBottom: 100 },
  menuIconContainer: { position: 'absolute', top: 20, left: 15, zIndex: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)' },
  menuContainer: { backgroundColor: 'white', borderRadius: 10, padding: 10, position: 'absolute', top: 60, left: 15 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5 },
  menuItemText: { fontSize: 16, marginLeft: 10 },
  profileContainer: { alignItems: 'center', marginTop: 20 },
  avatarWrapper: { borderWidth: 3, borderColor: '#8A2BE2', borderRadius: 63, padding: 3 },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  profileName: { marginTop: 10, fontSize: 22, fontWeight: '600' },
  buttonContainer: { width: '85%', marginTop: 20 },
  button: { backgroundColor: '#8860D0', paddingVertical: 15, borderRadius: 25, alignItems: 'center', marginBottom: 10 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  scheduleCard: { width: '90%', backgroundColor: '#FFFFFF', borderRadius: 20, padding: 15, marginTop: 20 },
  daySelector: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15 },
  dayText: { fontSize: 16, color: '#9A9A9A' },
  selectedDayText: { color: '#4A4A4A', fontWeight: 'bold' },
  dayIndicator: { height: 3, width: 20, backgroundColor: '#8860D0', borderRadius: 2, marginTop: 4 },
  timelineContainer: { flexDirection: 'row', height: 25, borderRadius: 15, overflow: 'hidden', backgroundColor: '#F0F0F0', marginTop: 5 },
  timeLabels: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 5, marginTop: 5 },
  timeLabelText: { fontSize: 10, color: '#9A9A9A' },
  slotsListContainer: { marginTop: 20 },
  slotTitle: { fontSize: 18, fontWeight: '600', color: '#4A4A4A', marginBottom: 10 },
  noSlotsText: { color: '#9A9A9A', textAlign: 'center', padding: 10 },
  slotItem: { backgroundColor: '#F9F9F9', borderRadius: 12, padding: 12, marginBottom: 10, borderLeftWidth: 5 },
  slotColorIndicator: { width: 12, height: 12, borderRadius: 3, marginRight: 10 },
  slotTimeText: { fontSize: 16, fontWeight: '500', color: '#4A4A4A' },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, paddingLeft: 22 },
  tag: { backgroundColor: '#EAE2FF', borderRadius: 12, paddingVertical: 4, paddingHorizontal: 10, marginRight: 6, marginBottom: 6 },
  tagText: { color: '#8860D0', fontSize: 12, fontWeight: '500' },
  navBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 55, backgroundColor: '#FFFFFF', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#E0E0E0' },
  navButton: { alignItems: 'center', justifyContent: 'center', flex: 1 },
});

export default ReadOnlyScreen;