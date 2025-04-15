import React from "react";
import { Marker } from "react-native-maps";

const ReferenciaMarker = ({ punto, index, onPress, onDragEnd }) => {
  if (!punto?.latitude || !punto?.longitude) return null;

  return (
    <Marker
      coordinate={{ latitude: punto.latitude, longitude: punto.longitude }}
      pinColor="red"
      draggable
      onPress={() => onPress(punto, index)}
      onDragEnd={(e) => onDragEnd(index, e.nativeEvent.coordinate)}
    />
  );
};

export default ReferenciaMarker;
