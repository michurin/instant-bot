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
        if ! convert -version >/dev/null
        then
            echo 'It seems ImageMagick is not installed :-('
            exit
        fi
        # Convert is ImageMagick utility, you have to install ImageMagic https://www.imagemagick.org/
        # We just stream png image to stdout, bot can recognize it
        convert rose: png:-
        ;;
    error)  # Error emulation, you will receive error detail in your telegram client
        echo 'Message'
        echo 'Error message' >&2
        exit 28
        ;;
    two)
        bot_url="http://$TG_HTTP_HOST:$TG_HTTP_PORT/?chat_id=$TG_CHAT_ID"
        curl -qX POST -o /dev/null --data-binary 'one' "$bot_url"
        curl -qX POST -o /dev/null --data-binary 'and two' "$bot_url"
        echo .
        ;;
    delayed)
        if ! at -V 2>/dev/null
        then
            echo 'You have not command "at" :-('
            echo 'Install it and try again'
            exit
        fi
        task_id=$$  # use pid just as uniq id
        bot_url="http://$TG_HTTP_HOST:$TG_HTTP_PORT/?chat_id=$TG_CHAT_ID"
        delayed_message="Task $task_id done!"
        delayed_command="curl -qX POST -o /dev/null --data-binary '$delayed_message' '$bot_url'"
        # schedule command using `at`
        # remove redirections if you need to debug
        echo "$delayed_command" | at -M now + 1minute >/dev/null 2>&1
        # reply
        echo "Task $task_id scheduled"
        echo 'Delayed Command:'
        echo "$delayed_command"
        echo 'Wait one minute for result'
        ;;
    help)
        echo 'Commands:'
        for cmd in ok hi env empty silent rose error two delayed help
        do
            echo "- $cmd"
        done
        ;;
    *)
        echo "Unknown command $CMD. Say ''help'' to get help"
        ;;
esac
