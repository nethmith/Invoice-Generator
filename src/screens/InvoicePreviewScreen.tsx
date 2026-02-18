import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { DRIVER_DETAILS } from '../types/Invoice';
import { saveInvoice } from '../storage/invoiceStorage';
import { createAndSharePDF } from '../utils/pdfGenerator';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'InvoicePreview'>;
    route: RouteProp<RootStackParamList, 'InvoicePreview'>;
};

export default function InvoicePreviewScreen({ navigation, route }: Props) {
    const { invoice, isNew } = route.params;
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(!isNew); // If not new, it is already saved

    const handleSave = async () => {
        setSaving(true);
        try {
            await saveInvoice(invoice);
            setSaved(true);
            Alert.alert('Success', 'Invoice saved successfully!');
        } catch (e) {
            Alert.alert('Error', 'Failed to save invoice');
        } finally {
            setSaving(false);
        }
    };

    const handleShare = async () => {
        try {
            await createAndSharePDF(invoice);
        } catch (e) {
            Alert.alert('Error', 'Failed to share PDF');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.paper}>
                    <View style={styles.header}>
                        <Text style={styles.title}>HERATH TOURS</Text>
                        <Text style={styles.driverName}>{DRIVER_DETAILS.name}</Text>
                        <Text style={styles.driverInfo}>Vehicle: {DRIVER_DETAILS.vehicleModel} ({DRIVER_DETAILS.vehicleNo})</Text>
                        <Text style={styles.driverInfo}>{DRIVER_DETAILS.phone1} / {DRIVER_DETAILS.phone2}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.details}>
                        <Row label="Invoice No" value={invoice.invoiceNumber} />
                        <Row label="Date" value={invoice.date} />
                        <Row label="Tourist" value={invoice.touristName} />
                        <Row label="Route" value={invoice.route} />
                        <Row label="Payment Method" value={invoice.paymentMethod || 'Cash'} />
                        {invoice.distance ? <Row label="Distance" value={`${invoice.distance} km`} /> : null}
                    </View>

                    {invoice.notes ? (
                        <View style={styles.notes}>
                            <Text style={styles.notesLabel}>Notes:</Text>
                            <Text style={styles.notesValue}>{invoice.notes}</Text>
                        </View>
                    ) : null}

                    <View style={styles.totalBox}>
                        <Text style={styles.totalLabel}>Total Amount</Text>
                        <Text style={styles.totalValue}>{invoice.currency} {invoice.amount}</Text>
                    </View>

                    <Text style={styles.footer}>Thank you for choosing our service!</Text>
                </View>
            </ScrollView>

            <View style={styles.actions}>
                <TouchableOpacity style={[styles.button, styles.shareButton]} onPress={handleShare}>
                    <Text style={styles.buttonText}>📤 Share PDF</Text>
                </TouchableOpacity>

                {isNew && (
                    <TouchableOpacity
                        style={[styles.button, saved ? styles.savedButton : styles.saveButton]}
                        onPress={handleSave}
                        disabled={saving || saved}
                    >
                        <Text style={styles.buttonText}>
                            {saving ? 'Saving...' : saved ? '✅ Saved' : '💾 Save Invoice'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const Row = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#cbd5e0' },
    scrollContent: { padding: 20 },
    paper: { backgroundColor: '#fff', padding: 25, borderRadius: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
    header: { alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 22, fontWeight: 'bold', color: '#1a365d', marginBottom: 5, letterSpacing: 1 },
    driverName: { fontSize: 16, fontWeight: '600', color: '#4a5568' },
    driverInfo: { fontSize: 12, color: '#718096', marginTop: 2 },
    divider: { height: 1, backgroundColor: '#e2e8f0', marginVertical: 20 },
    details: { gap: 10 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    label: { fontSize: 14, color: '#718096', fontWeight: '500' },
    value: { fontSize: 14, color: '#2d3748', fontWeight: 'bold', textAlign: 'right', flex: 1, marginLeft: 20 },
    notes: { marginTop: 20, borderTopWidth: 1, borderTopColor: '#f7fafc', paddingTop: 10 },
    notesLabel: { fontSize: 12, color: '#718096', marginBottom: 4 },
    notesValue: { fontSize: 14, color: '#2d3748', fontStyle: 'italic' },
    totalBox: { marginTop: 30, backgroundColor: '#f7fafc', padding: 20, borderRadius: 8, alignItems: 'center' },
    totalLabel: { fontSize: 12, textTransform: 'uppercase', color: '#718096', letterSpacing: 1 },
    totalValue: { fontSize: 28, fontWeight: 'bold', color: '#2b6cb0', marginTop: 5 },
    footer: { textAlign: 'center', marginTop: 30, color: '#a0aec0', fontSize: 12, fontStyle: 'italic' },
    actions: { padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e2e8f0', flexDirection: 'row', gap: 15 },
    button: { flex: 1, padding: 15, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    shareButton: { backgroundColor: '#4a5568' },
    saveButton: { backgroundColor: '#3182ce' },
    savedButton: { backgroundColor: '#48bb78' },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
