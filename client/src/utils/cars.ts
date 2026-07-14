export interface Car {
    _id: string;
    make: string;
    model: string;
    year: string;
    matricule: string;
    image: string;
    available: boolean;
  }
  export interface Rental {
  _id: string;
  car: Car;
  client: Client;
  documents?: Document[]; // Added documents field
  startDate: string;
  endDate: string;
  status: string;
  dailyRate: number;
  totalPrice: number;
  contractPath?: string; // Optional contract path
  rentalAgreement?: string; 

}

/** @deprecated use Rental */
export type rental = Rental;

export interface Document {
  name: string;
  image: string;
  uploadedAt: string; // Date as a string
}

  export interface Client {
    firstName: string;
    lastName: string;
    phone?: string;
    email?: string;
  }

export interface RentalFormClient {
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  dateOfBirth?: string;
  address?: string;
  nationality?: string;
  clientID?: string;
  licenceNumber?: string;
  clientLicenseIssued?: string;
}

export interface RentalFormData {
  client: RentalFormClient;
  carId: string;
  departureLocation: string;
  returnLocation: string;
  startDate: string;
  endDate: string;
  dailyRate: number;
  totalPrice: number;
  rentalDuration: number;
  createdAt: string;
  rentalAgreement?: string;
}

  export interface RentalCreationData {
    client: {
      firstName: string;
      lastName: string;
      phone?: string;
      email?: string;
    };
    carId: string;
    startDate: string;
    endDate: string;
    dailyRate: number;
    rentalAgreement?: string;
  }

export interface ContractTemplate {
  _id: string;
  html: string;
  name?: string;
  createdAt?: string;
}