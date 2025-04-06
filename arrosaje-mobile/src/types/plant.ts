// src/types/plant.ts - Version améliorée

export interface User {
    id: number;
    email: string;
    username: string;
    phone: string;
    is_active: boolean;
    is_botanist: boolean;
  }
  
  export interface Plant {
    id: number;
    name: string;
    location: string;
    care_instructions?: string;
    photo_url?: string;
    owner: User;
    created_at: string;
    in_care: boolean;
    plant_sitting?: number | null;
  }
  
  export interface PlantCreate {
    name: string;
    location: string;
    care_instructions?: string;
    photo?: any; // Pour les fichiers photo depuis ImagePicker
  }
  
  export interface PlantUpdate {
    name?: string;
    location?: string;
    care_instructions?: string;
    photo?: any;
    in_care_id?: number;
  }