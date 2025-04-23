import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  TouchableOpacity,
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

  const onPressGoogle = useCallback(async () => {
    try {
      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy: "oauth_google",
          redirectUrl: AuthSession.makeRedirectUri(),
        });

      // If sign in was successful, set the active session
      if (createdSessionId) {
        if (setActive) {
          setActive({ session: createdSessionId });
          router.push({
            pathname: "/preferences/travelPreferences",
            params: {
              flow: "onboarding",
              returnPath: null,
            },
          });
        }
      } else {
      }
    } catch (err) {
      console.log(err);
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Image
          style={styles.image}
          source={require("../../assets/images/logo.png")}
        />
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
        <TouchableOpacity style={styles.button}>
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
        <TouchableOpacity style={styles.button}>
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
        <TouchableOpacity style={styles.button}>
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
    justifyContent: "center", // Centers vertically
    alignItems: "center", // Centers horizontally
    backgroundColor: "white",
  },
  image: {
    height: 150,
    width: 150,
    marginBottom: 15,
  },
  title: {
    fontSize: 25,
    color: "black",
    fontWeight: 700,
    marginBottom: 15,
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
    position: "absolute", // This will position the icon to the left
    left: 20,
  },
  text: {
    fontSize: 16,
    color: "#555",
    fontWeight: "bold",
  },
});

export default LoginScreen;
