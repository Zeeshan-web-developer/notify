// import React from 'react';
// import { StyleSheet, Text, View, Button } from 'react-native';
// import * as BackgroundFetch from 'expo-background-fetch';
// import * as TaskManager from 'expo-task-manager';

// const BACKGROUND_FETCH_TASK = 'background-fetch';

// // Define the background fetch task
// TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
//   const now = Date.now();
//   console.log(`Got background fetch call at date: ${new Date(now).toISOString()}`);
//   const fetchdata = await fetch('http://localhost:3009/')
//     .then((response) => response.json())
//    .catch((error) => console.error(error));

//   // Return the result of the task
//   return BackgroundFetch.BackgroundFetchResult.NewData;
// });

// // Register the background fetch task
// async function registerBackgroundFetchAsync() {
//   console.log('Registering background fetch');
//   return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
//     minimumInterval: 1 * 60, // 1 minute
//     stopOnTerminate: false, // android only
//     startOnBoot: true, // android only
//   });
// }

// // Unregister the background fetch task
// async function unregisterBackgroundFetchAsync() {
//   console.log('Unregistering background fetch');
//   return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
// }

// export default function BackgroundFetchScreen() {
//   const [isRegistered, setIsRegistered] = React.useState(false);
//   const [status, setStatus] = React.useState<any>(null);

//   React.useEffect(() => {
//     checkStatusAsync();
//   }, []);

//   const checkStatusAsync = async () => {
//     const status = await BackgroundFetch.getStatusAsync();
//     const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
//     console.log(`Background fetch status: ${status}`);
//     console.log(`Background fetch task is registered: ${isRegistered}`);
//     setStatus(status);
//     setIsRegistered(isRegistered);
//   };

//   const toggleFetchTask = async () => {
//     if (isRegistered) {
//       await unregisterBackgroundFetchAsync();
//     } else {
//       await registerBackgroundFetchAsync();
//     }
//     checkStatusAsync();
//   };

//   return (
//     <View style={styles.screen}>
//       <View style={styles.textContainer}>
//         <Text>
//           Background fetch status: <Text style={styles.boldText}>
//             {status && BackgroundFetch.BackgroundFetchStatus[status]}
//           </Text>
//         </Text>
//         <Text>
//           Background fetch task name: <Text style={styles.boldText}>
//             {isRegistered ? BACKGROUND_FETCH_TASK : 'Not registered yet!'}
//           </Text>
//         </Text>
//       </View>
//       <Button
//         title={isRegistered ? 'Unregister BackgroundFetch task' : 'Register BackgroundFetch task'}
//         onPress={toggleFetchTask}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   textContainer: {
//     margin: 10,
//   },
//   boldText: {
//     fontWeight: 'bold',
//   },
// });

import React from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

const BACKGROUND_FETCH_TASK = 'background-fetch';

// Define the background fetch task
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
     // fetch data here...
    const receivedNewData = "Simulated fetch " + Math.random()
    console.log("My task ", receivedNewData)
    Alert.alert("My task ", receivedNewData)
     return receivedNewData
      ? BackgroundFetch.BackgroundFetchResult.NewData
      : BackgroundFetch.BackgroundFetchResult.NoData;
    
  } catch (error) {
    console.error('Background fetch task failed:', error);
    // Return no data signal if failed
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// Register the background fetch task
async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 1 * 60, // task will fire 1 minute after app is backgrounded
    stopOnTerminate: false, // android only
    startOnBoot: true, // android only
  });
}

// Unregister the background fetch task
async function unregisterBackgroundFetchAsync() {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}

export default function BackgroundFetchScreen() {
  const [isRegistered, setIsRegistered] = React.useState(false);
  const [status, setStatus] = React.useState<any>(null);

  React.useEffect(() => {
    checkStatusAsync();
  }, []);

  const checkStatusAsync = async () => {
    
    const status = await BackgroundFetch.getStatusAsync();
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
    console.log(`Background fetch status: ${status}`);
    console.log(`Background fetch task is registered: ${isRegistered}`);
       

    setStatus(status);
    setIsRegistered(isRegistered);
  };

  const toggleFetchTask = async () => {
    if (isRegistered) {
      await unregisterBackgroundFetchAsync();
    } else {
      await registerBackgroundFetchAsync();
    }
    checkStatusAsync();
  };

  return (
    <View style={styles.screen}>
      <View style={styles.textContainer}>
        
        <Text>
          Background fetch status v2: <Text style={styles.boldText}>
            {status && BackgroundFetch.BackgroundFetchStatus[status]}
          </Text>
        </Text>
        <Text>
          Background fetch task name: <Text style={styles.boldText}>
            {isRegistered ? BACKGROUND_FETCH_TASK : 'Not registered yet!'}
          </Text>
        </Text>
      </View>
      <Button
        title={isRegistered ? 'Unregister BackgroundFetch task' : 'Register BackgroundFetch task'}
        onPress={toggleFetchTask}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    margin: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
});

