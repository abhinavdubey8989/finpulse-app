
- Now, create another page : Personal expense sumary, for summarising the monthly expenses
- On the page, there should be 2 drop downs
    - 1st to select year : it should have 10 element, beginning from 2026 till 2036
    - 2nd to select month : the UI should Display January, February... & use the map to convert into 1,2..12 respectively
- Also on the main header page, where we have 4 buttons (add category, add expense, view past expenses, log-out), add another button to `view summary`, upon landing on this page, the backend API should be called

- color the cards
    - if % usage 50% or less , the color should be #84c38eff
    - if % usage is in the range [51-90], the color should be #b3b36f
    - for [91-99]  , the color should be : #c77350
    - for 100 or more , it should be : #9c5962

- Add another dropdown to sort, with below options : 
    - `Amount spent (highest to lowest)` :  sort by `monthlyExpenseDone` descending order
    - `Amount spent (lowest to highest)` :  sort by `monthlyExpenseDone` ascending order
    - `Percentage spent (highest to lowest)` :  sort by `monthlyExpenseDone` by `monthlyUpperLimit` percent descending order
    - `Percentage spent (lowest to highest)` :  sort by `monthlyExpenseDone` by `monthlyUpperLimit` percent asc order
    - This will be a UI based sorting only, no API calls to be made

- Add a progress bar, just above the cards & below the dropdown, which shows the progress totalExpenseAmount by (sum of all monthlyUpperLimit)


- Request & response of the API to be called shown below
- Pass the JWT access token from local storage, which is stored at the time of login, along with userId
- Keep the UI design & look & feel similar to existing UI design



```
curl --location 'http://localhost:8055/api/v1/expense/personal/550e8400-e29b-41d4-a716-446655440000/summary' \
--header 'Authorization: Bearer access-token' \
--header 'Content-Type: application/json' \
--header 'Cookie: JSESSIONID=56492B90A7B4FBE670EEF4AF1355EBEF' \
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
                "category": "commute",
                "categoryDescription": "local commute",
                "categoryId": "741b75b8-3471-4539-89f3-3e5be941da22",
                "monthlyExpenseDone": 20,
                "monthlyUpperLimit": 400
            },
            {
                "category": "eat-out",
                "categoryDescription": "Travelling yayy",
                "categoryId": "6581f24e-aae8-4978-9545-fa2727042618",
                "monthlyExpenseDone": 120,
                "monthlyUpperLimit": 100
            }
        ],
        "month": 1,
        "numberOfExpenses": 3,
        "totalExpenseAmount": 140,
        "userId": "550e8400-e29b-41d4-a716-446655440000",
        "year": 2026
    },
    "respId": ""
}
```