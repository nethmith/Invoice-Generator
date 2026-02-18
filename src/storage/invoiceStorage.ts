import AsyncStorage from '@react-native-async-storage/async-storage';
import { Invoice } from '../types/Invoice';

const STORAGE_KEY_INVOICES = '@invoices_v1';
const STORAGE_KEY_SEQ = '@invoice_seq_v1';

export const getInvoices = async (): Promise<Invoice[]> => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY_INVOICES);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error('Error reading invoices', e);
        return [];
    }
};

export const saveInvoice = async (invoice: Invoice): Promise<void> => {
    try {
        const invoices = await getInvoices();

        // Check for duplicates
        const existingIndex = invoices.findIndex(inv => inv.id === invoice.id);
        if (existingIndex >= 0) {
            return;
        }

        // Prepend to list
        const newList = [invoice, ...invoices];
        await AsyncStorage.setItem(STORAGE_KEY_INVOICES, JSON.stringify(newList));

        // Update sequence
        await incrementInvoiceSequence();
    } catch (e) {
        console.error('Error saving invoice', e);
        throw e;
    }
};

export const getNextInvoiceNumber = async (): Promise<string> => {
    try {
        const currentYear = new Date().getFullYear();
        const seqStr = await AsyncStorage.getItem(STORAGE_KEY_SEQ);

        let count = 0;

        if (seqStr) {
            const data = JSON.parse(seqStr);
            if (data.year === currentYear) {
                count = data.count;
            } else {
                // new year, count starts at 0 (next is 1)
            }
        }

        const nextCount = count + 1;
        const formattedCount = String(nextCount).padStart(3, '0');
        return `HK-${currentYear}-${formattedCount}`;
    } catch (e) {
        console.error('Error generating invoice number', e);
        return `HK-${new Date().getFullYear()}-001`;
    }
};

const incrementInvoiceSequence = async (): Promise<void> => {
    try {
        const currentYear = new Date().getFullYear();
        const seqStr = await AsyncStorage.getItem(STORAGE_KEY_SEQ);
        let count = 0;

        if (seqStr) {
            const data = JSON.parse(seqStr);
            if (data.year === currentYear) {
                count = data.count;
            }
        }

        const nextCount = count + 1;
        await AsyncStorage.setItem(STORAGE_KEY_SEQ, JSON.stringify({
            year: currentYear,
            count: nextCount
        }));
    } catch (e) {
        console.error('Error incrementing sequence', e);
    }
};

export const clearAllData = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY_INVOICES);
    await AsyncStorage.removeItem(STORAGE_KEY_SEQ);
};
