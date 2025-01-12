const client = require('../connection');

const createNotification = async (req, res) => {
  const { role, type, message } = req.body;

  if (!role || !type || !message) {
    return res.status(400).json({ error: "Role, type, and message are required" });
  }

  try {
    await client.query('BEGIN'); // Start a transaction
    let notifId;

    // Check if notification with the same type and message already exists
    const existingNotificationQuery = `
      SELECT notif_id
      FROM notification
      WHERE type = $1 AND message = $2;
    `;
    const existingNotificationResult = await client.query(existingNotificationQuery, [type, message]);

    if (existingNotificationResult.rows.length > 0) {
      // Use the existing notif_id
      notifId = existingNotificationResult.rows[0].notif_id;
    } else {
      // Insert a new notification
      const notificationQuery = `
        INSERT INTO notification (type, message)
        VALUES ($1, $2)
        RETURNING notif_id;
      `;
      const notificationResult = await client.query(notificationQuery, [type, message]);
      notifId = notificationResult.rows[0].notif_id;
    }

    // --
    const roles = Array.isArray(role) ? role : [role];

    // Find users with the specified role
    const usersQuery = `
      SELECT user_id
      FROM users
      WHERE role = ANY($1);
    `;
    const usersResult = await client.query(usersQuery, [roles]);

    if (usersResult.rows.length === 0) {
      throw new Error(`No users found with the roles "${roles.join(", ")}"`);
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
      notification: { notifId, type, message },
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