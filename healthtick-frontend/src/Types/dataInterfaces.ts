export interface ClientData {
  client: string | null;
  callType: "onboarding" | "followup";
  timeSlot: string;
  date: string | Date;
}
export interface ClientDataFromDB {
  docid: string;
  client: string | null;
  callType: "onboarding" | "followup";
  timeSlot: string;
  date: string | Date;
}
export const clientData: ClientData[] = [
  {
    client: "Aarav - 9876543210",
    callType: "onboarding",
    timeSlot: "10:30 AM",
    date: "2025-08-03",
  },
  {
    client: "Ishita - 9123456789",
    callType: "followup",
    timeSlot: "10:50 AM",
    date: "2025-08-04",
  },
  {
    client: "Rohan - 9988776655",
    callType: "onboarding",
    timeSlot: "11:10 AM",
    date: "2025-08-05",
  },
  {
    client: "Sneha - 9871234567",
    callType: "followup",
    timeSlot: "11:30 AM",
    date: "2025-08-06",
  },
  {
    client: "Karan - 9543217890",
    callType: "onboarding",
    timeSlot: "11:50 AM",
    date: "2025-08-07",
  },
  {
    client: "Meera - 9665544332",
    callType: "followup",
    timeSlot: "12:10 PM",
    date: "2025-08-08",
  },
  {
    client: "Yash - 9345678923",
    callType: "onboarding",
    timeSlot: "12:30 PM",
    date: "2025-08-09",
  },
  {
    client: "Divya - 9012345678",
    callType: "followup",
    timeSlot: "12:50 PM",
    date: "2025-08-10",
  },
  {
    client: "Ayaan - 9765432180",
    callType: "onboarding",
    timeSlot: "1:10 PM",
    date: "2025-08-11",
  },
  {
    client: "Neha - 9832145698",
    callType: "followup",
    timeSlot: "1:30 PM",
    date: "2025-08-12",
  },
  {
    client: "Vikram - 9023412345",
    callType: "onboarding",
    timeSlot: "1:50 PM",
    date: "2025-08-13",
  },
  {
    client: "Pooja - 9898989898",
    callType: "followup",
    timeSlot: "2:10 PM",
    date: "2025-08-14",
  },
  {
    client: "Siddharth - 9870001234",
    callType: "onboarding",
    timeSlot: "2:30 PM",
    date: "2025-08-15",
  },
  {
    client: "Anika - 9760011223",
    callType: "followup",
    timeSlot: "2:50 PM",
    date: "2025-08-16",
  },
  {
    client: "Riya - 9822223333",
    callType: "onboarding",
    timeSlot: "3:10 PM",
    date: "2025-08-17",
  },
  {
    client: "Aditya - 9011998877",
    callType: "followup",
    timeSlot: "3:30 PM",
    date: "2025-08-18",
  },
  {
    client: "Tara - 9888777666",
    callType: "onboarding",
    timeSlot: "3:50 PM",
    date: "2025-08-19",
  },
  {
    client: "Rahul - 9123123123",
    callType: "followup",
    timeSlot: "4:10 PM",
    date: "2025-08-20",
  },
  {
    client: "Kavya - 9555666777",
    callType: "onboarding",
    timeSlot: "4:30 PM",
    date: "2025-08-01",
  },
  {
    client: "Dev - 9900112233",
    callType: "followup",
    timeSlot: "4:50 PM",
    date: "2025-08-02",
  },
];
