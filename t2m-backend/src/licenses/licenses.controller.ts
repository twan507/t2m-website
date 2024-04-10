import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile, Put } from '@nestjs/common';
import { CreateLicenseDto } from './dto/create-license.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { LicensesService } from './licenses.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('licenses')
export class LicensesController {
  constructor(private readonly licensesService: LicensesService) { }

  @Post("update-licenses-days-left")
  @Public()
  @ResponseMessage("Update license date")
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  updateLincesesDaysLeft() {
    return this.licensesService.updateLincesesDaysLeft()
  }

  @Post()
  create(
    @Body() createLicenseDto: CreateLicenseDto,
    @User() user: IUser,
  ) {
    return this.licensesService.create(createLicenseDto, user);
  }

  @Post('extend')
  extend(
    @Body() body: { id: string, monthExtend: number, price: number },
    @User() user: IUser,
  ) {
    return this.licensesService.extend(body.id, body.monthExtend, body.price, user);
  }

  @Post('undo-extend')
  undoExtend(
    @Body() body: { id: string },
    @User() user: IUser,
  ) {
    return this.licensesService.undoExtend(body.id, user);
  }

  @Get()
  @ResponseMessage("Fetch list License with paginate")
  findAll(
    @Query("current") current: string,
    @Query("pageSize") pageSize: string,
    @Query() qs: string
  ) {
    return this.licensesService.findAll(+current, +pageSize, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.licensesService.findOne(id);
  }


  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: { product: string, discountCode: string, discountPercent: number, monthAdjust: number, priceAdjust: number},
    @User() user: IUser
  ) {
    return this.licensesService.update(id, body, user);
  }

  @Patch(':id')
  changeActivation(@Param('id') id: string, @User() user: IUser, @Body() body: { status: boolean }) {
    return this.licensesService.changeActivation(id, user, body.status);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.licensesService.remove(id, user);
  }
}
