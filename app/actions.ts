// app/actions.ts
'use server'

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function enviarQueja(formData: FormData) {
  const rating = formData.get('rating');
  const comment = formData.get('comment');
  const contact = formData.get('contact');

  try {
    await resend.emails.send({
      from: 'Acai Feedback <onboarding@resend.dev>',
      to: 'TU_EMAIL@gmail.com', // <--- Pone tu mail acá
      subject: `Nueva Queja - ${rating} Estrellas`,
      html: `<p>Estrellas: ${rating}</p><p>Queja: ${comment}</p><p>Contacto: ${contact}</p>`
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}