import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import PlaceRowView from './PlaceRowView';

const styles = StyleSheet.create({
  container: {
    margin: 30,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
  },
});

export default function PlacesView(props) {
  const {places} = props;

  const getPlaceRows = () => {
    return places.map((place, index) => {
      return <PlaceRowView name={place.name} index={index} icon={place.icon} />;
    });
  };
  return (
    <View style={styles.container}>
      <Text>Places nearby you:</Text>
      {getPlaceRows()}
    </View>
  );
}
