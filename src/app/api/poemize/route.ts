import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Analyze this image and write a poem about it. Limit the poem to 4 lines. Make it very flowery. Add an easter egg about turtles. Write the poem like it was written in the 1800s.',
          },
          {
            //@ts-ignore
            type: 'image_url',
            image_url: {
              url,
            },
          },
        ],
      },
    ],
  })

  return NextResponse.json({ poem: completion.choices[0].message.content })
}
