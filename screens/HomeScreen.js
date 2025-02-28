import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import RoomItem from '../components/RoomItem';

const API_URL = 'https://gist.githubusercontent.com/yuhong90/7ff8d4ebad6f759fcc10cc6abdda85cf/raw/463627e7d2c7ac31070ef409d29ed3439f7406f6/room-availability.json';

const HomeScreen = ({ navigation }) => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState("08:00");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    useEffect(() => {
        async function loadRooms() {
            try {
                const response = await axios.get(API_URL);
                setRooms(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching room data", error);
                setLoading(false);
            }
        }
        loadRooms();
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate('QRScanner')} style={{ marginRight: 15 }}>
                    <Ionicons name="camera" size={24} color="black" />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const sortRooms = (type) => {
        let sortedRooms = [...rooms];
    
        if (type === 'level') {
            sortedRooms.sort((a, b) => a.level - b.level);
        } else if (type === 'capacity') {
            sortedRooms.sort((a, b) => b.capacity - a.capacity);
        } else if (type === 'availability') {
            sortedRooms.sort((a, b) => {
                const availableA = Object.values(a.availability).filter(v => v === "1").length;
                const availableB = Object.values(b.availability).filter(v => v === "1").length;
                return availableB - availableA;
            });
        }
    
        setRooms(sortedRooms);
    };

    const checkAvailability = (room) => {
        Alert.alert(`${room.name} is ${room.availability[time] === "1" ? "available" : "NOT available"} at ${time}`);
    };

    if (loading) {
        return <ActivityIndicator size="large" color="blue" />;
    }

    return (
        <View style={{ flex: 1, padding: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }}>Book a Room</Text>
            <View style={styles.buttonRow}>
                <Button title={`Select Date: ${date.toLocaleDateString()}`} onPress={() => setShowDatePicker(true)} />
                <Button title={`Select Time: ${time}`} onPress={() => setShowTimePicker(true)} />
            </View>
            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) setDate(selectedDate);
                    }}
                />
            )}
            {showTimePicker && (
                <DateTimePicker
                    value={new Date(date.setHours(parseInt(time.split(":")[0]), parseInt(time.split(":")[1]), 0, 0))}
                    mode="time"
                    is24Hour={false}
                    display="default"
                    onChange={(event, selectedTime) => {
                        setShowTimePicker(false);
                        if (selectedTime) {
                            const hours = selectedTime.getHours();
                            const minutes = selectedTime.getMinutes();
                            setTime(`${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`);
                        }
                    }}
                />
            )}
            <View style={styles.buttonRow}>
                <TouchableOpacity onPress={() => sortRooms('level')} style={styles.sortButton}>
                    <Text style={styles.sortButtonText}>Sort by Level</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => sortRooms('capacity')} style={styles.sortButton}>
                    <Text style={styles.sortButtonText}>Sort by Capacity</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => sortRooms('availability')} style={styles.sortButton}>
                    <Text style={styles.sortButtonText}>Sort by Availability</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={rooms}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => <RoomItem room={item} onCheckAvailability={() => checkAvailability(item)} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
    sortButton: { padding: 10, backgroundColor: '#007bff', borderRadius: 5, alignItems: 'center' },
    sortButtonText: { color: 'white', fontSize: 14, fontWeight: 'bold' }
});

export default HomeScreen;
