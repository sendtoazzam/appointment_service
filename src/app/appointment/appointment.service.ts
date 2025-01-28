import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment } from './appointment.model';
import { Pagination } from 'src/common/pagination/pagination';
import { SlotQueryFilter } from './query-filter/appointment.query-filter';
import { Configs } from '../configs/configs.model';
import { UnavailableHoursRequestDTO } from '../configs/dto/request/unavailable-hours.request.dto';
import * as moment from 'moment-timezone';
import { SlotUnavailableException } from './exception/slot-unavailable.exception';
import { SlotBookRequestDTO } from './dto/request/slot-book/slot-book.request.dto';
import { ConfigNotFound } from '../configs/exception/config-not-found.exception';
import { SlotExceedingMoreThanAllowedException } from './exception/slot-exceed.exception';
import { AppointmentStatus } from './enum/appointment-status.enum';
import { AppointmentNotFoundException } from './exception/appointment-not-found.exception';
import { AppointmentStatusException } from './exception/appointment-status-update.exception';
import { AppointmentList } from './appointment-list.model';

@Injectable()
export class AppointmentService {
    constructor(
        @InjectModel(Appointment.name)
        private readonly appointmentModel: Model<Appointment>,
        @InjectModel(AppointmentList.name)
        private readonly appointmentListModel: Model<AppointmentList>,
        @InjectModel(Configs.name)
        private readonly configModel: Model<Configs>,
    ) { }

    async getAvailableSlots(slotBookDate: string): Promise<any[]> {
        // Fetch configurations (slot duration, operational hours, etc.)
        const config = await this.configModel.findOne({});
        const { slotDuration, operationHours, maxSlotPerAppointment, holidays, unavailableHours } = config?.appointmentConfigs;

        // Check if the selected date is a holiday
        await this.checkIsHoliday(holidays, slotBookDate);

        // Fetch appointments for the given date
        const appointments = await this.appointmentModel.find({ date: slotBookDate, appointmentStatus: AppointmentStatus.CONFIRMED });

        // Generate all possible time slots for the day
        const allSlots = this.generateTimeSlots(operationHours, slotDuration);

        // Filter out unavailable hours (e.g., lunch breaks)
        const unavailable = unavailableHours.find((u) => this.isDayUnavailable(u, slotBookDate));

        // Filter out unavailable slots
        const filteredSlots = await this.filterSlotsByAvailability(allSlots, unavailable);

        // Map and calculate available slots for each time slot
        const availableSlots = filteredSlots.map((slot) => {
            const bookedSlots = appointments.filter((a) => a.time === slot.time).reduce((acc, a) => acc + a.slotsBooked, 0);
            const remainingSlots = maxSlotPerAppointment - bookedSlots;

            return {
                date: slotBookDate,
                time: slot.time,
                available_slots: remainingSlots > 0 ? remainingSlots : 0,
            };
        });

        if (availableSlots.length !== 0) {
            const appointmentList = await this.appointmentListModel.findOne({ date: slotBookDate });

            if (!appointmentList) {
                await this.appointmentListModel.create({
                    date: slotBookDate,
                    slots: availableSlots
                });
            }
        }

        return availableSlots;
    }

    private async checkIsHoliday(holidays, slotBookDate): Promise<boolean> {
        if (holidays.includes(slotBookDate)) throw new SlotUnavailableException(`SLOT UNAVAILABLE DUE TO HOLIDAY`); // No slots available on holidays
        return true;
    }

    private generateTimeSlots(operationalHours, slotDuration): { time: string }[] {
        const { start, end } = operationalHours;
        const slots = [];
        let currentTime = start;

        while (currentTime < end) {
            slots.push({ time: currentTime });
            currentTime = this.addMinutes(currentTime, slotDuration);
        }

        return slots;
    }

    private async filterSlotsByAvailability(allSlots: { time: string }[], unavailable: { hours: string[] }): Promise<{ time: string }[]> {
        const availableSlots = []; // Array to store valid slots

        for (const slot of allSlots) {
            // Check if the current slot is unavailable
            const isUnavailable = await this.isTimeUnavailable(slot.time, unavailable.hours);
            // Include the slot only if it is not unavailable
            if (!isUnavailable) {
                availableSlots.push(slot);
            }
        }
        return availableSlots; // Return the filtered list of slots
    }

    private addMinutes(time: string, minutes: number): string {
        const [hours, mins] = time.split(':').map(Number);
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(mins + minutes);

        const newHours = date.getHours().toString().padStart(2, '0');
        const newMinutes = date.getMinutes().toString().padStart(2, '0');

        return `${newHours}:${newMinutes}`;
    }

    private isDayUnavailable(unavailable: UnavailableHoursRequestDTO, slotBookDate: string): boolean {
        var dayOfWeek = moment(slotBookDate).tz(process.env.TIMEZONE).format('dddd');
        return unavailable.day === dayOfWeek;
    }

    private async isTimeUnavailable(slotTime: string, unavailableHours: string[]): Promise<boolean> {
        // Check if slotTime falls within any unavailable range
        return unavailableHours.some((hourRange) => {
            const [start, end] = hourRange.split('-'); // Split "HH:mm-HH:mm"
            return slotTime >= start && slotTime < end; // Check if slotTime is within the range
        });
    }

    async bookAppointment(reqBody: SlotBookRequestDTO) {
        const config = await this.configModel.findOne();
        if (!config) throw new ConfigNotFound(`CONFIGURATION NOT FOUND.`);

        const { name, email, date, time } = reqBody;

        // Check if the selected date is a holiday
        await this.checkIsHoliday(config.appointmentConfigs.holidays, date);

        // Filter out unavailable hours (e.g., lunch breaks)
        const unavailable = config?.appointmentConfigs?.unavailableHours.find((u) => this.isDayUnavailable(u, date));
        const isTimeUnavailable = await this.isTimeUnavailable(time, unavailable.hours);
        if (isTimeUnavailable) throw new SlotUnavailableException(`SLOT UNAVAILABLE DUE TO UNAVAILABLE HOURS`);

        // Check if the slot is already fully booked
        const bookings = await this.appointmentModel.countDocuments({ date: date, time: time, appointmentStatus: AppointmentStatus.CONFIRMED });
        if (bookings >= config?.appointmentConfigs.maxSlotPerAppointment) throw new SlotExceedingMoreThanAllowedException('SLOT IS FULLY BOOKED.');

        const appointment = new this.appointmentModel({ name, email, date, time, slotsBooked: 1, appointmentStatus: AppointmentStatus.PENDING });
        return appointment.save();
    }

    async confirmedAppointment(id: string) {
        const appointment = await this.appointmentModel.findById(id);
        if (!appointment) throw new AppointmentNotFoundException(`APPOINTMENT ID ${id} NOT FOUND`);
        if (appointment.appointmentStatus === AppointmentStatus.CONFIRMED) throw new AppointmentStatusException(`APPOINTMENT ID ${id} ALREADY CONFIRMED`);

        // Set appointment status to confirmed
        appointment.appointmentStatus = AppointmentStatus.CONFIRMED;
        await this.appointmentListModel.updateOne(
            { date: appointment.date, "slots.time": appointment.time },
            {
                $set: {
                    "slots.$.appointment_id": appointment._id,
                    "slots.$.available_slots": 0,
                    "slots.$.bookedAt": new Date(),
                    "slots.$.updatedAt": new Date()
                }
            }
        );
        return appointment.save();
    }

    async cancelAppointment(id: string) {
        const config = await this.configModel.findOne();
        if (!config) throw new ConfigNotFound(`CONFIGURATION NOT FOUND.`);

        const appointment = await this.appointmentModel.findById(id);
        if (!appointment) throw new AppointmentNotFoundException(`APPOINTMENT ID ${id} NOT FOUND`);
        if (appointment.appointmentStatus === AppointmentStatus.CANCELLED) throw new AppointmentStatusException(`APPOINTMENT ID ${id} ALREADY BEEN CANCELLED`);

        appointment.appointmentStatus = AppointmentStatus.CANCELLED;
        appointment.slotsBooked = 0;  // Reset slots booked
        appointment.deleted = true;  // Soft delete the appointment
        appointment.deletedAt = new Date();  // Set the deletedAt timestamp

        await this.appointmentListModel.updateOne(
            { date: appointment.date, "slots.time": appointment.time },
            {
                $set: {
                    "slots.$.appointment_id": null,
                    "slots.$.available_slots": config?.appointmentConfigs?.maxSlotPerAppointment ?? 1,
                    "slots.$.bookedAt": null,
                    "slots.$.updatedAt": new Date()
                }
            }
        );
        
        return appointment.save();
    }

    async paginationMeta(
        qs: SlotQueryFilter,
        paginationMeta: boolean = false,
    ): Promise<Appointment[] | Pagination> {
        const conditions = {
            deleted: false,
        };

        return paginationMeta
            ? await qs.getPagination(this.appointmentModel, conditions)
            : await qs.setMongooseQuery(this.appointmentModel, conditions);
    }
}
