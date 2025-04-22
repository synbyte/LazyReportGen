import * as XLSX from 'xlsx';

interface Client {
  name: string;
  rowCount: number;
  services: Array<{
    date: string;
    category: string;
    service: string;
    description: string;
  }>;
}

interface Data {
  clients: Client[];
}

export async function generateExcel(data: Data) {
  const XLSX = await import('xlsx');
  const workbook = XLSX.utils.book_new();

  // Create a single worksheet for all data
  const worksheetData = [
    ['COURT Pier360 Groups and Activities summary for DATE docket'], // Empty row 1
    [], // Empty row 2
    ['Name', '', 'Date', '', 'Description'] // Headers in row 3
  ];

  // Process all clients and their services
  data.clients.forEach((client, clientIndex) => {
    // Add empty row between clients (except for the first client after headers)
    if (clientIndex > 0) {
      worksheetData.push([]);
    }

    // Swap Lastname, Firstname to Firstname Lastname
    const [lastName, firstName] = client.name.split(', ');
    const fullName = `${firstName} ${lastName}`;

    client.services.forEach(service => {
      let description = service.description;
      
      // Handle different categories
      if (service.category === 'Group') {
        description = service.description || service.service;
      } else if (service.category === 'Activity') {
        description = service.description;
      } else {
        // For Peer Support and Center Participation, use category
        description = service.category;
      }

      worksheetData.push([
        fullName,
        '',
        service.date,
        '',
        description
      ]);
    });
  });

  // Create the worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Set column widths
  const columnWidths = [
    { wch: 30 }, // Name
    { wch: 5 },  // Empty column
    { wch: 15 }, // Date
    { wch: 5 },  // Empty column
    { wch: 50 }  // Description
  ];
  worksheet['!cols'] = columnWidths;

  // Define header style
  const headerStyle = {
    font: {
      bold: true,
      underline: {
        type: 'single'
      }
    }
  };

  // Apply styles to header cells
  worksheet['A3'] = { v: 'Name', t: 's', s: headerStyle };
  worksheet['C3'] = { v: 'Date', t: 's', s: headerStyle };
  worksheet['E3'] = { v: 'Description', t: 's', s: headerStyle };

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Service Data');

  // Write the workbook and trigger download
  XLSX.writeFile(workbook, 'service_data.xlsx');
}
