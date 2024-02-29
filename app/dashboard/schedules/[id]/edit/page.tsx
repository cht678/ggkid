import Form from '@/app/ui/schedules/edit-form';
import Breadcrumbs from '@/app/ui/schedules/breadcrumbs';
import { fetchAllStudentIds, fetchSessionToken, fetchSchoolName,fetchScheduleById } from '@/app/lib/data';
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

    const scheduleObject = await fetchScheduleById(id);
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
  }

  // Extract user ID from decoded token
  const sessionUserId = typeof decodedToken === 'string' ? decodedToken : decodedToken?.id;*/


    if (!scheduleObject || !scheduleObject.school_name) {
        console.error('Error: School name not found in the fetched data.');
        // Handle the error or return an appropriate value
        return <div>Error: School name not found in the fetched data.</div>;
    }

    // Fetch the company name using the user ID
    const schoolName = scheduleObject.school_name;
  console.log('Company Name:', schoolName);

  const students = await fetchAllStudentIds(schoolName);
  //const schedule = await fetchScheduleById(id); // Fetch schedule data

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Schedules', href: '/dashboard/schedules' },
          {
            label: 'Edit Schedule',
            href: `/dashboard/schedules/${params.id}/edit`,
            active: true,
          },
        ]}
      />
      <Form schedule={scheduleObject} students={students} /> {/* Pass schedule and students as props */}
    </main>
  );
}
