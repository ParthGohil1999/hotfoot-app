import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { AuthManager } from '../utils/auth';
import { Mail, Calendar } from 'lucide-react-native';

export default function AuthButtons() {
  const [authState, setAuthState] = useState({
    google: { isAuthenticated: false, userEmail: '' },
    microsoft: { isAuthenticated: false, userEmail: '' }
  });
  
  const authManager = AuthManager.getInstance();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const googleAuth = await authManager.isGoogleAuthenticated();
    const microsoftAuth = await authManager.isMicrosoftAuthenticated();
    
    setAuthState({
      google: { isAuthenticated: true, userEmail: '' },
      microsoft: { isAuthenticated: microsoftAuth, userEmail: '' }
    });
    // setAuthState({
    //   google: { isAuthenticated: googleAuth, userEmail: '' },
    //   microsoft: { isAuthenticated: microsoftAuth, userEmail: '' }
    // });
  };

  const handleGoogleAuth = async () => {
    try {
      const success = await authManager.authenticateGoogle();
      if (success) {
        Alert.alert('Success', 'Google authentication successful!');
        checkAuthStatus();
      } else {
        Alert.alert('Error', 'Google authentication failed. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during Google authentication.');
    }
  };

  const handleMicrosoftAuth = async () => {
    try {
      const success = await authManager.authenticateMicrosoft();
      if (success) {
        Alert.alert('Success', 'Microsoft authentication successful!');
        checkAuthStatus();
      } else {
        Alert.alert('Error', 'Microsoft authentication failed. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during Microsoft authentication.');
    }
  };

  const handleLogout = async (provider: 'google' | 'microsoft') => {
    try {
      await authManager.logout(provider);
      checkAuthStatus();
      Alert.alert('Success', `Logged out from ${provider === 'google' ? 'Google' : 'Microsoft'} successfully!`);
    } catch (error) {
      Alert.alert('Error', 'An error occurred during logout.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect Your Accounts</Text>
      <Text style={styles.subtitle}>
        Connect your email and calendar accounts to enable AI-powered assistance
      </Text>

      {/* Google Authentication */}
      <View style={styles.authSection}>
        <View style={styles.providerHeader}>
          <Mail size={24} color="#4285F4" />
          <Text style={styles.providerTitle}>Google</Text>
        </View>
        
        {authState.google.isAuthenticated ? (
          <View style={styles.authenticatedContainer}>
            <Text style={styles.authenticatedText}>✓ Connected to Google</Text>
            <TouchableOpacity 
              style={[styles.authButton, styles.logoutButton]} 
              onPress={() => handleLogout('google')}
            >
              <Text style={styles.logoutButtonText}>Disconnect</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={[styles.authButton, styles.googleButton]} onPress={handleGoogleAuth}>
            <Text style={styles.authButtonText}>Connect Google Account</Text>
          </TouchableOpacity>
        )}
        
        <Text style={styles.permissionText}>
          Grants access to Gmail and Google Calendar
        </Text>
      </View>

      {/* Microsoft Authentication */}
      <View style={styles.authSection}>
        <View style={styles.providerHeader}>
          <Calendar size={24} color="#0078D4" />
          <Text style={styles.providerTitle}>Microsoft</Text>
        </View>
        
        {authState.microsoft.isAuthenticated ? (
          <View style={styles.authenticatedContainer}>
            <Text style={styles.authenticatedText}>✓ Connected to Microsoft</Text>
            <TouchableOpacity 
              style={[styles.authButton, styles.logoutButton]} 
              onPress={() => handleLogout('microsoft')}
            >
              <Text style={styles.logoutButtonText}>Disconnect</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={[styles.authButton, styles.microsoftButton]} onPress={handleMicrosoftAuth}>
            <Text style={styles.authButtonText}>Connect Microsoft Account</Text>
          </TouchableOpacity>
        )}
        
        <Text style={styles.permissionText}>
          Grants access to Outlook Email and Calendar
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    marginBottom: 24,
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    color: "#E2E8F0",
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#94A3B8",
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  authSection: {
    marginBottom: 24,
  },
  providerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  providerTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 16,
    color: "#E2E8F0",
    marginLeft: 8,
  },
  authButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  googleButton: {
    backgroundColor: "#4285F4",
  },
  microsoftButton: {
    backgroundColor: "#0078D4",
  },
  logoutButton: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    borderWidth: 1,
    borderColor: "#EF4444",
  },
  authButtonText: {
    fontFamily: "Inter-Bold",
    fontSize: 14,
    color: "#FFFFFF",
  },
  logoutButtonText: {
    fontFamily: "Inter-Bold",
    fontSize: 14,
    color: "#EF4444",
  },
  authenticatedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authenticatedText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#10B981",
  },
  permissionText: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#64748B",
    fontStyle: 'italic',
  },
});