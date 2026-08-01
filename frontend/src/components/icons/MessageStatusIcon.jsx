import { MessageSentIcon, MessageDeliveredIcon, MessageReadIcon,
  MessageWaitingIcon, MessageFailedIcon } from '../icons';
import { formatRelativeDate, formatTime } from '../../utils/datetime.js';

function formatDateIcon(date) {
  return `${formatRelativeDate(date, { article: true }).toLocaleLowerCase()} a las ${formatTime(date)}`;
}

export default function MessageStatusIcon({
  receivedAt,
  sentAt,
  deliveredAt,
  readAt,
  failedAt,
  failMessage,
  sx: sxProp,
}) {
  const sx = {
    marginLeft: .3,
    fontSize: 16,
    verticalAlign: 'text-bottom',
    ...sxProp,
  };

  let message = [`Recibido ${formatDateIcon(receivedAt)}`];
  
  if (sentAt)
    message.push(`Enviado ${formatDateIcon(sentAt)}`);

  if (deliveredAt)
    message.push(`Entregado ${formatDateIcon(deliveredAt)}`);

  if (readAt)
    message.push(`Leído ${formatDateIcon(readAt)}`);
  
  if (failedAt) {
    message.push(`Fallido ${formatDateIcon(failedAt)}`);
    if (failMessage)
      message.push(`Motivo: ${failMessage}`);
  } else if (!sentAt) {
    message.push('Preparando envío...');
  }

  const title = message.map((m, i) => <div key={i}>{m}</div>);

  if (failedAt)
    return <MessageFailedIcon sx={sx} title={title} />;

  if (readAt)
    return <MessageReadIcon sx={sx} title={title} />;

  if (deliveredAt)
    return <MessageDeliveredIcon sx={sx} title={title} />;

  if (sentAt)
    return <MessageSentIcon sx={sx} title={title} />;

  return <MessageWaitingIcon sx={sx} title={title} />;
}