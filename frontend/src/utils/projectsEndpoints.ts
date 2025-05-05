import { api, apiWithoutAuth } from "./axios";

export interface Project {
    id: number;
    name: string;
    img: string | null;
    causes: string[];
    target: string;
    campaign_limit: number;
    city: string;
    country: string;
    description: string;
    status: string;
    donation_percentage: number;
}

interface UserBeneficiary {
    assignable_type: "User";
    assignable_id: number;
    beneficiary: {
        first_name: string;
        last_name: string;
        name: string;
        email: string;
        img: string | null;
        is_group_leader: boolean;
    };
}

interface GroupBeneficiary {
    assignable_type: "UserGroup";
    assignable_id: number;
    beneficiary: {
        name: string;
        img: string | null;
        interest: string;
    };
}

export type ProjectBeneficiary = UserBeneficiary | GroupBeneficiary;

export const fetchAllProjects = async (): Promise<Project[]> => {
    try {
        const response = await api.get<Project[]>('/projects/');
        console.log("fetch projects: ", response.data);
        return response.data;
    } catch (error: any) {
        console.error(
            "Failed to fetch projects:",
            error.response?.data || error.message
        );
        throw error;
    }
}

export const fetchProjectById = async (projectId: number): Promise<Project> => {
    try {
        const response = await api.get<Project>(`/projects/${projectId}`);
        console.log("fetch project by Id: ", response.data);
        return response.data;
    } catch (error: any) {
        console.error(
            "Failed to fetch project:",
            error.response?.data || error.message
        );
        throw error;
    }
}

export const updateProject = async (projectId: number, body: Partial<Project>): Promise<Project> => {
    try {
        const response = await api.patch<Project>(`/projects/${projectId}/`, body);
        console.log('patch project: ', response.data)
        return response.data;
    } catch (error: any) {
        console.error(
            "Failed to patch project:",
            error.response?.data || error.message
        );
        throw error;
    }
}

export const fetchProjectBeneficiaries = async (projectId: number) => {
    try {
        const response = await api.get<ProjectBeneficiary[]>(`/projects/${projectId}/assignments/`)
        console.log('fetch project beneficiaries: ', response.data)
        return response.data
    } catch (error: any) {
        console.error(
            "Failed to fetch project beneficiaries:",
            error.response?.data || error.message
        );
        throw error;
    }
}