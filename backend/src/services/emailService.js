const transporter = require('../config/mailer');

async function sendBookingConfirmation({ clientName, clientEmail, professionalName, serviceName, date, time }) {
  await transporter.sendMail({
    from: `"Agenda de Reservas" <${process.env.EMAIL_USER}>`,
    to: clientEmail,
    subject: 'Agendamento confirmado!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">Agendamento Confirmado</h2>
        <p>Olá, <strong>${clientName}</strong>!</p>
        <p>Seu agendamento foi confirmado com sucesso.</p>
        <div style="background: #f0f2f5; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
          <p><strong>Profissional:</strong> ${professionalName}</p>
          <p><strong>Serviço:</strong> ${serviceName}</p>
          <p><strong>Data:</strong> ${new Date(date).toLocaleDateString('pt-BR')}</p>
          <p><strong>Horário:</strong> ${time.slice(0, 5)}</p>
        </div>
        <p>Até logo!</p>
      </div>
    `,
  });
}

async function sendBookingCancellation({ clientName, clientEmail, professionalName, serviceName, date, time }) {
  await transporter.sendMail({
    from: `"Agenda de Reservas" <${process.env.EMAIL_USER}>`,
    to: clientEmail,
    subject: 'Agendamento cancelado',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ef4444;">Agendamento Cancelado</h2>
        <p>Olá, <strong>${clientName}</strong>!</p>
        <p>Infelizmente seu agendamento foi cancelado.</p>
        <div style="background: #f0f2f5; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
          <p><strong>Profissional:</strong> ${professionalName}</p>
          <p><strong>Serviço:</strong> ${serviceName}</p>
          <p><strong>Data:</strong> ${new Date(date).toLocaleDateString('pt-BR')}</p>
          <p><strong>Horário:</strong> ${time.slice(0, 5)}</p>
        </div>
        <p>Entre em contato para reagendar.</p>
      </div>
    `,
  });
}

module.exports = { sendBookingConfirmation, sendBookingCancellation };