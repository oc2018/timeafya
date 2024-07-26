import AppointmentForm from "@/components/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.actions";
import Image from "next/image";
import * as Sentry from '@sentry/nextjs';

export default async function NewAppointment({ params: { userId }}: SearchParamProps) {
    
    const patient = await getPatient(userId);

      Sentry.metrics.set("user_view_new-appointment", patient.name);  

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container ">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <div className="flex gap-2 mb-12">
            <Image 
              src={'/assets/icons/logo-icon.svg'} 
              alt="logo" 
              width={100} 
              height={100}
              className=" h-10 w-fit"
            />
            <p className="text-32-bold">TimeAfya</p>
          </div>

            <AppointmentForm
                type="create"
                userId={userId}
                patientId={patient.$id}

            />

            <p className="copyright py-12">
              © 2024 TimeAfya
            </p>

        </div>
      </section>
      <Image
        src={"/assets/images/appointment-img.png"}
        height={1000}
        width={1000}
        alt="appointment"
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
}
