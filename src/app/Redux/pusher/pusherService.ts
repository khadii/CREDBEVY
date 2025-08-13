// // app/Redux/pusher/pusherService.ts
// import Pusher from 'pusher-js'
// import Cookies from "js-cookie";
// const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
// const pusherKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY!
// const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER!
// const token = Cookies.get("authToken");

// if (!pusherKey || !pusherCluster) {
//   throw new Error('Pusher key and cluster must be defined in environment variables')
// }

// const pusher = new Pusher(pusherKey, {
//   cluster: pusherCluster,
//   authEndpoint: `${BASE_URL}/api/partner/notifications/auth`, 
//   auth: {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json"
//     }
//   }
// })

// export const subscribeToNotifications = (userId: string, callback: (data: any) => void) => {
//   const channel = pusher.subscribe(`private-partner-user.${userId}`)
//   channel.bind(`private-partner-user.${userId}`, callback)
  
//   return () => {
//     channel.unbind(`private-partner-user.${userId}`, callback)
//     pusher.unsubscribe(`private-partner-user.${userId}`)
//   }
// }

// export const unsubscribeFromNotifications = (userId: string) => {
//   pusher.unsubscribe(`private-partner-user.${userId}`)
// }import Pusher from 'pusher-js';
// import Cookies from 'js-cookie';
// import Pusher from 'pusher-js';

// const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
// const pusherKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY || '55c933a520b4f61645f4'; // Fallback to test code key
// const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER || 'eu'; // Fallback to test code cluster

// if (!pusherKey || !pusherCluster || !BASE_URL) {
//   console.error('Missing environment variables:', {
//     pusherKey: !!pusherKey,
//     pusherCluster: !!pusherCluster,
//     baseUrl: !!BASE_URL,
//   });
//   throw new Error('Pusher key, cluster, or base URL must be defined in environment variables');
// }

// // Enable Pusher logging for debugging
// Pusher.logToConsole = true;

// const pusher = new Pusher(pusherKey, {
//   cluster: pusherCluster,
//   forceTLS: true,
//   authorizer: (channel, options) => {
//     return {
//       authorize: (socketId, callback) => {
//         const token = Cookies.get('authToken');
//         if (!token) {
//           console.error('No authToken found in cookies');
//           callback(new Error('No authToken found'), null);
//           return;
//         }

//         console.log('Authorizing Pusher channel:', channel.name, 'with socketId:', socketId);
//         fetch(`${BASE_URL}/api/partner/notifications/auth`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             socket_id: socketId,
//             channel_name: channel.name,
//           }),
//         })
//           .then((response) => {
//             // console.log('Auth endpoint response status:', response.status);
//             return response.json();
//           })
//           .then((data) => {
//             console.log('Pusher auth response:', data);
//             if (data.error) {
//               // console.error('Auth endpoint error:', data.message);
//               callback(new Error(data.message), null);
//             } else {
//               callback(null, data);
//             }
//           })
//           .catch((error) => {
//             // console.error('Pusher auth fetch error:', error.message);
//             callback(error, null);
//           });
//       },
//     };
//   },
// });

// export const subscribeToNotifications = (userId: string, callback: (data: any) => void) => {
//   if (!userId) {
//     console.error('User ID is required for Pusher subscription');
//     return () => {};
//   }

//   const channelName = `private-partner-user.${userId}`;
//   // console.log(`Subscribing to channel: ${channelName}`);
//   const channel = pusher.subscribe(channelName);

//   // Listen for all events so we don't miss any or trigger warnings
//   channel.bind_global((eventName: string, data: any) => {
//     console.log(`Pusher event received on ${channelName}: ${eventName}`, data);
//     callback({ event: eventName, data });
//   });

//   channel.bind('pusher:subscription_succeeded', () => {
//     // console.log(`Successfully subscribed to ${channelName}`);
//   });

//   channel.bind('pusher:subscription_error', (error: any) => {
//     // console.error(`Subscription error for ${channelName}:`, error);
//   });

//   pusher.connection.bind('error', (error: any) => {
//     console.error('Pusher connection error:', error);
//   });

//   pusher.connection.bind('connected', () => {
//     console.log('Pusher connected successfully');
//   });

//   pusher.connection.bind('unavailable', () => {
//     console.error('Pusher connection unavailable');
//   });

//   return () => {
//     console.log(`Unsubscribing from ${channelName}`);
//     channel.unbind_global();
//     pusher.unsubscribe(channelName);
//   };
// };

// export const unsubscribeFromNotifications = (userId: string) => {
//   if (userId) {
//     const channelName = `private-partner-user.${userId}`;
//     console.log(`Unsubscribing from ${channelName}`);
//     pusher.unsubscribe(channelName);
//   }
// };







import Cookies from 'js-cookie';
import Pusher from 'pusher-js';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const pusherKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY || '55c933a520b4f61645f4';
const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER || 'eu';

if (!pusherKey || !pusherCluster || !BASE_URL) {
  console.error('Missing environment variables:', {
    pusherKey: !!pusherKey,
    pusherCluster: !!pusherCluster,
    baseUrl: !!BASE_URL,
  });
  throw new Error('Pusher key, cluster, or base URL must be defined in environment variables');
}

Pusher.logToConsole = true;

const pusher = new Pusher(pusherKey, {
  cluster: pusherCluster,
  forceTLS: true,
  authorizer: (channel, options) => {
    return {
      authorize: (socketId, callback) => {
        const token = Cookies.get('authToken');
        if (!token) {
          console.error('No authToken found in cookies');
          callback(new Error('No authToken found'), null);
          return;
        }

        console.log('Authorizing Pusher channel:', channel.name, 'with socketId:', socketId);
        fetch(`${BASE_URL}/api/partner/notifications/auth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            socket_id: socketId,
            channel_name: channel.name,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log('Pusher auth response:', data);
            if (data.error) {
              callback(new Error(data.message), null);
            } else {
              callback(null, data);
            }
          })
          .catch((error) => {
            console.error('Pusher auth fetch error:', error.message);
            callback(error, null);
          });
      },
    };
  },
});

export const subscribeToNotifications = (userId: string, callback: (data: any) => void) => {
  if (!userId) {
    console.error('User ID is required for Pusher subscription');
    return () => {};
  }

  const channelName = `private-partner-user.${userId}`;
  console.log(`Subscribing to channel: ${channelName}`);
  const channel = pusher.subscribe(channelName);

  // Bind to production notification event
  channel.bind('notification.created', (data: any) => {
    console.log(`Pusher event received on ${channelName}: notification.created`, JSON.stringify(data, null, 2));
    callback(data);
  });

  // Temporary binding for testing (remove in production)
  channel.bind('test.notification', (data: any) => {
    console.log(`Pusher test event received on ${channelName}: test.notification`, JSON.stringify(data, null, 2));
    callback(data);
  });

  channel.bind('pusher:subscription_succeeded', () => {
    console.log(`Successfully subscribed to ${channelName}`);
  });

  channel.bind('pusher:subscription_error', (error: any) => {
    console.error(`Subscription error for ${channelName}:`, error);
  });

  pusher.connection.bind('error', (error: any) => {
    console.error('Pusher connection error:', error);
  });

  pusher.connection.bind('connected', () => {
    console.log('Pusher connected successfully');
  });

  pusher.connection.bind('unavailable', () => {
    console.error('Pusher connection unavailable');
  });

  return () => {
    console.log(`Unsubscribing from ${channelName}`);
    channel.unbind('notification.created');
    channel.unbind('test.notification'); // Unbind test event
    pusher.unsubscribe(channelName);
  };
};

export const unsubscribeFromNotifications = (userId: string) => {
  if (userId) {
    const channelName = `private-partner-user.${userId}`;
    console.log(`Unsubscribing from ${channelName}`);
    pusher.unsubscribe(channelName);
  }
};