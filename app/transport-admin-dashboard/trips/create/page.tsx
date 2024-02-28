import Form from '@/app/ui/trips/create-form';
import Breadcrumbs from '@/app/ui/trips/breadcrumbs';
import {fetchAllDriversEmails, fetchAllVehicleIds, fetchCompanyName, fetchDataForCreateTrips} from '@/app/lib/data3';
import { fetchSessionToken } from '@/app/lib/data';
import jwt, { JwtPayload } from 'jsonwebtoken';

export default async function Page() {
  //Fetch session token
  const sessionName = 'currentSession'; // Adjust session name according to your setup
    console.log('获取token')
  const token = await fetchSessionToken(sessionName);
  console.log('Session token:', token);
    console.log('获取token陈工',token)
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
    console.log('token解析陈工',decodedToken)
    const sessionUserId = typeof decodedToken === 'string' ? decodedToken : decodedToken?.id;
    console.log('sessionUserId值：',sessionUserId)
    console.log('开始调用fetchDataForCreateTrips')
    const {vehicles,drivers} = await fetchDataForCreateTrips(sessionUserId)
    console.log('fetchDataForCreateTrips调用成功',vehicles,drivers)
  //
  // // Extract user ID from decoded token
  // const sessionUserId = typeof decodedToken === 'string' ? decodedToken : decodedToken?.id;
  //
  // // Fetch the company name using the user ID
  // const companyName = await fetchCompanyName(sessionUserId);
  // console.log('Company Name:', companyName);
  //
  // // Fetch drivers' emails filtered by the company name
  // const drivers = await fetchAllDriversEmails(companyName);
  //
  // // Fetch all vehicle IDs
  // const vehicles = await fetchAllVehicleIds(companyName);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Trips', href: '/transport-admin-dashboard/trips' },
          {
            label: 'Create Trip',
            href: '/transport-admin-dashboard/trips/create',
            active: true,
          },
        ]}
      />
      <Form drivers={drivers} vehicles={vehicles} />
    </main>
  );
}
