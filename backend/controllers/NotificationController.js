const client = require('../connection');

const createNotification = async (req, res) => {
  const { role, type, message, rf_id } = req.body;

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
        INSERT INTO notification (type, message, rf_id)
        VALUES ($1, $2, $3)
        RETURNING notif_id;
      `;
      const notificationResult = await client.query(notificationQuery, [type, message, rf_id]);
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

const markAsRead = async (req, res) => {
  const { user_notif_id  } = req.body;  // You can pass userId and status as query params

  try {

    const markAsReadQuery = `
    UPDATE user_notification 
    SET status = 'read'
    WHERE user_notif_id = $1;
    `
    const result = await client.query(markAsReadQuery, [user_notif_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "No notifications found." });
    }

    // Return the notifications
    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error updating notification:", error.message);
    res.status(500).json({ error: "Failed to update notification" });
  }
};

const getNotifications = async (req, res) => {
  const { userId, status } = req.query;  // You can pass userId and status as query params

  try {
    let query = `
      SELECT un.user_notif_id, n.notif_id, n.type, n.message, n.rf_id, n.product_id, un.created_at, un.status AS user_status
      FROM notification n
      JOIN user_notification un ON n.notif_id = un.notif_id
    `;
    
    // If userId is provided, filter notifications for that user
    if (userId) {
      query += ` WHERE un.user_id = $1`;
    }
    
    // If status is provided, filter by notification status
    if (status) {
      query += userId ? ` AND un.status = $2` : ` WHERE un.status = $1`;
    }

    // Execute the query
    const params = userId ? (status ? [userId, status] : [userId]) : (status ? [status] : []);
    const result = await client.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No notifications found." });
    }

    // Return the notifications
    res.status(200).json({ notifications: result.rows });
  } catch (error) {
    console.error("Error retrieving notifications:", error.message);
    res.status(500).json({ error: "Failed to retrieve notifications" });
  }
};




module.exports = {
  createNotification,
  getNotifications,
  markAsRead
};