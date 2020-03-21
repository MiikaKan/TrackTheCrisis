import React, {useState} from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import PlaceRowView from './PlaceRowView';

export default function PlacesView(props) {
  const {places} = props;

  const getPlaceRows = () => {
    return places.map((place, index) => {
      return <PlaceRowView name={place.name} index={index} icon={place.icon} />;
    });
  };
  return (
    <View>
      <Text>Places nearby you:</Text>
      {getPlaceRows()}
    </View>
  );
}
