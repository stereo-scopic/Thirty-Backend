import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as ejs from 'ejs';
import path from 'path';

@Injectable()
export class EmailService {
    constructor(
        private readonly mailerService: MailerService
    ) {}

    async signup(to: string, authCode: number): Promise<void> {
        this.send(to, '[써티] 회원가입을 인증번호 입니다.', 'signup.ejs', {
            code: authCode,
        });
    }

    private async send(
        to: string,
        subject: string,
        templateName: string,
        context: any = {},
    ): Promise<void> {
        ejs.renderFile(path.join(__dirname, `/../templates/${templateName}`), context, (err, data) => {
            if (err) {
                console.log(err);
                return;
            }
            try {
                this.mailerService.sendMail({
                    to: to,
                    subject: subject,
                    sender: '써티',
                    // template: `./${templateName}`,
                    html: data,
                    context: context,
                });
                console.log(`
                    mail sent success
                    receiver: ${to},
                    data: ${context}
                `);
            } catch (error) {
                console.log(`
                    error occurred
                    receiver: ${to},
                    at: ${new Date()}
                    message: ${error}
                `);
            }
        })
    }
}
