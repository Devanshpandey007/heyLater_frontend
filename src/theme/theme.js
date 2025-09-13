import { Appearance } from 'react-native';

export const lightTheme = {
  background: '#F7F7F7',
  text: '#000000',
  inputBackground: '#FFFFFF',
  buttonBackground: '#53175C',
  buttonText: '#FFFFFF',
  label: '#000000',
  shadowColor: '#000000',
  placeholder: '#666666',
};

export const darkTheme = {
  background: '#121212',
  text: '#FFFFFF',
  inputBackground: '#1E1E1E',
  buttonBackground: '#6D187A',
  buttonText: '#FFFFFF',
  label: '#FFFFFF',
  shadowColor: '#FFFFFF',
  placeholder: '#AAAAAA',
};

export const getTheme = () => {
  const colorScheme = Appearance.getColorScheme();
  return colorScheme === 'dark' ? darkTheme : lightTheme;
}; 