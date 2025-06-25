const express = require('express');
const { createRoom } = require('../controller/createRoom');
const { getRooms } = require('../controller/getRooms');
const { joinRoom } = require('../controller/joinRoom');
const { getRoomDetails } = require('../controller/getRoomDetails');

const router = express.Router();
router.post("/create-room", createRoom);
router.get("/get-rooms", getRooms);
router.post("/join-room", joinRoom);
router.post("/get-room-details", getRoomDetails);

module.exports = router;