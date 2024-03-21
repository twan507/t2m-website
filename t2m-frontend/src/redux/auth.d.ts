// src/features/authState/sessionTypes.ts
export interface LicenseInfo {
    daysLeft: number | null;
    product: string | null;
    accessLevel: number | null;
}

export interface IUserInfo {
    _id: string | null;
    name: string | null;
    email: string | null;
    phoneNumber: string | null;
    role: string | null;
    affiliateCode: string | null;
    sponsorCode: string | null;
    licenseInfo: LicenseInfo | null;
    permissions: Array<string>;
}

export interface IAuthState {
    access_token: string | null;
    user: IUserInfo | null;
}
