import { View, TouchableOpacity } from "react-native";
import React, {
  useLayoutEffect,
  useState,
  useCallback,
  useEffect,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { MaterialIcons } from "@expo/vector-icons";
import { Avatar, Button } from "react-native-elements";
import { GiftedChat } from "react-native-gifted-chat";
import { IMessage } from "react-native-gifted-chat/lib/Models";
import { AuthenticationAPI, MessagesAPI } from "../lib/services";
import { ChatScreenProps, IUser } from "../definitions";
import { auth } from "../lib/utils/firebase";
import { useMediaControls } from "../hooks/useMediaControl";
import { MediaInput } from "../components/chat/MediaInput";

const ChatScreen = ({ route, navigation }: ChatScreenProps) => {
  const { roomId, roomName } = route.params;
  const [messages, setMessages] = useState<IMessage[]>([]);

  useLayoutEffect(() => {
    const fetchData = async () => {
      setMessages(await MessagesAPI.getMessagesFromRoom(roomId));
    };

    fetchData().catch(console.error);
  });

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user == null) {
        navigation.replace("Login");
      }
    });
  }, []);

  const goToChatList = () => {
    navigation.goBack();
  };

  const onSend = useCallback((messages: IMessage[] = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    const { _id, createdAt, text, user } = messages[0];

    MessagesAPI.sendTextMessage({ _id, createdAt, text, user }, roomId);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={{
            marginRight: 30,
          }}
          onPress={goToChatList}
        >
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View
          style={{
            marginLeft: 20,
          }}
        >
          <Avatar
            rounded
            source={{
              uri:
                AuthenticationAPI.getCurrentUser()?.photoURL ||
                AuthenticationAPI.defaultPhotoURL,
            }}
          />
        </View>
      ),
    });
  }, []);

  const {
    setNavigation,
    setSelectedImages,
    selectedImages,
    selectImageFromCamera,
    selectImageFromGallery,
  } = useMediaControls({ initialNavigation: navigation });

  useEffect(() => setNavigation(navigation), [navigation]);

  useEffect(() => setSelectedImages([]), []);

  useEffect(() => {
    if (selectedImages.length > 0) {
      navigation.navigate("Add Image", { images: selectedImages });
      setSelectedImages([]);
    }
  }, [selectedImages]);

  return (
    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={true}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: AuthenticationAPI.getCurrentUser()?.email || "",
        name: AuthenticationAPI.getCurrentUser()?.displayName || "",
        avatar:
          AuthenticationAPI.getCurrentUser()?.photoURL ||
          AuthenticationAPI.defaultPhotoURL,
      }}
      renderChatFooter={() => (
        <MediaInput
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onAddClick={selectImageFromGallery}
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onCameraClick={selectImageFromCamera}
          onMicClick={() => {}}
        />
      )}
    />
  );
};

export default ChatScreen;
