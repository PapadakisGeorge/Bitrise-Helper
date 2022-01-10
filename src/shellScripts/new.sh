#!/bin/bash


if [ "$#" -eq "0" ] 
	then
		osascript -e 'tell application "iTerm2" to tell current window to set newWindow to (create window with default profile)'	
	else 
		a="$1"
		for ARG in "${@: 2}"
		do
		a="${a} && ${ARG}"
		done
		osascript -e 'tell application "iTerm2" to tell current window to set newWindow to (create window with default profile)' -e "tell application \"iTerm2\" to tell current session of newWindow to write text \"${a}\""
fi
