import React, {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import Geolocation from 'react-native-geolocation-service';
import LoginView from './views/LoginView';
import {Button, View, Text, PermissionsAndroid} from 'react-native';


const App: () => React$Node = () => {


  const ref = firestore().collection('locations');


  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState('');
  const [error, setError] = useState('');
  const [text, setText] = useState('');
  const [position, setPosition] = useState({latitude: 0, longitude: 0});

  const registerUser = async (username, password) => {
    try {
      await auth().createUserWithEmailAndPassword(username, password);
    } catch (e) {
      console.error(e.message);
    }
  };


  const loginUser = async (username, password) => {
    try {
      await auth().signInWithEmailAndPassword(username, password);
    } catch (e) {
      console.error(e.message);
    }
  };
  
  const saveLocation = async () =>  {
    await ref.add({
      title: "test",
      complete: false,
    });
  }

  const onAuthStateChanged = user => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });
  }, []);

  useEffect(() => {
    const granted = PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (granted) {
      const watchId = Geolocation.watchPosition(
        pos => {
          setError('');
          setPosition({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        e => setError(e.message),
        {enableHighAccuracy: true, distanceFilter: 1, interval: 10000},
      );
      return () => Geolocation.clearWatch(watchId);
    }
  }, []);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <View>
        <LoginView loginUser={loginUser} />
      </View>
    );
  }

  return (
    <View style={{
      flexDirection: 'row',
      height: 100,
      padding: 20,
    }}>
      <Text>
        Hello {position.latitude} {position.longitude}
      </Text>
      <View>
      <Button onPress={() => storeLocation} title={"Save location"}/>
      </View>
    </View>
  );
};

export default App;
