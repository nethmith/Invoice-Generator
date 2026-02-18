export type Currency = 'USD' | 'EUR' | 'LKR' | 'GBP';
export type PaymentMethod = 'Cash' | 'Card' | 'Bank Transfer';

export interface DriverDetails {
  name: string;
  vehicleNo: string;
  vehicleModel: string;
  phone1: string;
  phone2: string;
}

export interface Invoice {
  id: string; // unique ID for storage
  invoiceNumber: string; // HK-YYYY-XXX
  date: string; // YYYY-MM-DD
  touristName: string;
  pickupLocation: string;
  dropLocation: string;
  route: string; // derived from pickup -> drop
  distance?: string;
  amount: string;
  currency: Currency;
  paymentMethod: PaymentMethod;
  notes?: string;
  createdAt: number;
}

export const DRIVER_DETAILS: DriverDetails = {
  name: 'U.K Herath',
  vehicleNo: 'KV 4575',
  vehicleModel: 'Prius',
  phone1: '+94 76 493 1715',
  phone2: '+94 70 481 7779',
};
