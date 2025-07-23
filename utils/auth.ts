import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { Platform } from 'react-native';


// You'll need to get these from Google Cloud Console and Azure Portal

const GOOGLE_CLIENT_ID = '902830851336-2fenrtmge8dg31jro9defv8qhdjvs1dc.apps.googleusercontent.com'; //expo ios client
// const GOOGLE_CLIENT_ID = '902830851336-mmie4o84m30lq2gkfguujbiar35b1if0.apps.googleusercontent.com'; //web client
const MICROSOFT_CLIENT_ID = '3b74f3f0-5b64-42c3-9a1b-aa88f741ab7a';

// Secure storage keys
const GOOGLE_TOKENS_KEY = 'google_tokens';
const MICROSOFT_TOKENS_KEY = 'microsoft_tokens';

// OAuth scopes
const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/userinfo.email',
];

const MICROSOFT_SCOPES = [
  'https://graph.microsoft.com/Mail.ReadWrite',
  'https://graph.microsoft.com/Mail.Send',
  'https://graph.microsoft.com/Calendars.ReadWrite',
  'https://graph.microsoft.com/User.Read',
  'offline_access'
];

// Platform-specific storage utilities
class StorageManager {
  static async setItemAsync(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  }

  static async getItemAsync(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  }

  static async deleteItemAsync(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  }
}

export class AuthManager {
  private static instance: AuthManager;

  public static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  // Google Authentication
  async authenticateGoogle(): Promise<boolean> {
    try {
      const redirectUri = "com.anonymous.elevenlabs-conversational-ai-expo-react-native:/oauthredirect"
      // const redirectUri = "http://localhost:8081"
      console.log("redirectUri: ", redirectUri)

      const codeChallenge = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        Math.random().toString(36),
        { encoding: Crypto.CryptoEncoding.BASE64 }
      );

      const request = new AuthSession.AuthRequest({
        clientId: GOOGLE_CLIENT_ID,
        scopes: GOOGLE_SCOPES,
        redirectUri,
        responseType: AuthSession.ResponseType.Code,
        // codeChallenge,
        codeChallengeMethod: AuthSession.CodeChallengeMethod.S256,
        additionalParameters: {},
        // extraParams: {
        //   access_type: 'offline',
        //   prompt: 'consent'
        // },
        usePKCE: false,
      });

      const result = await request.promptAsync({
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
        // useProxy: true,
      });

      console.log("result:", result);

      if (result.type === 'success' && result.params.code) {
        const tokenResponse = await this.exchangeGoogleCodeForToken(
          result.params.code,
          redirectUri,
          // codeChallenge
        );

        console.log("tokenResponse: ", tokenResponse)

        await this.storeGoogleTokens(tokenResponse);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Google authentication error:', error);
      return false;
    }
  }

  // Microsoft Authentication
  async authenticateMicrosoft(): Promise<boolean> {
    try {
      const redirectUri = "msauth.com.anonymous.elevenlabs-conversational-ai-expo-react-native://auth";

      const request = new AuthSession.AuthRequest({
        clientId: MICROSOFT_CLIENT_ID,
        scopes: MICROSOFT_SCOPES,
        redirectUri,
        responseType: AuthSession.ResponseType.Code,
        additionalParameters: {},
        // extraParams: {
        //   prompt: 'consent'
        // },
        usePKCE: false,
      });


      console.log("request:", request);

      const result = await request.promptAsync(
        {
          authorizationEndpoint: 'https://login.microsoftonline.com/25aff073-39ce-42aa-960c-d1a451e0a060/oauth2/v2.0/authorize',
        },

      );
      console.log("result1:", result);

      if (result.type === 'success' && result.params.code) {
        const tokenResponse = await this.exchangeMicrosoftCodeForToken(
          result.params.code,
          redirectUri,
        );
        console.log("tokenResponse: ", tokenResponse)
        await this.storeMicrosoftTokens(tokenResponse);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Microsoft authentication error:', error);
      return false;
    }
  }

  private async exchangeGoogleCodeForToken(code: string, redirectUri: string, ) {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        code,
        // code_verifier: codeVerifier,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }).toString(),
    });

    return await response.json();
  }

  private async exchangeMicrosoftCodeForToken(code: string, redirectUri: string, codeVerifier: string) {
    console.log("microsoft code: ", code)
    const response = await fetch('https://login.microsoftonline.com/25aff073-39ce-42aa-960c-d1a451e0a060/oauth2/v2.0/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: MICROSOFT_CLIENT_ID,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        scope: MICROSOFT_SCOPES.join(' '),
        // code_verifier: codeVerifier, // Include the code verifier
      }).toString(),
    });

    return await response.json();
  }

  async storeGoogleTokens(tokens: any): Promise<void> {
    await StorageManager.setItemAsync(GOOGLE_TOKENS_KEY, JSON.stringify(tokens));
  }

  async storeMicrosoftTokens(tokens: any): Promise<void> {
    await StorageManager.setItemAsync(MICROSOFT_TOKENS_KEY, JSON.stringify(tokens));
  }

  async getGoogleTokens(): Promise<any | null> {
    const tokens = await StorageManager.getItemAsync(GOOGLE_TOKENS_KEY);
    return tokens ? JSON.parse(tokens) : null;
  }

  async getMicrosoftTokens(): Promise<any | null> {
    const tokens = await StorageManager.getItemAsync(MICROSOFT_TOKENS_KEY);
    return tokens ? JSON.parse(tokens) : null;
  }

  async refreshGoogleToken(): Promise<string | null> {
    try {
      const tokens = await this.getGoogleTokens();
      if (!tokens?.refresh_token) return null;

      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: GOOGLE_CLIENT_ID,
          refresh_token: tokens.refresh_token,
          grant_type: 'refresh_token',
        }).toString(),
      });

      const newTokens = await response.json();
      await this.storeGoogleTokens({ ...tokens, ...newTokens });
      return newTokens.access_token;
    } catch (error) {
      console.error('Google token refresh error:', error);
      return null;
    }
  }

  async refreshMicrosoftToken(): Promise<string | null> {
    try {
      const tokens = await this.getMicrosoftTokens();
      if (!tokens?.refresh_token) return null;

      const response = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: MICROSOFT_CLIENT_ID,
          refresh_token: tokens.refresh_token,
          grant_type: 'refresh_token',
          scope: MICROSOFT_SCOPES.join(' '),
        }).toString(),
      });

      const newTokens = await response.json();
      await this.storeMicrosoftTokens({ ...tokens, ...newTokens });
      return newTokens.access_token;
    } catch (error) {
      console.error('Microsoft token refresh error:', error);
      return null;
    }
  }

  async isGoogleAuthenticated(): Promise<boolean> {
    const tokens = await this.getGoogleTokens();
    return !!tokens?.access_token;
  }

  async isMicrosoftAuthenticated(): Promise<boolean> {
    const tokens = await this.getMicrosoftTokens();
    return !!tokens?.access_token;
  }

  async logout(provider: 'google' | 'microsoft' | 'both' = 'both'): Promise<void> {
    if (provider === 'google' || provider === 'both') {
      await StorageManager.deleteItemAsync(GOOGLE_TOKENS_KEY);
    }
    if (provider === 'microsoft' || provider === 'both') {
      await StorageManager.deleteItemAsync(MICROSOFT_TOKENS_KEY);
    }
  }
}