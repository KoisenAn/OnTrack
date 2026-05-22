import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import React from 'react';
import { useTheme } from '../theme';
// FontAwesome6 may not be available in some setups; import if present
import Feather from '@expo/vector-icons/Feather';
import * as FA6 from '@expo/vector-icons/FontAwesome6';

import type { StyleProp, TextStyle } from 'react-native';

type Props = {
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
};

export default function Icon({ name, size = 24, color, style }: Props) {
  const { iconLibrary } = useTheme() as any;

  switch (iconLibrary) {
    case 'fontawesome':
      if (name === 'social') {
        return <FontAwesome name="users" size={size} color={color} style={style} />;
      } 
      else if (name === 'settings') {
        return <FontAwesome name="cog" size={size} color={color} style={style} />;
      }
      else if (name === 'dashboard') {
        return <FontAwesome name="home" size={size} color={color} style={style} />;
      }
      else if (name === 'list') {
        return <FontAwesome name="list" size={size} color={color} style={style} />;
      }
      else if (name === 'stats') {
        return <FontAwesome name="area-chart" size={size} color={color} style={style} />;
      }
      else {
        return <FontAwesome name={name as any} size={size} color={color} style={style} />;
      }
    case 'fontawesome5':
      if (name === 'social') {
        return <FontAwesome5 name="users" size={size} color={color} style={style} />;
      } 
      else if (name === 'settings') {
        return <FontAwesome5 name="cog" size={size} color={color} style={style} />;
      }
      else if (name === 'dashboard') {
        return <FontAwesome5 name="home" size={size} color={color} style={style} />;
      }
      else if (name === 'list') {
        return <FontAwesome5 name="list" size={size} color={color} style={style} />;
      }
      else if (name === 'stats') {
        return <FontAwesome5 name="area-chart" size={size} color={color} style={style} />;
      }
      else {
        return <FontAwesome5 name={name as any} size={size} color={color} style={style} />;
      }
    case 'fontawesome6':
      const FA6Component = (FA6 as any)?.default ?? FA6;
      if (name === 'social') {
        return <FA6Component name="users" size={size} color={color} style={style} />;
      } 
      else if (name === 'settings') {
        return <FontAwesome5 name="cog" size={size} color={color} style={style} />;
      }
      else if (name === 'dashboard') {
        return <FontAwesome5 name="home" size={size} color={color} style={style} />;
      }
      else if (name === 'list') {
        return <FA6Component name="list" size={size} color={color} style={style} />;
      }
      else if (name === 'stats') {
        return <FA6Component name="chart-simple" size={size} color={color} style={style} />;
      }
      else {
        return <FA6Component name={name} size={size} color={color} style={style} />;
      }
    case 'feather':
    default:
      if (name === 'social') {
        return <Feather name="users" size={size} color={color} style={style} />;
      }
      else if (name === 'settings') {
        return <Feather name="settings" size={size} color={color} style={style} />;
      }
      else if (name === 'dashboard') {
        return <Feather name="home" size={size} color={color} style={style} />;
      }
      else if (name === 'list') {
        return <Feather name="list" size={size} color={color} style={style} />;
      }
      else if (name === 'stats') {
        return <Feather name="pie-chart" size={size} color={color} style={style} />;
      }
      else {
        return <Feather name={name as any} size={size} color={color} style={style} />;
      }
  }
}
