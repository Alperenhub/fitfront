export interface ITrainerCodeResponse {
  id: number;
  code: string;
  durationInMonths: number;
  quota: number;
  isUsed: boolean;
  createdAt: string;
  expiresAt?: string | null;

  // 🔹 Trainer kodunu kullanan öğrenciler
  students?: IStudentResponse[];
}

// Öğrenci bilgisi
export interface IStudentResponse {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
}

export interface IGenerateCode {
  durationInMonths: number;
  quota: number;
}

export interface IUpdateCode {
  durationInMonths: number;
  quota: number;
}
