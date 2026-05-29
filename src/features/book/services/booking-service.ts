import { api } from "@/lib/axios";
import { ResponseData } from "@/lib/type";

export type BookingCreateRequest = {
  rentable_id: string;
  property_id: string;
  check_in: string;
  check_out: string;
  quantity: number;
  guest_count: number;
  first_payment?: string;
  phone_number: string;
};

export type BookingResponse = {
  id: string;
  user_id: string;
  property_id: string;
  rentable_id: string;
  quantity: number;
  guest_count: number;
  check_in: string;
  check_out: string;
  total_night: number;
  total_price: number;
  discount: number;
  status: string;
  payment_status: string;
  first_payment?: string;
  created_at: number;
  updated_at: number;
};

export const getBookingById = async (
  id: string,
): Promise<ResponseData<BookingResponse>> => {
  const response = await api.get(`bookings/${id}`);
  if (response.status !== 200) {
    throw new Error(response.data?.message || "Booking tidak ditemukan");
  }
  return response.data;
};

export const createBooking = async (
  req: BookingCreateRequest,
): Promise<ResponseData<BookingResponse>> => {
  const response = await api.post("bookings", req);

  if (response.status !== 201) {
    throw new Error(response.data?.message || "Booking gagal");
  }

  return response.data;
};

export const getMyBookings = async (): Promise<ResponseData<BookingResponse[]>> => {
  const response = await api.get("bookings/my");
  if (response.status !== 200) {
    throw new Error(response.data?.message || "Gagal mengambil riwayat booking");
  }
  return response.data;
};

export type PaymentInfoResponse = {
  invoice_no: string;
  amount: number;
  status: string;
  payment_url: string;
} | null;

export type CreatePaymentResponse = {
  payment_url: string;
  invoice_no: string;
};

export const getPaymentByBooking = async (
  bookingId: string,
): Promise<ResponseData<PaymentInfoResponse>> => {
  const response = await api.get(`bookings/${bookingId}/payment`);
  if (response.status !== 200) {
    throw new Error(response.data?.message || "Gagal mengambil info pembayaran");
  }
  return response.data;
};

export const createPayment = async (
  bookingId: string,
): Promise<ResponseData<CreatePaymentResponse>> => {
  const response = await api.post(`bookings/${bookingId}/pay`);
  if (response.status !== 200) {
    throw new Error(response.data?.message || "Gagal membuat link pembayaran");
  }
  return response.data;
};
