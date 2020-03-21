import React, {useState} from 'react';
import {View, Text, TextInput, Button} from 'react-native';

export default function LoginView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const {loginUser} = props;
  return (
    <View>
      <TextInput
        placeholder="Username"
        onChangeText={username => setUsername(username)}
        value={username}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={password => setPassword(password)}
        value={password}
      />
      <Button title="Login" onPress={() => loginUser(username, password)} />
    </View>
  );
}
