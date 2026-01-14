
- Whenever user lands on page-2, which is the form page to add an expense, you need to call the below API to fetch expense category (request & response mentioned below)
- The UI of the dropdown of the form category must be the `category` in the `response.apiData.userExpenseCategories.category`
- For invoking the API to add expense, you must use the  `id` of `category` in the request `categoryId`



```
curl --location 'http://localhost:8055/api/v1/user/550e8400-e29b-41d4-a716-446655440000/settings' \
--header 'Authorization: Bearer access-token' \
--header 'Cookie: JSESSIONID=2CA5285CAF75BB4F3CBCA423AABEB062' \
--data ''
```

```
{
    "apiData": {
        "expenseCategories": [
            {
                "id" : "abcd123",
                "category": "travel",
                "description": "Travelling yayy",
                "monthlyUpperLimit": 100
            }
            {
                "id" : "xys78",
                "category": "eatout",
                "description": "eat out",
                "monthlyUpperLimit": 500
            }
        ],
        "userId": "550e8400-e29b-41d4-a716-446655440000"
    },
    "respId": ""
}
```


```
# API request to create expense
{
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "categoryId": "6581f24e-aae8-4978-9545-fa2727042618",
    "year": 2026,
    "month": "january",
    "amount": 100,
    "description": "test"
}

```