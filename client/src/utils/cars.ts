export interface Car {
    _id: string;
    make: string;
    model: string;
    year: string;
    matricule: string;
    image: string;
    available: boolean;
  }
  export interface rental{
    _id: string;
    car: Car;
    client: Client;
    startDate: string;
    endDate: string;
    status: string;
    dailyRate: number;
    totalPrice: number;
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
  }