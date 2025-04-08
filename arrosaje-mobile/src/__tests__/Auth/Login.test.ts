// src/__tests__/auth/Login.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../../screens/auth/LoginScreen';
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

describe('LoginScreen', () => {
  const mockLogin = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    // Configuration du mock pour useAuth
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
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
        <LoginScreen navigation={{ navigate: mockNavigate } as any} route={{} as any} />
      </NavigationContainer>
    );

    expect(getByText('Arrosaje')).toBeTruthy();
    expect(getByText('Connectez-vous pour accéder à votre compte')).toBeTruthy();
    expect(getByLabelText('Email')).toBeTruthy();
    expect(getByLabelText('Mot de passe')).toBeTruthy();
    expect(getByText('Se connecter')).toBeTruthy();
  });

  it('should show validation errors for empty form submission', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <LoginScreen navigation={{ navigate: mockNavigate } as any} route={{} as any} />
      </NavigationContainer>
    );

    const loginButton = getByText('Se connecter');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(getByText('Email requis')).toBeTruthy();
      expect(getByText('Mot de passe requis')).toBeTruthy();
    });

    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('should validate email format', async () => {
    const { getByText, getByLabelText } = render(
      <NavigationContainer>
        <LoginScreen navigation={{ navigate: mockNavigate } as any} route={{} as any} />
      </NavigationContainer>
    );

    const emailInput = getByLabelText('Email');
    const loginButton = getByText('Se connecter');

    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(getByText('Email invalide')).toBeTruthy();
    });
  });

  it('should call login function with form data on valid submission', async () => {
    const { getByText, getByLabelText } = render(
      <NavigationContainer>
        <LoginScreen navigation={{ navigate: mockNavigate } as any} route={{} as any} />
      </NavigationContainer>
    );

    const emailInput = getByLabelText('Email');
    const passwordInput = getByLabelText('Mot de passe');
    const loginButton = getByText('Se connecter');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        username: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('should navigate to Register screen when register link is pressed', () => {
    const { getByText } = render(
      <NavigationContainer>
        <LoginScreen navigation={{ navigate: mockNavigate } as any} route={{} as any} />
      </NavigationContainer>
    );

    const registerLink = getByText('S\'inscrire');
    fireEvent.press(registerLink);

    expect(mockNavigate).toHaveBeenCalledWith('Register');
  });

  it('should show loading state during login', async () => {
    // Mock loading state
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      error: null,
      isLoading: true,
    });

    const { getByTestId } = render(
      <NavigationContainer>
        <LoginScreen navigation={{ navigate: mockNavigate } as any} route={{} as any} />
      </NavigationContainer>
    );

    // Assuming your Button component uses testID="loading-indicator" when loading
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('should show error message when login fails', async () => {
    const errorMessage = "Identifiants incorrects";

    // Mock error state
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      error: errorMessage,
      isLoading: false,
    });

    const { getByText } = render(
      <NavigationContainer>
        <LoginScreen navigation={{ navigate: mockNavigate } as any} route={{} as any} />
      </NavigationContainer>
    );

    expect(getByText(errorMessage)).toBeTruthy();
  });
});


