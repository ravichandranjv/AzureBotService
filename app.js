var restify = require('restify');
var builder = require('botbuilder');
var server = restify.createServer();

server.listen(process.env.port || process.env.PORT || 8088, function () {
   console.log('%s listening to %s', server.name, server.url);
});

var connector = new builder.ChatConnector({
    appId: "89a56755-5917-4150-a0bb-106a8b827ed7",
    appPassword: "xoBaosafcHDwmLmDdpKz5iE"
    //serviceUrl: "https://smba.trafficmanager.net/apis/"
});
server.post('/api/messages', connector.listen());
var bot = new builder.UniversalBot(connector);

bot.dialog('/', [
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
        var choices = ['Set', 'Something else'];
        builder.Prompts.choice(session, message, choices);        
    },
    /*
    function (session, results) {
         var msg="Give me the time to set reminder.";
         //builder.Prompts.Time(session,"Please provide the date and time to set reminder for (e.g.: June 6th at 5pm)");
         session.endDialogWithResults(results);
    },*/
    function (session, results) {
      if (results.response.entity==="Send my profile")
         session.replaceDialog('Setreminder',results);
    }
]).triggerAction({matches: [/hi/i, /hello/i, /hey/i]});
bot.dialog('Help',[
  function (session,args){
    var message = null;
        var card = new builder.ThumbnailCard(session);        
        card
        .buttons([
            new builder.CardAction(session).title('Send your profile').value('Profile').type('imBack'),
            new builder.CardAction(session).title('Send my profile').value('Myprofile').type('imBack'),
        ])
        .images([
            builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/PikePlaceMarket.jpg/320px-PikePlaceMarket.jpg"),
        ])
        .text(`What would you like to do?`);

        var message = new builder.Message(session);
        message.addAttachment(card);

        var choices = ['Send me your profile', 'Send my profile'];
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
bot.on('contactRelationUpdate', function (message) {
    if (message.action === 'add') {
        var name = message.user ? message.user.name : null;
        var reply = new builder.Message()
                .address(message.address)
                .text("Hello %s... Thanks for adding me!", name || 'there');
        bot.send(reply);
    } else {
    }
});
