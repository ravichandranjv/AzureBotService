var restify = require('restify');
var builder = require('botbuilder');
var server = restify.createServer();

server.listen(process.env.port || process.env.PORT || 8080, function () {
   console.log('%s listening to %s', server.name, server.url);
});

var connector = new builder.ChatConnector({
    appId: "89a56755-5917-4150-a0bb-106a8b827ed7",
    appPassword: "xoBaosafcHDwmLmDdpKz5iE",
    serviceUrl: "https://smba.trafficmanager.net/apis/"
});
server.post('/api/messages', connector.listen());
var bot = new builder.UniversalBot(connector);

bot.dialog('/', [
  function (session) {
      builder.Prompts.text(session, "Hey there, how are you doing?");
  },
   function (session, results) {
      session.send("Great!  Thank you for seeking my help!")
      builder.Prompts.text(session, "I will try to find a solution for you, ok?");      
    },
    function (session) {
        var card = new builder.ThumbnailCard(session);        
        card
        .buttons([
            new builder.CardAction(session).title('Set a reminder').value('Setting...').type('imBack'),
            new builder.CardAction(session).title('Something else').value('Help').type('imBack'),
        ])
        .images([
                      builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/PikePlaceMarket.jpg/320px-PikePlaceMarket.jpg"),
        ])
        .text(`What would you like to do?`);

        var message = new builder.Message(session);
        message.addAttachment(card);

        session.send(`Hey there, how are you doing? I can set a reminder for you to start with.`);
        var choices = ['Set', 'Something else'];
        builder.Prompts.choice(session, message, choices);        
    },
    function (session, results) {
         var msg="Give me the time to set reminder.";
         //builder.Prompts.Time(session,"Please provide the date and time to set reminder for (e.g.: June 6th at 5pm)");
         session.endDialogWithResults(results);
    },
    function (session, results) {
     // if (results.response.entity==="Send my profile")
         session.replaceDialog('Setreminder',results);
    }
]);//.triggerAction({matches: [/hi/i, /hello/i, /hey/i]});
bot.dialog('Help',[
  function (session,args){
    var message = null;
        var card = new builder.ThumbnailCard(session);
        
        card
        .buttons([
            new builder.CardAction(session).title('Send your profile').value('Profile').type('imBack'),
            new builder.CardAction(session).title('Send my profile').value('Myprofile').type('imBack'),
            new builder.CardAction(session).title('Chat with me').value('Chat').type('imBack'),
        ])
        .images([
                      builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/PikePlaceMarket.jpg/320px-PikePlaceMarket.jpg"),
        ])
        .text(`What would you like to do?`);

        var message = new builder.Message(session);
        message.addAttachment(card);

        var choices = ['Send me your profile', 'Send my profile',"Chat with me"];
        builder.Prompts.choice(session, message, choices);        
    },
    function (session, results) {
        if (results.response) {
            console.log(results.response+ " " + results.response.entity);
        }
         session.replaceDialog('SendProfile',results);
    }        
]).triggerAction({
  matches:/Help/,
  onSelectAction:function(session,args){
    session.beginDialog(args.action,args);
  }
  });
  
bot.dialog('SendProfile',[
  function(session,results){
    var text = "Please find attached my profile"
    var reply = 
    new builder.Message()
        .setText(session, text)
        //.addAttachment({ fallbackText: text, contentType: 'pdf/pdf', contentUrl: "https://drive.google.com/open?id=0B1sqI07DjwuudG1EV2htdUJ2d28" });
        session.send(reply);        
  }
]).triggerAction({
  matches:/Profile/,
  onSelectAction:function(session,args){
    session.beginDialog(args.actions,args);
  }
});

String.prototype.contains = function(content){
  return this.indexOf(content) !== -1;
}

bot.dialog("Setreminder",[
  function (session,args){
    var message = null;
        //session.dialogData.time = builder.EntityRecognizer.resolveTime([args.response]);
        session.send("Reminder set (Dummy)");
  }
]).triggerAction({
  matches:/Setting.../,
    onSelectAction: function (session, args){
        session.beginDialog(args.action, args);
    }
});
/*
bot.on('contactRelationUpdate', function (message) {
    if (message.action === 'add') {
        var name = message.user ? message.user.name : null;
        var reply = new builder.Message()
                .address(message.address)
                .text("Hello %s... Thanks for adding me!", name || 'there');
        bot.send(reply);
    } else {
        // delete their data
    }
});
var bot = new builder.UniversalBot(connector, [function (session,args) {
var card = new builder.ThumbnailCard(session);
        card.buttons([
            new builder.CardAction(session).title('Set a reminder').value('Setting...').type('imBack'),
            new builder.CardAction(session).title('Something else').value('Help').type('imBack'),
        ]).text(`What would you like to do?`);

        var message = new builder.Message(session);
        message.addAttachment(card);

        session.send(`Hi there! I can set a reminder for you to start with.`);
        var choices = ['Set', 'Help'];
        builder.Prompts.choice(session, message, choices);
    },
    function (session, results){
        session.endConversation("Setting reminder. Thank you!");
    }
  ]);
  
bot.dialog('Setting...', [
    function (session, args, next){
        session.endConversation(`Setting reminder`);
    },
]).triggerAction({matches: [/hi/i, /hello/i, /hey/i]});
//.beginDialogAction('Reminder', 'Total', { matches: /^total$/});

/* 
    if (session.message && session.message.value) {
        // A Card's Submit Action obj was received
        processSubmitAction(session, session.message.value);
        return;
    }

var card = {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "body": [
                {
                    "type": "Container",
                    "speak": "<s>Hello!</s><s>Do you want to set a reminder or an alarm?</s>",
                    "items": [
                        {
                            "type": "ColumnSet",
                            "columns": [
                                {
                                    "type": "Column",
                                    "size": "auto",
                                    "items": [
                                        {
                                            "type": "Image",
                                            "url": "https://placeholdit.imgix.net/~text?txtsize=65&txt=Adaptive+Cards&w=300&h=300",
                                            "size": "medium",
                                            "style": "person"
                                        }
                                    ]
                                },
                                {
                                    "type": "Column",
                                    "size": "stretch",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": "Hello!",
                                            "weight": "bolder",
                                            "isSubtle": true
                                        },
                                        {
                                            "type": "TextBlock",
                                            "text": "Do you want to set a reminder or an alarm?",
                                            "wrap": true
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            "actions": [
                {
                    "type": "Action.ShowCard",
                    "title": "Set Alarm",
                    "speak": "<s>Alarm</s>",
                    "card": {
                        "type": "AdaptiveCard",
                        "body": [
                            {
                                "type": "TextBlock",
                                "text": "Please enter time:"
                            },
                            {
                                "type": "Input.Time",
                                "id": "time",
                                "speak": "<s>Please enter time</s>",
                                "placeholder": "12:00 AM",
                                "style": "text"
                            },
                            {
                                "type": "TextBlock",
                                "text": "Which date?"
                            },
                            {
                                "type": "Input.Date",
                                "id": "date",
                                "speak": "<s>Which date?</s>"
                            },
                            {
                                "type": "TextBlock",
                                "text": "Please enter recurring frequency for the alarm."
                            },
                            {
                                "type": "Input.Number",
                                "id": "recurrence",
                                "min": 1,
                                "max": 60,
                                "speak": "<s>Please enter recurring frequency for the alarm</s>"
                            }
                        ],
                        "actions": [
                            {
                                "type": "Action.Submit",
                                "title": "reminder",
                                "speak": "<s>Set reminder</s>",
                                "data": {
                                    "type": "setReminder"
                                }
                            }
                        ]
                    }
                },
                {
                    "type": "Action.ShowCard",
                    "title": "Flights",
                    "speak": "<s>Flights</s>",
                    "card": {
                        "type": "AdaptiveCard",
                        "body": [
                            {
                                "type": "TextBlock",
                                "text": "Flights is not implemented =(",
                                "speak": "<s>Flights is not implemented</s>",
                                "weight": "bolder"
                            }
                        ]
                    }
                }
            ]
    };

    var msg = new builder.Message(session)
        .addAttachment(card);
        session.send(msg);
        
});

//=========================================================
// Bots Dialogs
//=========================================================
/*
bot.dialog('/', [
  function (session) {
      builder.Prompts.text(session, "Hey there, how are you doing?");
  },
  function (session, results) {
    //session.userData.howIsHe = results.response;
    session.send("Great! Thank you for letting me know.");
    builder.Prompts.text(session, "How can I be of service to you?");  
  },
    function (session, results) {
      session.send("Great!  Thank you for seeking my help!")
      builder.Prompts.text(session, "I will try to find a solution for you");
      
    }
]);


// Set reminder
bot.dialog('/set-reminder')
  .triggerAction({
    matches:[/remind me/i,/reminder/i,/set reminder/i]
  });

// Help
bot.dialog('/support')
    .triggerAction({
        matches: [/help/i, /support/i, /problem/i]
    });

// log any bot errors into the console
bot.on('error', function (e) {
    console.log('And error ocurred', e);
});

function processSubmitAction(session, value) {
    var defaultErrorMessage = 'Please complete all the parameters';
    switch (value.type) {
        case 'reminder':
            // Validate time, date parameters 
            if (validateReminerParams(value)) {
                // proceed to set reminder
                session.beginDialog('set-reminder', value);
            } else {
                session.send(defaultErrorMessage);
            }
            break;

        case 'help':
            // Hotel selection
            sendHelpSelection(session, value);
            break;

        default:
            // A form data was received, invalid or incomplete since the previous validation did not pass
            session.send(defaultErrorMessage);
    }
}
*/