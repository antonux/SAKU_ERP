const client = require('../connection');

const getUsers = async (req, res) => {
    try {
        const query = `
      SELECT user_id, username, email, fname, lname, phone, gender, role, image
      FROM USERS;
    `;
        const result = await client.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Error fetching users");
    }
};

const createUser = async (req, res) => {
    const { username, password, email, fname, lname, phone, gender, role } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        const query = `
      INSERT INTO USERS (username, password, email, fname, lname, phone, gender, role, image)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING user_id;
    `;
        const values = [username, password, email, fname, lname, phone, gender, role, image];
        const result = await client.query(query, values);

        res.status(201).json({
            message: 'User created successfully',
            user: { user_id: result.rows[0].user_id, username, email, fname, lname, phone, gender, role, image },
        });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send("Error creating user");
    }
};

const updateUser = async (req, res) => {
    const { user_id, username, email, fname, lname, phone, gender, role } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        const query = `
      UPDATE USERS
      SET 
        username = $1,
        email = $2,
        fname = $3,
        lname = $4,
        phone = $5,
        gender = $6,
        role = $7,
        image = COALESCE($8, image)
      WHERE user_id = $9
    `;
        const values = [username, email, fname, lname, phone, gender, role, image, user_id];
        await client.query(query, values);

        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send("Error updating user");
    }
};

const loginUser = async (req, res) => {
    const { usernameOrEmail, password } = req.body;

    try {
        // Query the database to find a user by username or email
        const query = `
            SELECT * FROM USERS
            WHERE (username = $1 OR email = $1) AND password = $2;
        `;
        const values = [usernameOrEmail, password];
        const result = await client.query(query, values);

        // Check if any user matches the query
        if (result.rows.length > 0) {
            return res.status(200).json({
                success: true,
                message: 'Login successful',
                user: {
                    user_id: result.rows[0].user_id,
                    role: result.rows[0].role,
                },
            });
        } else {
            return res.status(401).json({
                success: false,
                message: 'Invalid username/email or password',
            });
        }
    } catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).send("Error logging in user");
    }
};

const deleteUser = async (req, res) => {
    const { user_id } = req.params;
    try {
        const query = `
        DELETE FROM USERS WHERE user_id = $1
    `;
        await client.query(query, [user_id]);

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send("Error deleting user");
    }
};

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    loginUser
};

