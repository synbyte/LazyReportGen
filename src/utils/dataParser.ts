/**
 * Parse input data in the specified format:
 * 
 * [Client Name]
 * Row Count
 * [Row Count Number]
 * Service Date ↓ Service Category ↓ Service ↓ Description ↓
 * [Date] [Category] [Service] [Description]
 * ...
 */
export function OLDparseInputData(input: string) {
  const lines = input.split('\n').filter(line => line.trim() !== '');
  const clients = [];
  
  let currentIndex = 0;
  
  while (currentIndex < lines.length) {
    // Get client name
    const clientName = lines[currentIndex++].trim();
    
    // Skip "Row Count" line
    if (lines[currentIndex].trim().toLowerCase() === 'row count') {
      currentIndex++;
    }
    
    // Get row count
    const rowCount = parseInt(lines[currentIndex++], 10);
    
    // Skip header line
    currentIndex++;
    
    // Parse service rows
    const services = [];
    for (let i = 0; i < rowCount; i++) {
      if (currentIndex < lines.length) {
        const serviceData = lines[currentIndex++].split('\t');
        
        services.push({
          date: serviceData[0]?.trim() || '',
          category: serviceData[1]?.trim() || '',
          service: serviceData[2]?.trim() || '',
          description: serviceData[3]?.trim() || ''
        });
      }
    }
    
    clients.push({
      name: clientName,
      rowCount,
      services
    });
  }
  
  return { clients };
}

export function parseInputData(input: string) {
  const lines = input.split('\n');
  const clients = [];
  let currentIndex = 0;
  
  function isClientName(line: string): boolean {
    return /^[A-Za-z]+,\s+[A-Za-z]+$/.test(line.trim());
  }
  
  function isDatePattern(text: string): boolean {
    return /^\d{2}\/\d{2}\/\d{4}/.test(text.trim());
  }

  while (currentIndex < lines.length) {
    const currentLine = lines[currentIndex].trim();
    
    // Check if this line is a client name
    if (isClientName(currentLine)) {
      const clientName = currentLine;
      currentIndex++;
      
      // Skip "Row Count" line
      if (currentIndex < lines.length && lines[currentIndex].trim().toLowerCase() === 'row count') {
        currentIndex++;
        
        // Skip the actual count number
        if (currentIndex < lines.length && /^\d+$/.test(lines[currentIndex].trim())) {
          currentIndex++;
        }
      }
      
      // Skip header line (contains Service Date, Category, etc.)
      while (currentIndex < lines.length && 
             !isDatePattern(lines[currentIndex]) && 
             !isClientName(lines[currentIndex])) {
        currentIndex++;
      }
      
      const services = [];
      
      // Process service entries for this client
      while (currentIndex < lines.length && !isClientName(lines[currentIndex])) {
        const serviceLine = lines[currentIndex].trim();
        
        // If line starts with a date, it's a new service entry
        if (isDatePattern(serviceLine)) {
          // Split the line by tabs or multiple spaces
          const parts = serviceLine.split(/\t+|\s{2,}/);
          
          // Create initial service entry
          const serviceEntry: { [key: string]: string } = {
            date: parts[0] || '',
            category: parts[1] || '',
            service: parts[2] || '',
            description: parts.slice(3).join(' ') || ''
          };
          
          // Move to the next line to check for continuation
          currentIndex++;
          
          // Collect continuation lines (lines that don't start with a date and aren't a new client)
          while (currentIndex < lines.length && 
                 !isDatePattern(lines[currentIndex]) && 
                 !isClientName(lines[currentIndex])) {
            const continuationLine = lines[currentIndex].trim();
            
            if (continuationLine !== '') {
              // Try to determine which field this continuation belongs to
              const parts = continuationLine.split(/\t+|\s{2,}/);
              
              if (parts.length > 1) {
                // If there are multiple parts, this could be a continuation with structure
                if (!serviceEntry.category && parts[0]) {
                  serviceEntry.category = parts[0];
                  serviceEntry.service = parts[1] || serviceEntry.service;
                  serviceEntry.description = parts.slice(2).join(' ') || serviceEntry.description;
                } else {
                  // Just append to description if we can't determine structure
                  serviceEntry.description += ' ' + continuationLine;
                }
              } else {
                // If there's just one part, append to description
                serviceEntry.description += ' ' + continuationLine;
              }
            }
            
            currentIndex++;
          }
          
          // Clean up the service entry
          Object.keys(serviceEntry).forEach(key => {
            serviceEntry[key] = serviceEntry[key].trim();
          });
          
          services.push(serviceEntry);
        } else {
          // Skip non-service lines
          currentIndex++;
        }
      }
      
      clients.push({
        name: clientName,
        rowCount: services.length,
        services
      });
    } else {
      currentIndex++;
    }
  }
  
  return { clients };
}





