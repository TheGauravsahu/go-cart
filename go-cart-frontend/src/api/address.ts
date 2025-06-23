import { AddAddressValues } from "@/pages/Profile/Addresses/AddAddress";
import { Address } from "@/types/address.types";
import { ApiResponse } from "@/types/apiRes.types";
import { api } from "@/utils/axios";

export const listAddresses = async (): Promise<
  ApiResponse<{ addresses: Address[] }>
> => {
  const res = await api.get("/users/address/");
  return res.data;
};

export const getAddressById = async (
  addrId: string
): Promise<ApiResponse<Address>> => {
  const res = await api.get("/users/address/" + addrId);
  return res.data;
};

export const addAddress = async (addrData: AddAddressValues) => {
  const res = await api.post("/users/address/", addrData);
  return res.data;
};

export const editAddress = async (
  addrId: string,
  addrData: AddAddressValues
) => {
  const res = await api.put("/users/address/" + addrId, addrData);
  return res.data;
};

export const deleteAddress = async (
  addrId: string
): Promise<ApiResponse<string>> => {
  const res = await api.delete("/users/address/" + addrId);
  return res.data;
};
