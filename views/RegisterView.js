import React, {useState} from 'react';
import {View, Text, TextInput, Button} from 'react-native';

export default function RegisterView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const {registerUser} = props;
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
      <Button
        title="Register"
        onPress={() => registerUser(username, password)}
      />
    </View>
  );
}
