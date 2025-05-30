# UI Design Framework

## Table of Contents
- [About](#about)
- [Installation](#installation)
- [Main Features](#main-features)
- [Documentation](#documentation)
- [RAPID Frameworks](#rapid-frameworks)
## About
The UI Design Framework allows the users to quickly create a UI design and connect it to the streams. It features a drag and drop interface with a library of widgets that can be configured and connected to streams. 

- Connects with other [RAPID Frameworks](#rapid-frameworks)

## Installation
This project requires Node.js. Git must be installed in order for cloning to work.
1. Download or clone the project. To clone to project, run `git clone https://github.com/Rapid-Project-SRI/UINewStructure`. 
2. Run `npm i` to download all dependencies
3. Run `npm start` to run the project on your local host

## Main Features
**Widget Library**<br>
The Widget Library houses all the currently available widgets for the user to use in the UI design. It features both display only widgets and interactive widgets, as well as static widgets. 
![Widget Library Image](/readme_images/widgetlibrary.png)

**Stream Display**<br>
The Stream Display allows for users to upload their streams created from the [Simulation Designer](https://github.com/Rapid-Project-SRI/Simulation-Designer).
![Upload Stream](/readme_images/uploadstream.png)
Once the streams are uploaded, the user will be able to see all streams as well as which streams interact with which. The user can then use these streams to connect with their widgets.
![Stream Displays](/readme_images/streamdisplays.png)

**Workspace**<br>
The Workspace is where all the widgets from the widget library are dragged onto and configured. The widgets can be placed onto the canvas and moved to their desired locations. The user can connect streams from the stream display to the widgets as well as customize it.
![Workspace](/readme_images/workspace.png)
Once the user is done with creating their UI, they can export it by clicking on `Download RAPID Simulation` and move on to the [Simulator](https://github.com/Rapid-Project-SRI/Simulator).

## Documentation
For more detailed documentation and a complete list of all features, click [here](add link to docs once they are complete).

## RAPID Frameworks
- [Simulation Designer](https://github.com/Rapid-Project-SRI/Simulation-Designer): A node based approach to creating data streams that can be used in the UI Designer.
- [UI Designer](https://github.com/Rapid-Project-SRI/UINewStructure): A drag and drop interface that allows users to create a UI and connect their data streams.
- [Simulator](https://github.com/Rapid-Project-SRI/Simulator): A way to rapidly execut the UI design and its connected streams.