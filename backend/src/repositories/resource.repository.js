import pool from "../config/db.js";

// Create a new resource
export const createResource = async ({
  organizationId,
  name,
  type,
  capacity = 0,
  location = null,
}) => {
  const query = `
    INSERT INTO resources (organization_id, name, type, capacity, location)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  const values = [organizationId, name, type, capacity, location];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

// Find resource by ID
export const findResourceById = async (id) => {
  const query = `
    SELECT * FROM resources WHERE id = $1 AND is_active = true;
  `;

  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

// Get all resources for an organization
export const getResourcesByOrganization = async (organizationId) => {
  const query = `
    SELECT * 
    FROM resources 
    WHERE organization_id = $1 AND is_active = true
    ORDER BY name ASC;
  `;

  const { rows } = await pool.query(query, [organizationId]);
  return rows;
};

// Update a resource
export const updateResource = async (id, data) => {
  const { name, type, capacity, location, is_active } = data;

  const query = `
    UPDATE resources
    SET name = COALESCE($2, name),
        type = COALESCE($3, type),
        capacity = COALESCE($4, capacity),
        location = COALESCE($5, location),
        is_active = COALESCE($6, is_active),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *;
  `;

  const values = [id, name, type, capacity, location, is_active];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

// Delete (soft delete) a resource
export const deleteResource = async (id) => {
  const query = `
    UPDATE resources
    SET is_active = false,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *;
  `;

  const { rows } = await pool.query(query, [id]);
  return rows[0];
};