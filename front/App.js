import React, { useEffect, useState } from "react";
// import * as React from 'react';
import { Button, Image, View, Text, StyleSheet } from "react-native";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import axios from "axios";

export default function App() {
  var [data, setData] = useState({});
  var [photo, setPhoto] = useState({});

  const getPermissionAsync = async () => {
    if (!Constants.platform.web) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  async function handleUploadPhoto() {
    const path = photo.uri.split("/");
    const name = path[path.length - 1];
    const file = dataURLtoFile(photo.uri, name);
    const data = new FormData();
    data.append("file", file, file.name);

    await axios({
      method: "POST",
      url: "http://localhost:3000/posts",
      data: data,
      headers: {
        "Content-Type": "multipart/form-data; boundary=${form._boundary}",
      },
    });
  }
  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n) {
      u8arr[n - 1] = bstr.charCodeAt(n - 1);
      n -= 1; // to make eslint happy
    }
    return new File([u8arr], filename, { type: mime });
  };

  const takePhoto = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        setPhoto(result);
      }
      console.log(result);
    } catch (E) {
      console.log(E);
    }
  };

  const pickPhoto = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        setPhoto(result);
      }

      console.log(result);
    } catch (E) {
      console.log(E);
    }
  };

  useEffect(() => {
    getPermissionAsync();

    console.warn(data);
  }, [data]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button title="Take a photo with ur camera" onPress={takePhoto} />
      <Button title="Pick an photo from camera roll" onPress={pickPhoto} />
      {photo && (
        <Image source={{ uri: photo }} style={{ width: 200, height: 200 }} />
      )}
      {photo && (
        <React.Fragment>
          <Image
            source={{ uri: photo.uri }}
            style={{ width: 300, height: 300 }}
          />
          <Button title="Upload" onPress={handleUploadPhoto} />
        </React.Fragment>
      )}
      {/* {data} */}
    </View>
  );
}
