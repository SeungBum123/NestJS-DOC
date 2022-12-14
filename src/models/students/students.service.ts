import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entity/Students.entity';
import { StudentsRepository } from './repository/students.repository';

@Injectable()
export class StudentsService {
    constructor(
        @InjectRepository(Student, 'testDB_1')
        private studentsInfo: Repository<Student>,

        private readonly studentRepository: StudentsRepository
    ) {}
    
    async allStudents() {
        try {
            return await this.studentRepository.allStudents();
        } catch(err) {
            throw err;
        }
    }

    async create(createStudentDto:CreateStudentDto) {
        try {
            const {name, age, school, email, password, summary} = createStudentDto;
            const student = this.studentsInfo.create({name, age, school, email, password, summary});
            
            await this.studentsInfo.save(student);

            if (!student) {
                throw new InternalServerErrorException(1500);
            }

            return student;
        } catch(err) {
            throw err;
        }
    }

    async update(no: number, updateStudentDto: UpdateStudentDto) {
        try {
            const student: Student = await this.studentsInfo.findOne({
                where: {
                    no,
                },
            });

        if (!student) {
            throw new NotFoundException(1000);
        }
        const {affected} = await this.studentsInfo.update(no, updateStudentDto);

        if (!affected) {
            throw new InternalServerErrorException(1500);
        }

        return affected;
        } catch(err) {
            throw err;
        }
    }

    async delete(no: number) {
        try {
            const student: Student = await this.studentsInfo.findOne({
                where: {
                    no,
                },
            });
            
            if (!student) {
                throw new NotFoundException(1000);
            };

            const {affected} = await this.studentsInfo.delete(no);

            if (!affected) {
                throw new InternalServerErrorException(1500);
            }

            return affected;
        } catch (err) {
            throw err;
        }
    }
}
