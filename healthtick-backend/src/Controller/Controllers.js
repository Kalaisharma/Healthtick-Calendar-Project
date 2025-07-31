"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCallById = exports.fetchClients = exports.fetchDocsByDate = exports.bookACall = void 0;
const firestore_1 = require("firebase/firestore");
const fireBaseConnection_1 = require("../Services/fireBaseConnection");
function addMinutesToTimeSlot(timeSlot, minutes) {
    const date = new Date(`2000-01-01 ${timeSlot}`);
    date.setMinutes(date.getMinutes() + minutes);
    const hours = date.getHours() % 12 || 12;
    const formattedHour = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "PM" : "AM";
    return `${formattedHour}:${formattedMinutes} ${ampm}`;
}
const bookACall = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { client, callType, timeSlot, date } = req.body;
        const timeSlotsToCheck = [];
        const offsets = callType === "onboarding" ? [-40, -20, 20, 40] : [-40, -20, 20];
        for (const offset of offsets) {
            const adjustedTime = addMinutesToTimeSlot(timeSlot, offset);
            timeSlotsToCheck.push(adjustedTime);
        }
        if (callType === "followup" || "onboarding") {
            const checkTime = timeSlotsToCheck[0]; // this is -40 minutes from selected time
            // Query the DB to see if there's a call at that time
            const q = (0, firestore_1.query)((0, firestore_1.collection)(fireBaseConnection_1.db, "calls"), (0, firestore_1.where)("timeSlot", "==", checkTime), (0, firestore_1.where)("date", "==", date));
            const snapshot = yield (0, firestore_1.getDocs)(q);
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
        const callsRef = (0, firestore_1.collection)(fireBaseConnection_1.db, "calls");
        const q = (0, firestore_1.query)(callsRef, (0, firestore_1.where)("date", "==", date));
        const snapshot = yield (0, firestore_1.getDocs)(q);
        const existingTimeSlots = snapshot.docs.map((doc) => doc.data().timeSlot);
        for (const checkTime of timeSlotsToCheck) {
            if (existingTimeSlots.includes(checkTime)) {
                return res.status(409).json({
                    message: `A overlapping call is already booked at ${checkTime} on ${date}. Please choose another slot.`,
                });
            }
        }
        // Check for duplicate call with same client, date, and callType
        const duplicateQuery = (0, firestore_1.query)(callsRef, (0, firestore_1.where)("client", "==", client), (0, firestore_1.where)("date", "==", date), (0, firestore_1.where)("callType", "==", callType));
        const duplicateSnapshot = yield (0, firestore_1.getDocs)(duplicateQuery);
        console.log(duplicateSnapshot.docs.length, "duplicateSnapshot", date);
        if (!duplicateSnapshot.empty) {
            return res.status(409).json({
                message: `A ${callType} call is already booked for ${client} on ${date}.`,
            });
        }
        // If no conflict, book the call
        const docRef = yield (0, firestore_1.addDoc)(callsRef, {
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
    }
    catch (error) {
        console.error("Error booking call: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.bookACall = bookACall;
const fetchDocsByDate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date } = req.query;
        if (!date || typeof date !== "string") {
            return res
                .status(400)
                .json({ error: "Missing or invalid 'date' parameter" });
        }
        // Parse input and create independent start and end date objects
        const q = (0, firestore_1.query)((0, firestore_1.collection)(fireBaseConnection_1.db, "calls"), (0, firestore_1.where)("date", "==", date));
        const snapshot = yield (0, firestore_1.getDocs)(q);
        // Extract actual document data
        const data = snapshot.docs.map((doc) => ({
            docid: doc.id,
            client: doc.data().client,
            callType: doc.data().callType,
            date: doc.data().date,
            timeSlot: doc.data().timeSlot,
        }));
        return res.status(200).json(data);
    }
    catch (error) {
        console.error("Error fetching documents by date:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.fetchDocsByDate = fetchDocsByDate;
const fetchClients = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const callsRef = (0, firestore_1.collection)(fireBaseConnection_1.db, "clientlist");
        const snapshot = yield (0, firestore_1.getDocs)(callsRef);
        const clients = snapshot.docs.map((doc) => {
            var _a;
            const data = doc.data();
            return (_a = data.clientname) !== null && _a !== void 0 ? _a : null; // Return client or null if missing
        });
        return res.status(200).json(clients);
    }
    catch (error) {
        console.error("Error fetching clients:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.fetchClients = fetchClients;
const deleteCallById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { docid } = req.query;
    if (!docid || typeof docid !== "string") {
        return res
            .status(400)
            .json({ error: "Missing or invalid 'date' parameter" });
    }
    try {
        const docRef = (0, firestore_1.doc)(fireBaseConnection_1.db, "calls", docid);
        yield (0, firestore_1.deleteDoc)(docRef);
        res.status(200).json(`Document with ID ${docid} deleted successfully.`);
    }
    catch (error) {
        res.status(500).json("Error deleting document: Internal Server error");
        throw error;
    }
});
exports.deleteCallById = deleteCallById;
