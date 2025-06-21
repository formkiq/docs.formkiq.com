#!/usr/bin/env bash
set -euo pipefail

# local build dir, S3 bucket name and optional prefix
SEARCH_DIR="build"
BUCKET=$1
DEST_PREFIX="docs"   # remove or change if you don’t want a prefix

# sanity check
if [[ ! -d "$SEARCH_DIR" ]]; then
  echo "Error: '$SEARCH_DIR' not found." >&2
  exit 1
fi

# find every index.html.redirect stub and upload it to S3 using its full path under build/
find "$SEARCH_DIR" -type f -name 'index.html' -print0 \
| while IFS= read -r -d '' stub; do
  # drop the leading "build/" and the trailing "/index.html.redirect"
  rel="${stub#"$SEARCH_DIR"/}"                 # e.g. docs/api-reference/add-task/index.html.redirect
  key_path="${rel%/index.html}"       # e.g. docs/api-reference/add-task

  # build the full S3 key (with optional DEST_PREFIX)
  if [[ -n "$DEST_PREFIX" ]]; then
    s3key="${DEST_PREFIX}/${key_path}"
  else
    s3key="${key_path}"
  fi

  echo "Uploading stub → s3://${BUCKET}/${s3key}"

  # build and print the exact command
  cmd=(aws s3 cp "$stub" "s3://${BUCKET}/${s3key}" --content-type text/html)
  echo "+ ${cmd[@]}"

  # execute it
  "${cmd[@]}"
done