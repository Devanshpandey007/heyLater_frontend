import React from 'react';
import { Image, StyleSheet, ImageStyle, StyleProp, View } from 'react-native';

interface LogoProps {
  style?: StyleProp<ImageStyle>;
}

const Logo: React.FC<LogoProps> = ({ style }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logo2-1.png')}
        style={[styles.logo, style]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 286,
    height: 286,
  },
});

export default Logo; 