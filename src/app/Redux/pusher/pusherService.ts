// app/Redux/pusher/pusherService.ts
import Pusher from 'pusher-js'
import Cookies from "js-cookie";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const pusherKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY!
const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER!
const token = Cookies.get("authToken");

if (!pusherKey || !pusherCluster) {
  throw new Error('Pusher key and cluster must be defined in environment variables')
}

const pusher = new Pusher(pusherKey, {
  cluster: pusherCluster,
  authEndpoint: `${BASE_URL}/api/partner/notifications/auth`, 
  auth: {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  }
})

export const subscribeToNotifications = (userId: string, callback: (data: any) => void) => {
  const channel = pusher.subscribe(`private-partner-user.${userId}`)
  channel.bind(`private-partner-user.${userId}`, callback)
  
  return () => {
    channel.unbind(`private-partner-user.${userId}`, callback)
    pusher.unsubscribe(`private-partner-user.${userId}`)
  }
}

export const unsubscribeFromNotifications = (userId: string) => {
  pusher.unsubscribe(`private-partner-user.${userId}`)
}
