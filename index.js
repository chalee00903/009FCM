const admin = require('firebase-admin')
const { google } = require('googleapis')
const axios = require('axios')

const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging'
const SCOPES = [MESSAGING_SCOPE]

const serviceAccount = require('./fcm-460f9-firebase-adminsdk-6kr2p-7fea0a3d29.json')
const databaseURL = 'https://fcm-460f9.firebaseio.com'
const URL =
  'https://fcm.googleapis.com/v1/projects/messanging-fbf79/messages:send'
const deviceToken =
  'ffo1bR7zCTY9jzwx7EKvFV:APA91bFgG6mbGH3K6_GqblUtYz28SATrnt7DfQxFlZx0qkfadyNjzFvWjTLuCQFjKo30cV8sJ_k3484PWHeM1WdPvoL6uHRiqky4q8YcYtg0d59YrbkspRU0mIdf4w-aUArXVNV99bj_'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL
})

function getAccessToken() {
  return new Promise(function(resolve, reject) {
    var key = serviceAccount
    var jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    )
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        reject(err)
        return
      }
      resolve(tokens.access_token)
    })
  })
}

async function init() {
  const body = {
    message: {
      data: { key: 'value' },
      notification: {
        title: 'Notification title',
        body: 'Notification body'
      },
      webpush: {
        headers: {
          Urgency: 'high'
        },
        notification: {
          requireInteraction: 'true'
        }
      },
      token: deviceToken
    }
  }

  try {
    const accessToken = await getAccessToken()
    console.log('accessToken: ', accessToken)
    const { data } = await axios.post(URL, JSON.stringify(body), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })
    console.log('name: ', data.name)
  } catch (err) {
    console.log('err: ', err.message)
  }
}

init()