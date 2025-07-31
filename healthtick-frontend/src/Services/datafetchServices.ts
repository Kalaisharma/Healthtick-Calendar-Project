import { axiosCall } from "../Client/clientCall";

export const fetchClients = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await axiosCall(
      "http://localhost:5000/api/fetchclients",
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
      `http://localhost:5000/api/fetchDatabyDate?date=${date}`,
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
      `http://localhost:5000/api/deletedoc?docid=${docId}`,
      "GET"
    );
    return response;
  } catch (error) {
    throw error;
  }
};
