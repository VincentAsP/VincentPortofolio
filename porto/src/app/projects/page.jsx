import ListingPage from '../ListingPage';

export default async function ProjectsPage({ searchParams }) {
  const params = await searchParams;
  const type = params?.type ?? null;

  return <ListingPage type={type} />;
}
