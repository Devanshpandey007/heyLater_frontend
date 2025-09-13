import { PermissionsAndroid, Platform } from 'react-native';
import Contacts from 'react-native-contacts';

export const fetchDeviceContacts = async () => {
  try {
    let granted;
    if (Platform.OS === 'android') {
      granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Contacts',
          message: 'This app would like to view your contacts',
          buttonPositive: 'Accept'
        }
      );
    } else {
      // iOS permission handled via Info.plist
      granted = await Contacts.checkPermission();
    }

    // 2. Get Contacts if Permission Granted
    if (granted === 'authorized' || granted === PermissionsAndroid.RESULTS.GRANTED) {
      const contacts = await Contacts.getAll();
      
      // Format contacts for consistent structure
      return contacts.map(contact => ({
        id: contact.recordID,
        name: `${contact.givenName} ${contact.familyName}`.trim(),
        phoneNumbers: contact.phoneNumbers.map(p => ({
          number: p.number,
          type: p.label
        })),
        email: contact.emailAddresses[0]?.email,
        thumbnailPath: contact.thumbnailPath
      }));
    }

    throw new Error('Contacts permission denied');

  } catch (error) {
    console.error('Contact fetch error:', error);
    throw error;
  }
};


