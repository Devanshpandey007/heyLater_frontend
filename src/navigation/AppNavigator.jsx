import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { navigationTypes } from '../types/navigation';

// Import screens
import SignUpScreen from '../screens/Auth/SignUpScreen';
import EmailSignUp from '../screens/Auth/EmailSignUp';
import SetProfile from '../screens/Profile/SetProfile';
import SignInScreen from '../screens/Auth/SignInScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/Auth/ResetPasswordScreen';
import VerifyOTPScreen from '../screens/Auth/VerifyOTPScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import NotificationsScreen from '../screens/Notifications/NotificationsScreen';
import MessagesScreen from '../screens/Messages/MessagesScreen';
import CreateMessageScreen from '../screens/Messages/CreateMessageScreen';
import MessageDetailsScreen from '../screens/Messages/MessageDetailsScreen';
import EditMessageScreen from '../screens/Messages/EditMessageScreen';
import DeleteMessageScreen from '../screens/Messages/DeleteMessageScreen';
import ShareMessageScreen from '../screens/Messages/ShareMessageScreen';
import ViewSharedMessageScreen from '../screens/Messages/ViewSharedMessageScreen';
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import WelcomeScreen from '../screens/Onboarding/WelcomeScreen';
import TutorialScreen from '../screens/Onboarding/TutorialScreen';
import PermissionsScreen from '../screens/Onboarding/PermissionsScreen';
import LocationScreen from '../screens/Onboarding/LocationScreen';
import NotificationsPermissionScreen from '../screens/Onboarding/NotificationsPermissionScreen';
import CameraScreen from '../screens/Onboarding/CameraScreen';
import MicrophoneScreen from '../screens/Onboarding/MicrophoneScreen';
import StorageScreen from '../screens/Onboarding/StorageScreen';
import ContactsScreen from '../screens/Onboarding/ContactsScreen';
import CalendarScreen from '../screens/Onboarding/CalendarScreen';
import SocialScreen from '../screens/Social/SocialScreen';
import FacebookScreen from '../screens/Social/FacebookScreen';
import TwitterScreen from '../screens/Social/TwitterScreen';
import InstagramScreen from '../screens/Social/InstagramScreen';
import LinkedInScreen from '../screens/Social/LinkedInScreen';
import WhatsAppScreen from '../screens/Social/WhatsAppScreen';
import TelegramScreen from '../screens/Social/TelegramScreen';
import EmailScreen from '../screens/Social/EmailScreen';
import SMSScreen from '../screens/Social/SMSScreen';
import VoiceScreen from '../screens/Social/VoiceScreen';
import VideoScreen from '../screens/Social/VideoScreen';
import AudioScreen from '../screens/Social/AudioScreen';
import ImageScreen from '../screens/Social/ImageScreen';
import DocumentScreen from '../screens/Social/DocumentScreen';
import LinkScreen from '../screens/Social/LinkScreen';
import LocationShareScreen from '../screens/Social/LocationShareScreen';
import ContactShareScreen from '../screens/Social/ContactShareScreen';
import CalendarShareScreen from '../screens/Social/CalendarShareScreen';
import ReminderScreen from '../screens/Social/ReminderScreen';
import TaskScreen from '../screens/Social/TaskScreen';
import NoteScreen from '../screens/Social/NoteScreen';
import ListScreen from '../screens/Social/ListScreen';
import PollScreen from '../screens/Social/PollScreen';
import QuizScreen from '../screens/Social/QuizScreen';
import SurveyScreen from '../screens/Social/SurveyScreen';
import FeedbackScreen from '../screens/Social/FeedbackScreen';
import ReviewScreen from '../screens/Social/ReviewScreen';
import RatingScreen from '../screens/Social/RatingScreen';
import CommentScreen from '../screens/Social/CommentScreen';
import LikeScreen from '../screens/Social/LikeScreen';
import ShareScreen from '../screens/Social/ShareScreen';
import SaveScreen from '../screens/Social/SaveScreen';
import BookmarkScreen from '../screens/Social/BookmarkScreen';
import ArchiveScreen from '../screens/Social/ArchiveScreen';
import DeleteScreen from '../screens/Social/DeleteScreen';
import EditScreen from '../screens/Social/EditScreen';
import CreateScreen from '../screens/Social/CreateScreen';
import UpdateScreen from '../screens/Social/UpdateScreen';
import ViewScreen from '../screens/Social/ViewScreen';
import SearchScreen from '../screens/Social/SearchScreen';
import FilterScreen from '../screens/Social/FilterScreen';
import SortScreen from '../screens/Social/SortScreen';
import GroupScreen from '../screens/Social/GroupScreen';
import TagScreen from '../screens/Social/TagScreen';
import CategoryScreen from '../screens/Social/CategoryScreen';
import CollectionScreen from '../screens/Social/CollectionScreen';
import FolderScreen from '../screens/Social/FolderScreen';
import FileScreen from '../screens/Social/FileScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={navigationTypes.SignUp}
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Auth Stack */}
        <Stack.Screen name={navigationTypes.SignUp} component={SignUpScreen} />
        <Stack.Screen name={navigationTypes.EmailSignUp} component={EmailSignUp} />
        <Stack.Screen name={navigationTypes.SetUpProfile} component={SetProfile} />
        <Stack.Screen name={navigationTypes.SignIn} component={SignInScreen} />
        <Stack.Screen name={navigationTypes.ForgotPassword} component={ForgotPasswordScreen} />
        <Stack.Screen name={navigationTypes.ResetPassword} component={ResetPasswordScreen} />
        <Stack.Screen name={navigationTypes.VerifyOTP} component={VerifyOTPScreen} />

        {/* Main Stack */}
        <Stack.Screen name={navigationTypes.Home} component={HomeScreen} />
        <Stack.Screen name={navigationTypes.Profile} component={ProfileScreen} />
        <Stack.Screen name={navigationTypes.Settings} component={SettingsScreen} />
        <Stack.Screen name={navigationTypes.Notifications} component={NotificationsScreen} />

        {/* Messages Stack */}
        <Stack.Screen name={navigationTypes.Messages} component={MessagesScreen} />
        <Stack.Screen name={navigationTypes.CreateMessage} component={CreateMessageScreen} />
        <Stack.Screen name={navigationTypes.MessageDetails} component={MessageDetailsScreen} />
        <Stack.Screen name={navigationTypes.EditMessage} component={EditMessageScreen} />
        <Stack.Screen name={navigationTypes.DeleteMessage} component={DeleteMessageScreen} />
        <Stack.Screen name={navigationTypes.ShareMessage} component={ShareMessageScreen} />
        <Stack.Screen name={navigationTypes.ViewSharedMessage} component={ViewSharedMessageScreen} />

        {/* Onboarding Stack */}
        <Stack.Screen name={navigationTypes.Onboarding} component={OnboardingScreen} />
        <Stack.Screen name={navigationTypes.Welcome} component={WelcomeScreen} />
        <Stack.Screen name={navigationTypes.Tutorial} component={TutorialScreen} />
        <Stack.Screen name={navigationTypes.Permissions} component={PermissionsScreen} />
        <Stack.Screen name={navigationTypes.Location} component={LocationScreen} />
        <Stack.Screen name={navigationTypes.Notifications} component={NotificationsPermissionScreen} />
        <Stack.Screen name={navigationTypes.Camera} component={CameraScreen} />
        <Stack.Screen name={navigationTypes.Microphone} component={MicrophoneScreen} />
        <Stack.Screen name={navigationTypes.Storage} component={StorageScreen} />
        <Stack.Screen name={navigationTypes.Contacts} component={ContactsScreen} />
        <Stack.Screen name={navigationTypes.Calendar} component={CalendarScreen} />

        {/* Social Stack */}
        <Stack.Screen name={navigationTypes.Social} component={SocialScreen} />
        <Stack.Screen name={navigationTypes.Facebook} component={FacebookScreen} />
        <Stack.Screen name={navigationTypes.Twitter} component={TwitterScreen} />
        <Stack.Screen name={navigationTypes.Instagram} component={InstagramScreen} />
        <Stack.Screen name={navigationTypes.LinkedIn} component={LinkedInScreen} />
        <Stack.Screen name={navigationTypes.WhatsApp} component={WhatsAppScreen} />
        <Stack.Screen name={navigationTypes.Telegram} component={TelegramScreen} />
        <Stack.Screen name={navigationTypes.Email} component={EmailScreen} />
        <Stack.Screen name={navigationTypes.SMS} component={SMSScreen} />
        <Stack.Screen name={navigationTypes.Voice} component={VoiceScreen} />
        <Stack.Screen name={navigationTypes.Video} component={VideoScreen} />
        <Stack.Screen name={navigationTypes.Audio} component={AudioScreen} />
        <Stack.Screen name={navigationTypes.Image} component={ImageScreen} />
        <Stack.Screen name={navigationTypes.Document} component={DocumentScreen} />
        <Stack.Screen name={navigationTypes.Link} component={LinkScreen} />
        <Stack.Screen name={navigationTypes.Location} component={LocationShareScreen} />
        <Stack.Screen name={navigationTypes.Contact} component={ContactShareScreen} />
        <Stack.Screen name={navigationTypes.Calendar} component={CalendarShareScreen} />
        <Stack.Screen name={navigationTypes.Reminder} component={ReminderScreen} />
        <Stack.Screen name={navigationTypes.Task} component={TaskScreen} />
        <Stack.Screen name={navigationTypes.Note} component={NoteScreen} />
        <Stack.Screen name={navigationTypes.List} component={ListScreen} />
        <Stack.Screen name={navigationTypes.Poll} component={PollScreen} />
        <Stack.Screen name={navigationTypes.Quiz} component={QuizScreen} />
        <Stack.Screen name={navigationTypes.Survey} component={SurveyScreen} />
        <Stack.Screen name={navigationTypes.Feedback} component={FeedbackScreen} />
        <Stack.Screen name={navigationTypes.Review} component={ReviewScreen} />
        <Stack.Screen name={navigationTypes.Rating} component={RatingScreen} />
        <Stack.Screen name={navigationTypes.Comment} component={CommentScreen} />
        <Stack.Screen name={navigationTypes.Like} component={LikeScreen} />
        <Stack.Screen name={navigationTypes.Share} component={ShareScreen} />
        <Stack.Screen name={navigationTypes.Save} component={SaveScreen} />
        <Stack.Screen name={navigationTypes.Bookmark} component={BookmarkScreen} />
        <Stack.Screen name={navigationTypes.Archive} component={ArchiveScreen} />
        <Stack.Screen name={navigationTypes.Delete} component={DeleteScreen} />
        <Stack.Screen name={navigationTypes.Edit} component={EditScreen} />
        <Stack.Screen name={navigationTypes.Create} component={CreateScreen} />
        <Stack.Screen name={navigationTypes.Update} component={UpdateScreen} />
        <Stack.Screen name={navigationTypes.View} component={ViewScreen} />
        <Stack.Screen name={navigationTypes.Search} component={SearchScreen} />
        <Stack.Screen name={navigationTypes.Filter} component={FilterScreen} />
        <Stack.Screen name={navigationTypes.Sort} component={SortScreen} />
        <Stack.Screen name={navigationTypes.Group} component={GroupScreen} />
        <Stack.Screen name={navigationTypes.Tag} component={TagScreen} />
        <Stack.Screen name={navigationTypes.Category} component={CategoryScreen} />
        <Stack.Screen name={navigationTypes.Collection} component={CollectionScreen} />
        <Stack.Screen name={navigationTypes.Folder} component={FolderScreen} />
        <Stack.Screen name={navigationTypes.File} component={FileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 