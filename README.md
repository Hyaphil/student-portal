# Student Portal

An AI-generated student portal website built with HTML, CSS, and JavaScript, hosted on GitHub Pages (no backend or database).

## AI Tool Used
Claude (Anthropic) via Claude Code.

## Prompt Used (exactly as provided)
> Create a modern and visually appealing student portal website using HTML, CSS, and JavaScript. Include a dashboard, class schedule, grades, announcements, and student profile. Ensure that the website can be hosted using GitHub Pages without requiring a backend or database.

## Features
- **Dashboard** – greeting, GPA / courses / attendance / units stats, today's classes, latest announcements, course performance chart
- **Class Schedule** – day tabs and a full-week overview table
- **Grades** – semester selector, grade table, computed GPA ring
- **Announcements** – search, category filter, mark-as-read with unread badge
- **Student Profile** – profile card and editable personal information
- Dark / light mode, responsive mobile layout, data saved in `localStorage`

## Project Structure
```
index.html
css/style.css
js/data.js   – fictional sample data
js/app.js    – rendering, routing, interactions
```

## Run Locally
Open `index.html` in a browser, or serve the folder:
```
python -m http.server 8080
```

## Modification Log
- No manual changes were made to the generated interface.
- Technical fixes for deployment: none required.

All student information is fictional.
