#!/usr/bin/env bash
set -euo pipefail

# -----------------------------------------------------------------------------
# list-cfn-events.sh
#
# Usage: ./list-cfn-events.sh <stack-name>
#
# Description:
#   Fetches all CloudFormation events for the given stack and all of its
#   nested stacks that occurred within one hour of the latest event on the
#   root stack.  Prints a nicely formatted header and the events as plain text:
#     Timestamp    LogicalResourceId    ResourceStatus    ResourceType    ResourceStatusReason
#   Pagination is disabled to ensure you get every event in one shot.
# -----------------------------------------------------------------------------

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <stack-name>"
  exit 1
fi

ROOT_STACK=$1

# 1) Determine the cutoff based on the root stack’s newest event
LATEST_RAW=$(aws cloudformation describe-stack-events \
  --stack-name "$ROOT_STACK" \
  --no-paginate \
  --query 'StackEvents[0].Timestamp' \
  --output text | head -n1)

# Strip fractional seconds and "+00:00" → "Z"
LATEST_TS=$(echo "$LATEST_RAW" | sed -E 's/\.[0-9]+//; s/\+00:00$/Z/')

# Convert to epoch, subtract one hour, back to ISO-Z
LATEST_EPOCH=$(date -u -d "$LATEST_TS" '+%s')
THRESHOLD_EPOCH=$((LATEST_EPOCH - 3600))
THRESHOLD=$(date -u -d "@$THRESHOLD_EPOCH" '+%Y-%m-%dT%H:%M:%SZ')

# Prepare queue for BFS through nested stacks
stack_queue=("$ROOT_STACK")
processed=()

while [ "${#stack_queue[@]}" -gt 0 ]; do
  # Pop the first stack off the queue
  current="${stack_queue[0]}"
  stack_queue=("${stack_queue[@]:1}")
  processed+=("$current")

  # Header for this stack
  echo
  echo "========================================"
  echo "  CloudFormation Events for Stack:"
  echo "      $current"
  echo "    (since $THRESHOLD to now)"
  echo "========================================"
  echo

  # Fetch & display events newer than threshold
  aws cloudformation describe-stack-events \
    --stack-name "$current" \
    --no-paginate \
    --query "StackEvents[?Timestamp>=\`${THRESHOLD}\`].[Timestamp, LogicalResourceId, ResourceStatus, ResourceType, ResourceStatusReason]" \
    --output text

  # Find nested stacks of this stack
  nested_ids=$(aws cloudformation describe-stack-resources \
    --stack-name "$current" \
    --no-paginate \
    --query 'StackResources[?ResourceType==`AWS::CloudFormation::Stack`].PhysicalResourceId' \
    --output text)

  # Enqueue any nested stacks we haven’t processed yet
  for nested in $nested_ids; do
    skip=false
    for seen in "${processed[@]}" "${stack_queue[@]}"; do
      [[ "$seen" == "$nested" ]] && { skip=true; break; }
    done
    $skip || stack_queue+=("$nested")
  done
done