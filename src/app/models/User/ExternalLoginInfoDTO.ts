export interface ExternalLoginInfoDTO {
  email: string;
  fullName?: string;
  provider?: string;
  providerKey?: string;
  newUser?: boolean;
}
