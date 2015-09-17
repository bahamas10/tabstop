#!/usr/bin/env bash
#
# Quickly switch tab styles in vim
#
# Author: Dave Eddy <dave@daveeddy.com>
# Date: August 29, 2015
# License: MIT

# we do everything in a function so this file can be sourced,
# or called directly
ts() {
	local prog=${0##*/}
	local usage="Usage: $prog [-f file] [-d] [filetype] [0-9t]"

	local file=~/.vimrc.indent
	local delete=false
	while getopts 'df:h' option; do
		case "$option" in
			d) delete=true;;
			h) echo "$usage"; return 0;;
			f) file=$OPTARG;;
			*) echo "$usage"; return 0;;
		esac
	done
	shift "$((OPTIND - 1))"

	local ft=$1
	local tabs=$2

	# read the indent file right away.. we need it no matter what
	local contents=$(sort "$file" 2>/dev/null)

	local FileType= sw= et=

	# 0 or 1 arguments given, generate list
	if ! $delete && [[ -z $tabs ]]; then
		local ret=1
		while read -r _ _ FileType _ sw _ et _; do
			[[ -n $FileType ]] || continue
			sw="${sw##*=} spaces"
			[[ $et == 'noet' ]] && sw='tabs'
			if [[ -n $ft && $ft == "$FileType" ]]; then
				echo "$sw"
				ret=0
			elif [[ -z $ft ]]; then
				printf '%-15s %s\n' "$FileType" "$sw"
				ret=0
			fi
		done <<< "$contents"
		return "$ret"
	fi

	# if we are here, user wants to set a value

	# validate input
	local valid_re='^([0-9]+|t|tabs)$'
	if ! $delete && ! [[ $tabs =~ $valid_re ]]; then
		echo "error: invalid value '$tabs'" >&2
		return 1
	fi
	if $delete && [[ -z $ft ]]; then
		echo 'error: filetype must be included with -d' >&2
		return 1
	fi

	# construct the new file
	local s=()
	while read -r _ _ FileType _ sw _ et; do
		[[ -n $FileType ]] || continue
		[[ $ft == "$FileType" ]] && continue
		sw=${sw##*=}
		s+=("autocmd FileType $FileType setlocal sw=$sw sts=$sw $et")
	done <<< "$contents"

	if ! $delete; then
		if [[ $tabs == 't' || $tabs == 'tabs' ]]; then
			tabs=8
			et='noet'
		else
			et='et'
		fi
		s+=("autocmd FileType $ft setlocal sw=$tabs sts=$tabs $et")
	fi

	# write it out
	printf '%s\n' "${s[@]}" > "$file"
}

if ! (return &>/dev/null); then
	# called interactively, run the function
	ts "$@"
fi
