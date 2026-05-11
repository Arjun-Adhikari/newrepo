import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function StudentContactQR ({ student }) {
  const generateVCard = () => {
    // Mapping the Sequelize model fields to the vCard format
    const vcard = `BEGIN:VCARD
VERSION:3.0
N:${student.last_name};${student.first_name};;;
FN:${student.first_name} ${student.last_name}
ORG:Class ${student.class}
ADR;TYPE=HOME:;;${student.address};;;;
NOTE:Student ID: ${student.student_id} | School ID: ${student.school_id}
END:VCARD`;

    return vcard;
  };

  return (
    <div className="flex flex-col items-center p-4 border rounded shadow-sm bg-white">
      <h3 className="text-lg font-semibold mb-4">Scan Student ID</h3>
      <QRCodeSVG 
        value={generateVCard()} 
        size={200} 
        level="M" 
        includeMargin={true}
      />
      <div className="mt-4 text-center">
        <p className="text-sm font-medium text-gray-700">
          {student.first_name} {student.last_name}
        </p>
        <p className="text-xs text-gray-500">
          Class: {student.class} | ID: {student.student_id}
        </p>
      </div>
    </div>
  );
};
