import Form from '@/app/ui/trips/edit-form';
import Breadcrumbs from '@/app/ui/trips/breadcrumbs';
import { fetchAllDriversEmails, fetchAllVehicleIds, fetchCompanyName,fetchTripById } from '@/app/lib/data3';
import { fetchSessionToken } from '@/app/lib/data';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { Pool } from 'pg';


const dbConfig = {
  host: 'ep-rough-unit-92773982-pooler.us-east-1.postgres.vercel-storage.com',
  database: 'verceldb',
  port: 5432, // Change this if your PostgreSQL server uses a different port
};

const pool = new Pool(dbConfig);

export default async function Page({ params }: { params: { id: string } }) {

  const id = new ObjectId(params.id);
  const trip = await fetchTripById(id);

 /* // Fetch session token
  const sessionName = 'currentSession'; // Adjust session name according to your setup
  const token = await fetchSessionToken(sessionName);
  console.log('Session token:', token);

  // Verify and decode the token
  let decodedToken: JwtPayload | string; // Explicitly type decodedToken
  try {
    // Type assertion to assert that token is a non-null string
    decodedToken = jwt.verify(token!, process.env.TOKEN_SECRET!) as JwtPayload;
    console.log('Decoded token data:', decodedToken);
  } catch (error) {
    console.error('Error verifying token:', error);
    // Handle error if token verification fails or token is null
    return null; // Or handle the error in some other way
  }*/
  if (!trip || !trip.company_name) {
    console.error('Error: Company name not found in the fetched data.');
    // Handle the error or return an appropriate value
    return <div>Error: School name not found in the fetched data.</div>;
  }

  /*// Extract user ID from decoded token
  const sessionUserId = typeof decodedToken === 'string' ? decodedToken : decodedToken?.id;*/

  // Fetch the company name using the user ID
  const companyName = trip.company_name;
  console.log('Company Name:', companyName);

  // Fetch drivers' emails filtered by the company name
  const drivers = await fetchAllDriversEmails(companyName);

  // Fetch all vehicle IDs
  const vehicles = await fetchAllVehicleIds(companyName);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Trips', href: '/transport-admin-dashboard/trips' },
          {
            label: 'Edit Trip',
            href: `/transport-admin-dashboard/trips/${params.id}/edit`, // Corrected href attribute
            active: true,
          },
        ]}
      />
      <Form drivers={drivers} vehicles={vehicles} trip={trip}/>
    </main>
  );
}
