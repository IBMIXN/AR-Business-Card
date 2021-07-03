import React, { useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { StatusBar } from "expo-status-bar";
import ChatListView from "../components/chatbot/chat";
import ChatMicInput from "../components/chatbot/chatInput";
import { Audio } from "expo-av";

import { speechToText, textToAssistant } from "../utils/server/watson.utils";

const ChatBotScreen = ({ navigation }) => {
  const [recording, setRecording] = React.useState();
  const [chatHistory, setChatHistory] = React.useState([]);

  // Watson assistant session state tracking - initially empty string
  const [watsonSessionId, setWatsonSessionId] = React.useState("");

  async function startRecording() {
    try {
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log("Starting recording..");
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        // need to configure custom formats as android default m4a not compatible with watson API
        {
          android: {
            extension: ".wav",
            outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
            audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
          },
          ios: {
            extension: ".wav",
            outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
            audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
            linearPCMBitDepth: 16,
            linearPCMIsBigEndian: false,
            linearPCMIsFloat: false,
          },
        }
        // Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recording.startAsync();
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);
    // Send recording to watson, trigger STT

    const sentText = await speechToText(uri);
    console.log(sentText);
    // TODO - change into handler to handle if results[0] - empty array
    setChatHistory([
      ...chatHistory,
      {
        // id: (chatHistory.length + 1).toString(),
        sent: 1,
        text: sentText.results[0].alternatives[0].transcript,
        // confidence:
      },
    ]);

    // send text to assistant and handle Watson response, update chat history
    const watsonResult = await textToAssistant(
      sentText.results[0].alternatives[0].transcript,
      watsonSessionId
    );

    const chatResponse = watsonTextResponseHandler(watsonResult);

    setChatHistory((prevState) => {
      return [...prevState, ...chatResponse];
    });

    // console.log(WatsonResult);
    console.log("SESION ID = ", watsonSessionId);

    // some check for return values, errors?
    // check if session needs updating
    // for each itme in array, get value for text and add to new chat object
    function watsonTextResponseHandler(res) {
      console.log("res = ", res);
      console.log("RES OUT GEN = ", res.output.generic[0].text);
      let watsonReply = [];
      for (let i = 0; i < res.output.generic.length; i++) {
        watsonReply.push({
          // id: (chatHistory.length + 1 + i).toString(),
          sent: 0,
          text: res.output.generic[i].text,
        });
      }
      console.log("WATSON REPLY =", watsonReply);
      return watsonReply;
    }

    // console.log(watsonReply);
    // setChatHistory([...chatHistory, ...watsonReply]);

    if (watsonResult.output.session_id != watsonSessionId) {
      setWatsonSessionId(watsonResult.session_id);
    }

    // console.log(chatHistory);
  }

  const [sound, setSound] = React.useState();

  async function playSound(uri) {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync({ uri: uri });
    setSound(sound);

    console.log("Playing Sound");
    await sound.playAsync();
  }

  React.useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  // TODO - ON component mount should initialise session with Watson!

  return (
    <View style={styles.container}>
      <ChatListView chatArray={chatHistory} />

      <View style={styles.micView}>
        <ChatMicInput
          onPress={!recording ? startRecording : stopRecording}
          recording={recording}
        />
        {/* <Chat /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  micView: {
    position: "absolute",
    bottom: 20,
    left: 10,
    right: 10,
    zIndex: 2,
  },
  container: { flex: 1, backgroundColor: "white" },
});

export default ChatBotScreen;
