export async function findAssetById(client, id, forUpdate = false) {
  const result = await client.query(`SELECT * FROM assets WHERE id = $1${forUpdate ? " FOR UPDATE" : ""}`, [id]);
  return result.rows[0];
}