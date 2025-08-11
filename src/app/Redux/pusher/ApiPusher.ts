// // app/api/pusher/auth/route.ts
// import { NextResponse } from 'next/server'
// import Pusher from 'pusher'
// import { cookies } from 'next/headers'

// const pusher = new Pusher({
//   appId: process.env.PUSHER_APP_ID!,
//   key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
//   secret: process.env.PUSHER_APP_SECRET!,
//   cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER!,
//   useTLS: true
// })

// export async function POST(req: Request) {
//   try {
//     const body = await req.json()
//     const { socket_id, channel_name } = body
    
//     // Get auth token from cookies
//     const cookieStore = cookies()
//     const token = (await cookieStore).get('authToken')?.value
    
//     if (!token) {
//       return NextResponse.json(
//         { error: 'Authentication token missing' },
//         { status: 401 }
//       )
//     }

//     // Replace with your actual token verification logic
//     const userId = extractUserIdFromToken(token)
    
//     if (!userId) {
//       return NextResponse.json(
//         { error: 'Invalid authentication token' },
//         { status: 401 }
//       )
//     }

//     // Validate channel access
//     if (!channel_name.startsWith(`private-partner-user.${userId}`)) {
//       return NextResponse.json(
//         { error: 'Unauthorized channel access' },
//         { status: 403 }
//       )
//     }

//     // Use the new authorizeChannel method instead of authenticate
//     const authResponse = pusher.authorizeChannel(socket_id, channel_name)
//     return NextResponse.json(authResponse)
    
//   } catch (error) {
//     console.error('Pusher authentication error:', error)
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     )
//   }
// }

// // Replace with your actual token verification logic
// function extractUserIdFromToken(token: string): string | null {
//   try {
//     // This is a placeholder - implement your actual token verification
//     // For example, if your token is just the user ID:
//     return token // WARNING: This is not secure for production
    
//     // In production, you would:
//     // 1. Verify JWT with your secret
//     // 2. Or query your session store
//     // 3. Then return the user ID
//   } catch (error) {
//     console.error('Token verification failed:', error)
//     return null
//   }
// }