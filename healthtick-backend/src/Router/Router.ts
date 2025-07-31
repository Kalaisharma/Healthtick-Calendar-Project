const express = require('express');
const router = express.Router();
const {
  bookACall,
  fetchDocsByDate,
  fetchClients,
  deleteCallById,
} = require("../Controller/Controllers");
router.post('/clientbooking', bookACall)
router.get("/fetchDatabyDate", fetchDocsByDate);
router.get("/fetchclients", fetchClients);
router.get("/deletedoc", deleteCallById);

export default router