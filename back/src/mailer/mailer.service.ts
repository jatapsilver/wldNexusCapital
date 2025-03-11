import { Injectable } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailerService {
  constructor(private readonly mailerService: NestMailerService) {}

  //correo de bienvenida
  async sendEmailWelcome(
    email: string,
    name: string,
    username: string,
    sponsor: string,
    profile: string,
  ) {
    const template =
      profile === 'ambassador' ? 'welcome-ambassador' : 'welcome-user';

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: '¡Bienvenido a NeuroBotIA!',
        template: `./${template}`,
        context: {
          name,
          username,
          email,
          sponsor,
        },
      });

      console.log(`📧 Correo de bienvenida enviado a -> ${email}`);
    } catch (error) {
      console.error(`❌ Error al enviar correo a ${email}:`, error);
    }
  }

  //correo para recuperar contraseña
  async sendResetEmail(email: string, token: any, name: string) {
    const resetUrl = `${process.env.DOMAIN_FRONT}/reset-password?token=${token}`;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Recuperar contraseña NeuroBotIA',
        template: './reset-password',
        context: {
          email,
          resetUrl,
          name,
        },
      });

      console.log(
        `📧 Correo de recuperación de contraseña enviado a -> ${email}`,
      );
    } catch (error) {
      console.error(`❌ Error al enviar correo a ${email}:`, error);
    }
  }
}
