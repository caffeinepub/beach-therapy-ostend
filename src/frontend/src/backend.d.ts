import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface PricingPackage {
    id: string;
    duration: string;
    name: string;
    description: string;
    highlighted: boolean;
    bulletPoints: Array<string>;
    price: number;
}
export interface ContactFormSubmission {
    id: string;
    name: string;
    email: string;
    message: string;
    timestamp: Time;
    phone?: string;
}
export type Time = bigint;
export interface CVEntry {
    id: string;
    title: string;
    yearRange: string;
    type: CVType;
    description: string;
    organization: string;
}
export interface TherapistProfile {
    bio: string;
    tagline: string;
    name: string;
    photo: Uint8Array;
}
export interface SessionContentItem {
    id: string;
    title: string;
    description: string;
    iconName: string;
}
export interface UserProfile {
    name: string;
}
export enum CVType {
    education = "education",
    experience = "experience",
    certification = "certification"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addOrUpdateCVEntry(entry: CVEntry): Promise<void>;
    addOrUpdatePricingPackage(pkg: PricingPackage): Promise<void>;
    addOrUpdateSessionContentItem(item: SessionContentItem): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteCVEntry(id: string): Promise<void>;
    deletePricingPackage(id: string): Promise<void>;
    deleteSessionContentItem(id: string): Promise<void>;
    getAllCVEntries(): Promise<Array<CVEntry>>;
    getAllContactFormSubmissions(): Promise<Array<ContactFormSubmission>>;
    getAllPricingPackages(): Promise<Array<PricingPackage>>;
    getAllSessionContentItems(): Promise<Array<SessionContentItem>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getTherapistProfile(): Promise<TherapistProfile>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    seedSampleData(): Promise<void>;
    submitContactForm(name: string, email: string, phone: string | null, message: string): Promise<void>;
    updateProfilePhoto(blob: ExternalBlob): Promise<void>;
    updateTherapistProfile(profile: TherapistProfile): Promise<void>;
}
