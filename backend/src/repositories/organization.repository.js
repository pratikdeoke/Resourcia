import pool from "../config/db.js";
import bcrypt from "bcrypt";

export const createOrganizationWithOwner = async ({
  organization,
  owner,
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const orgQuery = `
      INSERT INTO organizations (name, domain, timezone, google_calendar_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const orgValues = [
      organization.name,
      organization.domain,
      organization.timezone,
      organization.calendarEmail ?? null,
    ];

    const { rows: orgRows } = await client.query(orgQuery, orgValues);
    const org = orgRows[0];
    const passwordHash = await bcrypt.hash(owner.password, 10);

    const userQuery = `
      INSERT INTO users (
        organization_id,
        name,
        email,
        password_hash,
        role,
        is_owner,
        is_active
      )
      VALUES ($1, $2, $3, $4, 'ADMIN', true, true)
      RETURNING id, name, email, role, is_owner;
    `;

    const userValues = [
      org.id,
      owner.name,
      owner.email.toLowerCase(),
      passwordHash,
    ];

    const { rows: userRows } = await client.query(userQuery, userValues);
    const user = userRows[0];

    await client.query("COMMIT");

    return {
      organization: org,
      owner: user,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const findOrganizationByName = async (name) => {
  if (!name) return null;

  const query = `
    SELECT id FROM organizations WHERE name = $1;
  `;

  const { rows } = await pool.query(query, [name]);
  return rows[0];
};