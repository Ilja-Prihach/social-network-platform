type AdminUserDetailsPageProps = {
  params: Promise<{
    userId: string;
  }>;
};

export default async function AdminUserDetailsPage({ params }: AdminUserDetailsPageProps) {
  const { userId } = await params;

  return <main>User details placeholder: {userId}</main>;
}
