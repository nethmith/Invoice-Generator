import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: Props) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Herath Tours</Text>
                <Text style={styles.subtitle}>Professional Invoice Generator</Text>
            </View>

            <View style={styles.content}>
                <TouchableOpacity
                    style={[styles.button, styles.primaryButton]}
                    onPress={() => navigation.navigate('CreateInvoice')}
                >
                    <Text style={styles.buttonText}>+ Create New Invoice</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.secondaryButton]}
                    onPress={() => navigation.navigate('History')}
                >
                    <Text style={[styles.buttonText, styles.secondaryButtonText]}>📜 View History</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Version 1.0.0</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        justifyContent: 'space-between',
    },
    header: {
        marginTop: 60,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1a365d',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#718096',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        gap: 20,
    },
    button: {
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    primaryButton: {
        backgroundColor: '#2b6cb0',
    },
    secondaryButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    secondaryButtonText: {
        color: '#2d3748',
    },
    footer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    footerText: {
        color: '#cbd5e0',
    },
});
