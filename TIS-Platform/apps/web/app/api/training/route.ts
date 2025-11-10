import { NextResponse } from 'next/server';

export async function GET() {
  const data = {
    courses: [
      {
        id: 1,
        title: 'ESG Fundamentals',
        description: 'Introduction to ESG principles',
        duration: '4 weeks',
        level: 'Beginner',
        enrolled: 234,
        rating: 4.8
      },
      {
        id: 2,
        title: 'AI Governance',
        description: 'Responsible AI practices',
        duration: '6 weeks',
        level: 'Intermediate',
        enrolled: 156,
        rating: 4.9
      }
    ],
    userProgress: {
      completedCourses: 2,
      inProgress: 1,
      totalHours: 45,
      certificates: 2
    }
  };

  return NextResponse.json(data);
}