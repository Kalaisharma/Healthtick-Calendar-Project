import {
  collection,
  addDoc,
  getDocs,
  Timestamp,
  query,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../Services/fireBaseConnection";
import { Request, Response } from "express";

function addMinutesToTimeSlot(timeSlot: string, minutes: number): string {
  const date = new Date(`2000-01-01 ${timeSlot}`);
  date.setMinutes(date.getMinutes() + minutes);

  const hours = date.getHours() % 12 || 12;
  const formattedHour = hours < 10 ? `0${hours}` : `${hours}`;
  const formattedMinutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = date.getHours() >= 12 ? "PM" : "AM";

  return `${formattedHour}:${formattedMinutes} ${ampm}`;
}
export const bookACall = async (req: Request, res: Response) => {
  try {
    const { client, callType, timeSlot, date } = req.body;
    const timeSlotsToCheck: string[] = [];

    const offsets =
      callType === "onboarding" ? [-40, -20, 20, 40] : [-40, -20, 20];

    for (const offset of offsets) {
      const adjustedTime = addMinutesToTimeSlot(timeSlot, offset);
      timeSlotsToCheck.push(adjustedTime);
    }

    if (callType === "followup" || "onboarding") {
      const checkTime = timeSlotsToCheck[0]; // this is -40 minutes from selected time

      // Query the DB to see if there's a call at that time
      const q = query(
        collection(db, "calls"),
        where("timeSlot", "==", checkTime),
        where("date", "==", date)
      );

      const snapshot = await getDocs(q);
      let isFollowupAtMinus40 = false;

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.callType === "followup") {
          isFollowupAtMinus40 = true;
        }
      });

      // If it's followup at -40 mins, remove it from timeSlotsToCheck
      if (isFollowupAtMinus40) {
        timeSlotsToCheck.splice(0, 1); // remove the first element (i.e., -40 min)
      }
    }

    // Query existing bookings on the same date
    const callsRef = collection(db, "calls");
    const q = query(callsRef, where("date", "==", date));
    const snapshot = await getDocs(q);

    const existingTimeSlots = snapshot.docs.map((doc) => doc.data().timeSlot);
    for (const checkTime of timeSlotsToCheck) {
      if (existingTimeSlots.includes(checkTime)) {
        return res.status(409).json({
          message: `A overlapping call is already booked at ${checkTime} on ${date}. Please choose another slot.`,
        });
      }
    }
    // Check for duplicate call with same client, date, and callType
    const duplicateQuery = query(
      callsRef,
      where("client", "==", client),
      where("date", "==", date),
      where("callType", "==", callType)
    );

    const duplicateSnapshot = await getDocs(duplicateQuery);
    console.log(duplicateSnapshot.docs.length, "duplicateSnapshot",date);
    
    if (!duplicateSnapshot.empty) {
      return res.status(409).json({
        message: `A ${callType} call is already booked for ${client} on ${date}.`,
      });
    }

    // If no conflict, book the call
    const docRef = await addDoc(callsRef, {
      client,
      callType,
      timeSlot,
      date,
      timestamp: new Date(),
    });

    return res.status(201).json({
      docid: docRef.id,
      client,
      callType,
      timeSlot,
      date,
    });
  } catch (error) {
    console.error("Error booking call: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const fetchDocsByDate = async (req: Request, res: Response) => {
  try {
    const { date } = req.query;

    if (!date || typeof date !== "string") {
      return res
        .status(400)
        .json({ error: "Missing or invalid 'date' parameter" });
    }

    // Parse input and create independent start and end date objects

    const q = query(
      collection(db, "calls"),
      where("date", "==", date),
    );

    const snapshot = await getDocs(q);

    // Extract actual document data
    const data = snapshot.docs.map((doc) => ({
      docid: doc.id,
      client: doc.data().client,
      callType: doc.data().callType,
      date: doc.data().date,
      timeSlot: doc.data().timeSlot,
    }));

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching documents by date:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const fetchClients = async (_req: Request, res: Response) => {
  try {
    const callsRef = collection(db, "clientlist");
    const snapshot = await getDocs(callsRef);

    const clients = snapshot.docs.map((doc) => {
      const data = doc.data();
      return data.clientname ?? null; // Return client or null if missing
    });
    return res.status(200).json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteCallById = async (req: Request, res: Response) => {
  const { docid } = req.query;
  if (!docid || typeof docid !== "string") {
    return res
      .status(400)
      .json({ error: "Missing or invalid 'date' parameter" });
  }
  try {
    const docRef = doc(db, "calls", docid);
    await deleteDoc(docRef);
    res.status(200).json(`Document with ID ${docid} deleted successfully.`);
  } catch (error) {
    res.status(500).json("Error deleting document: Internal Server error");
    throw error;
  }
};
