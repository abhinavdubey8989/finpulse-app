
# 1. For edit expense category
- There is a new API to update an expense category
- On the `Add Expense Category` page, after the form, you need to show cards of existing categories (this you can get by calling `/api/v1/user/550e8400-e29b-41d4-a716-446655440000/settings` API)
- There should be 3 dots on the top right of the card to update the category
- When user clicks on the 3 dots, open a pop-up modal with pre-fill data
- The popup must have 2 buttons in the bottom : `udpate` & `cancel`
- allow user to edit all fields are mentioned in the request below


- Request & response of the API to be called shown below
- Pass the JWT access token from local storage, which is stored at the time of login, along with userId
- Keep the UI design & look & feel similar to existing UI design

```
curl --location --request PUT 'http://localhost:8055/api/v1/user/550e8400-e29b-41d4-a716-446655440000/expense-category/1104866c-8399-4852-9b1a-c470c2649871' \
--header 'Authorization: Bearer <access-token>' \
--header 'Content-Type: application/json' \
--header 'Cookie: JSESSIONID=AE0457DAA3F64F5683E30F8CAE898FAD' \
--data '{
    "categoryName": "shoppinggg",
    "monthlyUpperLimit": 1000,
    "description": "updated",
    "addTags": [
        "aaa",
        "bbb"
    ],
    "updateTags": [
        {
            "id": "f00e11dd-1821-4169-9314-b976c56b7247",
            "newName": "new"
        }
    ]
}'
```


```
{
    "apiData": {
        "failedAddTags": [],
        "failedUpdateTags": [],
        "id": "1104866c-8399-4852-9b1a-c470c2649871"
    },
    "respId": ""
}
```