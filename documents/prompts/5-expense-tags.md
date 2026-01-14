
# 1. For Add expense category page

- There is a change in add expense category form page. You need to add another input fields called `tags`.
- Tags can be thought of sub-category of expense-category
- The user can enter a string of minimum 3 chars & when he presses enter, it should show-up a chip in the same input box
- Show a toast in case the `failedAddTags` in response is non empty array saying : `Failed to add tags : t1, t2 ...`

- Request & response of the API to be called shown below
- Pass the JWT access token from local storage, which is stored at the time of login, along with userId
- Keep the UI design & look & feel similar to existing UI design

```
curl --location 'http://localhost:8055/api/v1/user/550e8400-e29b-41d4-a716-446655440000/expense-category' \
--header 'Authorization: Bearer <access-token>' \
--header 'Content-Type: application/json' \
--header 'Cookie: JSESSIONID=0788C2F6E839081C4478FFAD88EB9120' \
--data '{
    "category": "travel-non-local-27",
    "monthlyUpperLimit": 100,
    "description": "Travelling yayy",
    "addTags":["ola", "uber"]
}'
```

```
{
    "apiData": {
        "failedAddTags": [],
        "id": "834d2d94-d31c-4a35-a2f4-2b5e467d5f89"
    },
    "respId": ""
}
```



# 2. For user-settings API & Add expense page
- There is corresponding change in user-setting API, the response now has tags (shown below)

```
{
    "apiData": {
        "expenseCategories": [
            {
                "category": "rent",
                "description": "rent pay",
                "id": "56ec6963-2edb-421c-aac6-bc349d032943",
                "monthlyUpperLimit": 6000,
                "tags": []
            },
            {
                "category": "commute",
                "description": "local commute",
                "id": "741b75b8-3471-4539-89f3-3e5be941da22",
                "monthlyUpperLimit": 400,
                "tags": []
            },
            {
                "category": "travel-non-local-2",
                "description": "Travelling yayy",
                "id": "0a4a2edc-f141-4773-8641-4461f597bbeb",
                "monthlyUpperLimit": 100,
                "tags": [
                    {
                        "id": "c1ca87d9-79cb-4751-acde-34faf358739f",
                        "name": "ola"
                    },
                    {
                        "id": "c09fb4f8-8483-45c7-870e-7cc7448f1828",
                        "name": "uber"
                    }
                ]
            },
            {
                "category": "my-cat",
                "description": "cattt",
                "id": "16f3dba8-43eb-4307-bff8-782d0a252369",
                "monthlyUpperLimit": 600,
                "tags": [
                    {
                        "id": "5bf568bb-6b68-48a4-b0bb-ac618fcc0d9f",
                        "name": "okay"
                    },
                    {
                        "id": "3c03a478-06f8-4a21-b7fd-06a16220d236",
                        "name": "no-pro"
                    }
                ]
            }
        ],
        "userId": "550e8400-e29b-41d4-a716-446655440000"
    },
    "respId": ""
}
```

- Also, on the add expense page, there is a modification in the form, before description, show the tags for the selected category as chips
- User can select only 1 tag while adding an expense
- User must select a tag or enter description (or both)
- Request of add expense is shown below

```
curl --location 'http://localhost:8055/api/v1/expense/personal' \
--header 'Authorization: Bearer <access-token>' \
--header 'Content-Type: application/json' \
--header 'Cookie: JSESSIONID=839B1FCD01892916ECDAD4D523A5AA08' \
--data '{
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "categoryId": "0a4a2edc-f141-4773-8641-4461f597bbeb",
    "year": 2026,
    "month": 1,
    "amount": 100,
    "description": "test",
    "tagId": "c1ca87d9-79cb-4751-acde-34faf358739f"
}'
```



# 2. For View-summary page
- The response of summary API is updated to support tags as shown below
- Now the cards must be update, to add a down carrot saying `see details`
- when user clicks on it, the card expands vertically & shows `tagBreakup` in descding order of `expenseAmount`

```
{
    "apiData": {
        "elements": [
            {
                "category": "eat-out",
                "categoryDescription": "eating out",
                "categoryId": "5e7b5a08-27b8-4c77-b0d3-d39b32a5badd",
                "monthlyExpenseDone": 60,
                "monthlyUpperLimit": 5600,
                "tagBreakup": [
                    {
                        "expenseAmount": 60,
                        "id": "Others",
                        "name": "Others"
                    }
                ]
            },
            {
                "category": "shooping",
                "categoryDescription": "all shopping",
                "categoryId": "1104866c-8399-4852-9b1a-c470c2649871",
                "monthlyExpenseDone": 500,
                "monthlyUpperLimit": 2000,
                "tagBreakup": [
                    {
                        "expenseAmount": 0,
                        "id": "f00e11dd-1821-4169-9314-b976c56b7247",
                        "name": "cosmetic"
                    },
                    {
                        "expenseAmount": 500,
                        "id": "014ab6e0-2e68-4059-a282-8c1d106be783",
                        "name": "non-cosmetic"
                    },
                    {
                        "expenseAmount": 0,
                        "id": "Others",
                        "name": "Others"
                    }
                ]
            }
        ],
        "month": 1,
        "numberOfExpenses": 2,
        "totalExpenseAmount": 560,
        "userId": "550e8400-e29b-41d4-a716-446655440000",
        "year": 2026
    },
    "respId": ""
}
```
===
- Right now, when i click on see details of of one card, the details of all card get expanded
- Only the clicked card should expand
- Let drop the expand idea, lets do another thing
- Do up carrot icon, when user click, the sptn, limit, usage % moves up , the progress-bar goes away making space for details & details show up in majority of card space