import pool from "../config/db.js";

export const createOrganization = async ({
  name,
  domain,
  timezone,
  googleCalendarId,
}) => {
  const query = `
    INSERT INTO organizations (name, domain, timezone, google_calendar_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [name, domain, timezone, googleCalendarId || null];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const findOrganizationByDomain = async (domain) => {
  if (!domain) return null;

  const query = `
    SELECT id FROM organizations WHERE domain = $1;
  `;

  const { rows } = await pool.query(query, [domain]);
  return rows[0];
};