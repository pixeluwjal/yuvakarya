import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      whatsapp,
      college,
      // --- NEW FIELDS ---
      degree,
      classSemester,
      // ------------------
      course,
      locality,
      pincode,
      birthYear,
      interests,
      // --- NEW FIELD ---
      comments,
      // -----------------
    } = body;

    // A more robust validation check with specific error messages
    if (!name) return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
    if (!whatsapp) return NextResponse.json({ error: 'WhatsApp number is required.' }, { status: 400 });
    if (!college) return NextResponse.json({ error: 'College is required.' }, { status: 400 });
    // --- UPDATED VALIDATION ---
    if (!degree) return NextResponse.json({ error: 'Degree is required.' }, { status: 400 });
    if (!classSemester) return NextResponse.json({ error: 'Class/Semester is required.' }, { status: 400 });
    // --------------------------
    if (!course) return NextResponse.json({ error: 'Course is required.' }, { status: 400 });
    if (!locality) return NextResponse.json({ error: 'Residential locality is required.' }, { status: 400 });
    if (!pincode) return NextResponse.json({ error: 'Pincode is required.' }, { status: 400 });
    if (!birthYear) return NextResponse.json({ error: 'Birth year is required.' }, { status: 400 });
    if (!interests || interests.length === 0) return NextResponse.json({ error: 'At least one area of interest is required.' }, { status: 400 });

    // Check if "Others" is selected without a specific value
    const otherInterestSelected = interests.includes('Others');
    const hasOtherValue = interests.some((interest: string) => interest.startsWith('Others: '));
    if (otherInterestSelected && !hasOtherValue) {
        return NextResponse.json({ error: 'Please specify your other interest in the text field.' }, { status: 400 });
    }

    // Attempt to parse credentials safely
    let credentials;
    try {
        if (!process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS) {
            throw new Error('GOOGLE_SERVICE_ACCOUNT_CREDENTIALS environment variable is not set.');
        }
        credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS);
    } catch (parseError) {
        console.error('Failed to parse Google credentials:', parseError);
        return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }
    
    const auth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const sheetId = process.env.GOOGLE_SHEET_ID;
    // --- UPDATED RANGE TO INCLUDE NEW COLUMNS ---
    const range = 'Sheet1!A:L'; // Updated to support Degree, Class/Semester, and Comments. Let's use L just in case the interests parsing adds more.
    // ------------------------------------------

    // Format the data for the sheet
    // --- UPDATED VALUES ARRAY TO INCLUDE NEW FIELDS ---
    const values = [
      name,
      whatsapp,
      college,
      degree,
      classSemester,
      course,
      locality,
      pincode,
      birthYear,
      interests.join(', '), // Convert the interests array to a comma-separated string
      comments,
    ];
    // --------------------------------------------------

    const resource = {
      values: [values],
    };

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: range,
      valueInputOption: 'RAW',
      resource: resource,
    });

    console.log('Data successfully appended to Google Sheet.');
    
    return NextResponse.json(
      { message: 'Data submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected Error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}