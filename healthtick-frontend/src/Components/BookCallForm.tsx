/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from "react";
import { Combobox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { formSubmission } from "../Services/formServices";
import type { ClientData } from "../Types/dataInterfaces";
import { DateContext, OpenContext } from "../App";
import { fetchClients } from "../Services/datafetchServices";
interface BookCallFormProps {
  timeSlot: string;
  setAddTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  addTrigger: boolean;
  ToastError: (err: string) => void;
}
const BookCallForm: React.FC<BookCallFormProps> = ({
  timeSlot,
  setAddTrigger,
  addTrigger,
  ToastError,
}) => {
  const { selectedDate } = useContext(DateContext);
  const { setOpen } = useContext(OpenContext);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [callType, setCallType] = useState<"onboarding" | "followup">(
    "onboarding"
  );
  const [clients, setClients] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchClients();
        setClients(response.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchData();
  }, []);

  const filteredClients =
    query === ""
      ? clients
      : clients.filter((client) =>
          client.toLowerCase().includes(query.toLowerCase())
        );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClient || !timeSlot || !callType || !selectedDate) {
      alert("Please complete all fields before submitting.");
      return;
    }

    if (callType === "followup") {
      const startDate = new Date(selectedDate);
      const year = startDate.getFullYear();
      const month = startDate.getMonth(); // 0-based
      const lastDayOfMonth = new Date(year, month + 1, 0); // Last day of month

      const currentDate = new Date(startDate);

      while (currentDate <= lastDayOfMonth) {
        const followUpData: ClientData = {
          client: selectedClient,
          callType: callType,
          timeSlot: timeSlot,
          date: currentDate.toISOString().split("T")[0], // format: YYYY-MM-DD
        };

        try {
          await formSubmission(followUpData);
          setOpen(false);
          setAddTrigger(!addTrigger);
        } catch (error: any) {
          console.error("Error adding document(s):", error?.response?.data);
          ToastError(error?.response?.data?.message);
        }

        currentDate.setDate(currentDate.getDate() + 7); // move to next week
      }
    } else {
      const clientData: ClientData = {
        client: selectedClient,
        callType: callType,
        timeSlot: timeSlot,
        date: selectedDate,
      };

      try {
        await formSubmission(clientData);
      } catch (error: any) {
        console.error("Error adding document(s):", error?.response?.data);
        ToastError(error?.response?.data?.message);
      }
    }

    setAddTrigger(!addTrigger);
    setOpen(false);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-none">
      <div className="relative max-w-md w-full px-6 py-8 bg-white shadow-md rounded-xl">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Book a Call
        </h2>
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold focus:outline-none"
          aria-label="Close form"
        >
          &times;
        </button>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Searchable Client Selection */}
          <div>
            <label
              htmlFor="client"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Client
            </label>
            <Combobox value={selectedClient} onChange={setSelectedClient}>
              <div className="relative">
                <Combobox.Input
                  placeholder="Search client..."
                  className="w-full border border-gray-300 rounded-md p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setQuery(e.target.value)}
                  displayValue={(client: string | null) => client ?? ""}
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="w-5 h-5 text-gray-400" />
                </Combobox.Button>

                {filteredClients.length > 0 && (
                  <Combobox.Options className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none">
                    {filteredClients.map((client, index) => (
                      <Combobox.Option
                        key={index}
                        value={client}
                        className={({ active }) =>
                          `cursor-pointer select-none px-4 py-2 ${
                            active ? "bg-blue-600 text-white" : "text-gray-900"
                          }`
                        }
                      >
                        {client}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                )}
              </div>
            </Combobox>
          </div>

          {/* Call Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Call Type
            </label>
            <div className="flex items-center gap-6">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="callType"
                  value="onboarding"
                  checked={callType === "onboarding"}
                  onChange={() => setCallType("onboarding")}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Onboarding</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="callType"
                  value="followup"
                  checked={callType === "followup"}
                  onChange={() => setCallType("followup")}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Follow-up</span>
              </label>
            </div>
          </div>

          {/* Time Slot Select */}
          <div>
            <label
              htmlFor="timeSlot"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Time Slot
            </label>
            <input
              type="text"
              id="timeSlot"
              value={timeSlot}
              readOnly
              className="w-full border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-700 pointer-events-none"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookCallForm;
