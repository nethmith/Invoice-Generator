import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { Invoice } from '../types/Invoice';
import { getInvoices } from '../storage/invoiceStorage';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'History'>;
};

export default function HistoryScreen({ navigation }: Props) {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            loadInvoices();
        }, [])
    );

    const loadInvoices = async () => {
        setLoading(true);
        const data = await getInvoices();
        setInvoices(data);
        setLoading(false);
    };

    const renderItem = ({ item }: { item: Invoice }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('InvoicePreview', { invoice: item, isNew: false })}
        >
            <View style={styles.cardHeader}>
                <Text style={styles.invoiceNo}>{item.invoiceNumber}</Text>
                <Text style={styles.date}>{item.date}</Text>
            </View>
            <View style={styles.cardBody}>
                <Text style={styles.touristName}>{item.touristName}</Text>
                <Text style={styles.amount}>{item.currency} {item.amount}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#3182ce" style={{ marginTop: 50 }} />
            ) : invoices.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No invoices yet.</Text>
                </View>
            ) : (
                <FlatList
                    data={invoices}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f7fafc' },
    listContent: { padding: 20 },
    card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    invoiceNo: { fontWeight: 'bold', color: '#2b6cb0', fontSize: 16 },
    date: { color: '#a0aec0', fontSize: 14 },
    cardBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    touristName: { fontSize: 16, color: '#2d3748', fontWeight: '500' },
    amount: { fontSize: 16, color: '#2d3748', fontWeight: 'bold' },
    emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    emptyText: { color: '#a0aec0', fontSize: 16 },
});
