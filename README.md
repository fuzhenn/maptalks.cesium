# maptalks.LineAnimPlayer

[![CircleCI](https://circleci.com/gh/maptalks/maptalks.LineAnimPlayer.svg?style=shield)](https://circleci.com/gh/MapTalks/maptalks.LineAnimPlayer)

## A line can show in an animated way by this plugin which is based on maptalks.
* *How to use it*
   1. include maptalks.LineAnimPlayer.js in head tag.
   2. creat a line object and then call createPlayer method,for example:

       *var line = new maptalks.LineAnimPlayer(coordinates, {*
       *symbol:....*
       *}).addTo(layer).createPlayer({*
            *duration: 15000,*
             *easing: 'linear'*
         *}, function (frm, coord) {*
             *// TO DO*
         *});*
         //I have edit the readme file.
