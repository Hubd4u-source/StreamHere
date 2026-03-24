import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

/**
 * MEGA-SYNC CLI UTILITY
 * Usage: node scripts/mega-sync.mjs --uid YOUR_ADMIN_UID --pages 50 --type all
 */

const args = process.argv.slice(2);
const getArg = (name) => {
  const idx = args.indexOf(name);
  return idx !== -1 ? args[idx + 1] : null;
};

const ADMIN_UID = getArg('--uid');
const PAGES = parseInt(getArg('--pages') || '20');
const TYPE = getArg('--type') || 'all'; // all, series, movies, cartoon
const DEEP = getArg('--deep') === 'true';
const BASE_URL = getArg('--url') || 'http://localhost:3000';

if (!ADMIN_UID) {
  console.error('❌ ERROR: Missing --uid. You can find your UID in the Admin Settings area of the site.');
  process.exit(1);
}

const types = TYPE === 'all' ? ['series', 'movies', 'cartoon'] : [TYPE];

async function run() {
  console.log(`🚀 STARTING MEGA-SYNC`);
  console.log(`📍 Target: ${BASE_URL}`);
  console.log(`📂 Types: ${types.join(', ')}`);
  console.log(`📄 Max Pages: ${PAGES}`);
  console.log(`🔍 Deep Sync: ${DEEP ? 'ENABLED' : 'DISABLED'}`);
  console.log('------------------------------------------');

  for (const type of types) {
    console.log(`\n📂 PROCESSING CATEGORY: ${type.toUpperCase()}`);
    
    for (let p = 1; p <= PAGES; p++) {
      console.log(`\n📄 Page ${p}/${PAGES}: Discovering items...`);
      
      try {
        const discResp = await fetch(`${BASE_URL}/api/admin/bulk-sync`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-admin-uid': ADMIN_UID
          },
          body: JSON.stringify({ action: 'discover', page: p, type })
        });

        if (!discResp.ok) {
          const text = await discResp.text();
          console.error(`❌ Page ${p} Discovery Failed (${discResp.status}): ${text}`);
          break;
        }

        const { items } = await discResp.json();
        if (!items || items.length === 0) {
          console.log(`🏁 Reached end of content for ${type} at page ${p}.`);
          break;
        }

        console.log(`✅ Found ${items.length} items. Starting import...`);

        for (const item of items) {
          process.stdout.write(`📥 Syncing: ${item.title}... `);
          
          try {
            const impResp = await fetch(`${BASE_URL}/api/admin/bulk-sync`, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'x-admin-uid': ADMIN_UID,
                'x-deep-sync': DEEP ? 'true' : 'false'
              },
              body: JSON.stringify({ action: 'import', slugs: [item], type })
            });

            if (!impResp.ok) {
              const text = await impResp.text();
              console.log(`❌ FAILED (${impResp.status})`);
              continue;
            }

            const impData = await impResp.json();
            const result = impData.results?.[0];
            
            if (result?.status === 'error') {
              console.log(`⚠️ SKIP (${result.error})`);
            } else {
              console.log(`✅ OK`);
            }
          } catch (err) {
            console.log(`❌ ERROR: ${err.message}`);
          }
          
          // Small delay to be nice to the server
          await new Promise(r => setTimeout(r, 200));
        }
      } catch (err) {
        console.error(`🚨 Fatal error on page ${p}:`, err.message);
        break;
      }
    }
  }

  console.log('\n✨ MEGA-SYNC COMPLETED!');
}

run();
