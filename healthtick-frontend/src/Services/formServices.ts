import { axiosCall } from "../Client/clientCall"
import type { ClientData } from "../Types/dataInterfaces";

export const formSubmission = async (clientData: ClientData) => {
   // eslint-disable-next-line no-useless-catch
   try{ const response = await axiosCall("http://localhost:5000/api/clientbooking", "POST", clientData);
        return response
    }
    catch(error){
       throw error;
    }
}