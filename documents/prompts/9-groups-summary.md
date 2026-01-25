

# Add expense category page
- Edit the add category page
- Above `Category Name` form element, add another drop down, named `select group`
- The options are to be fetched from the API `/group/configure/`
- In the list of options, these should be an additional option , which does not come from the API & it is called `Personal expense`

- When user selects `Personal expense`, the current flow continues (ie continue calling `/api/v1/user/<userId>/expense-category`)


- But when user select an option from below group option, we need to call API to add group expense-category ie `/group/<group-id>/expense-category`

- The cards in `Existing Categories` must be for the selected option in `select group`
    - if `Personal expense`, the displayed cards will be for personal expense-categories
    - if a group is selected, the displayed cards will be for that group

- As soon a category is added, you need to call 2 APIs to get the updated categories
    - for personal-expense : `/api/v1/user/<userId>/settings`
    - for all groups : `/api/v1/group/configure/<userId>`
    - This is needed for getting the correct data in `Existing Categories`
    - Also, the option selected in `Select group` must not change as soon as the creation of cateogory is done
    - Also, user must stay in the same page as soon as the creation of cateogory is done


```
curl --location 'http://localhost:8055/api/v1/group/52cc9664-e530-4dee-a23d-69f84c4c66fc/expense-category' \
--header 'Authorization: Bearer <access-token>' \
--header 'Content-Type: application/json' \
--header 'Cookie: JSESSIONID=16E9A953DDCB395ECC9AC475AFDBB9BB' \
--data '{
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "categoryName": "travel-non-local-2781adad",
    "monthlyUpperLimit": 100,
    "description": "Travelling yayy",
    "addTags": [
        "ola",
        "uber"
    ]
}'
```

```
{
    "apiData": {
        "failedAddTags": [],
        "id": "3c29551c-1659-434c-909a-fa581f030240"
    },
    "respId": ""
}
```

# category-correction
- i am not able to see correct categories when a group is selected from drop down
- Below is the response of `/group/configure/<userId>`
- `groupAndCategoryList` is a list of groups which the current signed in user is a part of
- Inside each element of this array, there is another array called `expenseCategories`
- These categories are to be displayed in `Existing Categories` section for the selected group 





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
                    },
                    {
                        "category": "travel-non-local-2781adad",
                        "description": "Travelling yayy",
                        "id": "3c29551c-1659-434c-909a-fa581f030240",
                        "monthlyUpperLimit": 100,
                        "tags": [
                            {
                                "id": "efbe1016-3a8c-41bb-a658-4d0b31cdf1c4",
                                "name": "ola"
                            },
                            {
                                "id": "03a18af7-5f3b-4b80-b74d-8a21324ec46a",
                                "name": "uber"
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
                    },
                    {
                        "category": "travel-non-local-2781adad",
                        "description": "Travelling yayy",
                        "id": "3c29551c-1659-434c-909a-fa581f030240",
                        "monthlyUpperLimit": 100,
                        "tags": [
                            {
                                "id": "efbe1016-3a8c-41bb-a658-4d0b31cdf1c4",
                                "name": "ola"
                            },
                            {
                                "id": "03a18af7-5f3b-4b80-b74d-8a21324ec46a",
                                "name": "uber"
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
                    },
                    {
                        "category": "travel-non-local-2781adad",
                        "description": "Travelling yayy",
                        "id": "3c29551c-1659-434c-909a-fa581f030240",
                        "monthlyUpperLimit": 100,
                        "tags": [
                            {
                                "id": "efbe1016-3a8c-41bb-a658-4d0b31cdf1c4",
                                "name": "ola"
                            },
                            {
                                "id": "03a18af7-5f3b-4b80-b74d-8a21324ec46a",
                                "name": "uber"
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
                    },
                    {
                        "category": "travel-non-local-2781adad",
                        "description": "Travelling yayy",
                        "id": "3c29551c-1659-434c-909a-fa581f030240",
                        "monthlyUpperLimit": 100,
                        "tags": [
                            {
                                "id": "efbe1016-3a8c-41bb-a658-4d0b31cdf1c4",
                                "name": "ola"
                            },
                            {
                                "id": "03a18af7-5f3b-4b80-b74d-8a21324ec46a",
                                "name": "uber"
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
                    },
                    {
                        "category": "travel-non-local-2781adad",
                        "description": "Travelling yayy",
                        "id": "3c29551c-1659-434c-909a-fa581f030240",
                        "monthlyUpperLimit": 100,
                        "tags": [
                            {
                                "id": "efbe1016-3a8c-41bb-a658-4d0b31cdf1c4",
                                "name": "ola"
                            },
                            {
                                "id": "03a18af7-5f3b-4b80-b74d-8a21324ec46a",
                                "name": "uber"
                            }
                        ]
                    }
                ],
                "groupDescription": "test",
                "groupId": "9b1b0152-46e3-4a81-a3d7-6f373f982756",
                "groupName": "grpppp",
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


# Summary page
- Update the expense summary page, the default sorting order must be `Percent spent (highest to lowest)`

- Update the expense summary page, in the left of year, add another drop down for group
- The options in this drop down will be Personal + list of groups in `/group/configure/<userId>`
- When user select a group, you need to call the below API to get expense summary of group
- Update the cards for each expense category accordingly

- Display the `userAmountBreakup` on the cards for group expense summary instead of `tagBreakup`
- In the format <User-name> : <Amount>
- Amount is present at `apiData.elements[i].userAmountBreakup[j].expenseAmount`
- User-id is present at `apiData.elements[i].userAmountBreakup[j].userId`
- This user-id is to be converted to user-name
- User-name is present at `apiData.users.<userId>.name`

- Also, on the summary page, when displaying summary for a group, you also need to add cards for users
- Each card must be collapsable, when collapsed, it just shows the `expenseCount` & `totalExpenseAmount`
- When expanded it shows credit & debit breakdown using `debitAmounts` & `creditAmounts` for each user in the format <user-name> : <credit/debit amount>
- use red for debit & green for credit
- After user-cards, show a divider & then display the category-wise cards (like it is shown currently)

- Each user has a `creditAmounts` map & `debitAmounts`, 
- so on the card of that user, only that user's `creditAmounts` map & `debitAmounts` is to be displayed



```
curl --location 'http://localhost:8055/api/v1/group/52cc9664-e530-4dee-a23d-69f84c4c66fc/summary' \
--header 'Authorization: Bearer <access-token>' \
--header 'Content-Type: application/json' \
--header 'Cookie: JSESSIONID=16E9A953DDCB395ECC9AC475AFDBB9BB' \
--data '{
    "year": 2026,
    "month": 1
}'
```

```
{
    "apiData": {
        "elements": [
            {
                "category": "shoppinggg-123",
                "categoryDescription": "updated",
                "categoryId": "47adac0e-3280-4264-83be-75bfc4299aa6",
                "monthlyExpenseDone": 3245,
                "monthlyUpperLimit": 1000,
                "tagBreakup": [
                    {
                        "expenseAmount": 0,
                        "id": "5e932388-8569-4a28-8eca-637d47482693",
                        "name": "ola"
                    },
                    {
                        "expenseAmount": 56,
                        "id": "abd3f490-80d3-47a9-a0a6-871d1465ee43",
                        "name": "uber"
                    },
                    {
                        "expenseAmount": 0,
                        "id": "6d07bab5-bd3e-4e4e-8737-04b77e3323ed",
                        "name": "aaa"
                    },
                    {
                        "expenseAmount": 89,
                        "id": "eba0a433-9c16-46c7-ba32-4f465412b918",
                        "name": "bbb"
                    },
                    {
                        "expenseAmount": 3100,
                        "id": "Others",
                        "name": "Others"
                    }
                ],
                "userAmountBreakup": [
                    {
                        "expenseAmount": 3245,
                        "userId": "550e8400-e29b-41d4-a716-446655440000"
                    }
                ]
            }
        ],
        "month": 1,
        "numberOfExpenses": 6,
        "totalExpenseAmount": 3245,
        "users": {
            "d33a3a27-8cbd-41e1-afd1-efa7760a7ced": {
                "creditAmounts": {},
                "debitAmounts": {
                    "550e8400-e29b-41d4-a716-446655440000": 2354
                },
                "emailId": "maitry@example.com",
                "expenseCount": 0,
                "name": "Maitry",
                "totalExpenseAmount": 0
            },
            "550e8400-e29b-41d4-a716-446655440000": {
                "creditAmounts": {
                    "d33a3a27-8cbd-41e1-afd1-efa7760a7ced": 2354
                },
                "debitAmounts": {},
                "emailId": "abhinav@example.com",
                "expenseCount": 6,
                "name": "Abhinav",
                "totalExpenseAmount": 3245
            }
        },
        "year": 2026
    },
    "respId": ""
}
```