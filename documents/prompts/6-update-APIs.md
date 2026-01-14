
# 1. Editing expense-category
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



# 2. Editing expense
- There is a new API to update an expense
- On the `View past expense` page, for each expense card there should be 3 dots on the top right of the card to update the expense
- When user clicks on the 3 dots, open a pop-up modal with pre-filled data
- The popup must have 2 buttons in the bottom : `Update Expense` & `Cancel`
- allow user to edit all fields are mentioned in the request below


- Request & response of the API to be called shown below
- Pass the JWT access token from local storage, which is stored at the time of login, along with userId
- Keep the UI design & look & feel similar to existing UI design


```
curl --location --request PUT 'http://localhost:8055/api/v1/expense/personal/57ce3de4-4e0e-4338-8721-18c262b29ee6' \
--header 'Authorization: Bearer <access-token>' \
--header 'Content-Type: application/json' \
--header 'Cookie: JSESSIONID=33AF848DE9BD51605F5B7C3D5B9D9CF3' \
--data '{
    "categoryId": "87abea55-092f-43d3-bf1c-138de83264e5",
    "amount": 200,
    "description": "test",
    "tagId": "f00e11dd-1821-4169-9314-b976c56b7247"
}'
```


```
{
    "apiData": {
        "id": "f6ae0e7c-81cd-4da4-b234-63bebd1c3719"
    },
    "respId": ""
}
```