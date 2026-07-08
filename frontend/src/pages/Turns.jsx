import Calendar from '../components/Calendar';

export default function Turns() {
  return <Calendar
    title="Turnos"
    onReload={() => {
      console.log('Reloading turns...');
    }}
    onCreate={(date) => {
      console.log('Creating turn for date:', date);
    }}
  />
}