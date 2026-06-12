const fs = require("fs");
const path = require("path");

const supabaseUrl = "https://cerjbqhlfcjuivafflrc.supabase.co";
const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlcmpicWhsZmNqdWl2YWZmbHJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDY5MzY4MywiZXhwIjoyMDk2MjY5NjgzfQ.5aFvAsXfdERahthraCX9h7T7oVdI2IL_ZUy3ad2W6VU";

async function run() {
  const sqlPath = path.join(__dirname, "001_initial_schema.sql");
  const sql = fs.readFileSync(sqlPath, "utf8");

  console.log("Executing migration...\n");

  // Try using the Supabase pg_query RPC
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/rpc/pg_query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({ query: sql }),
    });

    if (res.ok) {
      const text = await res.text();
      console.log("✓ Migration executed successfully via pg_query!");
      console.log("Response:", text.substring(0, 500));
      return;
    }

    const errText = await res.text();
    console.log("pg_query endpoint failed:", res.status, errText.substring(0, 200));
  } catch (e) {
    console.log("pg_query endpoint error:", e.message);
  }

  // Fallback: run statement by statement
  console.log("\nTrying statement-by-statement execution...");
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("--"));

  let success = 0;
  let failed = 0;

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i] + ";";
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/rpc/pg_query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        body: JSON.stringify({ query: stmt }),
      });
      if (res.ok) {
        success++;
      } else {
        const errText = await res.text();
        // Ignore "already exists" errors
        if (errText.includes("already exists")) {
          success++;
        } else {
          console.log(`  ✗ Statement ${i + 1} failed:`, errText.substring(0, 150));
          failed++;
        }
      }
    } catch (e) {
      console.log(`  ✗ Statement ${i + 1} error:`, e.message);
      failed++;
    }
  }

  console.log(`\n✓ ${success} statements executed, ${failed} failed`);

  if (failed > 0) {
    console.log("\n⚠ Some statements failed. Please open Supabase SQL Editor and paste:");
    console.log("  1. Go to https://supabase.com/dashboard/project/cerjbqhlfcjuivafflrc/sql/new");
    console.log(`  2. Copy the file: migrations/001_initial_schema.sql`);
    console.log("  3. Paste and run it there.");
  }
}

run().catch(console.error);
