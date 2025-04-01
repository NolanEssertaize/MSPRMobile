export interface Comment {
    id: number;
plant_id: number;
user_id: number;
comment: string;
time_stamp: string;
}

export interface CommentCreate {
plant_id: number;
comment: string;
}

export interface CommentUpdate {
comment_text: string;
}
