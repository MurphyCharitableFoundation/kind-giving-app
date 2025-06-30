import { api } from "../axios";

interface ICause {
  id: number;
  name: string;
  description: string;
  icon: string;
}

interface ICreateCause {
  name: string;
  description: string;
  icon?: string;
}

export const getCauses = async (): Promise<ICause[]> => {
  try {
    const result = await api.get<ICause[]>("/causes");

    if (!result) throw new Error("Error getting Causes");

    return result.data;
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
};

export const getCauseById = async (id: string): Promise<ICause> => {
  try {
    const response = await api.get<ICause>(`/causes/${id}`);

    if (!response) throw new Error("Error getting Cause");

    return response.data;
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
};

export const createNewCause = async (
  name: string,
  description: string,
  icon?: string
) => {
  try {
    const response = await api.post<ICreateCause>("/causes/", {
      name,
      description,
      icon,
    });

    if (!response) throw new Error("Error creating a new cause");

    return response.data;
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
};

export const updateCause = async (
  id: string,
  name: string,
  description: string,
  icon?: string
): Promise<ICause> => {
  try {
    const response = await api.put<ICause>(`/causes/${id}/`, {
      name,
      description,
      icon,
    });

    if (!response) throw new Error("Error updating cause");

    return response.data;
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
};

export const deleteCause = async (id: number): Promise<void> => {
  try {
    const response = await api.delete(`/causes/${id}/`);

    if (!response) throw new Error("Error deleting cause");

    return;
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
};
