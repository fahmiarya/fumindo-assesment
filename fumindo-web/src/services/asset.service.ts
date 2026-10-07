import axios from "axios";

export type AssetCategory = "Consumable" | "Non-consumable";

export interface Asset {
  asset_id: number;
  asset_name: string;
  stock_quantity: number;
  category: AssetCategory;
}

export interface CreateAssetPayload {
  asset_name: string;
  stock_quantity: number;
  category: AssetCategory;
}

const api = axios.create({
  baseURL: "http://localhost:3000",
});

export async function getAssets() {
  const response = await api.get<Asset[]>("/assets");

  return response.data;
}

export async function createAsset(payload: CreateAssetPayload) {
  const response = await api.post<Asset>("/assets", payload);

  return response.data;
}

export async function updateAsset(
  id: number,
  payload: Partial<CreateAssetPayload>,
) {
  const response = await api.patch<Asset>(`/assets/${id}`, payload);

  return response.data;
}

export async function deleteAsset(id: number) {
  await api.delete(`/assets/${id}`);
}
