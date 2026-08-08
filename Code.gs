// ===================================================================
// FOUNDIC NETWORK - WAITLIST WEB APP BACKEND
// -------------------------------------------------------------------
// HOW TO DEPLOY:
// 1. https://script.google.com -> New project -> paste this file -> Save
// 2. Deploy -> New deployment -> Web app
//    - Execute as: Me
//    - Who has access: Anyone
// 3. Click Deploy (authorize Drive + Sheets on first run)
// 4. Copy the /exec URL -> paste into script.js as WEB_APP_URL
// ===================================================================

const SHEET_NAME = 'Submissions';
const FOLDER_NAME = 'Foundic Uploads';
const SHARED_SECRET = 'foundic_waitlist_2026_x7k9q2'; // MUST match script.js / waitlist.html
const MAX_ROWS = 1000;                                 // waitlist capacity before "full"
const ROLES = ['company', 'expert', 'angel'];

function doGet() {
  return json_({ status: 'ok', service: 'foundic-waitlist', method: 'GET' });
}

function doPost(e) {
  // Parse JSON payload (sent as text/plain to avoid CORS preflight)
  let body = {};
  try {
    body = JSON.parse((e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return json_({ status: 'error', message: 'Invalid request.' });
  }

  // ---- Spam protection: honeypot + shared secret (silent reject) ----
  if (String(body.website || '').trim() !== '') return json_({ status: 'rejected' });
  if (body.secret !== SHARED_SECRET) return json_({ status: 'rejected' });

  // ---- Validate role + email ----
  const role = String(body.role || '').trim().toLowerCase();
  if (!ROLES.includes(role)) return json_({ status: 'error', message: 'Invalid role.' });
  const email = String(body.email || '').trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) return json_({ status: 'error', message: 'A valid email is required.' });

  const sheet = getSheet_();
  const lastRow = sheet.getLastRow();

  // ---- Duplicate email check (column C) ----
  if (lastRow > 1) {
    const existing = sheet.getRange(2, 3, lastRow - 1, 1).getValues();
    for (let i = 0; i < existing.length; i++) {
      const cell = String(existing[i][0] || '').trim().toLowerCase();
      if (cell === email) return json_({ status: 'duplicate', message: 'already applied' });
    }
  }

  // ---- Waitlist capacity check ----
  if (lastRow >= MAX_ROWS) {
    return json_({ status: 'full', message: 'The waitlist is currently full. Please check back later.' });
  }

  // ---- Save file uploads to Drive ----
  const links = [];
  try {
    const folder = getFolder_();
    const files = Array.isArray(body.files) ? body.files : [];
    for (const f of files) {
      if (!f || !f.data) continue;
      const bytes = Utilities.base64Decode(f.data);
      const blob = Utilities.newBlob(bytes, f.mime || 'application/octet-stream', f.filename || 'upload');
      const file = folder.createFile(blob);
      links.push(file.getUrl());
    }
  } catch (err) {
    // File failure must not block the text submission
  }

  // ---- Append one row ----
  sheet.appendRow([
    new Date(),
    role,
    email,
    String(body.name || '').trim(),
    String(body.details || '').trim(),
    links.join(', '),
    'New'
  ]);

  return json_({ status: 'success', row: sheet.getLastRow() });
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Timestamp', 'Role', 'Email', 'Name', 'Submission Details', 'Upload Links', 'Status']);
    sheet.getRange('A1:G1').setFontWeight('bold');
  }
  return sheet;
}

function getFolder_() {
  const folders = DriveApp.getFoldersByName(FOLDER_NAME);
  if (folders.hasNext()) return folders.next();
  return DriveApp.createFolder(FOLDER_NAME);
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
