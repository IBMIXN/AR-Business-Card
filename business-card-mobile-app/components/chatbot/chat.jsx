import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AutoScrollFlatList } from "react-native-autoscroll-flatlist";
import PropTypes from "prop-types";

// Chat bubble component
// hold text, styling + sent, receieved
const ChatBubble = (props) => {
  // console.log(props);
  if (props.sent == 1) {
    // sent message
    return (
      <View style={styles.bubbleSent}>
        <Text style={styles.messageTextSent}>{props.text}</Text>
        <Text style={styles.messageTextDetails}>You</Text>
      </View>
    );
  } else if (props.sent == 0) {
    // received message
    return (
      <View style={styles.bubbleReceived}>
        <Text style={styles.messageTextReceived}>{props.text}</Text>
        <Text style={styles.messageTextDetails}>Watson</Text>
      </View>
    );
  } else {
    // info bubble
    return (
      <View style={styles.bubbleInfo}>
        <Text style={styles.messageTextInfo}>{props.text}</Text>
      </View>
    );
  }
};

ChatBubble.propTypes = {
  sent: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
};

// List of chat bubbles component
// ScrollView/FlatList  + map logic + order
// Receieve data key value object array {id: , text: }

const ChatListView = (props) => {
  // props.ar - whether to render more top padding for AR MAskedView version of component
  return (
    <AutoScrollFlatList
      data={props.chatArray}
      renderItem={({ item }) => (
        <ChatBubble sent={item.sent} text={item.text} />
      )}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={
        props.ar ? styles.listContentAR : styles.listContent
      }
      // onContentSizeChange={onContentSizeChange}
      // ref={refHandler}
    ></AutoScrollFlatList>
  );
};

ChatListView.propTypes = {
  chatArray: PropTypes.array.isRequired,
};

export default ChatListView;

const styles = StyleSheet.create({
  bubbleSent: {
    backgroundColor: "#0043CE", // IBM blue 70
    alignSelf: "flex-end",
    borderRadius: 7,
    marginRight: "3%",
    marginLeft: "15%",
    marginTop: 5,
    marginBottom: 3,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,

    elevation: 13,
  },
  bubbleReceived: {
    backgroundColor: "#525252", // IBM grey 70
    alignSelf: "flex-start",
    borderRadius: 3,
    marginLeft: "3%",
    marginRight: "15%",
    marginTop: 5,
    marginBottom: 3,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,

    elevation: 13,
  },
  bubbleInfo: {
    backgroundColor: "#e0e0e0", // IBM blue 70
    alignSelf: "center",
    borderRadius: 2,
    marginRight: "7%",
    marginLeft: "7%",
    marginTop: 5,
    marginBottom: 3,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.3,

    elevation: 10,
  },
  messageTextSent: {
    fontSize: 16,
    color: "white",
  },
  messageTextReceived: {
    fontSize: 16,
    color: "white",
    justifyContent: "center",
  },
  messageTextInfo: {
    fontSize: 14,
    color: "black",
    fontStyle: "italic",
  },
  messageTextDetails: {
    fontSize: 8,
    color: "white",
    alignSelf: "flex-end",
    marginRight: "2%",
  },
  listContent: {
    paddingBottom: "35%",
  },
  listContentAR: {
    paddingBottom: "35%",
    paddingTop: "35%",
  },
});
