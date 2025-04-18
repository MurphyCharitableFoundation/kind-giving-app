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
        console.log('body da request: ', body)
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