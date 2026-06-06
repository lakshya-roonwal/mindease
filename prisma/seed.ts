import { prisma } from '../src/lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  const hashedPassword = await bcrypt.hash('Demo@1234', 12)
  const today = new Date()
  const examDate = new Date(today)
  examDate.setDate(today.getDate() + 90)
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@mindease.app' },
    update: {},
    create: {
      email: 'demo@mindease.app',
      name: 'Arjun Sharma',
      password: hashedPassword,
      exams: {
        create: {
          type: 'NEET',
          date: examDate,
        }
      },
      streak: {
        create: {
          count: 7,
          lastUpdated: today
        }
      }
    },
  })

  // Seed 21 days of check-ins
  const checkIns = []
  for (let i = 20; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    // Simulate time of day (Morning or Night)
    const isMorning = Math.random() > 0.5
    date.setHours(isMorning ? 8 : 22, Math.floor(Math.random() * 60), 0, 0)

    let moodScore = 5
    let energyLevel = 5
    let triggers = []

    // Pattern: Week 1 (Low), Week 2 (Improving), Week 3 (Stabilizing, dips on weekend)
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;

    if (i > 14) {
      // Week 1: Very stressed
      moodScore = Math.floor(Math.random() * 3) + 3 // 3-5
      energyLevel = Math.floor(Math.random() * 3) + 3 // 3-5
      triggers.push('Syllabus Pressure', 'Mock Results')
    } else if (i > 7) {
      // Week 2: Improving
      moodScore = Math.floor(Math.random() * 3) + 5 // 5-7
      energyLevel = Math.floor(Math.random() * 3) + 5 // 5-7
      triggers.push('Sleep', 'Study Routine')
    } else {
      // Week 3: Stable, but weekends are hard
      if (isWeekend) {
        moodScore = Math.floor(Math.random() * 2) + 4 // 4-5
        triggers.push('Family Pressure', 'Lack of Breaks')
      } else {
        moodScore = Math.floor(Math.random() * 3) + 7 // 7-9
        energyLevel = Math.floor(Math.random() * 2) + 7 // 7-8
        triggers.push('Good Focus', 'Completed Target')
      }
    }

    checkIns.push({
      userId: user.id,
      moodScore,
      energyLevel,
      triggers: triggers.join(', '),
      createdAt: date
    })
  }

  await prisma.moodCheckIn.deleteMany({ where: { userId: user.id } })
  await prisma.moodCheckIn.createMany({ data: checkIns })

  // Seed 8 Journal Entries spread across the 21 days
  const journalEntries = [
    { dayOffset: 19, title: "Feeling Overwhelmed", content: "The mock test scores today were terrible. I feel like I'm not making any progress despite studying 10 hours a day. Physics is killing me.", mood: "Stressed", moodScore: 3 },
    { dayOffset: 16, title: "A bit better", content: "Talked to dad today. He told me to just focus on the process and not the result. Managed to finish the entire optics module.", mood: "Okay", moodScore: 5 },
    { dayOffset: 13, title: "Burnout", content: "Couldn't sleep last night. The syllabus looks like a mountain. Tried the 4-7-8 breathing but my mind kept wandering.", mood: "Anxious", moodScore: 4 },
    { dayOffset: 10, title: "Small wins", content: "Scored 650+ in today's part test! The revision strategy is finally paying off. Need to maintain this momentum.", mood: "Great", moodScore: 8 },
    { dayOffset: 7, title: "Sunday Blues", content: "Why do Sundays feel so heavy? Everyone is relaxing and I'm stuck here with biology flashcards. FOMO is real.", mood: "Stressed", moodScore: 4 },
    { dayOffset: 4, title: "Steady pace", content: "Consistently hitting my daily targets. The AI coach suggested I take 10-minute walks between subjects. It's actually helping.", mood: "Calm", moodScore: 7 },
    { dayOffset: 2, title: "Nervous but ready", content: "90 days left. It sounds like a lot but it's really not. I just need to trust my preparation. I am capable.", mood: "Okay", moodScore: 6 },
    { dayOffset: 0, title: "Today's Focus", content: "Just woke up. Setting three main goals for today: revise organic chem, give one full mock, and review mistakes immediately. Let's do this.", mood: "Calm", moodScore: 8 },
  ]

  await prisma.journalEntry.deleteMany({ where: { userId: user.id } })
  
  for (const entry of journalEntries) {
    const date = new Date(today)
    date.setDate(date.getDate() - entry.dayOffset)
    date.setHours(20, 0, 0, 0) // Evening reflections
    
    await prisma.journalEntry.create({
      data: {
        userId: user.id,
        title: entry.title,
        content: entry.content,
        mood: entry.mood,
        moodScore: entry.moodScore,
        createdAt: date,
        updatedAt: date
      }
    })
  }

  console.log(`✅ Demo user created: ${user.email}`)
  console.log(`✅ Seeded 21 days of check-ins`)
  console.log(`✅ Seeded 8 journal entries`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
