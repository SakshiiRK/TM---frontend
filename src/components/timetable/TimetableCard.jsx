import React from 'react';
import Card from '../ui/Card';

const TimetableCard = ({ slot }) => (
  <Card>
    <p><strong>Time:</strong> {slot.time}</p>
    <p><strong>Subject:</strong> {slot.subject}</p>
    <p><strong>Faculty:</strong> {slot.faculty}</p>
    <p><strong>Room:</strong> {slot.room}</p>
  </Card>
);

export default TimetableCard;
