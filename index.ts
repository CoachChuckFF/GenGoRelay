import {Client, Events, GatewayIntentBits, Partials} from 'discord.js';
import * as api from 'clicksend';


// --------------- CLICKSEND BOT -----------------

const CLICKSEND_USERNAME = process.env.CLICKSEND_USERNAME as string;
const CLICKSEND_API_KEY = process.env.CLICKSEND_API_KEY as string;
const CLICKSEND_FROM = "myNumber";
const CLICKSEND_TO = process.env.CLICKSEND_TO as string;

const sms = new api.SMSApi(CLICKSEND_USERNAME, CLICKSEND_API_KEY);

function sendSMS(message: string) {

    const smsMessage = new api.SmsMessage();
    smsMessage.from = CLICKSEND_FROM;
    smsMessage.to = CLICKSEND_TO;
    smsMessage.body = message.substring(0, 280);

    const smsCollection = new api.SmsMessageCollection();
    smsCollection.messages = [smsMessage];

    sms.smsSendPost(smsCollection).then(function(response: any) {
        console.log("Message sent!")
    }).catch(function(err: any){
        console.error(`err.code: ${err}`);
    });
}

// --------------- DISCORD BOT -----------------

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;

// create a new Client instance
const client = new Client({
    intents: [GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent],
    partials: [Partials.Channel, Partials.Message, Partials.Reaction],
});

// listen for the client to be ready
client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on("messageCreate", async (message) => {
    if(message.channel.id === DISCORD_CHANNEL_ID) {
        console.log(message.content);
        sendSMS(message.content);
    }
 })

 client.on("error", (error) => {
    console.log(error);
})


// --------------- APP -----------------
client.login(DISCORD_TOKEN);
