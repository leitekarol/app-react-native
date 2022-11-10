import React, { useCallback, useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { MediaInput } from "../components/chat/MediaInput";

const ChooseImageExampleScreen: React.FC<{
  navigation: any;
}> = (props) => {
  const [images, setImages] = useState<string[]>([]);

  const openCamera = useCallback(async (): Promise<void> => {
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
      setImages([result.uri]);
    }
  }, [
    ImagePicker.requestCameraPermissionsAsync,
    ImagePicker.launchCameraAsync,
    setImages,
    props.navigation.navigate,
  ]);

  const pickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5,
      orderedSelection: true,
      quality: 0.1,
    });

    if (!result.cancelled) {
      const images: string[] = [];

      result.selected.forEach((image) => images.push(image.uri));
      setImages(images);
    }
  }, [setImages, props.navigation, ImagePicker.launchImageLibraryAsync]);

  useEffect(() => setImages([]), []);

  useEffect(() => {
    if (images.length > 0) props.navigation.navigate("Add Image", { images });
  }, [images]);

  return (
    <MediaInput
      navigation={props.navigation}
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onAddClick={pickImage}
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onCameraClick={openCamera}
      onMicClick={() => {}}
    />
  );
};

export default ChooseImageExampleScreen;
