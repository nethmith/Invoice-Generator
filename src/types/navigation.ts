import { Invoice } from './Invoice';

export type RootStackParamList = {
    Home: undefined;
    CreateInvoice: undefined;
    InvoicePreview: { invoice: Invoice, isNew: boolean };
    History: undefined;
};
