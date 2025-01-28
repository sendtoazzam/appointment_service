import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Public } from 'src/common/decorator/public.decorator';
import { AppointmentService } from './appointment.service';
import { GetSlotResponseDTO } from './dto/response/get-slot.response.dto';
import { SlotUnavailableException } from './exception/slot-unavailable.exception';
import { SlotBookRequestDTO } from './dto/request/slot-book/slot-book.request.dto';
import { AppointmentResponseDTO } from './dto/response/appointment.response.dto';

@Controller('appointment')
export class AppointmentController {
    constructor(
        private readonly appointmentService: AppointmentService
    ) { }

    @Public()
    @Get('slots')
    @ApiResponse({
        status: 200,
        type: Object
    })
    async getAvailableSlot(
        @Query('date') slotBookDate: string,
    ): Promise<GetSlotResponseDTO[]> {
        const slots = await this.appointmentService.getAvailableSlots(slotBookDate);

        if (!slots) throw new SlotUnavailableException(`No slots available`);

        return slots.map(GetSlotResponseDTO.fromModel);
    }

    @Public()
    @Post('book')
    @ApiResponse({
        status: 200,
        type: Object
    })
    async bookAppointment(@Body() reqBody: SlotBookRequestDTO): Promise<AppointmentResponseDTO> {
        const bookAppointment = await this.appointmentService.bookAppointment(reqBody);
        return AppointmentResponseDTO.fromModel(bookAppointment);
    }

    @Public()
    @Put(':id/confirm')
    @ApiResponse({
        status: 200,
        type: Object
    })
    async confirmAppointment(@Param('id') id: string ): Promise<AppointmentResponseDTO> {
        const confirm = await this.appointmentService.confirmedAppointment(id);
        return AppointmentResponseDTO.fromModel(confirm);
    }

    @Public()
    @Put(':id/cancel')
    @ApiResponse({
        status: 200,
        type: Object
    })
    async cancelAppointment(@Param('id') id: string): Promise<AppointmentResponseDTO> {
        const cancelAppointment = await this.appointmentService.cancelAppointment(id);
        return AppointmentResponseDTO.fromModel(cancelAppointment);
    }
}
