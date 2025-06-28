const pushNotification = (
  req,
  recipientUserId,
  senderUserId,
  type,
  message
) => {
  // emitting notification to the user
  const io = req.app.get("io");
  const onlineUsers = req.app.get("onlineUsers");

  const recipientSocketId = onlineUsers.get(recipientUserId);
  if (recipientSocketId) {
    io.to(recipientSocketId).emit("notification", {
      type,
      from: senderUserId,
      message,
    });
  } else {
    console.log(`User ${recipientUserId} is not online.`);
  }
};

module.exports = {
  pushNotification,
};
