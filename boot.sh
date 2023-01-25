#!/bin/bash
  
set -m

gunicorn  -b :5000 -w 8 --log-level=DEBUG --access-logfile - --error-logfile - application:application  --timeout 36000 --reload &
  
fg %1