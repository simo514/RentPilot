import { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft, Check, Eye, Upload } from 'lucide-react';
import { PDFViewer} from '@react-pdf/renderer';
import useRentalHistoryStore from '../store/rentalHistoryStore'; // Import the store
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Helper to format date as dd-mm-yyyy hh:mm for any ISO string
function formatDateTime(val: any) {
  if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(val)) {
    const date = new Date(val);
    const pad = (n: number) => n.toString().padStart(2, '0');
    // Always use UTC to match the Z (if present)
    const day = pad(date.getUTCDate());
    const month = pad(date.getUTCMonth() + 1);
    const year = date.getUTCFullYear();
    const hours = pad(date.getUTCHours());
    const minutes = pad(date.getUTCMinutes());
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }
  return val;
}

function RentalSummary() {
  const navigate = useNavigate();
  const { createRental, getTemplate } = useRentalHistoryStore(); // add getTemplate
  const [showPDF, setShowPDF] = useState(false);
  const [showPreview, setShowPreview] = useState<string | null>(null);
  const [rentalData, setRentalData] = useState<any>(null);
  const [car, setCar] = useState<any>(null);
  const [templateHtml, setTemplateHtml] = useState<string | null>(null);

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
      toast.warn("Please upload both Driver's License and ID Card before proceeding.", { position: 'top-right' });
      return;
    }

    try {
      // Always generate the latest populated HTML template before sending
      let agreement = '';
      const template = await getTemplate();
      if (template && template.html) {
        agreement = populateTemplate(template.html, rentalData, car);
        setRentalData((prev: any) => ({
          ...prev,
          rentalAgreement: agreement,
        }));
      }
      await createRental({
        ...rentalData,
        rentalAgreement: agreement,
      });
      navigate('/rentals');
    } catch (error) {
      console.error('Error creating rental:', error);
    }
  };

  // Utility to replace {{field}} in template with value from data objects
  function populateTemplate(template: string, rentalData: any, car: any) {
    if (!template) return '';
    return template.replace(/{{\s*([\w.]+)\s*}}/g, (_, key) => {
      // Support nested keys like client.firstName
      let value = key.split('.').reduce((obj: any, k: string) => (obj ? obj[k] : ''), { ...rentalData, car });
      // Format any ISO date string
      value = formatDateTime(value);
      return value !== undefined && value !== null ? value : '';
    });
  }

  const handleViewAgreement = async () => {
    const template = await getTemplate();
    if (template && template.html) {
      const populatedHtml = populateTemplate(template.html, rentalData, car);
      setTemplateHtml(populatedHtml);
      setShowPDF(false); // Hide PDF if open

      // Add the populated agreement to rentalData
      setRentalData((prev: any) => ({
        ...prev,
        rentalAgreement: populatedHtml, // Save the populated HTML as rentalAgreement
      }));
    } else {
      setTemplateHtml('<p>No template found.</p>');
    }
  };

  const handleDownloadTemplatePdf = () => {
    const element = document.getElementById('template-html-content');
    if (element && templateHtml) {
      // templateHtml is already populated with values
      html2pdf().from(element).set({
        margin: 10,
        filename: 'rental-agreement.pdf',
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }).save();
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Container for notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
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
            <p><span className="font-medium">Name:</span> {rentalData.client.firstName} {rentalData.client.lastName} </p>
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
            <p><span className="font-medium">Start Date:</span> {formatDateTime(rentalData.startDate)}</p>
            <p><span className="font-medium">End Date:</span> {formatDateTime(rentalData.endDate)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Documents</h2>
          <button
            onClick={handleViewAgreement}
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

      {/* Rental Agreement Template Modal */}
      {templateHtml && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col overflow-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">Rental Agreement Template</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadTemplatePdf}
                  className="px-3 py-1 bg-primary-500 text-white rounded hover:bg-primary-600"
                >
                  Download
                </button>
                <button
                  onClick={() => setTemplateHtml(null)}
                  className="text-gray-500 hover:text-gray-700 ml-2"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-auto">
              <div
                id="template-html-content"
                dangerouslySetInnerHTML={{ __html: templateHtml }}
                className="prose max-w-none"
              />
            </div>
          </div>
        </div>
      )}

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