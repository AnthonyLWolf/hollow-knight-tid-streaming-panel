# Hollow Knight Steel Soul OBS Panel - The Indie Diarist Livestreams

This is a personal streaming HUD prototype that I created for my livestreams on youtube.com/theindiediarist, specifically for the Hollow Knight Steel Soul challenge run series (and eventually for Silksong).

The idea behind this overlay/panel is to help my community (both new and regular viewers) follow along the streams and have a bit more fun with me, making the streams more interesting and hopefully unique to follow.

I designed this overlay as a modular template in HTML/CSS and JavaScript that can serve me for different types of games. Its modular nature means its functionalities can be easily flexed by simply changing its modules.

When hosted locally and added to OBS, this panel connects to Streamer.bot via a websocket connection that listens for Actions as specific events. These actions are triggered by Streamer.bot via hotkeys, allowing for various interactive features on the panel.

In its current form, **this panel is not a plug-and-play tool for other streamers** and will not work with other setups. It is simply a personal project for my streams. It is also branded in The Indie Diarist's core colours.

## Modules in this version

- **Boss List Sidebar**: A sidebar showing the list of mandatory bosses that need to be defeated in order to reach the end of the game, from False Knight to the Radiance. Bosses can be toggled on and off to mark their defeated or undefeated state
- **Attempts Counter**: A counter that goes up with every death during practice runs or in Steel Soul mode
- **Run Timer**: A simple timer in HH:MM:SS.cs format, useful to keep track of the time passed during a run

## Features

- **Interactivity**: The panel is far from static and can respond to various commands, activated by hotkeys. During streams, I use these commands to reset a run, mark defeated bosses, and so on.

- **Core hotkeys**: Specific combinations of keys trigger a predefined set of Streamer.bot actions. These get picked up by the panel's script to trigger commands, including:
    - Navigation through the bosses list
    - Selection to defeat a boss
    - Run/stop timer
    - Increase/decrease attempts
    - Reset panel to original state, including timer and attempts

- **Subtle CSS animations**: Neon pulse on the modules' borders to help add movement to the stream

## Future plans

I plan to use this panel for all my Hollow Knight and Silksong practice runs/speedruns in the future, but its modular nature means that the prototype template can be easily modified to add/remove elements as needed.

My ambition is to develop more panels and overlays to help support my streams with the channel's most important games, to help my community keep track of my progress and have more fun when following each run alongside me.