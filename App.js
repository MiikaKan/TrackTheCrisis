import React, {useState, useEffect} from 'react';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import Geolocation from 'react-native-geolocation-service';
import LoginView from './views/LoginView';
import {View, Text, PermissionsAndroid, Button} from 'react-native';
import {PLACES_API_KEY} from 'react-native-dotenv';

const API_KEY = PLACES_API_KEY;

const App: () => React$Node = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState('');
  const [error, setError] = useState('');
  const [position, setPosition] = useState({latitude: 0, longitude: 0});

  const filterPlacesByTypes = places => {
    const typesToFilterOut = ['locality'];

    return places.filter(place => {
      let count = 0;
      place.types.forEach(type =>
        typesToFilterOut.forEach(filterOutType => {
          if (type == filterOutType) count++;
        }),
      );

      return count < 1 ? place : false;
    });
  };

  const fetchNearbyPlaces = pos => {
    const base = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
    axios
      .get(
        `${base}?location=${pos.coords.latitude},${pos.coords.longitude}&radius=100&key=${API_KEY}`,
      )
      .then(response => {
        const results = response.data.results;

        const filteredByTypes = filterPlacesByTypes(results);
        const filteredRelevantFields = filteredByTypes.map(item => {
          return {
            name: item.name,
            types: item.types,
            id: item.id,
            icon: item.icon,
          };
        });

        console.error(filteredRelevantFields);
      })
      .catch(err => {
        console.error(err);
      });
  };

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

  const test = async () => {
    const documentSnapshot = await firestore()
      .collection('locations')
      .doc(user.uid)
      .get();

    console.error(documentSnapshot.data());
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
          fetchNearbyPlaces(pos);
        },
        e => setError(e.message),
        {enableHighAccuracy: true, distanceFilter: 100, interval: 10000},
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
      <Text>
        Hello {position.latitude} {position.longitude}
      </Text>
      <Button onPress={test} title="Get Data" />
    </View>
  );
};

export default App;
