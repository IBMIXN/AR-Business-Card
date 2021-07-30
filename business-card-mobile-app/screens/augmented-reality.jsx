import UnityView from "@asmadsen/react-native-unity-view";
import MaskedView from "@react-native-community/masked-view";
import { useFocusEffect } from "@react-navigation/native";
import { Camera } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  StyleSheet,
  Text,
  View,
} from "react-native";
import WatermarkLogo from "../components/watermarkLogo";
import ChatBotScreen from "./chatbot";

const ARUnityScreen = ({ navigation }) => {
  // navigation - once here, if back user should pop nav stack fully (bypass tutorial)
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: (props) => (
        <HeaderBackButton {...props} onPress={() => navigation.popToTop()} />
      ),
    });
  });
  // hardware back button pressed - popToTop - override Android default
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.popToTop();
        return true;
      };
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  // State
  const [camPermission, setCamPermission] = useState(null);

  // On component mount ensure camera permission are allowed
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setCamPermission(status === "granted");
    })();
  }, []);

  if (camPermission == null) {
    return (
      <View style={styles.loading}>
        {/* // Loading animation */}
        <ActivityIndicator size="large" color="#001d6c" />
      </View>
    );
  }
  if (camPermission == false) {
    return (
      <View>
        <Text>
          Camera permissions not granted. Please enable this app to use the
          camera in your settings to access the Augmented Reality Experience.{" "}
        </Text>
      </View>
    );
  }
  // If permissions granted return experience
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <UnityView
        style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
      />
      <View
        style={{
          height: "50%",
          marginTop: "auto",
          backgroundColor: "transparent",
        }}
      >
        {/* MaskedView to implement transparency gradient for Chatbot messages 
        (fade out towards top of parnet View to aid seeing the AR avatar) */}
        <MaskedView
          style={StyleSheet.absoluteFill}
          maskElement={
            <LinearGradient
              colors={["rgba(0,0,0,0)", "rgba(0,0,0,1)"]}
              style={{ flex: 1 }}
            />
          }
        >
          <ChatBotScreen />
        </MaskedView>
      </View>
      <WatermarkLogo />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
  },
  loading: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
});

export default ARUnityScreen;
