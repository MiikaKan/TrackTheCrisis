import React, {useState} from 'react';
import {View, Text, Image} from 'react-native';

export default function PlaceRowView(props) {
  const {name, icon, index} = props;

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        marginTop: 5,
      }}
      key={index}>
      <Image
        style={{width: 30, height: 30, marginRight: 10}}
        source={{uri: icon}}
      />
      <Text>{name}</Text>
    </View>
  );
}
