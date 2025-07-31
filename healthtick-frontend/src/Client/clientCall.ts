/* eslint-disable no-useless-catch */
import axios from "axios";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const axiosCall = async (url: string, method: string, data: any= null) => { 
    const config = {
        url: url,
        method: method,
        data: data,
    }
    try {
      const response = await axios(config);  
        return response;
    } catch (error) {
        throw error;
    }
  };

