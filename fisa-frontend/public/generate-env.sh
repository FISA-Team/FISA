#!/bin/bash

# Recreate config file
rm -rf ./env-config.js
touch ./env-config.js

cat .env

# Add assignment
echo "window.fisaEnv = {" >> ./env-config.js

filename=".env"

readarray -t lines < "$filename"

# Read each line in .env file
# Each line represents key=value pairs
for line in "${lines[@]}"; do
  # Split env variables by character `=`
  if printf '%s\n' "$line" | grep -q -e '='; then
    varname=$(printf '%s\n' "$line" | sed -e 's/=.*//')
    varvalue=$(printf '%s\n' "$line" | sed -e 's/^[^=]*=//')
  fi

  # Read value of current variable if exists as Environment variable
  value=$(printf '%s\n' "${!varname}")
  # Otherwise use value from .env file
  [[ -z $value ]] && value=${varvalue}

  # Append configuration property to JS file
  echo "  $varname: \"$value\"," >> ./env-config.js
done

echo "}" >> ./env-config.js