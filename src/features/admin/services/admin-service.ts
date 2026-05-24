import { BookingResponse } from "@/features/book/services/booking-service";
import { Experience } from "@/features/experiences/schemas/experience-schema";
import { api } from "@/lib/axios";
import { ResponseData } from "@/lib/type";

export type AmenityRequest = {
  name: string;
  icon: string;
  category: string;
};

export type AmenityResponse = {
  id: string;
  name: string;
  icon: string;
  category: string;
  created_at: number;
  updated_at: number;
};

export type ExperienceImageInput = {
  image_url: string;
  is_primary: boolean;
};

export type ExperienceCreateRequest = {
  title: string;
  address: string;
  description: string;
  experience_type: string;
  base_price: number;
  lat?: number;
  lng?: number;
  thumbnail_url?: string;
  images?: ExperienceImageInput[];
};

export const uploadImages = async (files: File[]): Promise<string[]> => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  const response = await api.post("/uploads", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  if (response.status !== 200 && response.status !== 201) {
    throw new Error(response.data?.message ?? "Gagal upload gambar");
  }
  return response.data.data.urls as string[];
};

export type HostCreateRequest = {
  name: string;
  email: string;
  phone_number: string;
  profile_picture_url?: string;
  address?: string;
  bank_account_name?: string;
  bank_account_number?: string;
  ktp_number?: string;
  bio?: string;
};

export type PropertyCreateRequest = {
  experience_id: string;
  host_id?: string;
  host?: HostCreateRequest;
  property_type: string;
  booking_type: string;
  amenity_ids?: string[];
};

export type PropertyResponse = {
  id: string;
  property_type: string;
  booking_type: string;
  created_at: number;
  updated_at: number;
};

export type RentableCreateRequest = {
  property_id: string;
  type: string;
  name: string;
  image_url?: string;
  capacity: number;
  base_price: number;
  discount?: number;
  stock: number;
  amenity_ids?: string[];
};

export const getAdminAllBookings = async (): Promise<
  ResponseData<BookingResponse[]>
> => {
  const response = await api.get("/admin/bookings");
  if (response.status !== 200) throw new Error(response.data?.message);
  return response.data;
};

export const adminConfirmBooking = async (
  id: string,
): Promise<ResponseData<BookingResponse>> => {
  const response = await api.patch(`/admin/bookings/${id}/confirm`, {
    status: "WAITING_PAYMENT",
  });
  if (response.status !== 200) throw new Error(response.data?.message);
  return response.data;
};

export const adminCheckoutBooking = async (
  id: string,
): Promise<ResponseData<BookingResponse>> => {
  const response = await api.patch(`/admin/bookings/${id}/checkout`);
  if (response.status !== 200) throw new Error(response.data?.message);
  return response.data;
};

export const adminCompleteBooking = async (
  id: string,
): Promise<ResponseData<BookingResponse>> => {
  const response = await api.patch(`/admin/bookings/${id}/done`);
  if (response.status !== 200) throw new Error(response.data?.message);
  return response.data;
};

export const getAmenities = async (): Promise<
  ResponseData<AmenityResponse[]>
> => {
  const response = await api.get("/amenities");
  if (response.status !== 200) throw new Error(response.data?.message);
  return response.data;
};

export const createAmenity = async (
  req: AmenityRequest,
): Promise<ResponseData<AmenityResponse>> => {
  const response = await api.post("/amenities", req);
  if (response.status !== 201) throw new Error(response.data?.message);
  return response.data;
};

export const createExperience = async (
  req: ExperienceCreateRequest,
): Promise<ResponseData<Experience>> => {
  const response = await api.post("/experiences", req);
  if (!response.data?.success) throw new Error(response.data?.message ?? "Gagal membuat experience");
  return response.data;
};

export const createProperty = async (
  req: PropertyCreateRequest,
): Promise<ResponseData<PropertyResponse>> => {
  const response = await api.post("/properties", req);
  if (!response.data?.success) throw new Error(response.data?.message ?? "Gagal membuat property");
  return response.data;
};

export const createRentable = async (
  req: RentableCreateRequest,
): Promise<ResponseData<unknown>> => {
  const response = await api.post("/rentables", req);
  if (!response.data?.success) throw new Error(response.data?.message ?? "Gagal membuat rentable");
  return response.data;
};

export const setPropertyAmenities = async (
  propertyId: string,
  amenityIds: string[],
): Promise<ResponseData<unknown>> => {
  const response = await api.put(`/properties/${propertyId}/amenities`, {
    amenity_ids: amenityIds,
  });
  if (response.status !== 200) throw new Error(response.data?.message);
  return response.data;
};

export const setRentableAmenities = async (
  rentableId: string,
  amenityIds: string[],
): Promise<ResponseData<unknown>> => {
  const response = await api.put(`/rentables/${rentableId}/amenities`, {
    amenity_ids: amenityIds,
  });
  if (response.status !== 200) throw new Error(response.data?.message);
  return response.data;
};
