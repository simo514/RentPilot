export interface Car {
    _id: string;
    make: string;
    model: string;
    year: string;
    matricule: string;
    image: string;
    available: boolean;
  }
  export interface rental {
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
}

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
    documents?: {
      name: string;
      image: string;
      uploadedAt: string; // Date as a string
    }[]; 

  }