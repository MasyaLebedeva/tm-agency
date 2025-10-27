import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { name, contact, messenger, message, timestamp } = await request.json()

    // Проверяем наличие пароля email
    if (!process.env.EMAIL_PASSWORD || process.env.EMAIL_PASSWORD === 'your_gmail_app_password_here') {
      console.log('Email не настроен, сохраняем заявку в лог')
      
      // Логируем заявку в консоль для отладки
      console.log('=== НОВАЯ ЗАЯВКА ===')
      console.log(`Имя: ${name}`)
      console.log(`Контакт: ${contact}`)
      console.log(`Мессенджер: ${messenger}`)
      console.log(`Сообщение: ${message}`)
      console.log(`Время: ${timestamp}`)
      console.log('==================')
      
      // Возвращаем успех, но без отправки email
      return NextResponse.json({ 
        success: true, 
        message: 'Заявка получена! Мы свяжемся с вами в ближайшее время.' 
      })
    }

    // Создаем transporter для отправки email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'masyalebedeva@gmail.com',
        pass: process.env.EMAIL_PASSWORD
      }
    })

    const mailOptions = {
      from: 'masyalebedeva@gmail.com',
      to: 'masyalebedeva@gmail.com',
      subject: `🎯 Новая заявка с сайта T&M Agency`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2AABEE;">🎯 НОВАЯ ЗАЯВКА С САЙТА</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>👤 Имя:</strong> ${name}</p>
            <p><strong>📱 Контакт:</strong> ${contact}</p>
            <p><strong>💬 Мессенджер:</strong> ${messenger}</p>
            <p><strong>📝 Сообщение:</strong> ${message}</p>
            <p><strong>⏰ Время:</strong> ${timestamp}</p>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Заявка отправлена с сайта T&M Agency
          </p>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Ошибка отправки email:', error)
    
    // Определяем тип ошибки для более понятного сообщения
    let errorMessage = 'Ошибка отправки заявки'
    
    if (error.code === 'EAUTH') {
      errorMessage = 'Ошибка аутентификации email. Проверьте настройки.'
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Ошибка подключения к email серверу.'
    } else if (error.message?.includes('535')) {
      errorMessage = 'Неверные учетные данные email. Обратитесь к администратору.'
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
