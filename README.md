instant-bot
===========

Telegram bot allows you to write bot logic as simple as GCI-script, using any programming language.

Requirements
------------

- [Node.js](https://nodejs.org/) >=8 (without any aditional modules)

To run examples on this page you may need to install
[ImageMagick](https://www.imagemagick.org/)
and some tools like `at` (run `atd`), `curl` etc.

The bot uses [long polling](https://en.wikipedia.org/wiki/Push_technology#Long_polling).
In particular, it means you have not to have open external ports or setup HTTPS.
You can just run script and enjoy.
Of course, the bot need to have access to `https://api.telegram.org/`.

How to run
----------

### Step 0: create bot and get token

First of all you have to [create](https://core.telegram.org/bots#3-how-do-i-create-a-bot) your Telegram bot.

Now you have authorization **token**.

### Step 1: first breth (run without installation)

Create configuration file and script with scenario. Simplest examples:

```javascript
{
    "token": "---your-token-here---",
    "pass_env": [],
    "force_env": {},
    "polling_timeout": 30,
    "whilelist": [],
    "debug": true
}
```

Run bot:
```sh
TG_BOT_CONFIG=config-minimal.json node bin/instant_bot.js
```

Now open your Telegram client, find your bot and say `/start`. You have to get responce like

> You are [AlexeyMichurin] (id=153812628). Add yourself to config.js.

### Step 2: add user to white list

Add yourself to `whilelist` in you config. Like this:

```javascript
    "whilelist": [153812628],
```

You have to mention here all users you want to service.

Restart bot and try to talk. You can try internal commands:
- `.proc` — bot process information
- `.getme` — bot accaunt information

On all other commands the bot responds like this:

> You have not setup slave script in your configuration file.

### Step 3: write script. Bring the brain to bot

It's time to add

```javascript
    "script": "./demo-slave.sh",
```

to your `config-minimal.json`. The path to script is relative `config-minimal.json`.

#### Simplest script

Simplest `demo-slave.sh` can seems like this:

```sh
#!/bin/sh
echo "I'm OK!"
```

Now you bot can reply only one phrase.

#### Script with commands

You can implement some commands. Rewrite your `demo-slave.sh` like this:

```sh
#!/bin/sh

CMD="$(echo "$1" | tr '[:upper:]' '[:lower:]')"  # make commands case insensitive

case "$CMD" in
    ok)
        echo 'Just Ok'
        ;;
    hi)
        echo "Hi, $TG_USER_NAME! Nice to meet you"
        ;;
    env)
        echo 'Process environment:'
        env | sort
        echo 'Current working directory:'
        pwd
        ;;
    empty)  # You will get message "(empty message)"
        ;;
    silent)
        echo .  # Single dot is a special silent marker, you will get nothing
        ;;
    rose)
        # Convert is ImageMagick utility, you have to instaill ImageMagic https://www.imagemagick.org/
        # We just stream png image to stdout, bot can recognize it
        convert rose: png:-
        ;;
    error)  # Error emulation, you will receive error detail in your telegram client
        echo 'Message'
        echo 'Error message' >&2
        exit 28
        ;;
    *)
        echo "Unknown command $CMD"
        ;;
esac
```

Try to say to bot commands `ok`, `hi`, `env`... You can find out how script works,
script environment, how to send images, what happens on errors... Just play.

#### Send images

Previosly you can see how to send image to client. Just dump you image to stdout asis.
Bot can recognize PNG, JPEG and GIF.

If you have not ImageMagick, you can change line

```sh
        convert rose: png:-
```

to somewhat like this:

```sh
        cat /path/to/you/favorite/image.png
```

It's realy enough to send image.

#### Empty/silent message

If you script exited with empty output, bot send to user special message `(empty message)`.

If you really want to suppress message, your script have to print special marker to
stdout: dot char (.) and optional space chars.

#### Environment vars

Play with options `pass_env` and `force_env` in your configuration file. You
can start from something like this

```javascript
     "pass_env": ["HOME", "PATH", "USER"],
     "force_env": {"LC_ALL": "C"},
```

It means, that you would like to pass `HOME`, `PATH` and `USER` asis, and force `LC_ALL=C`.

Restart bot and try command `env` to see actual environment of script.

### Step 4: asynchronous messages

#### Manual call

We overview only one scenario: you send a message to bot, bot runs script and send you back some reply.
But what if you need to send message not in reply? Is it possible to send message from crontab or
something like that? Fortunately yes!

To let magic going on, add to you config two new options:

```javascript
    "http_port": 8999,
    "http_host": "localhost",
```

Restart bot. You have to get log message like this:

```
2018-04-06T09:01:54.018Z INFO Start server on localhost:8999
```

Now send to bot command `env`. You have to get some vars in reply, like this:

```
TG_CHAT_ID=153812628
TG_HTTP_HOST=localhost
TG_HTTP_PORT=8999
TG_USER_ID=153812628
TG_USER_NAME=AlexeyMichurin
```

As you can see, our chat id is 153812628. Let use it.
Try to send you first asyncronius message by colling this serfer via HTTP:

```sh
curl -X POST --data-binary 'It is async message!' http://localhost:8999/?chat_id=153812628
```

#### Best practice

Of course you have not to repeat thous tricks every time. In real life you may have only
two basic cases of asynchronous:

##### Long job

Solution can seems like this:

```sh
    delayed)
        echo "curl -X POST --data-binary 'Delayed task is done' 'http://$TG_HTTP_HOST:$TG_HTTP_PORT/?chat_id=$TG_CHAT_ID'" | at -M now + 1minute 2>/dev/null
        echo 'Task scheduled... wait one minute...'
        ;;
```

You just run task in background, or schedule it for given `chat_id`.

##### Periodic tasks

Here you have to implements subscribe/unsubscribe commands, to manage `chat_id`s in some storage.
Your periodic task have to look to mentioned storage and send messages to all subscribers.

### Step 5: install into system

So far, we runs the bot simply from source code:

```sh
TG_BOT_CONFIG=config-minimal.json node bin/instant_bot.js
```

But you can to build and install package globally into your system:

```sh
npm pack
npm install -g instant-bot-VERSION.tgz
```

Now the command `instant_bot` have to be available.

More examples
-------------

You can find more examples in
[examples/](https://github.com/michurin/instant-bot/tree/master/examples).

In the same place you can find some code snippets,
how to run the bot in daemon mode. It is not ready
for production, but you can use it in your own `systemd` or
`rc.d` startup scripts.

Enjoy!
------

You can contact me via e-mail: a.michurin@gmail.com

--Alexey
