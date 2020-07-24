const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

/**
* An HTTP endpoint that acts as a webhook for HTTP(S) request event
* @returns {object} result Your return value
*/
module.exports = async () => {
  let result = {};

  // Query a certain table in the Postgres database
  let queryResult = await lib.postgres.db['@0.0.1'].query({
    query: `SELECT * FROM tweets;`
  });
  let rows = queryResult.rows;

  // Loop through the rows to create a list of records to send to Airtable
  let records = rows.map((row) => {
    return {
      'id': row.id,
      'txt': row.txt,
      'created_at': row.created_at,
      'user_id': row.user_id
    }
  });

  // Create the records in the Airtable base with the content from the Postgres DB table
  await lib.airtable.query['@0.5.3'].insert({
    baseId: `<INSERT BASE ID HERE>`,
    table: `Tweets`,
    fieldsets: records,
    typecast: false
  });

  return result;
};