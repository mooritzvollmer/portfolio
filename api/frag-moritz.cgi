#!/bin/sh
set -eu
base=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd -P)
export SCRIPT_FILENAME="$base/frag-moritz.php"
export REDIRECT_STATUS=200
exec /usr/bin/php8.4 -d cgi.fix_pathinfo=0
