import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RootStackParamList } from '../types/navigation';
import { Invoice, Currency, PaymentMethod } from '../types/Invoice';
import { getNextInvoiceNumber } from '../storage/invoiceStorage';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'CreateInvoice'>;
};

export default function CreateInvoiceScreen({ navigation }: Props) {
    const [loading, setLoading] = useState(false);
    const [touristName, setTouristName] = useState('');
    const [pickup, setPickup] = useState('');
    const [drop, setDrop] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [distance, setDistance] = useState('');
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState<Currency>('USD');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
    const [notes, setNotes] = useState('');

    const handleCreate = async () => {
        if (!touristName || !pickup || !drop || !amount) {
            Alert.alert('Missing Fields', 'Please fill in Tourist Name, Pickup, Drop, and Amount.');
            return;
        }

        setLoading(true);
        try {
            const nextInvoiceNo = await getNextInvoiceNumber();

            const newInvoice: Invoice = {
                id: Date.now().toString(),
                invoiceNumber: nextInvoiceNo,
                date: date.toISOString().split('T')[0],
                touristName,
                pickupLocation: pickup,
                dropLocation: drop,
                route: `${pickup} → ${drop}`,
                distance: distance || undefined,
                amount,
                currency,
                paymentMethod,
                notes: notes || undefined,
                createdAt: Date.now(),
            };

            navigation.navigate('InvoicePreview', { invoice: newInvoice, isNew: true });
        } catch (e) {
            console.error(e);
            Alert.alert('Error', 'Failed to generate invoice number');
        } finally {
            setLoading(false);
        }
    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.header}>New Invoice</Text>

            <View style={styles.section}>
                <Text style={styles.label}>Tourist Name *</Text>
                <TextInput style={styles.input} value={touristName} onChangeText={setTouristName} placeholder="John Doe" placeholderTextColor="#a0aec0" />
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Date</Text>
                {Platform.OS === 'web' ? (
                    <TextInput
                        style={styles.input}
                        value={date.toISOString().split('T')[0]}
                        onChangeText={(txt) => setDate(new Date(txt))}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor="#a0aec0"
                    />
                ) : (
                    <>
                        <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
                            <Text style={{ color: '#2d3748', fontSize: 16 }}>{date.toISOString().split('T')[0]}</Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display="default"
                                onChange={onDateChange}
                            />
                        )}
                    </>
                )}
            </View>

            <View style={styles.row}>
                <View style={[styles.section, { flex: 1, marginRight: 10 }]}>
                    <Text style={styles.label}>Pickup *</Text>
                    <TextInput style={styles.input} value={pickup} onChangeText={setPickup} placeholder="Colombo" placeholderTextColor="#a0aec0" />
                </View>
                <View style={[styles.section, { flex: 1 }]}>
                    <Text style={styles.label}>Drop *</Text>
                    <TextInput style={styles.input} value={drop} onChangeText={setDrop} placeholder="Ella" placeholderTextColor="#a0aec0" />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Distance (km)</Text>
                <TextInput style={styles.input} value={distance} onChangeText={setDistance} keyboardType="numeric" placeholder="120" placeholderTextColor="#a0aec0" />
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Amount *</Text>
                <View style={styles.amountContainer}>
                    <View style={styles.currencySelector}>
                        {(['USD', 'EUR', 'LKR', 'GBP'] as Currency[]).map((c) => (
                            <TouchableOpacity
                                key={c}
                                style={[styles.currencyChip, currency === c && styles.currencyChipSelected]}
                                onPress={() => setCurrency(c)}
                            >
                                <Text style={[styles.currencyText, currency === c && styles.currencyTextSelected]}>{c}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <TextInput
                        style={[styles.input, styles.amountInput]}
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="numeric"
                        placeholder="100.00"
                        placeholderTextColor="#a0aec0"
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Payment Method</Text>
                <View style={styles.currencySelector}>
                    {(['Cash', 'Card', 'Bank Transfer'] as PaymentMethod[]).map((m) => (
                        <TouchableOpacity
                            key={m}
                            style={[styles.currencyChip, paymentMethod === m && styles.currencyChipSelected]}
                            onPress={() => setPaymentMethod(m)}
                        >
                            <Text style={[styles.currencyText, paymentMethod === m && styles.currencyTextSelected]}>{m}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Notes</Text>
                <TextInput
                    style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    placeholder="Thank you..."
                    placeholderTextColor="#a0aec0"
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleCreate} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? 'Processing...' : 'Generate Invoice'}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 20 },
    content: { paddingBottom: 50 },
    header: { fontSize: 24, fontWeight: 'bold', color: '#1a202c', marginBottom: 25 },
    section: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '600', color: '#4a5568', marginBottom: 8 },
    input: { backgroundColor: '#f7fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, padding: 15, fontSize: 16, color: '#2d3748' },
    row: { flexDirection: 'row' },
    amountContainer: { gap: 10 },
    amountInput: { fontWeight: 'bold' },
    currencySelector: { flexDirection: 'row', gap: 8, marginBottom: 5, flexWrap: 'wrap' },
    currencyChip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#f7fafc', borderWidth: 1, borderColor: '#e2e8f0' },
    currencyChipSelected: { backgroundColor: '#3182ce', borderColor: '#3182ce' },
    currencyText: { fontSize: 14, fontWeight: '600', color: '#718096' },
    currencyTextSelected: { color: '#fff' },
    button: { backgroundColor: '#3182ce', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10, shadowColor: '#3182ce', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
