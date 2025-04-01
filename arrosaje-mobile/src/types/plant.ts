export interface Plant {
    id: number;
name: string;
location: string;
care_instructions?: string;
photo_url?: string;
owner: User;
created_at: string;
in_care: boolean;
plant_sitting?: number;
}

export interface PlantCreate {
name: string;
location: string;
care_instructions?: string;
photo?: any; // Pour les fichiers photo
}

export interface PlantUpdate {
name?: string;
location?: string;
care_instructions?: string;
photo?: any;
in_care_id?: number;
}
