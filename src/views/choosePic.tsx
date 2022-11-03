import React, { useState } from "react";
import { Image, View, Alert, SafeAreaView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";

export default function ImagePickerExample(props) {
  const [images, setImages] = useState(null);

  const openCamera = async (): Promise<void> => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setImages(result.uri);
    }

    props.navigation.navigate("Add Image", { image: result.uri });
  };

  const pickImage = async (): Promise<void> => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5,
      orderedSelection: true,
      quality: 0.1,
    });

    if (!result.cancelled) {
      let images: string[] = [];

      result.selected.forEach( (image) =>
        images.push(image.uri)
      )
      setImages(images);

      props.navigation.navigate("Add Image", { images: images });
    }
  };

  const save = async (): Promise<void> => {
    Alert.alert("Imagem adicionada!");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          position: "absolute",
          bottom: 10,
          left: 50,
          flexDirection: "row",
        }}
      >
        <MaterialIcons
          name="camera-alt"
          size={30}
          color="black"
          onPress={openCamera}
          style={{ margin: 5 }}
        />

        <MaterialIcons
          name="add-to-photos"
          size={30}
          color="black"
          onPress={pickImage}
          style={{ margin: 5 }}
        />

        <MaterialIcons
          name="mic"
          size={30}
          color="black"
          style={{ margin: 5 }}
        />
      </View>
    </SafeAreaView>
  );
}
