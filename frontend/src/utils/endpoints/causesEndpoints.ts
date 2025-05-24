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
      data: {
        name,
        description,
        icon,
      },
    });

    if (!response) throw new Error("Error creating a new cause");

    return response.data;
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
};
