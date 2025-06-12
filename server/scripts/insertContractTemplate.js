/**
 * Script to insert or update the contract HTML template in the database.
 *
 * Usage:
 *   node server/scripts/insertContractTemplate.js
 *
 * Requirements:
 *   - Ensure your MongoDB database is running and connection details are set in server/.env.
 *   - The contract template file should be located at server/utils/contrat.html.
 *
 * What it does:
 *   - Reads the contract template HTML file.
 *   - Saves or updates it in the database using the saveTemplateFromFile controller.
 *   - Useful for updating the template used for generating rental contracts.
 */

import fs from 'fs';
import connectDB from '../config/db.js';
import { saveTemplateFromFile } from '../controllers/contractTemplate.controller.js';
import dotenv from 'dotenv';
dotenv.config({ path: './server/.env' });

async function main() {
  await connectDB();
  const html = fs.readFileSync('./server/utils/contrat.html', 'utf-8');
  await saveTemplateFromFile('Contrat de Location', html);
  console.log('Template inserted.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
