// services/trainerCodeService.ts
import api from "../utils/api";
import type { ITrainerCodeResponse } from "../Interfaces/ITrainerCode"

export async function validateTrainerCode(code: string) {
  const response = await api.post<ITrainerCodeResponse>("/TrainerCode/validate", { code });
  return response.data;
}
