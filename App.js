import React, {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import Geolocation from 'react-native-geolocation-service';
import LoginView from './views/LoginView';
import {View, Text, PermissionsAndroid} from 'react-native';

const App: () => React$Node = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState('');
  const [error, setError] = useState('');
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

  const onAuthStateChanged = user => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

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
    <View>
      <Text>Hello {position.latitude}</Text>
    </View>
  );
};

export default App;
