const client = require('../connection');

const createNotification = async (req, res) => {
  const { role, type, message, productId } = req.body;

  if (!role || !type || !message) {
    return res.status(400).json({ error: "Role, type, and message are required" });
  }

  try {
    await client.query('BEGIN'); // Start a transaction

    // Insert into notification table
    const notificationQuery = `
      INSERT INTO notification (type, message, product_id)
      VALUES ($1, $2, $3)
      RETURNING notif_id;
    `;
    const notificationResult = await client.query(notificationQuery, [type, message, productId || null]);
    const notifId = notificationResult.rows[0].notif_id;

    // Find users with the specified role
    const usersQuery = `
      SELECT user_id
      FROM users
      WHERE role = $1;
    `;
    const usersResult = await client.query(usersQuery, [role]);

    if (usersResult.rows.length === 0) {
      throw new Error(`No users found with the role "${role}"`);
    }

    // Insert into user_notification table
    const userNotificationsQuery = `
      INSERT INTO user_notification (status, user_id, notif_id)
      VALUES ($1, $2, $3);
    `;
    for (const user of usersResult.rows) {
      await client.query(userNotificationsQuery, ["unread", user.user_id, notifId]);
    }

    await client.query('COMMIT'); // Commit the transaction

    res.status(201).json({
      message: "Notification created and assigned successfully",
      notification: { notifId, type, message, productId },
      role,
      usersNotified: usersResult.rows.length,
    });
  } catch (error) {
    await client.query('ROLLBACK'); // Rollback on error
    console.error("Error creating notification:", error.message);
    res.status(500).json({ error: "Failed to create notification" });
  }
};




module.exports = {
  createNotification,
};