import type { CreateBookingInput, BookingDto } from 'shared-types';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://api:3001') + '/api';

export const createBooking = async (data: CreateBookingInput): Promise<BookingDto> => {
  const response = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Authorization will be handled by a middleware/interceptor if implemented, 
      // but for now let's assume it's passed or handled by cookies.
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al crear la reserva');
  }

  return response.json();
};

export const getMyBookings = async (customerId: string): Promise<BookingDto[]> => {
  const response = await fetch(`${API_URL}/bookings?customerId=${customerId}`);
  
  if (!response.ok) {
    throw new Error('Error al obtener las reservas');
  }

  return response.json();
};
