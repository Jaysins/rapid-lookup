import { useQuery } from "@tanstack/react-query";
import http from "../lib/http";

export const useGetCountries = (continent) => {
  return useQuery({
    queryKey: ['countries', continent],
    queryFn: async () => {
      const res = await http.get('/countries', {
        params: { continent }
      });
      return res.data;
    },

    enabled: !!continent
  });
};

export const useGetCatalogue = (country) => {
  return useQuery({
    queryKey: ['catalogue', country],
    queryFn: async () => {
      const res = await http.get('/catalogues', {
        params: { country }
      });
      return res.data;
    },
    enabled: !!country
  });
};
