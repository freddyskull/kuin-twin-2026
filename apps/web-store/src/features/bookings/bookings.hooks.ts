import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createBooking, getMyBookings } from './bookings.api';
import { CreateBookingInput } from 'shared-types';

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookingInput) => createBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

export const useMyBookings = (customerId: string) => {
  return useQuery({
    queryKey: ['bookings', customerId],
    queryFn: () => getMyBookings(customerId),
    enabled: !!customerId,
  });
};
