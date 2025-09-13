import React from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import { SvgXml } from 'react-native-svg';

const emailIconXml = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/>
</svg>
`;

interface EmailIconProps {
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

const EmailIcon: React.FC<EmailIconProps> = ({ size = 24, color = '#ffffff', style }) => {
  return (
    <SvgXml
      xml={emailIconXml}
      width={size}
      height={size}
      color={color}
      style={style}
    />
  );
};

export default EmailIcon; 