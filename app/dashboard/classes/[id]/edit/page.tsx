import Form from '@/app/ui/classes/edit-form';
import Breadcrumbs from '@/app/ui/classes/breadcrumbs';
import { fetchClassById, fetchAllTeachersEmail, fetchSessionToken, fetchSchoolName } from '@/app/lib/data';
import { ObjectId } from 'mongodb';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Pool } from 'pg';

const dbConfig = {
    host: 'ep-rough-unit-92773982-pooler.us-east-1.postgres.vercel-storage.com',
    database: 'verceldb',
    port: 5432, // Change this if your PostgreSQL server uses a different port
};
const pool = new Pool(dbConfig);
export default async function Page({ params }: { params: { id: string } }) {
  const id = new ObjectId(params.id);

  const classObject = await fetchClassById(id);

    if (!classObject || !classObject.school_name) {
        console.error('Error: School name not found in the fetched data.');
        // Handle the error or return an appropriate value
        return <div>Error: School name not found in the fetched data.</div>;
    }


    /*// Fetch session token
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


  // Fetch the company name using the user ID
    const schoolName = classObject.school_name;
  console.log('School Name:', schoolName);

  const teachers = await fetchAllTeachersEmail(schoolName);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Classes', href: '/dashboard/classes' },
          {
            label: 'Edit Class',
            href: `/dashboard/classes/${params.id}/edit`,
            active: true,
          },
        ]}
      />
      <Form classroom={classObject} teachers={teachers} />
    </main>
  );
}
