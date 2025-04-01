
import React from 'react';
import { Button as PaperButton } from 'react-native-paper';
import { StyleSheet } from 'react-native';

interface ButtonProps {
  mode?: 'text' | 'outlined' | 'contained';
  onPress: () => void;
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  color?: string;
  style?: object;
}

const Button: React.FC<ButtonProps> = ({
  mode = 'contained',
  onPress,
  children,
  loading = false,
  disabled = false,
  color,
  style,
}) => {
  return (
    <PaperButton
      mode={mode}
      onPress={onPress}
      loading={loading}
      disabled={disabled}
      style={[styles.button, style]}
      labelStyle={styles.text}
      color={color}
    >
      {children}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 10,
    paddingVertical: 6,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 26,
  },
});

export default Button;
