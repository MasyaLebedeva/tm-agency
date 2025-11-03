import { NextResponse } from 'next/server'

// Простая проверка здоровья сайта для мониторинга
export async function GET() {
  try {
    return NextResponse.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      message: 'Site is running' 
    }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ 
      status: 'error', 
      timestamp: new Date().toISOString(),
      error: 'Site check failed' 
    }, { status: 500 })
  }
}

