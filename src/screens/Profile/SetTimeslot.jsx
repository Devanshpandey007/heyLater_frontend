import React, { useState, useCallback, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal, 
  LayoutAnimation, 
  UIManager,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useRoute, useNavigation} from '@react-navigation/native';
import { FIREBASE_APP, FIREBASE_AUTH } from '../../lib/firebaseConfig';
import axios from 'axios';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- Configuration & Constants ---
const THEME = {
  free: { primary: '#A8E6CF', secondary: '#4CAF50', text: '#005020', border: '#75Bda3' },
  busy: { primary: '#FFCDD2', secondary: '#F44336', text: '#B71C1C', border: '#e57a70' }
};
const PRESET_TAGS = ['Movie', 'Gym', 'Breakfast', 'Call', 'Swimming', 'Meeting', 'Shopping', 'Study', 'Work', 'Coding', 'Party', 'Gaming', 'Family', 'Lunch', 'Fun', 'Dinner', 'Cleaning'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// --- Helper Functions & Components ---

/**
 * Converts a time object to total minutes from midnight for easy comparison.
 * @param {{hour: number, minute: number, period: string}} time - The time object.
 * @returns {number} - Total minutes from midnight.
 */
const timeToMinutes = (time) => {
  let { hour, minute, period } = time;
  if (period === 'PM' && hour !== 12) {
    hour += 12;
  }
  if (period === 'AM' && hour === 12) { // Midnight case
    hour = 0;
  }
  return hour * 60 + minute;
};

const formatTime = (time) => {
  let { hour, minute, period } = time;
  const minuteStr = minute < 10 ? `0${minute}` : minute;
  return `${hour}:${minuteStr} ${period}`;
};

const Tag = ({ label, isSelected, onPress, theme }) => (
  <TouchableOpacity
    style={[
      styles.tag,
      { backgroundColor: isSelected ? theme.secondary : '#f0f0f0' }
    ]}
    onPress={onPress}
  >
    <Text style={[styles.tagText, { color: isSelected ? '#fff' : '#555' }]}>
      {label}
    </Text>
  </TouchableOpacity>
);

// Updated AddedSlot component with a delete button
const AddedSlot = ({ slot, theme, onDelete }) => {
  console.log('Slot:', slot); 

  return (
    <View style={[styles.addedSlotCard, { borderColor: theme.border }]}>
      <View style={styles.addedSlotContent}>
        <View style={styles.slotIndicatorContainer}>
          <View style={[styles.slotIndicator, { backgroundColor: theme.primary }]} />
        </View>
        <View style={styles.addedSlotDetails}>
          <Text style={styles.addedSlotTimeText}>
            {formatTime(slot.start)} - {formatTime(slot.end)}
          </Text>
          <View style={styles.addedSlotTagsContainer}>
            {slot.tags.map(tag => (
              <View key={tag} style={[styles.addedSlotTag, { backgroundColor: theme.primary }]}>
                <Text style={[styles.addedSlotTagText, { color: theme.text }]}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
        <Icon name="trash-outline" size={22} color="#888" />
      </TouchableOpacity>
    </View>
  );
};



// const AddedSlot = ({ slot, theme, onDelete }) => {
//   console.log("sslot:", slot);
//   const formatSlotTime = (timeString) => {
//     console.log("timestring: ", timeString);
//     if (!timeString) return "—";
//     const date = new Date(timeString);
//     let hours = date.getHours();
//     const minutes = date.getMinutes();
//     const period = hours >= 12 ? 'PM' : 'AM';
//     hours = hours % 12 || 12;
//     const minuteStr = minutes < 10 ? `0${minutes}` : minutes;
//     return `${hours}:${minuteStr} ${period}`;
//   };

//   return (
//     <View style={[styles.addedSlotCard, { borderColor: theme.border }]}>
//       <View style={styles.addedSlotContent}>
//         <View style={styles.slotIndicatorContainer}>
//           <View style={[styles.slotIndicator, { backgroundColor: theme.primary }]} />
//         </View>
//         <View style={styles.addedSlotDetails}>
//           <Text style={styles.addedSlotTimeText}>
//             {formatSlotTime(slot.start_time)} - {formatSlotTime(slot.end_time)}
//           </Text>
//           <View style={styles.addedSlotTagsContainer}>
//             {(slot.tags || []).map(tag => (
//               <View key={tag} style={[styles.addedSlotTag, { backgroundColor: theme.primary }]}>
//                 <Text style={[styles.addedSlotTagText, { color: theme.text }]}>{tag}</Text>
//               </View>
//             ))}
//           </View>
//         </View>
//       </View>
//       <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
//         <Icon name="trash-outline" size={22} color="#888" />
//       </TouchableOpacity>
//     </View>
//   );
// };


const convertToUtcDateTime = (dayName, timeObject) => {
    
    const today = new Date();
  
    const dayOfWeek = today.getDay(); 
  
    const isoDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1; 
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - isoDay);
    
    startOfWeek.setHours(0, 0, 0, 0); 

    
    const dayIndex = DAYS.indexOf(dayName); // DAYS = ['Mon', 'Tue', ...]
    if (dayIndex === -1) {
        console.error("Invalid day name provided for conversion.");
        return null;
    }

    const targetDate = new Date(startOfWeek);
    // Add the offset from Monday to get to the selected day (e.g., 5 days for Sat)
    targetDate.setDate(startOfWeek.getDate() + dayIndex);

    // 3. Convert 12h time to 24h hour
    let { hour, minute, period } = timeObject;
    let hour24 = hour;

    if (period === 'PM' && hour !== 12) {
        hour24 += 12;
    } else if (period === 'AM' && hour === 12) { // 12 AM (Midnight) is hour 0
        hour24 = 0;
    }

    // 4. Apply the time in the local timezone
    targetDate.setHours(hour24, minute, 0, 0);

    // The Date object is now complete and ready for the database/API call.
    return targetDate;
}; 


// --- Enhanced Custom Time Picker Component ---
const CustomTimePicker = ({
  visible,
  onClose,
  onConfirm,
  theme,
  initialTime
}) => {
  const [selectedHour, setSelectedHour] = useState(initialTime.hour);
  const [selectedMinute, setSelectedMinute] = useState(initialTime.minute);
  const [selectedPeriod, setSelectedPeriod] = useState(initialTime.period);

  if (!visible) return null;

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 12 }, (_, i) => (i * 5));
  const periods = ['AM', 'PM'];

  const handleConfirm = () => {
    onConfirm({
      hour: selectedHour,
      minute: selectedMinute,
      period: selectedPeriod
    });
  };

  const createPickerItem = (value, type) => {
    const isSelected = type === 'hour' ? selectedHour === value :
                       type === 'minute' ? selectedMinute === value :
                       selectedPeriod === value;

    const handlePress = () => {
      // Vibration.vibrate(50); // Haptic feedback
      if (type === 'hour') setSelectedHour(value);
      if (type === 'minute') setSelectedMinute(value);
      if (type === 'period') setSelectedPeriod(value);
    };

    return (
      <TouchableOpacity
        key={value}
        style={[styles.pickerItem, isSelected && { backgroundColor: theme.secondary }]}
        onPress={handlePress}
      >
        <Text style={[
          styles.pickerItemText,
          { color: theme.text },
          isSelected && styles.selectedPickerItemText
        ]}>
          {type === 'minute' ? value.toString().padStart(2, '0') : value}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={[styles.pickerContainer, { backgroundColor: theme.primary }]}>
          <View style={styles.pickerHeader}>
            <Text style={[styles.headerText, { color: theme.text }]}>Select Time</Text>
          </View>

          <View style={styles.pickerRow}>
            {/* Hour Picker */}
            <View style={styles.pickerColumn}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {hours.map(hour => createPickerItem(hour, 'hour'))}
              </ScrollView>
            </View>
            <Text style={[styles.timeSeparator, {color: theme.text}]}>:</Text>
            {/* Minute Picker */}
            <View style={styles.pickerColumn}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {minutes.map(minute => createPickerItem(minute, 'minute'))}
              </ScrollView>
            </View>
            {/* AM/PM Picker */}
            <View style={styles.pickerColumn}>
              {periods.map(period => createPickerItem(period, 'period'))}
            </View>
          </View>

          <View style={styles.pickerActions}>
            <TouchableOpacity style={styles.actionButton} onPress={onClose}>
              <Text style={[styles.cancelText, { color: theme.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.confirmButton, { backgroundColor: theme.secondary }]}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};


// --- Main Screen Component ---
const SetTimeSlotScreen = () => {
  const [slotType, setSlotType] = useState('free');
  const [selectedDay, setSelectedDay] = useState('Thu');
  const [startTime, setStartTime] = useState({ hour: 7, minute: 0, period: 'AM' });
  const [endTime, setEndTime] = useState({ hour: 12, minute: 0, period: 'PM' });
  const [selectedTags, setSelectedTags] = useState([]);
  const [allSlots, setAllSlots] = useState({});
  const [pickerVisible, setPickerVisible] = useState(false);
  const [editing, setEditing] = useState('start');
  const [error, setError] = useState('');
  const theme = THEME[slotType];


  const route  =  useRoute();
  const navigation = useNavigation();

  const onDismissPicker = useCallback(() => setPickerVisible(false), []);

  const onConfirmPicker = useCallback((newTime) => {
    if (editing === 'start') {
      setStartTime(newTime);
    } else {
      setEndTime(newTime);
    }
    setPickerVisible(false);
  }, [editing]);

  const handleToggleTag = (tag) => {
    setError(''); // Clear error on interaction
    setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  };

  const handleAddSlot = async () => {

    const existingSlots = allSlots[selectedDay] || [];
    const newSlotStart = timeToMinutes(startTime);
    const newSlotEnd = timeToMinutes(endTime);

    const currentUser = FIREBASE_AUTH.currentUser;
    if (!currentUser){
      console.log("No current user :(");
      return
    }

    const idToken = await currentUser.getIdToken();

    // Basic validation
    if (newSlotStart >= newSlotEnd) {
        setError('End time must be after start time.');
        return;
    }

    // Check for overlaps with existing slots
    const isOverlapping = existingSlots.some(slot => {
        const existingStart = timeToMinutes(slot.start);
        const existingEnd = timeToMinutes(slot.end);
        console.log("slot->start", slot.start, "slot->end", slot.end);
        // Overlap condition: (StartA < EndB) and (EndA > StartB)
        return newSlotStart < existingEnd && newSlotEnd > existingStart;
    });

    if (isOverlapping) {
      setError('This time slot overlaps with an existing one.');
      return;
    }
    const fullStartTime = convertToUtcDateTime(selectedDay, startTime);
//     const fullEndTime = convertToUtcDateTime(selectedDay, endTime);
    const finalDate = fullStartTime.toISOString().split('T')[0]

//     if (!fullStartTime || !fullEndTime) {
//         setError('Failed to generate full date/time for slot.');
//         return;
//     }
    
    // --- Backend Data Structure ---
    // The `newSlot` object contains all the info you need.
    // - `id`: A unique identifier for the slot.
    // - `type`: This will be either 'free' or 'busy'. Your backend can use this field to differentiate.
    // - `start`, `end`: Time objects.
    // - `tags`: An array of selected strings.
    console.log("satrtime", startTime);
    console.log("endtime", endTime);
    const newSlot = {
        id: Date.now(), 
        type: slotType, 
        start: startTime,
        end: endTime,
        day: selectedDay,
        tags: selectedTags,
        is_free: slotType
    };

    const response  = await axios.post('http://192.168.29.223:3000/api/users/slots', newSlot, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    if (!response.status === 201){
      return
    };

    console.log("response-data", response.data);

    await fetchAllExistingSlots();
    
  };

  const fetchAllExistingSlots = async () => {
    try {  
      console.log("api triggered");
      const user = FIREBASE_AUTH.currentUser;
      if (!user) {
        console.warn("User not authenticated.");
        return;
      }

      // Always await the token — it's an async operation
      const idToken = await user.getIdToken();

      const response = await axios.get('http://192.168.29.223:3000/api/users/slots', {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      // ❌ Incorrect: if (!response.status === 200)
      // ✅ Correct: check with !== operator
      if (response.status !== 200) {
        console.log("Slot does not exist!");
        return;
      }

      console.log("returnedSlot:", JSON.stringify(response.data, null, 2));

      const slotsFromBackend = response.data.slots;
      const formattedSlots = slotsFromBackend.reduce((acc, slot) => {
      const day = slot.day;
      if (!acc[day]) acc[day] = [];
        acc[day].push(slot);
        return acc;
      }, {});

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setAllSlots(formattedSlots);
      setSelectedTags([]);
      setError('');


      console.log("slotforday", slotsForDay);
    } catch (error) {
      console.error("Error fetching slots:", error?.response?.data || error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged((user) => {
      if (user) {
        fetchAllExistingSlots();
      } else {
        console.log("No user signed in yet.");
      }
    });

    return unsubscribe;
  }, []);




  const handleDeleteSlot = async (day, slotIdToDelete, slot) => {
      const user = FIREBASE_AUTH.currentUser;
      const idToken = await user.getIdToken();
      console.log("going to be deleted: ", slot);
      const response = await axios.delete(`http://192.168.29.223:3000/api/users/slots/${slot.id}`,{
        headers:{
          Authorization: `Bearer ${idToken}`
        }
      });
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setAllSlots(prev => ({
          ...prev,
          [day]: prev[day].filter(slot => slot.id !== slotIdToDelete)
      }));

  };

  const slotsForDay = allSlots[selectedDay] || [];
  const timeToEdit = editing === 'start' ? startTime : endTime;

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomTimePicker
        visible={pickerVisible}
        onClose={onDismissPicker}
        onConfirm={onConfirmPicker}
        theme={theme}
        initialTime={timeToEdit}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.slotTypeContainer}>
          {['free', 'busy'].map(type => (
            <TouchableOpacity
              key={type}
              style={[
                styles.slotTypeButton,
                slotType === type && { borderColor: THEME[type].border, backgroundColor: '#fff' }
              ]}
              onPress={() => setSlotType(type)}
            >
              <Text style={[
                styles.slotTypeButtonText,
                slotType === type && { color: THEME[type].secondary }
              ]}>
                Set {type.charAt(0).toUpperCase() + type.slice(1)} Slot
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.daySelector}>
          {DAYS.map((day) => (
            <TouchableOpacity key={day} onPress={() => setSelectedDay(day)}>
              <Text style={[
                styles.dayText,
                selectedDay === day && { color: theme.secondary, fontWeight: 'bold' }
              ]}>
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.card, { borderColor: theme.border }]}>
            <View style={styles.timeRangeDisplay}>
                 <TouchableOpacity onPress={() => { setEditing('start'); setPickerVisible(true); }}>
                     <Text style={[styles.timeText, { color: theme.secondary, fontWeight: 'bold' }]}>
                         {formatTime(startTime)}
                     </Text>
                 </TouchableOpacity>
                 <Text style={styles.timeText}> - </Text>
                 <TouchableOpacity onPress={() => { setEditing('end'); setPickerVisible(true); }}>
                     <Text style={[styles.timeText, { color: theme.secondary, fontWeight: 'bold' }]}>
                         {formatTime(endTime)}
                     </Text>
                 </TouchableOpacity>
            </View>
            <Text style={styles.helperText}>Tap on a time to open the clock picker.</Text>

            <View style={styles.tagsContainer}>
                {PRESET_TAGS.map((tag) => (
                    <Tag
                        key={tag}
                        label={tag}
                        isSelected={selectedTags.includes(tag)}
                        onPress={() => handleToggleTag(tag)}
                        theme={theme}
                    />
                ))}
            </View>
            
             {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={styles.addButton} onPress={handleAddSlot}>
                <Text style={styles.addButtonText}>Add Slot</Text>
                <Icon name="add-circle" size={24} color="#555"/>
            </TouchableOpacity>
        </View>

        <View style={styles.addedSlotsSection}>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
             <View style={[styles.slotIndicator, {backgroundColor: theme.primary}]} />
             <Text style={styles.addedSlotsTitle}>Added Slots for {selectedDay}</Text>
          </View>
          {slotsForDay.length > 0 ? (
            slotsForDay.map(slot => (
              <AddedSlot
                key={slot.id}
                slot={slot}
                theme={THEME[slot.type] || THEME[slot.is_free] || THEME['free']}
                onDelete={() => handleDeleteSlot(selectedDay, slot.id, slot)}
              />
            ))
          ) : (
            <Text style={styles.noSlotsText}>No slots added for {selectedDay}.</Text>
          )}
        </View>
      </ScrollView>
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

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9f9f9' },
  container: { padding: 15, paddingBottom: 100 },
  slotTypeContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  slotTypeButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, borderWidth: 1.5, borderColor: '#ddd', marginHorizontal: 5, backgroundColor: '#f7f7f7' },
  slotTypeButtonText: { fontSize: 16, fontWeight: '600', color: '#aaa' },
  daySelector: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  dayText: { fontSize: 16, color: '#888' },
  card: { backgroundColor: '#fff', borderRadius: 15, padding: 15, borderWidth: 1, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2, },
  timeRangeDisplay: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 20, paddingVertical: 12, alignSelf: 'center', paddingHorizontal: 25, },
  timeText: { fontSize: 20, color: '#333', fontWeight: '500' },
  helperText: { textAlign: 'center', color: '#999', fontSize: 12, marginTop: 15, marginBottom: 5 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 10, marginBottom: 10, },
  tag: { borderRadius: 15, paddingVertical: 6, paddingHorizontal: 12, margin: 4 },
  tagText: { fontSize: 14 },
  addButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 15, marginTop: 10, },
  addButtonText: { fontSize: 16, color: '#555', marginRight: 8 },
  addedSlotsSection: { marginTop: 10 },
  addedSlotsTitle: { fontSize: 18, fontWeight: 'bold', color: '#444' },
  noSlotsText: { textAlign: 'center', color: '#999', marginTop: 20 },
  addedSlotCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 10, borderLeftWidth: 5, },
  addedSlotContent: { flexDirection: 'row', alignItems: 'center', flex: 1, },
  slotIndicatorContainer: { alignSelf: 'flex-start', paddingTop: 3, },
  slotIndicator: { width: 12, height: 12, borderRadius: 3, marginRight: 10, },
  addedSlotDetails: { flex: 1, },
  addedSlotTimeText: { fontSize: 16, fontWeight: '500', color: '#4A4A4A', },
  addedSlotTagsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, },
  addedSlotTag: { borderRadius: 12, paddingVertical: 4, paddingHorizontal: 10, marginRight: 6, marginBottom: 6, },
  addedSlotTagText: { fontSize: 12, fontWeight: '500' },
  deleteButton: { padding: 8, marginLeft: 10, },
  navBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, backgroundColor: '#FFFFFF', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#E0E0E0', },
  errorText: { color: '#D32F2F', textAlign: 'center', marginVertical: 10, fontWeight: '500' },

  // --- Enhanced Time Picker Styles ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  pickerContainer: {
    borderRadius: 20,
    width: '100%',
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  pickerHeader: {
    padding: 15,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 220,
    paddingHorizontal: 10,
  },
  pickerColumn: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
  },
  timeSeparator: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 5,
    paddingBottom: 25, 
  },
  pickerItem: {
    padding: 10,
    marginVertical: 4,
    borderRadius: 50,
    width: 60,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerItemText: {
    fontSize: 20,
    fontWeight: '500',
  },
  selectedPickerItemText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmButton: {
    borderRadius: 25,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  confirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default SetTimeSlotScreen;
