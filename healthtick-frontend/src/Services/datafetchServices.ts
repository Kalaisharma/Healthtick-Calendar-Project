import { axiosCall } from "../Client/clientCall";

export const fetchClients = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await axiosCall(
      "https://healthtick-app.onrender.com/api/fetchclients",
      "GET"
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchDocsByDate = async (date: string) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await axiosCall(
      `https://healthtick-app.onrender.com/api/fetchDatabyDate?date=${date}`,
      "GET"
    );
    return response;
  } catch (error) {
    throw error;
  }
};
export const deleteDoc = async (docId: string) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await axiosCall(
      `https://healthtick-app.onrender.com/api/deletedoc?docid=${docId}`,
      "GET"
    );
    return response;
  } catch (error) {
    throw error;
  }
};
