
import StartCard from '@/components/StartCard'
import { columns } from '@/components/table/columns'
import { DataTable } from '@/components/table/DataTable'
import { getRecentAppointmentList } from '@/lib/actions/appointment.actions'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'


const Admin = async() => {

  const appointments = await getRecentAppointmentList();

  return (
    <div className='flex mx-auto max-w-7xl flex-col space-y-14'>
      <header className='admin-header'>
        <Link href='/' className='cursor-pointer flex w-full items-center justify-between'>
          <div className="flex gap-4">
            <Image 
              src={'/assets/icons/logo-icon.svg'} 
              alt="logo" 
              width={100} 
              height={100}
              className=" h-10 w-fit"
            />
            <p className="text-32-bold ">TimeAfya</p>
          </div>
          <p className='text-16-semibold'>Admin Dashboard</p>
        </Link>
      </header>

      <main className='admin-main'>
        <section className='w-full space-y-4'>
            <h1 className='header'>
            Welcome 👋
            </h1>
            <p className='text-dark-700'>Start the day with managing new appointments</p>
        </section>

        <section className='admin-stat'>
            <StartCard
                type="appointments"
                count={appointments.scheduledCount}
                label="Scheduled appointments"
                icon="/assets/icons/appointments.svg"
            />
            <StartCard
                type="pending"
                count={appointments.pendingCount}
                label="Pending appointments"
                icon="/assets/icons/pending.svg"
            />
            <StartCard
                type="cancelled"
                count={appointments.cancelledCount}
                label="Cancelled appointments"
                icon="/assets/icons/cancelled.svg"
            />
        </section>

        <DataTable columns={columns} data={appointments.documents} />

      </main>
    </div>
  )
}

export default Admin
