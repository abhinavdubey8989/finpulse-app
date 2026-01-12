
# Prompt to create a new react project

- You are a skilled front-end engineer, season in reactjs
- You are working on a new project, to create a new react application for personal expense tracking
- Create 3 pages in the react app for the mentioned use-case

- Page-1 : Login-page
    - this is a login page, having 2 input fields for user : email-id & password
    - Keep the background as light purple
    - API to call here in the form of curl, followed by the JSON API response is :

```
curl --location 'http://localhost:8055/api/v1/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "test@example.com",
    "hashedPassword": "63a9f0ea7bb98050796b649e85481845"
}'
```

```
{
    "data": {
        "accessToken": "jwt-token",
        "userId": 123,
        "personalExpenseSettings": []
    },
    "respId": ""
}
```

    - The `accessToken` & `userId`received must be stored in the front-end local-storage 
    - The `accessToken` must be passed into `Authorization` header as `Bearer <token>` for all subsequest HTTP requests




- Page-2 : Form page to create expense
    - Show a small form to user to add below :
        - expense category : which is a dropdown (with values like : rent, shopping, eat-out etc.)
        - expense amount : a number value (decimal allowed)
        - expense description: which is a string maximum 40 character, minimum 3 characters
    - Upon successfull creation of expense, redirect to Page-3 (explained below)
    - API to call here in the form of curl, followed by the JSON API response is :

```
curl --location 'http://localhost:8055/api/v1/expense/personal' \
--header 'Authorization: Bearer jwt-token-save-above' \
--header 'Content-Type: application/json' \
--header 'Cookie: JSESSIONID=5CEE760B6E46DBBC05E2D559DA8C81EC' \
--data '{
    "userId": 1,
    "year": 2026,
    "month": "january",
    "category": "travel",
    "amount": 100,
    "description": "test"
}'
```

```
{
    "data": {
        "id": 6
    },
    "respId": ""
}
```





- Page-3 : A page to list all added expense by the user
    - Display the expenses added in the form of list of cards
    - API to call here in the form of curl, followed by the JSON API response is :

```
curl --location 'http://localhost:8055/api/v1/expense/personal/1' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoidGVzZXIgdXNlciIsInVzZXJJZCI6MSwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNzY3ODg0NDUyLCJleHAiOjE3Njc5NzA4NTJ9.SraT-ZiGO1QobzQqPltexUZl5xGi-vd2zVHPBZrsWwM' \
--header 'Cookie: JSESSIONID=5CEE760B6E46DBBC05E2D559DA8C81EC' \
--data ''
```

```
{
    "data": [
        {
            "amount": 100,
            "category": "travel",
            "createdAt": "2026-01-08T15:19:55.716735Z",
            "description": "Goto some place",
            "id": 1,
            "month": "january",
            "updatedAt": "2026-01-08T15:19:55.71675Z",
            "year": 2026
        },
        {
            "amount": 200,
            "category": "shopping",
            "createdAt": "2026-01-08T15:20:04.178155Z",
            "description": "buy tshirt",
            "id": 2,
            "month": "january",
            "updatedAt": "2026-01-08T15:20:04.178184Z",
            "year": 2026
        }
    ],
    "respId": "12345"
}
```


- Note
    - Keep the code clean, modular, scalable & maintainable
    - Use npm & not yarn
    - Use tailwind CSS
    - Use typescript throughout the project
    - For any library you install, make sure it's version (& its required dependencies' version) is compatible with the project
    - Avoid using `--legacy-peer-deps`
    - All the API endpoints url & secrets & other required configs must come from `.env` file & not harcoded anywhere
    - Convert all the curl requests mentioned above to proper JS code in react project & have maitainable & industry standard way of invoking the APIs