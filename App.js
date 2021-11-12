import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";
import { Camera } from "expo-camera";
import { FontAwesome } from "@expo/vector-icons";

export default function App() {
  const camRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>Acesso negado!</Text>;
  }

  async function takePicture() {
    if (camRef) {
      const data = await camRef.current.takePictureAsync();
      setCapturedPhoto(data.uri);
      setOpen(true);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera style={styles.camera} type={type} ref={camRef}>
        <View style={styles.contentButtons}>
          <TouchableOpacity
            style={styles.buttonFlip}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          >
            <FontAwesome name="exchange" size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonCamera} onPress={takePicture}>
            <FontAwesome name="camera" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </Camera>
      {capturedPhoto && (
        <Modal visible={open} transparent={true} animationType="slide">
          <View style={styles.contentModal}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setOpen(false)}
            >
              <FontAwesome name="close" size={40} color="#000" />
            </TouchableOpacity>
            <Image style={styles.imgPhoto} source={{ uri: capturedPhoto }} />
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  contentButtons: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
  },
  buttonFlip: {
    position: "absolute",
    backgroundColor: "#fff",
    bottom: 40,
    left: 40,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 50,
  },
  buttonCamera: {
    position: "absolute",
    bottom: 40,
    right: 40,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 50,
  },
  contentModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    margin: 20,
  },
  closeButton: {
    position: "absolute",
    backgroundColor: '#fff',
    height: 50,
    width: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    top: 50,
    left: 2,
  },
  imgPhoto: {
    width: '100%',
    height: 400,
  }
});
