

- Edit the add expense category-page
- Above `Category Name` form element, add another drop down, named select group
- The options are to be fetched from the response of below API `/group/configure/`
- In the list of options, these should be an additional option , which does not come from the API & it is called `Personal expense`

- When user selects `Personal expense`, the current flow continues (ie continue calling `/api/v1/expense/personal`
)
- But when user select an option from below group option, we need to call API to add group expense ie `/group/<group-id>/expense`


[Details for form filling in case of group expense]
- When user selects an option from below group option, we need to show a sub form of 2 elements
- 1st element to select `splitType` : Exact/Percent
- 2nd element to enter the split of the expense, this section should contain each members user-name & text box to enter a number (if `splitType` is `Exact`, it represents amount. If `percent`, it represents % of the amount)
- The entered value will will be passed as `splits` in the request
- The API request & response is mentioned below







=== Request response of API to fetch group data from backend on the add-expense page ===


```
curl --location 'http://localhost:8055/api/v1/group/configure/550e8400-e29b-41d4-a716-446655440000' \
--header 'Authorization: Bearer <access-token>' \
--header 'Cookie: JSESSIONID=34C4EEE833F899987CB99CFA7BB3FECE'
```



```
{
    "apiData": {
        "allUsers": [
            {
                "emailId": "abhinav@example.com",
                "name": "Abhinav",
                "userId": "550e8400-e29b-41d4-a716-446655440000"
            },
            {
                "emailId": "maitry@example.com",
                "name": "Maitry",
                "userId": "d33a3a27-8cbd-41e1-afd1-efa7760a7ced"
            }
        ],
        "groupAndCategoryList": [
            {
                "expenseCategories": [
                    {
                        "category": "shoppinggg-123",
                        "description": "updated",
                        "id": "47adac0e-3280-4264-83be-75bfc4299aa6",
                        "monthlyUpperLimit": 1000,
                        "tags": [
                            {
                                "id": "5e932388-8569-4a28-8eca-637d47482693",
                                "name": "ola"
                            },
                            {
                                "id": "abd3f490-80d3-47a9-a0a6-871d1465ee43",
                                "name": "uber"
                            },
                            {
                                "id": "6d07bab5-bd3e-4e4e-8737-04b77e3323ed",
                                "name": "aaa"
                            },
                            {
                                "id": "eba0a433-9c16-46c7-ba32-4f465412b918",
                                "name": "bbb"
                            }
                        ]
                    }
                ],
                "groupDescription": "house-hold expenses",
                "groupId": "52cc9664-e530-4dee-a23d-69f84c4c66fc",
                "groupName": "house-hold",
                "members": [
                    {
                        "emailId": "abhinav@example.com",
                        "name": "Abhinav",
                        "userId": "550e8400-e29b-41d4-a716-446655440000"
                    },
                    {
                        "emailId": "maitry@example.com",
                        "name": "Maitry",
                        "userId": "d33a3a27-8cbd-41e1-afd1-efa7760a7ced"
                    }
                ]
            },
            {
                "expenseCategories": [
                    {
                        "category": "shoppinggg-123",
                        "description": "updated",
                        "id": "47adac0e-3280-4264-83be-75bfc4299aa6",
                        "monthlyUpperLimit": 1000,
                        "tags": [
                            {
                                "id": "5e932388-8569-4a28-8eca-637d47482693",
                                "name": "ola"
                            },
                            {
                                "id": "abd3f490-80d3-47a9-a0a6-871d1465ee43",
                                "name": "uber"
                            },
                            {
                                "id": "6d07bab5-bd3e-4e4e-8737-04b77e3323ed",
                                "name": "aaa"
                            },
                            {
                                "id": "eba0a433-9c16-46c7-ba32-4f465412b918",
                                "name": "bbb"
                            }
                        ]
                    }
                ],
                "groupDescription": "house-hold expenses 1",
                "groupId": "2aa24d8c-f998-42f2-8f87-61780066fa30",
                "groupName": "house-hold 1",
                "members": [
                    {
                        "emailId": "abhinav@example.com",
                        "name": "Abhinav",
                        "userId": "550e8400-e29b-41d4-a716-446655440000"
                    },
                    {
                        "emailId": "maitry@example.com",
                        "name": "Maitry",
                        "userId": "d33a3a27-8cbd-41e1-afd1-efa7760a7ced"
                    }
                ]
            },
            {
                "expenseCategories": [
                    {
                        "category": "shoppinggg-123",
                        "description": "updated",
                        "id": "47adac0e-3280-4264-83be-75bfc4299aa6",
                        "monthlyUpperLimit": 1000,
                        "tags": [
                            {
                                "id": "5e932388-8569-4a28-8eca-637d47482693",
                                "name": "ola"
                            },
                            {
                                "id": "abd3f490-80d3-47a9-a0a6-871d1465ee43",
                                "name": "uber"
                            },
                            {
                                "id": "6d07bab5-bd3e-4e4e-8737-04b77e3323ed",
                                "name": "aaa"
                            },
                            {
                                "id": "eba0a433-9c16-46c7-ba32-4f465412b918",
                                "name": "bbb"
                            }
                        ]
                    }
                ],
                "groupDescription": "asdasdasdasdasd",
                "groupId": "02d3011a-815a-48b4-9bff-399adacdc2b8",
                "groupName": "group-2",
                "members": [
                    {
                        "emailId": "abhinav@example.com",
                        "name": "Abhinav",
                        "userId": "550e8400-e29b-41d4-a716-446655440000"
                    },
                    {
                        "emailId": "maitry@example.com",
                        "name": "Maitry",
                        "userId": "d33a3a27-8cbd-41e1-afd1-efa7760a7ced"
                    }
                ]
            },
            {
                "expenseCategories": [
                    {
                        "category": "shoppinggg-123",
                        "description": "updated",
                        "id": "47adac0e-3280-4264-83be-75bfc4299aa6",
                        "monthlyUpperLimit": 1000,
                        "tags": [
                            {
                                "id": "5e932388-8569-4a28-8eca-637d47482693",
                                "name": "ola"
                            },
                            {
                                "id": "abd3f490-80d3-47a9-a0a6-871d1465ee43",
                                "name": "uber"
                            },
                            {
                                "id": "6d07bab5-bd3e-4e4e-8737-04b77e3323ed",
                                "name": "aaa"
                            },
                            {
                                "id": "eba0a433-9c16-46c7-ba32-4f465412b918",
                                "name": "bbb"
                            }
                        ]
                    }
                ],
                "groupDescription": "group-3",
                "groupId": "b6ad334a-4536-4af1-88ff-466875e34b5e",
                "groupName": "group-3",
                "members": [
                    {
                        "emailId": "abhinav@example.com",
                        "name": "Abhinav",
                        "userId": "550e8400-e29b-41d4-a716-446655440000"
                    },
                    {
                        "emailId": "maitry@example.com",
                        "name": "Maitry",
                        "userId": "d33a3a27-8cbd-41e1-afd1-efa7760a7ced"
                    }
                ]
            }
        ]
    },
    "respId": ""
}
```


=== Request response of API to add group expense ===

```
curl --location 'http://localhost:8055/api/v1/group/52cc9664-e530-4dee-a23d-69f84c4c66fc/expense' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGluYXZAZXhhbXBsZS5jb20iLCJ1c2VySWQiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJuYW1lIjoiQWJoaW5hdiIsImlhdCI6MTc2ODgzMDU0MiwiZXhwIjoxNzY4OTE2OTQyfQ.Mw_OPQBJUiGwQzv_Sqw0Z-nTvBu1VVbh6UdpomKBrXg' \
--header 'Content-Type: application/json' \
--header 'Cookie: JSESSIONID=71D41505DECC79B5AC77DB03335C3A98' \
--data '{
    "paidByUserId": "550e8400-e29b-41d4-a716-446655440000",
    "categoryId": "47adac0e-3280-4264-83be-75bfc4299aa6",
    "year": 2026,
    "month": 1,
    "amount": 1000,
    "description": "test",
    "splitType": "EXACT",
    "splits": {
        "550e8400-e29b-41d4-a716-446655440000": 1,
        "d33a3a27-8cbd-41e1-afd1-efa7760a7ced": 999
    }
}'
```


```
{
    "apiData": {
        "id": "828e670f-4336-4d61-bb7a-1706ad6c676e"
    },
    "respId": ""
}
```
