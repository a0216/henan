#!/bin/sh
echo

datetime=$(date '+%Y%m%d%H%M%S')
gitversion=$(git rev-list HEAD -n 1 | cut -c 1-8)

if [ "$1" == "prd" ]
then
    echo v_${datetime}_${gitversion} > version.h && npm run mgbuild && rm -rf version.h
elif [ "$1" == "dev" ]
then
    npm run test
else
    echo "The build command was not found !!"
fi
echo
