"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
} from "@/components/ui/form"
import { getAppointmentSchema } from "@/lib/validation"
import CustomFormField from "../CustomFormField"
import { FormFieldType } from "./PatientForm"
import { Doctors } from "@/constants"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import { createAppointment, updateAppointment } from "@/lib/actions/appointment.actions"
import { useState } from "react"
import { useRouter } from "next/navigation"
import SubmitButton from "../SubmitButton"
import { Appointment } from "@/types/appwrite.types"


const AppointmentForm = ({ userId, patientId, type, appointment, setOpen }:{
  userId: string;
  patientId: string;
  appointment?: Appointment;
  setOpen?: (open: boolean) => void;
  type: "schedule" | "cancel" | "create"
}) => {

  const [ isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const AppointmentFormValidation = getAppointmentSchema(type);

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician:  appointment ? appointment.primaryPhysician : '',
      schedule: appointment ? new Date(appointment?.schedule) : new Date(Date.now()),
      reason: appointment ? appointment?.reason : '',
      note: appointment ? appointment?.note : '',
      cancellationReason: appointment?.cancellationReason ||'',
    }
  })
  
  const onSubmit = async(values: z.infer<typeof AppointmentFormValidation>) => {
    setIsLoading(true);

    let status;
    switch (type) {
      case 'schedule':
        status = 'scheduled';
        break;
      case 'cancel':
        status = 'cancelled';
        break;
      default:
        status = "pending";
        break;
    }

    try {
      if(type === 'create' && patientId) {
        const appointment = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          status: status as Status,
          note: values.note,
        }
  
          const newAppointment = await createAppointment( appointment );
            if(newAppointment) {
              form.reset();
              router.push(`/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.$id}`)
            };
      } else {
        const appointmentToUpdate = {
          userId,
          appointmentId: appointment?.$id!,
          appointment: {
            primaryPhysician: values?.primaryPhysician,
            schedule: new Date(values?.schedule),
            status: status as Status,
            cancellationReason: values?.cancellationReason
          },
          type
        }
  
        const theUpdatedAppointment = await updateAppointment(appointmentToUpdate);
  
        if(theUpdatedAppointment) {
          setOpen && setOpen(false);
          form.reset();
        }
      }
      
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);

  };

  let buttonLabel;
  switch (type) {
    case "cancel":
      buttonLabel = "Cancel Appointment";
      break;
    case "schedule":
      buttonLabel = "Schedule Appointment";
      break;  
    default:
      buttonLabel = "Submit Appointment";
      break;
  }
  

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {type !== "cancel" && (
          <>
            <CustomFormField
              fieldType={ FormFieldType.SELECT}
              control={form.control}
              name="primaryPhysician"
              label="Doctor"
              placeholder="Select a doctor"
            >
              {Doctors.map( (doctor, i) => (
                <SelectItem value={doctor.name} key={doctor.name + i}>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <Image
                      src={doctor.image}
                      width={24}
                      height={24}
                      alt="doctor"
                    />
                    <p>{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>
            <CustomFormField 
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Schedule"
              showTimeSelect
              dateFormat="MM/dd/yyyy HH:mm"
            />

            <div>
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Reason"
                placeholder="Enter your reason for booking an appointment"
              />
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Notes"
                placeholder="Enter your more information here"
              />
            </div>
          </>
        )}

        {type === "cancel" && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="Enter the reason for cancellation"
          />
        )}
        
        <SubmitButton 
          isLoading={isLoading} 
          className={`${type === "cancel" ? "shad-danger-btn": "shad-primary-btn"}`}
        >{buttonLabel}</SubmitButton>
      </form>
    </Form>
  )
}

export default AppointmentForm;