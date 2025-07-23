import { IPaginatedResponse } from "../interfaces/Pagination";
import { api } from "./axios";

export interface Cause {
  id: number;
  name: string;
  description: string;
  icon: string | null;
}

export interface Project {
  id: number;
  name: string;
  img: string | null;
  causes: Cause[] | string[];
  target: string;
  campaign_limit: number;
  city: string;
  country: string;
  description: string;
  status: string;
  donation_percentage: number;
}

export interface UserBeneficiary {
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

export interface GroupBeneficiary {
  assignable_type: "UserGroup";
  assignable_id: number;
  beneficiary: {
    name: string;
    img: string | null;
    interest: string;
  };
}

export interface ProjectCampaign {
  id: number;
  created: string;
  modified: string;
  title: string;
  description: string;
  target_currency: string;
  target: number;
  end_date: string;
  img: string | null;
  project: number;
  owner: number;
}

export type ProjectBeneficiary = UserBeneficiary | GroupBeneficiary;

export const fetchAllProjects = async (params: { limit?: number; offset?: number }): Promise<IPaginatedResponse<Project>> => {
    try {
        const response = await api.get<IPaginatedResponse<Project>>('/projects/', {params});
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
    return response.data;
  } catch (error: any) {
    console.error(
      "Failed to fetch project:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateProject = async (
  projectId: number,
  body: Partial<Project>
): Promise<Project> => {
  try {
    const response = await api.patch<Project>(`/projects/${projectId}/`, body);
    return response.data;
  } catch (error: any) {
    console.error(
      "Failed to patch project:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchProjectBeneficiaries = async (projectId: number) => {
  try {
    const response = await api.get<ProjectBeneficiary[]>(
      `/projects/${projectId}/assignments/`
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Failed to fetch project beneficiaries:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchProjectCampaigns = async (projectId: number) => {
  try {
    const response = await api.get<ProjectCampaign[]>(
      `/projects/${projectId}/campaigns/`
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Failed to fetch project campaigns:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteProject = async (projectId: number) => {
  try {
    await api.delete(`/projects/${projectId}/`);
  } catch (error: any) {
    console.error(
      "Failed to delete project: ",
      error.response?.data || error.message
    );
    throw error;
  }
}

export function normalizeCauses(
  causes: Cause[] | string[] | undefined
): string[] {
  if (!Array.isArray(causes)) return [];
  if (typeof causes[0] === "string") return causes as string[];
  return (causes as Cause[]).map((cause) => cause.name);
}
