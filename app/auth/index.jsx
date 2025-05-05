import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useCallback, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { useSSO } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

export const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  useWarmUpBrowser();
  const router = useRouter();
  const { startSSOFlow } = useSSO();

  const handleAuth = useCallback(
    async (strategy) => {
      try {
        const { createdSessionId, setActive } = await startSSOFlow({
          strategy,
          redirectUrl: AuthSession.makeRedirectUri(),
        });

        if (createdSessionId && setActive) {
          setActive({ session: createdSessionId });
          router.push({
            pathname: "/preferences/travelPreferences",
            params: {
              flow: "onboarding",
              returnPath: null,
            },
          });
        } else {
          Alert.alert(
            "Authentication Failed",
            "Could not sign in. Please try again."
          );
        }
      } catch (err) {
        console.error(`Error in ${strategy}:`, JSON.stringify(err, null, 2));
        Alert.alert(
          "Authentication Error",
          "An error occurred during sign-in. Please try again."
        );
      }
    },
    [router, startSSOFlow]
  );

  const onPressGoogle = useCallback(
    () => handleAuth("oauth_google"),
    [handleAuth]
  );
  const onPressApple = useCallback(
    () => handleAuth("oauth_apple"),
    [handleAuth]
  );
  const onPressMicrosoft = useCallback(
    () => handleAuth("oauth_microsoft"),
    [handleAuth]
  );
  const onPressSlack = useCallback(
    () => handleAuth("oauth_slack"),
    [handleAuth]
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          style={styles.image}
          source={require("../../assets/images/logo.png")}
        />
        <Text style={styles.companyName}>Hotfoot AI</Text>
      </View>
      <Text style={styles.title}>Let's Get Started!</Text>
      <Text style={styles.subtitle}>Your Passport to Adventure Awaits</Text>
      <View>
        <TouchableOpacity style={styles.button} onPress={onPressGoogle}>
          <Image
            source={require("../../assets/images/google-icon.png")}
            style={styles.icon}
          />
          <View style={styles.content}>
            <Text style={styles.text}>Continue with Google</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity style={styles.button} onPress={onPressApple}>
          <Image
            source={require("../../assets/images/apple-icon.png")}
            style={styles.icon}
          />
          <View style={styles.content}>
            <Text style={styles.text}>Continue with Apple</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity style={styles.button} onPress={onPressMicrosoft}>
          <Image
            source={require("../../assets/images/microsoft-icon.png")}
            style={styles.icon}
          />
          <View style={styles.content}>
            <Text style={styles.text}>Continue with Microsoft</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity style={styles.button} onPress={onPressSlack}>
          <Image
            source={require("../../assets/images/slack-icon.png")}
            style={styles.icon}
          />
          <View style={styles.content}>
            <Text style={styles.text}>Continue with Slack</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  image: {
    height: 120,
    width: 120,
  },
  companyName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 22,
    color: "black",
    fontWeight: 600,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: "black",
    fontWeight: 200,
    marginBottom: 50,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    backgroundColor: "#fff",
    borderColor: "#e9e9e9",
    borderWidth: 1,
    borderRadius: 50,
    paddingVertical: 15,
    width: 330,
    marginVertical: 10,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 20,
    height: 20,
    position: "absolute",
    left: 20,
  },
  text: {
    fontSize: 16,
    color: "#555",
    fontWeight: "bold",
  },
});

export default LoginScreen;
