import { useState } from "react";
import { StyleSheet, View, Image, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as tensorflow from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import { decodeJpeg } from "@tensorflow/tfjs-react-native";
import * as FileSystem from "expo-file-system";

import { Button } from "../../components/Button";
import {
  Classification,
  ClassificationProps,
} from "../../components/Classification";

export default function Home() {
  const [selectedImageUri, setSelectedImageUri] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ClassificationProps[]>([]);

  async function handleSelectedImage() {
    setIsLoading(true);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
      });

      if (!result.canceled) {
        const { uri } = result.assets[0];

        setSelectedImageUri(uri);

        await imageClassification(uri);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function imageClassification(imageUri: string) {
    setResults([]);

    await tensorflow.ready();

    const model = await mobilenet.load();

    const imageBase64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const imgBuffer = tensorflow.util.encodeString(
      imageBase64,
      "base64"
    ).buffer;
    const raw = new Uint8Array(imgBuffer);
    const imageTensor = decodeJpeg(raw);

    const classificationResult = await model.classify(imageTensor);

    setResults(classificationResult);
  }

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: selectedImageUri
            ? selectedImageUri
            : "https://cdn2.vectorstock.com/i/1000x1000/48/06/image-preview-icon-picture-placeholder-vector-31284806.jpg",
        }}
        style={styles.image}
      />

      <View style={styles.results}>
        {results.map((result) => (
          <Classification key={result.className} data={result} />
        ))}
      </View>

      {isLoading ? (
        <ActivityIndicator color="#5F1BBF" />
      ) : (
        <Button title="Selecionar imagem" onPress={handleSelectedImage} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#171717",
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  image: {
    width: 250,
    height: 240,
    borderRadius: 7,
  },
  results: {
    marginTop: 64,
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "center",
  },
});
