import db from "../config/db.js";

export const createUser = async ({
  organizationId,
  name,
  email,
  passwordHash,
  role,
}) => {
  const { rows } = await db.query(
    `
    INSERT INTO users
    (organization_id, name, email, password_hash, role, is_active)
    VALUES ($1, $2, $3, $4, $5, true)
    RETURNING id, name, email, role, organization_id, is_active;
    `,
    [organizationId, name, email.toLowerCase(), passwordHash, role]
  );
  return rows[0];
};

export const findUserByEmail = async (
  organizationId,
  email,
  onlyActive = false
) => {
  const query = `
    SELECT *
    FROM users
    WHERE organization_id = $1
      AND email = $2
      ${onlyActive ? "AND is_active = true" : ""}
  `;

  const { rows } = await db.query(query, [
    organizationId,
    email.toLowerCase(),
  ]);

  return rows[0];
};

export const findUserById = async (id) => {
  const { rows } = await db.query(
    `SELECT * FROM users WHERE id = $1`,
    [id]
  );
  return rows[0];
};

// For Memeber (normal user)

export const createMember = async ({
  organizationId,
  name,
  email,
  passwordHash,
}) => {
  const { rows } = await db.query(
    `
    INSERT INTO users
    (organization_id, name, email, password_hash, role, is_active)
    VALUES ($1, $2, $3, $4, 'MEMBER', false)
    RETURNING id, name, email, role, is_active
    `,
    [organizationId, name, email.toLowerCase(), passwordHash]
  );
  return rows[0];
};

export const getPendingUsers = async (organizationId) => {
  const { rows } = await db.query(
    `
    SELECT id, name, email, created_at
    FROM users
    WHERE organization_id = $1
      AND role = 'MEMBER'
      AND is_active = false
    `,
    [organizationId]
  );
  return rows;
};

export const activateUser = async (userId) => {
  const { rows } = await db.query(
    `
    UPDATE users
    SET is_active = true, updated_at = NOW()
    WHERE id = $1
    RETURNING id, name, email, is_active
    `,
    [userId]
  );
  return rows[0];
};