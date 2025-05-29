import { AxiosRequestConfig } from "axios";
import { useState } from "react";
import { api } from "../bibliotecas/axios";

export function useCRUD<T>(baseUrl: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T[]>([]); // Sempre um array

  const handleRequest = async <D = any>(
    method: "get" | "post" | "put" | "patch" | "delete",
    endpoint: string = "",
    payload?: D,
    config?: AxiosRequestConfig
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api({
        method,
        url: `${baseUrl}${endpoint ? `/${endpoint}` : ""}`,
        data: payload,
        ...config,
      });

      // Garantir que setData receba um array
      const responseData = Array.isArray(response.data) ? response.data : [response.data];
      setData(responseData);
      return responseData;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAll = () => handleRequest("get");
  const getById = (id: number | string) => handleRequest("get", String(id));
  const create = <D>(item: D) => handleRequest("post", "", item);
  const update = <D>(id: number | string, item: D) => handleRequest("put", String(id), item);
  const remove = (id: number | string) => handleRequest("delete", String(id));

  return {
    data,
    loading,
    error,
    getAll,
    getById,
    create,
    update,
    remove,
  };
}