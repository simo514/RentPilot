import { useState, useEffect} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft, Check, Eye, Upload } from 'lucide-react';
import { PDFViewer, Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import useRentalHistoryStore from '../store/rentalHistoryStore'; // Import the store


const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
});

const RentalDocument = ({ data }: { data: any}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Rental Agreement</Text>
      
      <View style={styles.section}>
        <Text style={styles.heading}>Client Information</Text>
        <Text style={styles.text}>Name: {data.client.firstName} {data.client.lastName}</Text>
        <Text style={styles.text}>Phone: {data.client.phone}</Text>
        <Text style={styles.text}>Email: {data.client.email}</Text>
      </View>
{/* 
      <View style={styles.section}>
        <Text style={styles.heading}>Vehicle Details</Text>
        <Text style={styles.text}>Car: {data.make} {data.model}</Text>
        <Text style={styles.text}>Matricule: {data.matricule}</Text>
      </View> */}

      <View style={styles.section}>
        <Text style={styles.heading}>Rental Period</Text>
        <Text style={styles.text}>Start Date: {data.startDate}</Text>
        <Text style={styles.text}>End Date: {data.endDate}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Payment Details</Text>
        <Text style={styles.text}>Daily Rate: ${data.dailyRate}</Text>
        <Text style={styles.text}>Total Price: ${data.totalPrice}</Text>
      </View>
    </Page>
  </Document>
);

function RentalSummary() {
  const location = useLocation();
  const navigate = useNavigate();
  const { createRental } = useRentalHistoryStore(); // Access the createRental method
  const [showPDF, setShowPDF] = useState(false);
  const [showPreview, setShowPreview] = useState<string | null>(null);
  const [rentalData, setRentalData] = useState<any>(null);
  const [car, setCar] = useState<any>(null);
  const [documents, setDocuments] = useState({
    driverLicense: null as File | null,
    idCard: null as File | null,
  });


  useEffect(() => {
    const storedData = localStorage.getItem('rentalSummary');
    if (storedData) {
      setRentalData(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    const cars = localStorage.getItem('car');
    if (cars) {
      setCar(JSON.parse(cars));
    }
  }, []);

  if (!rentalData) {
    return <p>No rental data found.</p>;
  }

  const handleFileUpload = (type: 'driverLicense' | 'idCard', file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string; // Save as Base64 string
      setRentalData((prev: any) => ({
        ...prev,
        documents: [
          ...(prev.documents || []), // Ensure documents array is initialized
          {
            name: type === 'driverLicense' ? "Driver License" : "ID Card",
            image: base64,
            uploadedAt: new Date().toISOString(),
          },
        ],
      }));
    };
    reader.readAsDataURL(file);
  };

  const handlePreview = (type: 'driverLicense' | 'idCard') => {
    const document = rentalData.documents?.find(
      (doc: any) => doc.name === (type === 'driverLicense' ? "Driver License" : "ID Card")
    );
    if (document) {
      setShowPreview(document.image); // Directly use the base64 data as the preview URL
    } else {
      console.error('Document not found for preview');
    }
  };
  const handleCreateRental = async () => {
    if (!rentalData.documents?.find((doc: any) => doc.name === "Driver License") || !rentalData.documents?.find((doc: any) => doc.name === "ID Card")) {
      alert('Please upload both Driver\'s License and ID Card before proceeding.');
      return;
    }

    try {
      await createRental(rentalData); // Pass the updated rentalData directly
      navigate('/rentals'); // Navigate to the rental history page
    } catch (error) {
      console.error('Error creating rental:', error);
      alert('Failed to create rental. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Rental Summary</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Client Information</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Name:</span> {rentalData.client.firstName}</p>
            <p><span className="font-medium">Phone:</span> {rentalData.client.phone}</p>
            <p><span className="font-medium">Email:</span> {rentalData.client.email}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Vehicle Details</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Selected Car:</span> {car.make} {car.model}
              <span className="block text-xs text-gray-500">Matricule: {car.matricule}</span> {/* Added matricule */}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Rental Period</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Start Date:</span> {rentalData.startDate}</p>
            <p><span className="font-medium">End Date:</span> {rentalData.endDate}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Documents</h2>
          <button
            onClick={() => setShowPDF(true)}
            className="flex items-center text-primary-600 hover:text-primary-700"
          >
            <FileText className="h-5 w-5 mr-2" />
            View Rental Agreement
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 w-full">
        <h2 className="text-xl font-semibold mb-6">Required Documents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Driver's License</h3>
            <div className="flex items-center space-x-4">
              <label className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload('driverLicense', file);
                  }}
                />
                <div className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                  <Upload className="h-5 w-5 mr-2 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {rentalData.documents?.find((doc: any) => doc.name === "Driver License") ? "Driver License Uploaded" : "Upload Driver's License"}
                  </span>
                </div>
              </label>
              {rentalData.documents?.find((doc: any) => doc.name === "Driver License") && (
                <button
                  onClick={() => handlePreview('driverLicense')}
                  className="p-2 text-primary-600 hover:text-primary-700"
                >
                  <Eye className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">ID Card</h3>
            <div className="flex items-center space-x-4">
              <label className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload('idCard', file);
                  }}
                />
                <div className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                  <Upload className="h-5 w-5 mr-2 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {rentalData.documents?.find((doc: any) => doc.name === "ID Card") ? "ID Card Uploaded" : "Upload ID Card"}
                  </span>
                </div>
              </label>
              {rentalData.documents?.find((doc: any) => doc.name === "ID Card") && (
                <button
                  onClick={() => handlePreview('idCard')}
                  className="p-2 text-primary-600 hover:text-primary-700"
                >
                  <Eye className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={handleCreateRental} // Call the handleCreateRental function
          className="flex items-center px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Check className="h-5 w-5 mr-2" />
          Create Rental
        </button>
      </div>

      {showPDF && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">Rental Agreement</h2>
              <button
                onClick={() => setShowPDF(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="flex-1 p-4">
              <PDFViewer style={{ width: '100%', height: '100%' }}>
                <RentalDocument data={rentalData} />
              </PDFViewer>
            </div>
          </div>
        </div>
      )}

      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">Document Preview</h2>
              <button
                onClick={() => setShowPreview(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="flex-1 p-4 flex justify-center items-center">
              <img src={showPreview} alt="Document Preview" className="max-h-full max-w-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RentalSummary;