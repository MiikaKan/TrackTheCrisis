import React, {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import LoginView from './views/LoginView';
import {View, Text} from 'react-native';

const App: () => React$Node = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

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
      <Text>Welcome!</Text>
    </View>
  );
};

export default App;
