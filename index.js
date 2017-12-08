const http = require('http')
const Bot = require('messenger-bot')
const HELPTEXT = 'Commands I understand: Hours, Specials, Agent'
const HOURSTEXT = 'We are open Monday - Saturday 9 AM until 5 PM'
const SPECIALSTEXT = 'Everything is 25% off today!'
const UNKNOWNCOMMANDTEXT = 'Sorry I don\'t understand that command';
let bot = new Bot({
  token: 'EAAIEkB2BCmUBAAMn4QeFcTkxT8p7SzaJh69Kg0hiszj0y12Ow0ZAiNuooouisqnwilSGqc7d0mAmcQSqQxSEYacl8ISdb1bgN6AbjI1Rjd03hldQjyKI5mnke93skZAZCMZAppKWt7AsRJuUFJhOhN7sZBRPBEOAYyXSLhpmaWwZDZD',
  verify: 'MOXIE123',
  secondary_app_id: '2012752778969680'
})

bot.on('error', (err) => {
  console.log(err.message)
})

/*
bot.on('regain_control', (payload, reply) => {
  let text = 'Regaining control' + '\n' + HELPTEXT;
  reply({ text }, (err) => {
    if (err) throw err

    console.log(`regaining thread control to be primary`)
  })
})
*/
bot.on('regain_control', (payload, reply) => {
  bot.sendMessage(payload.sender.id, { text: 'Regaining control' },  (err) => {
    if (err) throw err  
    console.log('unknown command')
  })
  bot.sendHelpButtonTemplate(payload.sender.id, (err) => {
    if (err) throw err      
    console.log('regained control')
  });
  return;
})

bot.on('postback', (payload, reply) => {
  var p = payload;
  if (p.postback.payload == "GET_STARTED")
  {
    bot.sendHelpButtonTemplate(payload.sender.id, (err) => {
      if (err) throw err      
      console.log(`Received postback ${p.postback.payload}`)
    });
    return;
    /*
    bot.sendMessage(payload.sender.id, { text: HELPTEXT },  (err) => {
      if (err) throw err

      console.log(`Received postback ${p.postback.payload}`)
    })*/
  } else if (p.postback.payload == "HOURS")
  {
    text = HOURSTEXT;
  }
  else if (p.postback.payload == "SPECIALS")
  {
    text = SPECIALSTEXT;
  }
  else if (p.postback.payload == "AGENT")
  {
    bot.passThreadControl(payload.sender.id)
    text = 'Sending control to a live agent, please wait...';
  }

  reply({ text }, (err) => {
    if (err) throw err

    console.log(`Received postback ${p.postback.payload}`)
  })
})

bot.on('message', (payload, reply) => {
  let text = payload.message.text

  bot.getProfile(payload.sender.id, (err, profile) => {
    if (err) throw err
    
    if (text.toLowerCase() == "help")
    {
      bot.sendHelpButtonTemplate(payload.sender.id, (err) => {
        if (err) throw err      
        console.log('sending help button menu')
      });
      return;
      
    } else if (text.toLowerCase() == "hours")
    {        
        text= HOURSTEXT;
    } else if (text.toLowerCase() == "specials")
    {
        text = SPECIALSTEXT;
    } else if (text.toLowerCase() == "agent")
    {
        bot.passThreadControl(payload.sender.id)
        text = 'Sending control to a live agent, please wait...'
    }
    else
    {
      bot.sendMessage(payload.sender.id, { text: UNKNOWNCOMMANDTEXT },  (err) => {
        if (err) throw err  
        console.log('unknown command')
      })
      bot.sendHelpButtonTemplate(payload.sender.id, (err) => {
        if (err) throw err      
        console.log('sending help button menu')
      }); 
      return;
    }

    reply({ text }, (err) => {
      if (err) throw err

      console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
    })
  })
})
var port = process.env.PORT || 3000;
http.createServer(bot.middleware()).listen(port)
console.log('Echo bot server running at port.')