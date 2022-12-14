import { Body, Controller, Delete, Get, InternalServerErrorException, Param, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SchoolsService } from './schools.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { School } from './entity/Schools.entity';

@ApiTags('schools')
@Controller('schools')
export class SchoolsController {
    constructor(private schoolsService: SchoolsService) {}

    @ApiOperation({ summary: '학교 전체 조회 API', description: '학교 전체 조회'})
    @Get()
    async allSchools(): Promise<object> {
        try {
            return await this.schoolsService.allSchools();
        } catch(err) {
            throw err;
        }
    }

    @ApiOperation({ summary: '학교 정보 생성 API', description: '학교 정보 생성'})
    @Post()
    async create(@Body() createSchoolDto: CreateSchoolDto) {
        try {
            await this.schoolsService.create(createSchoolDto);
        } catch(err) {
            throw err;
        }
    }

    @ApiOperation({ summary: '학교 정보 수정 API', description: '학교 정보 수정'})
    @Patch(':no')
    async update(@Param('no') no: number, @Body() updateSchoolDto: UpdateSchoolDto) {
        try {
            await this.schoolsService.update(no, updateSchoolDto);
        } catch(err) {
            throw err;
        }
    }

    @ApiOperation({ summary: '학교 정보 삭제 API', description: '학교 정보 삭제'})
    @Delete(':no')
    async delete(@Param('no') no: number) {
        try {
            await this.schoolsService.delete(no);
        } catch(err) {
            throw err;
        }
    }
}
