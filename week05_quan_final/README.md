# Assignment
After the second review of your project, incorporate the feedback and refine your design. 

- Re-evaluate your visual design choices and refine all aspects of it in detail (pixel perfect design): Visualization method, composition, color, contrast, typography, hierarchy
- Fix outstanding bugs and missing features in the code version of your project
- Upload the working version of your project to your github.io page
- Create a set of 2-5 screenshots that work in a slide presentation (16:9, 1920x1080px) 
- Create a presentation about this project that describes the project
  - Initial motivation and question (1-3 slides, 1-2min)
  - Process (only if helpful, necessary)
  - Visualization (Still and in code)
  - Next steps, learnings and open questions

### Design Revisions

Original Data:

<img src="./Original.png" width="800" alt="Original Data">

Cleaned Data:
I summarized the data at regional level and standardized naming convention. 

<img src="./Cleaned.png" width="400" alt="Cleaned Data">

### Design Mockup - SDG Scoreboard 2022

#### Style Guide

To prevent the dashboard becoming too colorful, I chose a muted pastel color palette.

<img src="./Color.png" width="800" alt="Color Guide">

<img src="./Type1.png" width="800" alt="Type 1">

<img src="./Type2.png" width="800" alt="Type 2">

#### Mockup

The design done in [Figma](https://www.figma.com/file/cC6Yy4gIl6kkQTa3xYLleT/Major-Studio-1-Quantitative-Visualization?node-id=0%3A1) is centered around a sunburst chart with a horizontal scroll bar at the bottom. By clicking on individual goals in the scroll bar, the user can have an overview of the scores of each region with the world's score in the middle. 

<img src="./Design.png" width="800" alt="Design">

### Current Prototype

I coded the basic composition of the sunburst chart in d3.js. I also break down what I need to do next in the following list.

- Score grid rating
- Legend
- Text
- Hover over tooltip
- Generalize the code so user can toggle different goal metric
- Change the toggle to a horizontal scroll*
- Highlight goal selected and mute unselected ones*

*are nice to have features

[Project Link](http://muons.com/msdv-ms1-quantitative/)