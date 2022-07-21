export interface Challenge { 
    challenge_id: number;
    category: string;
    title: string;
    description: string;
    is_public: boolean;
    is_this_user_had_already: boolean;
    // created_at
    // updated_at
}