import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
    constructor(
        private readonly mailerService: MailerService
    ) {}

    async signup(to: string): Promise<void> {
        this.send(to, '[써티] 회원가입을 인증해주세요.', 'signup.ejs', {
            email: to,
        });
    }

    private async send(
        to: string,
        subject: string,
        templateName: string,
        context: any = {}
    ): Promise<void> {
        try {
            this.mailerService.sendMail({
                to: to,
                subject: subject,
                template: `./${templateName}`,
                context: context,
            });
        } catch (error) {
            console.log(error);
        }
    }
}
