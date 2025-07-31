/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from "react";
import { generateTimeSlots } from "../Utils/generalServices";
import { DateContext, OpenContext } from "../App";
import BookCallForm from "./BookCallForm";
import { deleteDoc, fetchDocsByDate } from "../Services/datafetchServices";
import type { ClientDataFromDB } from "../Types/dataInterfaces";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const Calendar: React.FC = () => {
  const { selectedDate, setSelectedDate } = useContext(DateContext);
  const { open, setOpen } = useContext(OpenContext);
  const [clientsbyDate, setClientsbyDate] = useState<ClientDataFromDB[]>([]);
  const [addTrigger, setAddTrigger] = useState<boolean>(false);
  const [timeSlot, setTimeSlot] = useState<string>("");
  const timeSlots = generateTimeSlots();
  useEffect(() => {
    const fetchDatabyDate = async () => {
      try {
        const response = await fetchDocsByDate(selectedDate);
        setClientsbyDate(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    fetchDatabyDate();
  }, [selectedDate, addTrigger]);

  const ToastError = (err: string) => {
    toast.error(err, {
      icon: <span>❌</span>,
      style: {
        backgroundColor: "#fee2e2", // light red
        color: "#991b1b", // deep red text
      },
    });
  };
  const handleDelete = async (docId: string) => {
    try {
      const response = await deleteDoc(docId);
      console.log(response);
      toast.success("Booking deleted successfully!", {
        icon: <span>🗑️</span>,
        style: {
          backgroundColor: "#dcfce7", // light green like your UI
          color: "#166534", // deep green text
        },
      });
      setAddTrigger(!addTrigger);
    } catch (err:any) {
      console.error("Error deleting booking:", err);
      ToastError(err?.response?.data?.message);
    }
  };

  return (
    <div className="w-full h-screen bg-white flex flex-col p-4">
      {/* Header with title and date picker */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-blue-700 mb-2 lg:mb-0">
          HealthTick Calendar
        </h1>

        <div>
          <label
            htmlFor="date"
            className="block mb-1 font-medium text-gray-700"
          >
            Select a Date
          </label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border px-3 py-2 rounded-md w-full lg:w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-y-auto border rounded-lg shadow-inner p-4 bg-gray-50">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {timeSlots.map((time, idx) => {
            const matchingClient = clientsbyDate.find(
              (entry: any) => entry.timeSlot === time
            );

            return (
              <div
                key={matchingClient?.docid || idx}
                onClick={() => {
                  if (matchingClient) return;
                  setOpen(true);
                  setTimeSlot(time);
                }}
                className={`relative border rounded-md shadow-sm p-2 h-28 cursor-pointer transition-all
    ${
      matchingClient
        ? "bg-green-100 border-green-400"
        : "bg-white border-red-300 hover:bg-red-50"
    }`}
              >
                {/* Top-left: Time */}
                <div className="absolute top-1 left-2 text-xs font-medium text-gray-1500">
                  {time}
                </div>

                {/* Top-right: Status */}
                <div
                  className={`absolute top-1 right-2 text-xs font-bold
      ${matchingClient ? "text-green-600" : "text-red-500"}`}
                >
                  {matchingClient ? "Booked" : ""}
                </div>

                {/* Center: Client Info */}
                <div className="flex flex-col justify-center items-center h-full text-center text-sm font-semibold text-gray-800">
                  {matchingClient ? (
                    <>
                      <div>{matchingClient.client}</div>
                      <div className="text-xs text-gray-500">
                        {matchingClient.callType}
                      </div>
                    </>
                  ) : (
                    <div className="text-xs text-gray-400">Available</div>
                  )}
                </div>

                {/* Bottom-right: Delete button */}
                {matchingClient && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(matchingClient.docid);
                    }}
                    className="absolute bottom-1 right-1 text-red-500 hover:text-red-700 text-sm"
                    title="Delete Booking"
                  >
                    🗑
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50">
          <BookCallForm
            timeSlot={timeSlot}
            setAddTrigger={setAddTrigger}
            addTrigger={addTrigger}
            ToastError={ToastError}
          />
        </div>
      )}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default Calendar;
