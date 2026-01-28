export const mapBookingToCalendarEvent = (booking, resource) => ({
  summary: `${booking.title} - ${resource?.name || 'Resource'}`,
  description: `${booking.description || ''}\nResource: ${resource?.name || 'N/A'}`,
  start: {
    dateTime: booking.start_time,
    timeZone: 'UTC',
  },
  end: {
    dateTime: booking.end_time,
    timeZone: 'UTC',
  },
});