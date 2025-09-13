import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';

type Style = ViewStyle | TextStyle | ImageStyle;

export function mergeStyles(...styles: Style[]): Style {
  return StyleSheet.flatten(styles);
}
