// import React from 'react';
// import {Platform, Pressable, StyleSheet, View,Text} from 'react-native';
// import BackgroundService from 'react-native-background-actions';

// const sleep = (ms:any) => new Promise(resolve => setTimeout(resolve, ms));

// const veryIntensiveTask = async () => {
//   while (BackgroundService.isRunning()) {
//     try {
//       await BackgroundService.updateNotification({
//         taskDesc: 'Updating...',
//       });
//       console.log('Fetching data...');
//       const res = await fetch('https://jsonplaceholder.typicode.com/todos/1');
//       const data = await res.json();
//       console.log('Data fetched:', data);

//       await BackgroundService.updateNotification({
//         taskDesc: 'Data fetched successfully',
//       });
//       console.log('Notification updated');

//       await sleep(5000);
//     } catch (error) {
//       console.error('Error in background task:', error);
//       await BackgroundService.updateNotification({
//         taskDesc: 'Error occurred',
//       });
//     }
//   }
// };

// const options = {
//   taskName: 'Example',
//   taskTitle: 'ExampleTask title',
//   taskDesc: 'ExampleTask description',
//   taskIcon: {
//     name: 'ic_launcher',
//     type: 'mipmap',
//   },
//   color: '#ff00ff',
//   linkingURI: 'yourSchemeHere://chat/jane',
//   parameters: {
//     delay: 5000,
//   },
// };

// export default function App() {
//   const startService = async () => {
//     if (Platform.OS !== 'android') {
//       return;
//     }

//     try {
//       await BackgroundService.start(veryIntensiveTask, options);
//       await BackgroundService.updateNotification({
//         taskDesc: 'Background service started',
//       });
//       console.log('Background service started:', BackgroundService.isRunning());
//     } catch (error) {
//       console.error('Failed to start background service:', error);
//     }
//   };

//   const stopService = async () => {
//     try {
//       await BackgroundService.stop();
//       console.log(
//         'Background service stopped:',
//         !BackgroundService.isRunning(),
//       );
//     } catch (error) {
//       console.error('Failed to stop background service:', error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Background Service Example</Text>
//       <Pressable
        
//         onPress={startService}
//        style={styles.button}
        
//           >
//         <Text>Start Background Service</Text>
//       </Pressable>
//       <Pressable
       
//         onPress={stopService}
//         style={styles.button}
//           >
//         <Text>Stop Background Service</Text>
//       </Pressable>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 16,
//   },
//   title: {
//     fontSize: 18,
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: '#007bff',
//     borderRadius: 5,
//     padding: 10,
//     marginVertical: 10,
//   },
//   buttonTitle: {
//     fontSize: 16,
//     color: '#fff',
//   },
// });

import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Button } from "react-native";
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import { Notifications } from "expo";

const BACKGROUND_TASK_NAME = "test-bg-fetch";
const LOCATION_TASK_NAME = "background-location-task";

BackgroundFetch.setMinimumIntervalAsync(5);

TaskManager.defineTask(BACKGROUND_TASK_NAME, async () => {
  try {
    // fetch data here...
    const backendData = "Simulated fetch " + Math.random();
    console.log(backendData);
    return backendData
      ? BackgroundFetch.Result.NewData
      : BackgroundFetch.Result.NoData;
  } catch (err) {
    return BackgroundFetch.Result.Failed;
  }
  // console.log("Inside task manager");
  // await Notifications.presentLocalNotificationAsync({
  //   title: "Background Fetch",
  //   body: BACKGROUND_TASK_NAME,
  //   ios: { _displayInForeground: true },
  // });
  // console.log("Bg fetch running");
  // return BackgroundFetch.Result.NewData;
});

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    console.log;
    return;
  }
  if (data) {
    const { locations } = data;
    console.log("Location captured in the background");
    // console.log(locations);
    // do something with the locations captured in the background
  }
});

export default function App() {
  useEffect(() => {
    const initPermissions = async () => {
      const notificationPermission = await Permissions.askAsync(
        Permissions.USER_FACING_NOTIFICATIONS
      );

      if (notificationPermission.status === "granted") {
        await Notifications.presentLocalNotificationAsync({
          title: "Background Fetch Test",
          body: "Notification permissions active",
          ios: { _displayInForeground: true },
        });

        const backgroundFetchStatus = await BackgroundFetch.getStatusAsync();
        switch (backgroundFetchStatus) {
          case BackgroundFetch.Status.Restricted:
            console.log("Background fetch execution is restricted");
            return;

          case BackgroundFetch.Status.Denied:
            console.log("Background fetch execution is disabled");
            return;

          default:
            console.log("Background fetch execution allowed");
            break;
        }
      }
    };
    initPermissions();
  }, []);

  const onBGFetchPress = async () => {
    // Register the task for bg fetch
    await BackgroundFetch.registerTaskAsync(BACKGROUND_TASK_NAME);
    console.log("Task registered");
    await Notifications.presentLocalNotificationAsync({
      title: "Background Fetch",
      body: "Task Registered",
      ios: { _displayInForeground: true },
    });
  };

  const onBGLocationPress = async () => {
    // get location access permission and register the task for bg location
    const { status } = await Location.requestPermissionsAsync();
    if (status === "granted") {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
      });
    }
  };

  const onDisableLocationTask = async () => {
    const isRegisterd = await TaskManager.isTaskRegisteredAsync(
      LOCATION_TASK_NAME
    );
    if (isRegisterd) {
      console.log("Unregistering BG Location");
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      await Notifications.presentLocalNotificationAsync({
        title: "Background Location",
        body: "Task unregistered",
        ios: { _displayInForeground: true },
      });
    }
  };

  const onDisableFetchTask = async () => {
    const isRegisterdFetch = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_TASK_NAME
    );
    if (isRegisterdFetch) {
      console.log("Unregistering BG Fetch");
      await BackgroundFetch.unregisterTaskAsync(BACKGROUND_TASK_NAME);
      await Notifications.presentLocalNotificationAsync({
        title: "Background Fetch",
        body: "Task unregistered",
        ios: { _displayInForeground: true },
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text>BG Test</Text>
      <StatusBar style="auto" />
      <Button
        onPress={onBGLocationPress}
        title="Enable background location"
        color="#841584"
      />
      <Button
        onPress={onBGFetchPress}
        title="Enable Background fetch"
        color="#841584"
      />
      <Button
        onPress={onDisableLocationTask}
        title="Disable Background Location Task"
        color="#841584"
      />
      <Button
        onPress={onDisableFetchTask}
        title="Disable Background Fetch Task"
        color="#841584"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});