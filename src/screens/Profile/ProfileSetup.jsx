import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-paper';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { useSignup } from '../../context/SignupContext';
import supabase from '../../lib/supabaseClient';
import { FIREBASE_AUTH } from '../../lib/firebaseConfig';
import RNFS from 'react-native-fs';
import { decode } from 'base64-arraybuffer'; 






const ProfileSetup = () => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('Select Gender');
  const [dob, setDob] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const {user, setUser} = useSignup();

  const navigation = useNavigation();


  const handleChooseProfilePicture = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.7 },
      (response) => {
        console.log('Image picker response:', response);
        if (response.didCancel) return;
        if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          console.log('Selected asset:', asset);
          console.log('Asset URI:', asset.uri);
          console.log('Asset type:', asset.type);
          console.log('Asset file size:', asset.fileSize);
          setProfileImage(asset.uri);
        }
      }
    );
  };

  const handleTakePhoto = async () => {
    try {
      const result = await launchCamera({ mediaType: 'photo', quality: 0.7 });
      console.log('Camera result:', result);
      if (result.didCancel) return;
      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        console.log('Camera asset:', asset);
        console.log('Camera asset URI:', asset.uri);
        setProfileImage(asset.uri);
      }
    } catch (error) {
      console.warn('Camera error:', error);
    }
  };

  const handleChooseFromGallery = async () => {
    try {
      const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.7 });
      console.log('Gallery result:', result);
      if (result.didCancel) return;
      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        console.log('Gallery asset:', asset);
        console.log('Gallery asset URI:', asset.uri);
        setProfileImage(asset.uri);
      }
    } catch (error) {
      console.warn('Gallery error:', error);
    }
  };

  const handleCameraOptions = () => {
    Alert.alert(
      'Choose Option',
      'Choose an option to take a photo or choose from gallery',
      [
        {
          text: 'Take Photo',
          onPress: handleTakePhoto,
        },
        {
          text: 'Choose from Gallery',
          onPress: handleChooseFromGallery,
        },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true },
    );
  };


  const getMimeType = (ext) => {
  const types = {
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'webp': 'image/webp',
    'gif': 'image/gif',
  };
  return types[ext] || 'application/octet-stream'; // Default for unknown types
};



  const uploadProfileImage = async (fileUri, userId) => {
    try {
      // 1. Get file extension and determine MIME type
      const fileExt = fileUri.split('.').pop()?.toLowerCase() ?? 'jpg';
      const mimeType = getMimeType(fileExt);
      
      // 2. Create a unique and descriptive file path for storage
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `public/avatars/${userId}/${fileName}`;

      // 3. Read the file from the local file system as a base64 string
      const base64File = await RNFS.readFile(fileUri, 'base64');

      // 4. Decode the base64 string into an ArrayBuffer
      // This is the crucial step. The Supabase 'upload' method expects a binary type.
      const fileBuffer = decode(base64File);

      // 5. Upload the file to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('image-storage') // Your bucket name
        .upload(filePath, fileBuffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (uploadError) {
        console.error('Supabase upload error:', uploadError.message);
        throw uploadError;
      }

      // 6. Get the public URL of the uploaded file
      const { data: urlData } = supabase.storage
        .from('image-storage')
        .getPublicUrl(data.path);
        
      console.log('Image uploaded successfully:', urlData.publicUrl);
      return urlData.publicUrl;

    } catch (err) {
      console.error('Error during image upload process:', err);
      return null;
    }
  };




  // const uploadProfileImage = async (fileUri, userId) => {
  //   try {
  //     console.log('Starting upload for URI:', fileUri);
  //     console.log('User ID:', userId);
      
  //     const fileExt = fileUri.split('.').pop();
  //     const fileName = `profile_${userId}_${Date.now()}.${fileExt}`;
  //     const filePath = `${fileName}`;
      
  //     console.log('File path:', filePath);

  //     // For React Native, we need to handle the file differently
  //     let fileData;
      
  //     if (Platform.OS === 'android') {
  //       // For Android, use the file URI directly
  //       fileData = fileUri;
  //     } else {
  //       // For iOS, try to convert to blob
  //       try {
  //         const response = await fetch(fileUri);
  //         fileData = await response.blob();
  //       } catch (fetchError) {
  //         console.log('Fetch failed, using URI directly:', fetchError);
  //         fileData = fileUri;
  //       }
  //     }

  //     console.log('Uploading to Supabase...');
      
  //     // Upload to Supabase Storage
  //     const { data, error } = await supabase.storage
  //       .from('image-storage')
  //       .upload(filePath, fileData, {
  //         cacheControl: '3600',
  //         upsert: false
  //       });

  //     if (error) {
  //       console.error('Supabase upload error:', error);
  //       throw error;
  //     }

  //     console.log('Upload successful, getting public URL...');

  //     // Get the public URL
  //     const { data: url } = supabase.storage
  //       .from('image-storage')
  //       .getPublicUrl(filePath);

  //     console.log('Public URL:', url.publicUrl);
  //     return url.publicUrl;
  //   } catch (err) {
  //     console.error('Upload error details:', err);
  //     console.error('Error message:', err.message);
  //     console.error('Error code:', err.code);
  //     return null;
  //   }
  // };


  const handleButtonPress = async () => {
    try {
      const currentUser = FIREBASE_AUTH.currentUser;
      if (!currentUser) {
        Alert.alert('Error', 'No authenticated user found. Please sign in again.');
        return;
      }

      // 1. Get the Firebase ID token for the current user.
      // Your backend requires this in the 'Authorization' header to verify the request.
      const idToken = await currentUser.getIdToken();

      let imageUrl = null;
      if (profileImage) {
        if (!profileImage.startsWith('file://') && !profileImage.startsWith('content://')) {
          Alert.alert('Error', 'Invalid image format. Please select an image again.');
          return;
        }
        imageUrl = await uploadProfileImage(profileImage, currentUser.uid);
        if (!imageUrl) {
          Alert.alert('Error', 'Failed to upload profile image. Please try again.');
          return;
        }
      }

      // This data will be sent to your backend.
      // Note: firebaseUid is removed because the backend now gets it securely from the token.
      const updatedUser = {
        ...user,
        idToken: idToken,
        picture: imageUrl,
        name,
        gender,
        date_of_birth: dob,
        referredByCode: referralCode
      };
      console.log("updatedUser: ", updatedUser);

      // 2. Make the API call WITH the Authorization header.
      const response = await axios.post(
        'http://192.168.29.223:3000/api/auth/signup',
        updatedUser,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.data.success) {
        navigation.navigate('Success');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to create profile');
      }
    } catch (err) {
      console.error('Signup error:', err);
      // Give more specific feedback from the backend if available
      const errorMessage = err.response?.data?.message || 'Failed to create profile';
      Alert.alert('Error', errorMessage);
    }
  };


// Optimized image conversion function

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      <View style={styles.backButtonWrapper}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>{'< Back'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <TouchableOpacity style={styles.imageWrapper} onPress={handleChooseProfilePicture}>
          <Image 
            source={
              profileImage
                ? { uri: profileImage }
                : { uri: 'https://example.com/your-image-url.png' }
            }
            style={styles.image}
          />
          <TouchableOpacity
            style={styles.cameraIconOverlay}
            onPress={handleCameraOptions}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="camera" size={24} color="#6A5ACD" />
          </TouchableOpacity>
        </TouchableOpacity>

        <Text style={styles.header}>Fill necessary details</Text>

        <View style={styles.form}>
          <TextInput
            label="Name"
            mode="outlined"
            value={name}
            onChangeText={setName}
            style={{ backgroundColor: 'white', marginBottom: 16 }}
            activeOutlineColor="#6A5ACD"
            outlineColor="#6A5ACD"
            theme={{ roundness: 20 }}
          />

          {/* <Text style={styles.label}>Gender</Text> */}
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={gender}
              style={styles.picker}
              onValueChange={(itemValue) => setGender(itemValue)}
              dropdownIconColor="#6A5ACD"
            >
              <Picker.Item label="Select Gender" value="Select Gender" />
              <Picker.Item label="Male" value="MALE" />
              <Picker.Item label="Female" value="FEMALE" />
              <Picker.Item label="Other" value="OTHER" />
            </Picker>
          </View>

          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={{ marginBottom: 16 }}
            activeOpacity={0.7}
          >
            <TextInput
              label="Date Of Birth"
              mode="outlined"
              value={dob}
              style={{ backgroundColor: 'white' }}
              editable={false}
              right={<TextInput.Icon name="calendar" />}
              pointerEvents="none"
              theme={{ roundness: 20 }}
              activeOutlineColor="#6A5ACD"
              outlineColor="#6A5ACD"
            />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dob ? new Date(dob) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              maximumDate={new Date()}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  // Format date as YYYY-MM-DD or any format you like
                  const formatted = selectedDate.toISOString().split('T')[0];
                  setDob(formatted);
                }
              }}
            />
          )}

          <TextInput
            label="Referral Code (optional)"
            mode="outlined"
            value={referralCode}
            onChangeText={setReferralCode}
            style={{ backgroundColor: 'white', marginBottom: 16 }}
            activeOutlineColor="#6A5ACD"
            outlineColor="#6A5ACD"
            theme={{ roundness: 20 }}
          />

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleButtonPress} 
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: 'white',
    padding: 20
  },
  backButtonWrapper: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  backText: {
    color: '#6A5ACD',
    fontSize: 16,
    marginBottom:20
  },
  imageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    marginTop: 10,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#e0e0e0',
    padding: 4,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  cameraIconOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 2,
    elevation: 2,
  },
  header: {
    fontSize: 16,
    color: '#6A5ACD',
    alignSelf: 'flex-start',
    marginLeft: 2,
    padding: 20
  },
  form: {
    width: '100%',
    marginBottom: 20,
    padding: 10, 
  },
  label: {
    fontSize: 14,
    color: '#6A5ACD',
    marginBottom: 4,
    marginLeft: 2,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#6A5ACD',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: 'white',
    height: 56, // Match Paper TextInput height
    justifyContent: 'center', // Center content vertically
  },
  picker: {
    height: 56, // Match Paper TextInput height
    width: '100%',
  },
  button: {
    backgroundColor: '#6A5ACD',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  }
});

export default ProfileSetup;
