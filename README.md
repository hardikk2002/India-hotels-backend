## Backend APIs of IndianHotels ✨️

This repo contains the **RestAPIs** for the backend of **hotel management system** in **microservice architecture**.

## 🔰 An Insight

**IndianHotels** is an solution for hotel owners to list their property details on this platform.

- Swagger (openAPI) docs: [Here](https://india-hotels-backend.herokuapp.com) 


## 📁 File structuring


```css
├─ env
├── openapi.json
├── package.json
├── package-lock.json
├── README.md
├── server.js
└── src
    ├── api
    │   ├── v1
    │   │   ├── auth
    │   │   │   ├── auth.controller.js
    │   │   │   └── auth.service.js
    │   │   ├── posts
    │   │   │   ├── posts.controller.js
    │   │   │   └── posts.service.js
    │   │   └── user
    │   │       ├── user.controller.js
    │   │       └── user.service.js
    │   └── v2
    ├── database
    │   ├── connection.js
    │   └── mongo
    │       ├── repositories
    │       │   ├── posts.repository.js
    │       │   └── user.repository.js
    │       └── schemas
    │           ├── Posts.schema.js
    │           └── Users.schema.js
    ├── routes
    │   └── routes.js
    └── services
        └── jwt.service.js
```
