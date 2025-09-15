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
      course,
      locality,
      pincode,
      birthYear,
      interests
    } = body;

    // Validate required fields
    if (!name || !whatsapp || !college || !course || !locality || !pincode || !birthYear || !interests || interests.length === 0) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS!);
    
    const auth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key.replace(/\\n/g, '\n'), // Fix newlines
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const sheetId = process.env.GOOGLE_SHEET_ID;
    const range = 'Sheet1!A:H'; // Update this if your sheet name or range is different

    // Format the data for the sheet
    const values = [
      name,
      whatsapp,
      college,
      course,
      locality,
      pincode,
      birthYear,
      interests.join(', ') // Convert the interests array to a comma-separated string
    ];

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
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}