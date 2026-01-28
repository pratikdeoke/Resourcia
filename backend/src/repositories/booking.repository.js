import pool from "../config/db.js";

// Create a new booking
export const createBooking = async ({
  organizationId,
  resourceId,
  userId,
  title,
  description,
  startTime,
  endTime,
  status = "PENDING",
}) => {
  const query = `
    INSERT INTO bookings
      (organization_id, resource_id, user_id, title, description, start_time, end_time, status)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *;
  `;

  const values = [
    organizationId,
    resourceId,
    userId,
    title,
    description || null,
    startTime,
    endTime,
    status,
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

// Get bookings for a resource within a time range
// Useful for conflict checks
export const getBookingsByResource = async (resourceId, startTime, endTime) => {
  const query = `
    SELECT * 
    FROM bookings
    WHERE resource_id = $1
      AND status != 'CANCELLED'
      AND (
        (start_time, end_time) OVERLAPS ($2::timestamp, $3::timestamp)
      )
    ORDER BY start_time ASC;
  `;

  const { rows } = await pool.query(query, [resourceId, startTime, endTime]);
  return rows;
};

// Get all bookings for a user
export const getBookingsByUser = async (userId) => {
  const query = `
    SELECT * 
    FROM bookings
    WHERE user_id = $1
      AND status != 'CANCELLED'
    ORDER BY start_time DESC;
  `;

  const { rows } = await pool.query(query, [userId]);
  return rows;
};


// Update booking details or status
export const updateBooking = async (id, data) => {
  const { title, description, startTime, endTime, status } = data;

  const query = `
    UPDATE bookings
    SET title = COALESCE($2, title),
        description = COALESCE($3, description),
        start_time = COALESCE($4, start_time),
        end_time = COALESCE($5, end_time),
        status = COALESCE($6, status),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *;
  `;

  const values = [id, title, description, startTime, endTime, status];

  const { rows } = await pool.query(query, values);
  return rows[0];
};


// Soft delete a booking (set status to CANCELLED)
export const cancelBooking = async (id) => {
  const query = `
    UPDATE bookings
    SET status = 'CANCELLED',
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *;
  `;

  const { rows } = await pool.query(query, [id]);
  return rows[0];
};


// Get all bookings for a resource (for calendar or analytics)
export const getAllBookingsForResource = async (resourceId) => {
  const query = `
    SELECT * 
    FROM bookings
    WHERE resource_id = $1
    ORDER BY start_time ASC;
  `;

  const { rows } = await pool.query(query, [resourceId]);
  return rows;
};

export const getPendingBookings = async (organizationId) => {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM bookings
    WHERE organization_id = $1
      AND status = 'PENDING'
    ORDER BY created_at ASC
    `,
    [organizationId]
  );
  return rows;
};

export const getBookingById = async (id) => {
  const { rows } = await pool.query(
    `SELECT * FROM bookings WHERE id = $1`,
    [id]
  );
  return rows[0];
};

export const updateBookingStatus = async (
  bookingId,
  status,
  googleEventId = null
) => {
  const { rows } = await pool.query(
    `
    UPDATE bookings
    SET status = $2,
        google_event_id = COALESCE($3, google_event_id),
        updated_at = NOW()
    WHERE id = $1
    RETURNING *;
    `,
    [bookingId, status, googleEventId]
  );

  return rows[0];
};

export const getOrganizationById = async (id) => {
  const { rows } = await pool.query(
    `SELECT id, google_calendar_id FROM organizations WHERE id = $1`,
    [id]
  );
  return rows[0];
};

export const getResourceById = async (resourceId) => {
  const { rows } = await pool.query(
    `SELECT * FROM resources WHERE id = $1`,
    [resourceId]
  );
  return rows[0];
};