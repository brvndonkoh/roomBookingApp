import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, TouchableOpacity, Alert, StyleSheet, Linking } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

const QRScanner = ({ navigation }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const cameraRef = useRef(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ data }) => {
        if (!scanned) {
            setScanned(true);
            Alert.alert('QR Code Scanned', `Opening: ${data}`, [{ text: 'OK', onPress: () => Linking.openURL(data) }]);
        }
    };

    if (hasPermission === null) return <Text>Requesting for camera permission...</Text>;
    if (hasPermission === false) return <Text>No access to camera</Text>;

    return (
        <View style={styles.container}>
            <Camera ref={cameraRef} style={styles.camera} onBarCodeScanned={scanned ? undefined : handleBarCodeScanned} />
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => setScanned(false)}>
                    <Text style={styles.text}>Scan Again</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                    <Text style={styles.text}>Back to Home</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    camera: { flex: 1, justifyContent: 'flex-end' },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', padding: 20 },
    button: { padding: 10, backgroundColor: '#007bff', borderRadius: 5 },
    text: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default QRScanner;