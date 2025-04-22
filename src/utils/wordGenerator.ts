import { Document, Paragraph, TextRun, UnderlineType, Packer, SectionType } from 'docx';
import { saveAs } from 'file-saver';

interface Service {
  date: string;
  category: string;
  service: string;
  description: string;
}

interface Client {
  name: string;
  rowCount: number;
  services: Service[];
}

interface Data {
  clients: Client[];
}

interface ParticipantDate {
  name: string;
  date: string;
}

function formatName(name: string): string {
  const [last, first] = name.split(',').map(s => s.trim());
  return `${first} ${last}`;
}

export async function generateWord(data: Data) {
  const serviceGroups = new Map<string, ParticipantDate[]>();

  data.clients.forEach(client => {
    client.services.forEach(service => {
      let description = service.description;

      if (service.category === 'Group') {
        description = service.description || service.service;
      } else if (service.category === 'Activity') {
        description = service.description;
      } else {
        description = service.category;
      }

      const isInlineDate = ['Peer Support', 'Center Participation', 'Community Service', 'Volunteer'].includes(service.category);
      const key = isInlineDate ? description : `${description}__${service.date}`;

      if (!serviceGroups.has(key)) {
        serviceGroups.set(key, []);
      }

      const dateParts = service.date.split('/');
      const formattedDate = `${dateParts[0]}/${dateParts[1]}`;

      serviceGroups.get(key)?.push({
        name: formatName(client.name),
        date: formattedDate
      });
    });
  });

  const allParagraphs = Array.from(serviceGroups.entries()).flatMap(([key, participants]) => {
    const [description, date] = key.includes('__') ? key.split('__') : [key, null];
    const headerText = date ? `${description} (${date})` : description;

    const activityHeader = new Paragraph({
      children: [
        new TextRun({
          text: headerText,
          bold: true,
          underline: { type: UnderlineType.SINGLE },
          font: 'Calibri',
          size: 22
        })
      ],
      spacing: { after: 200 }
    });

    const participantParagraphs = participants.map(participant =>
      new Paragraph({
        children: [
          new TextRun({
            text: key.includes('__') ? participant.name : `${participant.name} ${participant.date}`,
            font: 'Calibri',
            size: 22
          })
        ],
        spacing: { after: 100 }
      })
    );

    const spacingParagraph = new Paragraph({
      children: [new TextRun({ text: "", font: 'Calibri', size: 22 })],
      spacing: { after: 400 }
    });

    return [activityHeader, ...participantParagraphs, spacingParagraph];
  });

  const half = Math.ceil(allParagraphs.length / 2);
  const column1 = allParagraphs.slice(0, half);
  const column2 = allParagraphs.slice(half);

  const headerRow = new Paragraph({
    alignment: "center",
    children: [
      new TextRun({
        text: "DC/DOSA Court Report    4/9/2025 – 4/15/2025",
        bold: true,
        size: 28,
        font: "Calibri"
      })
    ],
    spacing: { after: 400 }
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          type: SectionType.CONTINUOUS
        },
        children: [headerRow]
      },
      {
        properties: {
          type: SectionType.CONTINUOUS,
          column: {
            space: 708,
            count: 2
          }
        },
        children: [...column1, ...column2]
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, 'service_data.docx');
}
