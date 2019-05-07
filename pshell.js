#!/usr/bin/env node
/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

var name = process.argv[2] || 'Auto-commit';
var shell = require("shelljs/global");

if (!which('git')) {
    echo('Sorry, this script requires Git');
    exit(1);
}

if (exec('git add -A').code !== 0) {
    echo('Error: Git add failed');
    exit(1);
}

if (exec(`git commit -am "${name}"`).code !== 0) {
    echo('Error: Git commit failed');
    exit(1);
}

if (exec('git push').code !== 0) {
    echo('Error: Git push failed');
    exit(1);
}

exec(`echo Git success ${name}`);
