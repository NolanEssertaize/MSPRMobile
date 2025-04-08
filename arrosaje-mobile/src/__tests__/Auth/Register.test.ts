// src/__tests__/auth/Register.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RegisterScreen from '../../screens/auth/RegisterScreen';
import { useAuth } from '../../contexts/AuthContext';
import { NavigationContainer } from '@react-navigation/native';

// Mock des dépendances
jest.mock('../../contexts/AuthContext');
jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: jest.fn().mockReturnValue({
    Navigator: jest.fn(),
    Screen: jest.fn(),
  }),
}));

describe('RegisterScreen', () => {
  const mockRegister = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    // Configuration du mock pour useAuth
    (useAuth as jest.Mock).mockReturnValue({
      register: mockRegister,
      error: null,
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const { getByText, getByLabelText } = render(
      <NavigationContainer>
        <RegisterScreen navigation={{ navigate: mockNavigate } as any} route={{} as any}></RegisterScreen>
      </NavigationContainer>
    );

    expect(getByText('Créer un compte')).toBeTruthy();
    expect(getByText('Inscrivez-vous pour utiliser Arrosaje')).toBeTruthy();
    expect(getByLabelText('Email')).toBeTruthy();
    expect(getByLabelText('Nom d\'utilisateur')).toBeTruthy();
    expect(getByLabelText('Téléphone')).toBeTruthy();
    expect(getByLabelText('Mot de passe')).toBeTruthy();
    expect(getByText('Je suis un botaniste et je veux prendre soin des plantes')).toBeTruthy();
    expect(getByText('S\'inscrire')).toBeTruthy();
  });

  it('should show validation errors for empty form submission', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <RegisterScreen navigation={{ navigate: mockNavigate } as any} route={{} as any} />
      </NavigationContainer>
    );

    const registerButton = getByText('S\'inscrire');
    fireEvent.press(registerButton);

    await waitFor(() => {
      expect(getByText('Email requis')).toBeTruthy();
      expect(getByText('Nom d\'utilisateur requis')).toBeTruthy();
      expect(getByText('Numéro de téléphone requis')).toBeTruthy();
      expect(getByText('Mot de passe requis')).toBeTruthy();
    });

    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('should validate email format and password length', async () => {
    const { getByText, getByLabelText } = render(
      <NavigationContainer>
        <RegisterScreen navigation={{ navigate: mockNavigate } as any} route={{} as any} />
      </NavigationContainer>
    );

    const emailInput = getByLabelText('Email');
    const passwordInput = getByLabelText('Mot de passe');
    const registerButton = getByText('S\'inscrire');

    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent.changeText(passwordInput, '12345');
    fireEvent.press(registerButton);

    await waitFor(() => {
      expect(getByText('Email invalide')).toBeTruthy();
      expect(getByText('Le mot de passe doit contenir au moins 6 caractères')).toBeTruthy();
    });
  });

  it('should validate username length', async () => {
    const { getByText, getByLabelText } = render(
      <NavigationContainer>
        <RegisterScreen navigation={{ navigate: mockNavigate } as any} route={{} as any} />
      </NavigationContainer>
    );

    const usernameInput = getByLabelText('Nom d\'utilisateur');
    const registerButton = getByText('S\'inscrire');

    fireEvent.changeText(usernameInput, 'ab');
    fireEvent.press(registerButton);

    await waitFor(() => {
      expect(getByText('Au moins 3 caractères')).toBeTruthy();
    });
  });

  it('should call register function with form data on valid submission', async () => {
    const { getByText, getByLabelText } = render(
      <NavigationContainer>
        <RegisterScreen navigation={{ navigate: mockNavigate } as any} route={{} as any} />
      </NavigationContainer>
    );

    const emailInput = getByLabelText('Email');
    const usernameInput = getByLabelText('Nom d\'utilisateur');
    const phoneInput = getByLabelText('Téléphone');
    const passwordInput = getByLabelText('Mot de passe');
    const registerButton = getByText('S\'inscrire');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(phoneInput, '0612345678');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(registerButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        email: 'test@example.com',
        username: 'testuser',
        phone: '0612345678',
        password: 'password123',
        is_botanist: false,
      });
    });
  });

  it('should set is_botanist flag when checkbox is checked', async () => {
    const { getByText, getByLabelText } = render(
      <NavigationContainer>
        <RegisterScreen navigation={{ navigate: mockNavigate } as any} route={{} as any} />
      </NavigationContainer>
    );

    const emailInput = getByLabelText('Email');
    const usernameInput = getByLabelText('Nom d\'utilisateur');
    const phoneInput = getByLabelText('Téléphone');
    const passwordInput = getByLabelText('Mot de passe');
    const registerButton = getByText('S\'inscrire');
    const checkbox = getByText('Je suis un botaniste et je veux prendre soin des plantes');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(phoneInput, '0612345678');
    fireEvent.changeText(passwordInput, 'password123');

    // Toggle checkbox
    fireEvent.press(checkbox);

    fireEvent.press(registerButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        email: 'test@example.com',
        username: 'testuser',
        phone: '0612345678',
        password: 'password123',
        is_botanist: true,
      });
    });
  });

  it('should navigate to Login screen when login link is pressed', () => {
    const { getByText } = render(
      <NavigationContainer>
        <RegisterScreen navigation={{ navigate: mockNavigate } as any} route={{} as any} />
      </NavigationContainer>
    );

    const loginLink = getByText('Se connecter');
    fireEvent.press(loginLink);

    expect(mockNavigate).toHaveBeenCalledWith('Login');
  });
});
