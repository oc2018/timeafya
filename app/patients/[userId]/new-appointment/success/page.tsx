import { Button } from '@/components/ui/button';
import { Doctors } from '@/constants';
import { getAppointment } from '@/lib/actions/appointment.actions';
import { formatDateTime } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import * as Sentry from '@sentry/nextjs';
import { getUser } from '@/lib/actions/patient.actions';

const Success = async({ params: { userId }, searchParams }: SearchParamProps) => {
    
    const user = await getUser(userId);
    const appointmentId = (searchParams?.appointmentId as string) || '';
    const appointment = await getAppointment(appointmentId);
    const doctor = Doctors.find((doc) => doc?.name === appointment?.primaryPhysician);
    
    // Sentry.metrics.set("user_view_appointment-success", user.name);

  return (
    <div className='flex h-screen max-h-screen px-[5%]'>
      <div className='success-img'>
        <Link href='/'>
            <div className="flex gap-2">
                <Image 
                src={'/assets/icons/logo-icon.svg'} 
                alt="logo" 
                width={100} 
                height={100}
                className=" h-10 w-fit"
                />
                <p className="text-32-bold">TimeAfya</p>
            </div>
        </Link>

        <section className='flex flex-col items-center'>
            <Image
                src='/assets/gifs/success.gif'
                height={300}
                width={280}
                alt='success'
            />
            <h2 className='header mb-6 max-w-[600px] text-center '>
                Your <span className='text-green-500'>appointment request</span> has been successfully submitted!
            </h2>

            <p>We will be in tourch shortly to confirm.</p>
        </section>

        <section className='request-details'>
            <p>Requested appointment details:</p>
            <div className='flex items-center gap-3'>
                <Image
                    src={doctor?.image!}
                    width={50}
                    height={50}
                    alt={doctor?.name!}
                />
                <p className='whitespace-nowrap'>Dr. {doctor?.name}</p>
            </div>
            <div className='flex gap-2'>
                <Image
                    src='/assets/icons/calendar.svg'
                    height={24}
                    width={24}
                    alt='calender'
                />
                <p>{formatDateTime(appointment.schedule).dateTime}</p>
            </div>
        </section>

        <Button variant='outline' className='shad-primary-btn' asChild>
            <Link href={`/patients/${userId}/new-appointment`}>
                New Appointment
            </Link>
        </Button>
        
        <p className="copyright">
            © 2024 TimeAfya
        </p>

        </div>
    </div>
  )
}

export default Success
