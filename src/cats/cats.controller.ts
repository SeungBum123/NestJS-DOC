import { Body, Controller, Get, Header, HttpCode, HttpException, HttpStatus, Param, Post, Query, Redirect, UseFilters } from '@nestjs/common';
import { Cat } from './interface/cat.interface';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { ForbiddenException } from 'src/exception/forbidden';
import { HttpExceptionFilter } from 'src/exception/http-exception.filters';

@Controller('cats')
//컨트롤러 단위로 예외 바인딩 필터 가능
//@UseFilters(new HttpExceptionFilter)
export class CatsController {
    // constructor를 통해 CatsService 주입
    constructor(private catsService: CatsService) {}
    
    // API 경로 : GET /cats
    @Get()
    // 지역 바인딩 필터
    //@UseFilters(new HttpExceptionFilter())
    async findAll(): Promise<Cat[]> {
        /*
        표준 예외 필터

        throw new HttpException({
            status: HttpStatus.FORBIDDEN,
            error: 'This is a custom message',
        }, HttpStatus.FORBIDDEN);
        
        */

       // 사용자 정의 예외 필터를 적용 한 예시
       throw new ForbiddenException();
        return this.catsService.findAll();
    }

    // GET 요청 시 경로는 abcd, ab_cd, ab(어떠한 숫자나 문자, ?를 제외한 기호)cd 이다.
    @Get('ab*cd')
    test(): string {
        return 'success';
    }

    @Get('httpCode')
    /* 
    핸들러 부분에 HttpCode를 추가하여 동작 변경가능, 
    201번인 Post요청을 제외하면 상태코드는 전부 200번.
    204번은 No Content 이므로 API 요청을 보내도 
    return 값인 success는 값이 오지 않는다.  
    */
    @HttpCode(204)
    httpCode(): string {
        return 'success';
    }

    /* 
    해당 경로로 API 요청이 들어오면 'https://docs.nestjs.com' 이 경로로 리다이렉션이 되고,
    /cats/redirect?version=5 라는 쿼리를 주면 'https://docs.nestjs.com/v5/' 해당 경로로 리다이렉션 된다.
    */
    @Get('redirect')
    @Redirect('https://docs.nestjs.com', 301)
    redirect(@Query('version') version) {
        if (version != undefined) {
            return {url: 'https://docs.nestjs.com/v5/'}
        }
    }

    @Get(':id')
    findOne(@Param() params): string {
        return `This action returns a #${params.id} cat`
    }

    @Post('header')
    // API 요청시 header에 Key값과 Value를 지정할 수 있다.
    @Header('Cache-Control', 'none')
    header(): string {
        return 'success';
    }

    @Post()
    async create(@Body() createCatDto: CreateCatDto) {
        this.catsService.create(createCatDto);
    }
}
