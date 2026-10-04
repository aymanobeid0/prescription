import DesignerLayout from "@/components/designer/DesignerLayout";

export const metadata = {
  title: "مصمم المستندات | DentalSaaS",
};

export default async function DesignerPage(
  props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }
) {
  const searchParams = await props.searchParams;
  const patientId = typeof searchParams.patientId === 'string' ? searchParams.patientId : undefined;

  return (
    <DesignerLayout patientId={patientId} />
  );
}
