import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const RoomItem = ({ room, onCheckAvailability }) => {
    const availableSlots = Object.values(room.availability).filter(v => v === "1").length;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{room.name}</Text>
            <Text>Capacity: {room.capacity}</Text>
            <Text>Level: {room.level}</Text>
            <Text>Available Slots: {availableSlots}</Text>
            <Button title="Check Availability" onPress={onCheckAvailability} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 15, margin: 10, backgroundColor: '#f5f5f5', borderRadius: 10 },
    title: { fontSize: 18, fontWeight: 'bold' },
});

export default RoomItem;
