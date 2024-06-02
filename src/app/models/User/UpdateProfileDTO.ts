export interface UpdateProfileDTO {
  fullName: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
  verificationCode: string;
}
