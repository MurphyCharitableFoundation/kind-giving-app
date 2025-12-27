import Cause from "../../../interfaces/Cause";


export interface CreateProjectFormData {
    name: string;
    img: string | null;
    causes: Cause[];
    target: number;
    campaign_limit: number;
    city: string;
    country: string;
    description: string;
    status: string;
}