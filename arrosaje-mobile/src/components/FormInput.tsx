import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';

interface FormInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  secureTextEntry?: boolean;
  error?: string;
  rules?: object;
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}

function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  secureTextEntry = false,
  error,
  rules,
  placeholder,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
}: FormInputProps<T>) {
  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label={label}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={styles.input}
            secureTextEntry={secureTextEntry}
            placeholder={placeholder}
            multiline={multiline}
            numberOfLines={numberOfLines}
            keyboardType={keyboardType}
            error={!!error}
          />
        )}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: 'transparent',
  },
  error: {
    color: '#f13a59',
    fontSize: 12,
    marginTop: 2,
  },
});

export default FormInput;
