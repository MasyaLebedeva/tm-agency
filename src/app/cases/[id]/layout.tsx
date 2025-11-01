import type { Metadata } from 'next'
import { casesData } from '../cases-data'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const caseId = parseInt(params.id)
  const caseItem = casesData.find(c => c.id === caseId)
  
  if (!caseItem) {
    return {
      title: 'Кейс не найден - T&M Agency',
      robots: 'noindex, follow',
    }
  }

  return {
    title: `${caseItem.title} - Кейс T&M Agency`,
    description: caseItem.description,
    alternates: {
      canonical: `https://tmads.ru/cases/${caseItem.id}`,
    },
    openGraph: {
      title: caseItem.title,
      description: caseItem.description,
      url: `https://tmads.ru/cases/${caseItem.id}`,
      type: 'article',
    },
  }
}

export default function CaseLayout({ children }: { children: React.ReactNode }) {
  return children
}

