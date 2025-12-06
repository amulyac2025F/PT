import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import React from 'react';
import { StyleSheet, TextInput, TextInputProps, useColorScheme, View } from 'react-native';

interface StyledInputProps extends TextInputProps {
  icon: IconSymbolName;
}

export function StyledInput({ icon, style, ...rest }: StyledInputProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const placeholderColor = Colors[colorScheme].icon;
  const textColor = Colors[colorScheme].text;

  return (
    <View style={[styles.container, { borderColor: placeholderColor }]}>
      <IconSymbol name={icon} size={20} color={placeholderColor} style={styles.icon} />
      <TextInput
        style={[styles.input, { color: textColor }, style]}
        placeholderTextColor={placeholderColor}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 16,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
});